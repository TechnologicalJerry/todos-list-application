import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { connectDatabase, disconnectDatabase } from '../config/db.config';

export async function mongoPlugin(
  app: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  await connectDatabase();

  app.addHook('onClose', async () => {
    await disconnectDatabase();
  });
}

