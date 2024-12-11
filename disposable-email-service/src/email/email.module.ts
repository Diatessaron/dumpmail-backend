import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import {EmailRepository} from "./email.repository";
import {JwtAuthService} from "../jwt/jwt.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'asd',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [EmailService, EmailRepository, JwtAuthService],
  exports: [EmailService],
})
export class EmailModule {}
