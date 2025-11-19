import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { envConfig } from '../config/env.config';

export async function swaggerPlugin(
  app: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  // Register Swagger
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Fastify TypeScript MongoDB API',
        description: 'A scalable Fastify backend with TypeScript, MongoDB, authentication, and REST API structure.',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: `http://${envConfig.HOST}:${envConfig.PORT}`,
          description: 'Development server',
        },
        {
          url: `https://api.example.com`,
          description: 'Production server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT token',
          },
        },
      },
      tags: [
        {
          name: 'Health',
          description: 'Health check endpoints',
        },
        {
          name: 'Auth',
          description: 'Authentication endpoints',
        },
        {
          name: 'Users',
          description: 'User management endpoints',
        },
      ],
    },
  });

  // Register Swagger UI
  await app.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}

