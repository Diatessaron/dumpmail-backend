import Redis from 'ioredis';

class RedisService {
    private static instance: RedisService;
    private readonly redis: Redis;

    private constructor() {
        const redisUrl = new URL(process.env.REDIS_URL || 'redis://localhost:6379');
        this.redis = new Redis({
            host: redisUrl.hostname,
            port: Number(redisUrl.port),
            username: redisUrl.username || undefined,
            password: redisUrl.password || undefined,
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
