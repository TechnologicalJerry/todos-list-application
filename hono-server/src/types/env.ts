import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/todo_db'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform((val) => parseInt(val, 10)),
  CORS_ORIGIN: z.string().default('*'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export interface AuthUserPayload {
  userId: string;
  email: string;
  fullName: string;
}

export type AppEnv = {
  Variables: {
    userId: string;
    user: AuthUserPayload;
  };
};
