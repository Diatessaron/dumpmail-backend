import {Controller, Head} from '@nestjs/common';

@Controller("/heartbeat")
export class AppController {
    @Head()
    getHeartBeat(): void {
        return;
    }
}
