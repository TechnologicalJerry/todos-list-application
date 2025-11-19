import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import jwt from '@fastify/jwt';
import { envConfig } from '../config/env.config';

export async function jwtPlugin(
  app: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  await app.register(jwt, {
    secret: envConfig.JWT_SECRET,
  });

  // Add authenticate decorator
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err: any) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}

