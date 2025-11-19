import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenError } from '../utils/error.util';
import { UserRole, UserDocument } from '../types/user.type';

export function roleGuard(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user as UserDocument;
    if (!user) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
  };
}

