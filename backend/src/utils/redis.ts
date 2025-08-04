import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export async function connectRedis(): Promise<void> {
  try {
    redisClient = createClient({
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
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient) {
      await redisClient.quit();
    }
  } catch (error) {
    console.error('Redis disconnection failed:', error);
    throw error;
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
}

// Helper functions for common Redis operations
export async function setCache(key: string, value: any, expireInSeconds?: number): Promise<void> {
  const client = getRedisClient();
  const serializedValue = JSON.stringify(value);
  
  if (expireInSeconds) {
    await client.setEx(key, expireInSeconds, serializedValue);
  } else {
    await client.set(key, serializedValue);
  }
}

export async function getCache(key: string): Promise<any | null> {
  const client = getRedisClient();
  const value = await client.get(key);
  
  if (!value) return null;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Error parsing cached value:', error);
    return value; // Return raw value if JSON parsing fails
  }
}

export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  await client.del(key);
}

export async function setCacheWithTTL(key: string, value: any, ttlSeconds: number): Promise<void> {
  await setCache(key, value, ttlSeconds);
}

export { redisClient };
