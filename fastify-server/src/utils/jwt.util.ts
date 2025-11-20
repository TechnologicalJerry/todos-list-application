import { envConfig } from '../config/env.config';
import { UserDocument } from '../types/user.type';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function signAccessToken(payload: JwtPayload): string {
  // This will be used with @fastify/jwt plugin
  // The actual signing happens in the plugin
  return JSON.stringify(payload);
}

export function signRefreshToken(payload: JwtPayload): string {
  // This will be used with @fastify/jwt plugin
  return JSON.stringify(payload);
}

export function createTokenPayload(user: UserDocument): JwtPayload {
  return {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
}

