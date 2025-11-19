import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function rateLimitPlugin(
  app: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
}

