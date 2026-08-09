import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AppEnv } from '../types/env.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from '../schemas/auth.schema.js';
import { AuthService } from '../services/auth.service.js';

export const authRoutes = new Hono<AppEnv>();

authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const body = c.req.valid('json');
  const result = await AuthService.register(body);
  return c.json(
    {
      success: true,
      data: result,
    },
    201
  );
});

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const body = c.req.valid('json');
  const result = await AuthService.login(body);
  return c.json(
    {
      success: true,
      data: result,
    },
    200
  );
});

authRoutes.post('/refresh', zValidator('json', refreshSchema), async (c) => {
  const body = c.req.valid('json');
  const result = await AuthService.refreshTokens(body.refreshToken);
  return c.json(
    {
      success: true,
      data: result,
    },
    200
  );
});

authRoutes.post('/logout', zValidator('json', logoutSchema), async (c) => {
  const body = c.req.valid('json');
  await AuthService.logout(body.refreshToken);
  return c.json(
    {
      success: true,
      message: 'Logged out successfully',
    },
    200
  );
});
