import {EmailService} from './email.service';
import {Body, Controller, Get, Param, Post} from "@nestjs/common";

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {
    }

    @Get()
    initializeEmail() {
    //     TODO: подумать как инициализировать имейл и делать это на основе куки(?). Чтобы типа не создавать много имейлов

    }

    @Get()
    getEmails(@Param('email') email: string) {
        return this.emailService.getEmails(email);
    }

    @Get()
    getEmail(@Param('email') email: string, @Param('date') date: string) {
        return this.emailService.getEmail(email, date);
    }
}
