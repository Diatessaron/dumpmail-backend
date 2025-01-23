import {Injectable} from '@nestjs/common';
import {EmailRepository} from './email.repository'
import {JwtAuthService} from "../jwt/jwt.service";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class EmailService {
    private domain: string = (process.env.DOMAIN as string);
    private emailLength: number = parseInt(process.env.EMAIL_LENGTH || "13");

    constructor(
        private readonly emailRepository: EmailRepository,
        private readonly jwtAuthService: JwtAuthService
    ) {
    }

    async initializeEmail(token: string | null): Promise<[string, string]> {
        //1. Если токена нет, то создаём, сохраняем в базу
        //2. если токен есть и просроченный, то создаём и сохраняем в базу
        //3. если токен есть и актуальный, то просто выдаём мыло назад и тела токена

        try {
            if (!!token) {
                const decoded = await this.jwtAuthService.validateJwtToken(token)
                return [token, decoded.email]
            } else {
                console.log('No token provided. Creating a new one');
            }
        } catch (error) {
            console.log("Got expired token. Creating a new one", token)
        }

        let disposableEmail;
        do {
            const randomString = uuidv4().substring(0, this.emailLength); // Generate random string
            disposableEmail = `${randomString}@${this.domain}`;

            const exists = await this.emailRepository.existsEmailAddressByKey(`emailAddress:${disposableEmail}`)
            if (!exists) break;
        } while (true);

        const jwtToken = await this.jwtAuthService.generateJwtToken(disposableEmail);
        await this.emailRepository.setEmailAddress(`emailAddress:${disposableEmail}`, jwtToken)

        return [jwtToken, disposableEmail];
    }

    getEmails(email: string, page = 0, count = 10) {
        return this.emailRepository.getAllShortEmailsByPattern(`email:${email}:*`, page, count)
    }

    getEmail(email: string, date: string) {
        return this.emailRepository.getEmailByKey(`email:${email}:${date}`);
    }
}
