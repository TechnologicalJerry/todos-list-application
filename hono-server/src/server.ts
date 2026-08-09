import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import app from './app.js';
import { envSchema } from './types/env.js';

dotenv.config();

// Validate Environment Variables
const envResult = envSchema.safeParse(process.env);
if (!envResult.success) {
  console.error('Invalid environment variables configured:', envResult.error.format());
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`Starting Hono server on port ${port}...`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Hono server running at http://localhost:${info.port}`);
  }
);
