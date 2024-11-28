const Redis = require('ioredis');
const simpleParser = require('mailparser').simpleParser;
require('dotenv').config();

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
    const emailBody = transaction.body;

    connection.loginfo("Body test: " + JSON.stringify(emailBody.bodytext))

    simpleParser(emailBody.bodytext, (err, parsed) => {
        if (err) {
            connection.logerror(`Email parsing failed: ${err.message}`);
            return next(DENYSOFT);
        }

        connection.loginfo("Parsed text: " + JSON.stringify(parsed))
        let headers = emailBody.header.headers;
        const subject = headers.subject.map(el => el.substring(0, el.length - 1));
        const from = headers.from.map(el => el.substring(0, el.length - 1));
        const to = headers.to.map(el => el.substring(0, el.length - 1));

        const emailJson = {
            subject: subject,
            from: from,
            to: to,
            text: emailBody.bodytext.substring(0, emailBody.bodytext.length - 1),
            textAsHtml: parsed.textAsHtml,
            isHtml: parsed.html,
            attachments: parsed.attachments.map(att => ({
                filename: att.filename,
                contentType: att.contentType,
                size: att.size
            }))
        };

        const redisKey = `email:${to}:${Date.now()}`;
        redis.set(redisKey, JSON.stringify(emailJson), 'EX', process.env.TTL, (err) => {
            if (err) {
                connection.logerror(`Redis .set() failed: ${err.message}`);
            }
            connection.loginfo(`Email stored successfully`);
            next(OK)
        });
    });
};
