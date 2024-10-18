import Redis from 'ioredis';

class RedisService {
    private static instance: RedisService;
    private readonly redis: Redis;

    private constructor() {
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public getClient(): Redis {
        return this.redis;
    }
}

export default RedisService;
