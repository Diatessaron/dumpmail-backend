const Redis = require('ioredis');
const fs = require("fs");
const path = require("path");
const { extensions } = require("./extensions");
require('dotenv').config();

let redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    lazyConnect: true
});

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

exports.hook_data = function (next, connection) {
    connection.transaction.parse_body = true;
    next();
};

exports.hook_data_post = function (next, connection) {
    const transaction = connection.transaction;

    let emailBody = transaction.body

    //todo: удалить потом
    fs.writeFile("./emailBody.txt", JSON.stringify(emailBody), function (err) {})

    let headers = emailBody.header.headers;
    const subject = headers.subject.map(el => el.substring(0, el.length - 1));
    const from = headers.from.map(el => el.substring(0, el.length - 1));
    const to = headers.to.map(entry => {
        const match = entry.match(emailRegex);
        return match ? match[0] : null;
    }).filter(Boolean);

    const parsedEmail = iterateChildren(emailBody)

    //todo: удалить потом
    fs.writeFile("./parsedEmail.txt", JSON.stringify(parsedEmail), function (err) {})

    const emailJson = {
        subject: subject,
        from: from,
        to: to,
        text: parsedEmail.body.text,
        attachments: parsedEmail.attachments
    };

    const redisKey = `email:${to}:${Date.now()}`;
    redis.set(redisKey, JSON.stringify(emailJson), 'EX', process.env.TTL, (err) => {
        if (err) {
            connection.logerror(`Redis .set() failed: ${err.message}`);
        }
        connection.loginfo(`Email stored successfully`);
        next(OK)
    });
};

function iterateChildren(emailBody) {
    const children = emailBody.children
    const parsedEmail = { body: {}, attachments: [] }

    if (children.length === 0) {
        parsedEmail.body.text = emailBody.bodytext
    }

    for (const child of children) {
        if (child.state === "body") {
            parsedEmail.body.text = child.bodytext;
        } else if (child.state === "attachment") {
            const contentTypeMatch = child.ct.match(/^([^;]+)/);
            const nameMatch = child.ct.match(/name=\\"([^"]+)\\"/);
            const contentType = contentTypeMatch ? contentTypeMatch[1] : null;
            let fileName = nameMatch ? nameMatch[1] : null;
            const file = Buffer.from(child.buf);
            if (!path.extname(fileName)) fileName += extensions[contentType] || ".bin";

            //todo: удалить потом
            fs.writeFile(fileName, file, (err) => {
                if (err) {
                    console.error("Error writing the file:", err);
                } else {
                    console.log(`File saved as ${fileName}`);
                }
            });

            const attachment = {
                filename: fileName,
                contentType: contentType,
                size: file.length,
                content: file.toString("base64")
            }

            parsedEmail.attachments.push(attachment)
        }
    }

    return parsedEmail
}
