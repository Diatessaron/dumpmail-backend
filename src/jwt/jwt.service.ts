import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateJwtToken(email: string): string {
        const payload = { email };
        return this.jwtService.sign(payload, { expiresIn: '24h' }); //24 hours expiration time for the authorization header
    }

    validateJwtToken(token: string): any {
        return this.jwtService.verify(token);
    }
}
