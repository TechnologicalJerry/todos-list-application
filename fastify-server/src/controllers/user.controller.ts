import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services/user.service';
import { UserSignup } from '../types/user.type';

export const userController = {
  async getUsers(
    request: FastifyRequest<{
      Querystring: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        isActive?: boolean;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const result = await userService.getUsers(request.query);
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

  async getUserById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.getUserById(request.params.id);
      reply.code(200).send({
        success: true,
        data: user,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },

  async createUser(
    request: FastifyRequest<{ Body: UserSignup }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.createUser(request.body);
      reply.code(201).send({
        success: true,
        data: user,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },

  async updateUser(
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<UserSignup> }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.updateUser(request.params.id, request.body);
      reply.code(200).send({
        success: true,
        data: user,
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },

  async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      await userService.deleteUser(request.params.id);
      reply.code(200).send({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({
        success: false,
        error: error.message,
      });
    }
  },
};

