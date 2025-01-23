import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateJwtToken(email: string): Promise<string> {
        const payload = { email };
        return this.jwtService.signAsync(payload, { expiresIn: '24h' }); //24 hours expiration time for the authorization header
    }

    validateJwtToken(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token);
    }
}
