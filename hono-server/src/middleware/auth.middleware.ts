import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { jwtVerify } from 'jose';
import { AppEnv, AuthUserPayload } from '../types/env.js';

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, {
      message: 'Unauthorized: Authorization token required in format Bearer <token>',
    });
  }

  const token = authHeader.substring(7).trim();
  const secret = process.env.JWT_SECRET || 'dev_access_token_secret_key_32_bytes_long!!';

  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);

    if (!payload || !payload.sub) {
      throw new HTTPException(401, { message: 'Unauthorized: Invalid token payload' });
    }

    const userPayload: AuthUserPayload = {
      userId: payload.sub as string,
      email: (payload.email as string) || '',
      fullName: (payload.fullName as string) || '',
    };

    c.set('userId', userPayload.userId);
    c.set('user', userPayload);

    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(401, {
      message: 'Unauthorized: Invalid or expired access token',
    });
  }
});
