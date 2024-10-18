export class ShortEmail {
    from: string;
    to: string;
    subject: string;
    date: Date;

    constructor(from: string, to: string, subject: string, date: Date) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.date = date;
    }

    static fromJson(json: any): ShortEmail {
        return new ShortEmail(json.from, json.to, json.subject, json.date)
    }
}
