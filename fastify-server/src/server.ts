import { buildApp } from './app';
import { envConfig } from './config/env.config';

async function start() {
  try {
    const app = await buildApp();

    await app.listen({
      port: envConfig.PORT,
      host: envConfig.HOST,
    });

    console.log(`Server listening on ${envConfig.HOST}:${envConfig.PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

start();
