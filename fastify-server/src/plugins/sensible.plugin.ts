import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import sensible from '@fastify/sensible';

export async function sensiblePlugin(
  app: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  await app.register(sensible);
}

