import express from 'express';
import {EmailService} from './email.service';
import {Controller, Get, Param, Post, Req, Res} from "@nestjs/common";

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {
    }

    @Post()
    async initializeEmail(@Req() req: express.Request, @Res() res: express.Response) {
        const [jwtToken, expirationTime, emailAddress] = await this.emailService.initializeEmail(req.cookies['session'])
        res
            .cookie('session', jwtToken, {
                httpOnly: true,
                maxAge: expirationTime,
            })
            .json({
                email: emailAddress,
            });
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
