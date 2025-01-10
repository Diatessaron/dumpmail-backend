import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {EmailController} from "./email/email.controller";
import {JwtModule} from "@nestjs/jwt";
import {EmailModule} from "./email/email.module";
import {CookieParserMiddleware} from "./lib/CookieParserMiddleware";

@Module({
    imports: [
        EmailModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '24h'},
        }),
    ],
    controllers: [EmailController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(CookieParserMiddleware).forRoutes('*');
    }
}
