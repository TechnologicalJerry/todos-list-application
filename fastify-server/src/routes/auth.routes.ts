import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { authSchemas } from '../schemas/auth.schema';
import { initAuthService } from '../services/auth.service';
import { authGuard } from '../middlewares/auth.guard';

export async function authRoutes(
  app: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  // Initialize auth service with app instance for JWT
  initAuthService(app);

  // Register schemas
  for (const schema of authSchemas) {
    app.addSchema(schema);
  }

  // Routes
  app.post('/register', {
    schema: {
      tags: ['Auth'],
      description: 'Register a new user',
      body: { $ref: 'registerSchema#' },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: authController.register,
  });

  app.post('/login', {
    schema: {
      tags: ['Auth'],
      description: 'Login with email and password',
      body: { $ref: 'loginSchema#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: authController.login,
  });

  app.post('/refresh', {
    schema: {
      tags: ['Auth'],
      description: 'Refresh access token using refresh token',
      body: { $ref: 'refreshSchema#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
    },
    handler: authController.refresh,
  });

  app.post('/logout', {
    schema: {
      tags: ['Auth'],
      description: 'Logout user (requires authentication)',
      security: [{ bearerAuth: [] }],
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
    preHandler: [authGuard],
    handler: authController.logout,
  });

  app.post('/forgot-password', {
    schema: {
      tags: ['Auth'],
      description: 'Request password reset email',
      body: { $ref: 'forgotPasswordSchema#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
    handler: authController.forgotPassword,
  });

  app.post('/reset-password', {
    schema: {
      tags: ['Auth'],
      description: 'Reset password using reset token',
      body: { $ref: 'resetPasswordSchema#' },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
    handler: authController.resetPassword,
  });
}

