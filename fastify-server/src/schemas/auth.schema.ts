import { z } from 'zod';

export const registerSchema = {
  $id: 'registerSchema',
  type: 'object',
  required: ['firstName', 'lastName', 'userName', 'email', 'password', 'isActive', 'isVerified', 'role'],
  properties: {
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    userName: { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    gender: { type: 'string', enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
    dob: { type: 'string', format: 'date' },
    password: { type: 'string', minLength: 6 },
    profilePicture: { type: 'string' },
    isActive: { type: 'boolean' },
    isVerified: { type: 'boolean' },
    role: { type: 'string', enum: ['user', 'admin'] },
  },
};

export const loginSchema = {
  $id: 'loginSchema',
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
};

export const refreshSchema = {
  $id: 'refreshSchema',
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: { type: 'string' },
  },
};

export const forgotPasswordSchema = {
  $id: 'forgotPasswordSchema',
  type: 'object',
  required: ['email'],
  properties: {
    email: { type: 'string', format: 'email' },
  },
};

export const resetPasswordSchema = {
  $id: 'resetPasswordSchema',
  type: 'object',
  required: ['token', 'password'],
  properties: {
    token: { type: 'string' },
    password: { type: 'string', minLength: 6 },
  },
};

export const authSchemas = [
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
];

