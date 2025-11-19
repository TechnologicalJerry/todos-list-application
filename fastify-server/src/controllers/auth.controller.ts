import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { UserSignup, UserLogin, UserDocument } from '../types/user.type';

export const authController = {
  async register(request: FastifyRequest<{ Body: UserSignup }>, reply: FastifyReply) {
    try {
      const result = await authService.register(request.body);
      reply.code(201).send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },

  async login(request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) {
    try {
      const result = await authService.login(request.body);
      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },

  async refresh(request: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
    try {
      const tokens = await authService.refreshToken(request.body.refreshToken);
      reply.code(200).send({
        success: true,
        data: tokens,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as UserDocument;
      if (!user || !user._id) {
        reply.code(401).send({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      await authService.logout(user._id);
      reply.code(200).send({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },

  async forgotPassword(
    request: FastifyRequest<{ Body: { email: string } }>,
    reply: FastifyReply
  ) {
    try {
      const result = await authService.forgotPassword(request.body.email);
      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },

  async resetPassword(
    request: FastifyRequest<{ Body: { token: string; password: string } }>,
    reply: FastifyReply
  ) {
    try {
      const result = await authService.resetPassword(
        request.body.token,
        request.body.password
      );
      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },
};

