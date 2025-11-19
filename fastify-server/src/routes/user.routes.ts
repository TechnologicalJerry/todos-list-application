import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { userController } from '../controllers/user.controller';
import { userSchemas } from '../schemas/user.schema';
import { authGuard } from '../middlewares/auth.guard';

export async function userRoutes(
  app: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  // Register schemas
  for (const schema of userSchemas) {
    app.addSchema(schema);
  }

  // Apply auth guard to all routes
  app.addHook('onRequest', authGuard);

  // Routes
  app.get('/', {
    schema: {
      tags: ['Users'],
      description: 'Get all users with pagination and filters',
      security: [{ bearerAuth: [] }],
      querystring: { $ref: 'getUsersQuerySchema#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                users: { type: 'array', items: { type: 'object' } },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
    handler: userController.getUsers,
  });

  app.get('/:id', {
    schema: {
      tags: ['Users'],
      description: 'Get user by ID',
      security: [{ bearerAuth: [] }],
      params: { $ref: 'getUserParamsSchema#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
    handler: userController.getUserById,
  });

  app.post('/', {
    schema: {
      tags: ['Users'],
      description: 'Create a new user',
      security: [{ bearerAuth: [] }],
      body: { $ref: 'createUserSchema#' },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
    handler: userController.createUser,
  });

  app.put('/:id', {
    schema: {
      tags: ['Users'],
      description: 'Update user by ID',
      security: [{ bearerAuth: [] }],
      params: { $ref: 'updateUserParamsSchema#' },
      body: { $ref: 'updateUserSchema#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
    handler: userController.updateUser,
  });

  app.delete('/:id', {
    schema: {
      tags: ['Users'],
      description: 'Delete user by ID',
      security: [{ bearerAuth: [] }],
      params: { $ref: 'deleteUserParamsSchema#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
    handler: userController.deleteUser,
  });
}

