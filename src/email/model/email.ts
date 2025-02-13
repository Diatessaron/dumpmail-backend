class EmailAttachment {
    filename: string;
    contentType: string;
    size: number;
    content: string;

    constructor(filename: string, contentType: string, size: number, content: string) {
        this.filename = filename;
        this.contentType = contentType;
        this.size = size;
        this.content = content;
    }
}

export class Email {
    from: string;
    to: string;
    subject: string;
    text: string;
    attachments: EmailAttachment[];

    constructor(
        from: string,
        to: string,
        subject: string,
        text: string,
        attachments: EmailAttachment[]
    ) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.text = text;
        this.attachments = attachments;
    }

    static fromJSON(json: any): Email {
        const attachments = json.attachments.map((attachment: any) =>
            new EmailAttachment(
                attachment.filename,
                attachment.contentType,
                attachment.size,
                attachment.content
            )
        );

        return new Email(
            json.from,
            json.to,
            json.subject,
            json.text,
            attachments
        );
    }
}
