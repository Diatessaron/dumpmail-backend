import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateJwtToken(email: string): [string, number] {
        const payload = { email };
        return [this.jwtService.sign(payload, { expiresIn: '24h' }), 86400000]; //24 hours expiration time for the cookie with token
    }

    validateJwtToken(token: string): any {
        return this.jwtService.verify(token);
    }
}
