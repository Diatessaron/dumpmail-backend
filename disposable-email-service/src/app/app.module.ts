import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        EmailModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
