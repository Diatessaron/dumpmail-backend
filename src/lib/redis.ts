import Redis from 'ioredis';

class RedisService {
    private static instance: RedisService;
    private readonly redis: Redis;

    private constructor() {
        this.redis = new Redis({
            path: process.env.REDIS_URL || 'redis://localhost:6379',
            username: process.env.REDIS_USER,
            password: process.env.REDIS_PASSWORD,
        });
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
