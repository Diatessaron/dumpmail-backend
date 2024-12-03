const Redis = require('ioredis');
require('dotenv').config();
const fs = require("fs");

let redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    lazyConnect: true
});

exports.hook_data = function (next, connection) {
    connection.transaction.parse_body = true;
    next();
};

exports.hook_data_post = function (next, connection) {
    const transaction = connection.transaction;

    let emailBody = transaction.body

    fs.writeFile("./emailBody.txt", JSON.stringify(emailBody), function (err) {})

    let headers = emailBody.header.headers;
    const subject = headers.subject.map(el => el.substring(0, el.length - 1));
    const from = headers.from.map(el => el.substring(0, el.length - 1));
    const to = headers.to.map(el => el.substring(0, el.length - 1));

    const parsedEmail = iterateChildren(emailBody)

    fs.writeFile("./parsedEmail.txt", JSON.stringify(parsedEmail), function (err) {})

    //todo: надо теперь тестировать в каком формате сохраняются реальные мэилы на серваке

    const emailJson = {
        subject: subject,
        from: from,
        to: to,
        text: parsedEmail.body.text,
        attachments: parsedEmail.attachments
        // parsed.attachments.map(att => ({
        // filename: att.filename || "Unnamed Attachment",
        // contentType: att.contentType,
        // size: att.size
        // }))
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
            parsedEmail.attachments.push(Buffer.from(child.buf).toString())
        }
    }

    return parsedEmail
}
