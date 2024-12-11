import express from 'express';
import {EmailService} from './email.service';
import {Controller, Get, Post, Query, Req, Res} from "@nestjs/common";
import {Email} from "./model/email";
import {ShortEmail} from "./dto/shortEmail";

@Controller('/api/email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {
    }

    @Post()
    async initializeEmail(@Req() req: express.Request, @Res() res: express.Response) {
        const [ jwtToken, emailAddress ] = await this.emailService.initializeEmail(req?.header('Authorization')?.split(' ')[1]);
        res
            .header('Authorization', `Bearer ${jwtToken}`)
            .json({
                email: emailAddress,
            })
    }

    @Get('/all')
    getEmails(@Query('email') emailAddress: string, @Query('page') page: number = 0): Promise<ShortEmail[]> {
        return this.emailService.getEmails(emailAddress, page);
    }

    @Get()
    getEmail(@Query('email') emailAddress: string, @Query('date') date: string): Promise<Email> {
        return this.emailService.getEmail(emailAddress, date);
    }
}
