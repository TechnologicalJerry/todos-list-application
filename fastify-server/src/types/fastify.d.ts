import { FastifyRequest } from 'fastify';
import { UserDocument } from './user.type';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserDocument | any;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: any) => Promise<void>;
  }
}

