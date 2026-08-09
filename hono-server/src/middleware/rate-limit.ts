import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { AppEnv } from '../types/env.js';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

export function createRateLimiter(windowMs = 60000, maxRequests = 100) {
  const hits = new Map<string, RateLimitStore>();

  // Periodically clean up expired keys
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, Math.max(10000, windowMs));

  return createMiddleware<AppEnv>(async (c, next) => {
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
      c.req.header('x-real-ip') ||
      '127.0.0.1';

    const userId = c.get('userId');
    const key = userId ? `user:${userId}` : `ip:${ip}`;
    const now = Date.now();

    let record = hits.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      record.count += 1;
    }

    hits.set(key, record);

    const remaining = Math.max(0, maxRequests - record.count);
    const resetSec = Math.ceil((record.resetTime - now) / 1000);

    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());
    c.header('X-RateLimit-Reset', resetSec.toString());

    if (record.count > maxRequests) {
      throw new HTTPException(429, {
        message: `Too many requests, please try again in ${resetSec} seconds.`,
      });
    }

    await next();
  });
}
