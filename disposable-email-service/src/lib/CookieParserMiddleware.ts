import {Injectable, NestMiddleware} from "@nestjs/common";
import * as cookieParser from 'cookie-parser';

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        cookieParser()(req, res, next);
    }
}
