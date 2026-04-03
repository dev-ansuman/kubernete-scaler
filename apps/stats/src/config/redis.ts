import Redis from 'ioredis';

export const redis = new Redis({
    host: "redis-svc",
    port: Number(process.env.REDIS_PORT || 6379),
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (error: unknown) => {
    console.error(`Error connecting to redis: ${error}`);
});
