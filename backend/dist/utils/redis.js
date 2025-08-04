"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.connectRedis = connectRedis;
exports.disconnectRedis = disconnectRedis;
exports.getRedisClient = getRedisClient;
exports.setCache = setCache;
exports.getCache = getCache;
exports.deleteCache = deleteCache;
exports.setCacheWithTTL = setCacheWithTTL;
const redis_1 = require("redis");
let redisClient;
async function connectRedis() {
    try {
        exports.redisClient = redisClient = (0, redis_1.createClient)({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            password: process.env.REDIS_PASSWORD,
        });
        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
        redisClient.on('connect', () => {
            console.log('Redis client connected');
        });
        redisClient.on('ready', () => {
            console.log('Redis client ready');
        });
        redisClient.on('end', () => {
            console.log('Redis client disconnected');
        });
        await redisClient.connect();
    }
    catch (error) {
        console.error('Redis connection failed:', error);
        throw error;
    }
}
async function disconnectRedis() {
    try {
        if (redisClient) {
            await redisClient.quit();
        }
    }
    catch (error) {
        console.error('Redis disconnection failed:', error);
        throw error;
    }
}
function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client not initialized. Call connectRedis() first.');
    }
    return redisClient;
}
async function setCache(key, value, expireInSeconds) {
    const client = getRedisClient();
    const serializedValue = JSON.stringify(value);
    if (expireInSeconds) {
        await client.setEx(key, expireInSeconds, serializedValue);
    }
    else {
        await client.set(key, serializedValue);
    }
}
async function getCache(key) {
    const client = getRedisClient();
    const value = await client.get(key);
    if (!value)
        return null;
    try {
        return JSON.parse(value);
    }
    catch (error) {
        console.error('Error parsing cached value:', error);
        return value;
    }
}
async function deleteCache(key) {
    const client = getRedisClient();
    await client.del(key);
}
async function setCacheWithTTL(key, value, ttlSeconds) {
    await setCache(key, value, ttlSeconds);
}
//# sourceMappingURL=redis.js.map