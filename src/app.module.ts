import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {EmailController} from "./email/email.controller";
import {JwtModule} from "@nestjs/jwt";
import {EmailModule} from "./email/email.module";
import {CookieParserMiddleware} from "./lib/CookieParserMiddleware";

@Module({
    imports: [
        EmailModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || "asd",
            signOptions: {expiresIn: '24h'},
        }),
    ],
    controllers: [AppController, EmailController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(CookieParserMiddleware).forRoutes('*');
    }
}
