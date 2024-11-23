import express from 'express';
import {EmailService} from './email.service';
import {Controller, Get, Post, Query, Req, Res} from "@nestjs/common";

@Controller('/api/email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {
    }

    @Post()
    async initializeEmail(@Req() req: express.Request, @Res() res: express.Response) {
        const [jwtToken, expirationTime, emailAddress] = await this.emailService.initializeEmail(req?.cookies?.['session'])
        res
            .cookie('session', jwtToken, {
                httpOnly: true,
                maxAge: expirationTime,
            })
            .json({
                email: emailAddress,
            });
    }

    @Get('/all')
    getEmails(@Query('email') emailAddress: string, @Query('page') page: number = 0) {
        return this.emailService.getEmails(emailAddress, page);
    }

    @Get()
    getEmail(@Query('email') emailAddress: string, @Query('date') date: string) {
        return this.emailService.getEmail(emailAddress, date);
    }
}