import {Injectable} from '@nestjs/common';
import {EmailRepository} from './email.repotsitory'

@Injectable()
export class EmailService {
    constructor(private readonly emailRepository: EmailRepository) {
    }

    getEmails(email: string, cursor = 0, count = 10) {
        return this.emailRepository.getAllByPattern(`email:${email}:*`, cursor, count)
    }

    getEmail(email: string, date: string) {
        return this.emailRepository.getByKey(`email:${email}:${date}`);
    }
}
