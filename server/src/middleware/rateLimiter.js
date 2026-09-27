import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import logger from './logger.js';

const POINTS_LIMIT = 60; // 60 requests
const DURATION_SECONDS = 60; // per 60 seconds

// Initialize In-Memory Rate Limiter as reliable fallback
const memoryLimiter = new RateLimiterMemory({
  points: POINTS_LIMIT,
  duration: DURATION_SECONDS,
});

let redisClient = null;
let activeLimiter = memoryLimiter;
let isRedisConnected = false;

try {
  const redisHost = process.env.REDIS_HOST || '127.0.0.1';
  const redisPort = Number(process.env.REDIS_PORT) || 6379;

  redisClient = new Redis({
    host: redisHost,
    port: redisPort,
    lazyConnect: true,
    connectTimeout: 1500,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) {
        return null; // Stop trying to reconnect after 3 attempts
      }
      return 2000;
    },
  });

  redisClient.on('connect', () => {
    isRedisConnected = true;
    logger.info(`Redis rate limiter connected successfully on ${redisHost}:${redisPort}`);
    activeLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      points: POINTS_LIMIT,
      duration: DURATION_SECONDS,
      keyPrefix: 'aegis_rl',
    });
  });

  redisClient.on('error', (err) => {
    if (isRedisConnected) {
      logger.warn(`Redis disconnected. Falling back to in-memory rate limiter: ${err.message}`);
    }
    isRedisConnected = false;
    activeLimiter = memoryLimiter;
  });

  // Attempt connection asynchronously without blocking server start
  redisClient.connect().catch((err) => {
    logger.info(`Redis not detected (${err.message}). Using high-performance in-memory rate limiter.`);
    activeLimiter = memoryLimiter;
  });
} catch (error) {
  logger.info('Running in-memory rate limiter mode.');
  activeLimiter = memoryLimiter;
}

export const rateLimiterMiddleware = async (req, res, next) => {
  // Key by IP or authorization token
  const clientKey =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    req.ip ||
    '127.0.0.1';

  try {
    await activeLimiter.consume(clientKey);
    next();
  } catch (rejRes) {
    const secs = Math.round(rejRes?.msBeforeNext ? rejRes.msBeforeNext / 1000 : DURATION_SECONDS) || 1;
    res.set('Retry-After', String(secs));
    res.set('X-RateLimit-Limit', String(POINTS_LIMIT));
    res.set('X-RateLimit-Remaining', '0');

    logger.warn('Rate limit exceeded', {
      clientIp: clientKey,
      route: req.originalUrl || req.url,
      retryAfterSecs: secs,
    });

    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded (60 requests/minute). Please slow down and try again shortly.',
      retryAfter: secs,
    });
  }
};

export const getRateLimiterStatus = () => ({
  mode: isRedisConnected ? 'Redis Token Bucket' : 'In-Memory Sliding Window',
  limit: `${POINTS_LIMIT} req / ${DURATION_SECONDS} sec`,
});

export default rateLimiterMiddleware;
