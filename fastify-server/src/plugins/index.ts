import { FastifyInstance } from 'fastify';
import { swaggerPlugin } from './swagger.plugin';
import { corsPlugin } from './cors.plugin';
import { jwtPlugin } from './jwt.plugin';
import { mongoPlugin } from './mongo.plugin';
import { rateLimitPlugin } from './rate-limit.plugin';
import { sensiblePlugin } from './sensible.plugin';

export async function registerPlugins(app: FastifyInstance): Promise<void> {
  // Register Swagger first (before other plugins)
  await app.register(swaggerPlugin);
  
  await app.register(corsPlugin);
  await app.register(jwtPlugin);
  await app.register(mongoPlugin);
  await app.register(rateLimitPlugin);
  await app.register(sensiblePlugin);
}

