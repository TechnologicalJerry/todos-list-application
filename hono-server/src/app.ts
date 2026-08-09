import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';

import { AppEnv } from './types/env.js';
import { createRateLimiter } from './middleware/rate-limit.js';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { checkDbConnection } from './db/index.js';

import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { todoRoutes } from './routes/todo.routes.js';

const app = new Hono<AppEnv>();

// Start time for server uptime calculation
const startTime = Date.now();

// Global Security & Logging Middlewares
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 600,
    credentials: true,
  })
);
app.use('*', secureHeaders());

// Custom Rate Limiting Middleware
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
app.use('*', createRateLimiter(windowMs, maxRequests));

// Health Check Endpoint
app.get('/health', async (c) => {
  const isDbConnected = await checkDbConnection();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const status = isDbConnected ? 200 : 503;

  return c.json(
    {
      status: isDbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: `${uptimeSeconds}s`,
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
      },
    },
    status
  );
});

// API Routes Version 1
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/users', userRoutes);
app.route('/api/v1/todos', todoRoutes);

// Error Handling & 404 Handlers
app.onError(globalErrorHandler);
app.notFound(notFoundHandler);

export default app;
