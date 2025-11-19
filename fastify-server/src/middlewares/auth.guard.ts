import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../utils/error.util';
import { User } from '../models/user.model';

export async function authGuard(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Verify JWT token using @fastify/jwt
    // This stores the decoded payload in request.user
    await request.jwtVerify();

    // Get decoded token from request.user (set by @fastify/jwt)
    const decoded = (request as any).user as any;

    // Verify token type
    if (decoded.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Attach user document to request (overwriting JWT payload)
    request.user = user;
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      reply.code(401).send({ error: error.message });
      return;
    }
    reply.code(401).send({ error: 'Unauthorized' });
  }
}

