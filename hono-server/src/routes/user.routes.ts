import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AppEnv } from '../types/env.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { updateProfileSchema, updatePasswordSchema } from '../schemas/user.schema.js';
import { UserService } from '../services/user.service.js';

export const userRoutes = new Hono<AppEnv>();

userRoutes.use('*', authMiddleware);

userRoutes.get('/me', async (c) => {
  const userId = c.get('userId');
  const user = await UserService.getProfile(userId);
  return c.json(
    {
      success: true,
      data: user,
    },
    200
  );
});

userRoutes.patch('/me', zValidator('json', updateProfileSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');
  const updatedUser = await UserService.updateProfile(userId, body);
  return c.json(
    {
      success: true,
      data: updatedUser,
    },
    200
  );
});

userRoutes.put('/me/password', zValidator('json', updatePasswordSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');
  const result = await UserService.updatePassword(userId, body);
  return c.json(
    {
      success: true,
      message: result.message,
    },
    200
  );
});

userRoutes.delete('/me', async (c) => {
  const userId = c.get('userId');
  const result = await UserService.deleteAccount(userId);
  return c.json(
    {
      success: true,
      message: result.message,
    },
    200
  );
});
