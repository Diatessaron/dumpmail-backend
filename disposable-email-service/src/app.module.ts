import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {EmailController} from "./email/email.controller";
import {JwtModule} from "@nestjs/jwt";
import {EmailModule} from "./email/email.module";
import {EmailService} from "./email/email.service";

@Module({
  imports: [
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AppController, EmailController],
  providers: [AppService, EmailService],
})
export class AppModule {}
