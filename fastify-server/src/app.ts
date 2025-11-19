import Fastify from 'fastify';
import { registerPlugins } from './plugins/index';
import { registerRoutes } from './routes/index.routes';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Register plugins
  await registerPlugins(app);

  // Register routes
  await registerRoutes(app);

  return app;
}
