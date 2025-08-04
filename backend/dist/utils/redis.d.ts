import { RedisClientType } from 'redis';
declare let redisClient: RedisClientType;
export declare function connectRedis(): Promise<void>;
export declare function disconnectRedis(): Promise<void>;
export declare function getRedisClient(): RedisClientType;
export declare function setCache(key: string, value: any, expireInSeconds?: number): Promise<void>;
export declare function getCache(key: string): Promise<any | null>;
export declare function deleteCache(key: string): Promise<void>;
export declare function setCacheWithTTL(key: string, value: any, ttlSeconds: number): Promise<void>;
export { redisClient };
//# sourceMappingURL=redis.d.ts.map