const Redis = require('ioredis');
const logger = require('haraka/logger');
const simpleParser = require('mailparser');

let redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    lazyConnect: true
});

exports.hook_data = function (next, connection) {
    connection.transaction.parse_body = true;

    connection.transaction.body.on('end', async function () {
        const recipient = connection.transaction.rcpt_to[0].address();
        const emailData = connection.transaction.body.bodytext;

        const parsedEmail = await simpleParser(emailData);
        const emailJson = buildEmailJson(parsedEmail);

        try {
            await redis.set(`email:${recipient}:${Date.now()}`, JSON.stringify(emailJson), 'EX', process.env.TTL);
            logger.loginfo(`Stored email for ${recipient}`);
        } catch (err) {
            logger.logerror(`Failed to store email: ${err}`);
        }
    });

    next();
};

function buildEmailJson(parsedEmail) {
    const emailObject = {
        from: parsedEmail.from.text,
        to: parsedEmail.to.text,
        subject: parsedEmail.subject,
        textBody: parsedEmail.text,
        htmlBody: parsedEmail.html,
        attachments: []
    };

    // Process each attachment
    if (parsedEmail.attachments && parsedEmail.attachments.length > 0) {
        parsedEmail.attachments.forEach(attachment => {
            emailObject.attachments.push({
                filename: attachment.filename,
                contentType: attachment.contentType,
                size: attachment.size,
                content: attachment.content.toString('base64')
            });
        });
    }

    return emailObject;
}
