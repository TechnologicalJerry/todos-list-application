import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import cors from '@fastify/cors';

export async function corsPlugin(
  app: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  await app.register(cors, {
    origin: true,
    credentials: true,
  });
}

