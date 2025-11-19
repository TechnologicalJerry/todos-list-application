export const createUserSchema = {
  $id: 'createUserSchema',
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

export const updateUserSchema = {
  $id: 'updateUserSchema',
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    userName: { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    gender: { type: 'string', enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
    dob: { type: 'string', format: 'date' },
    profilePicture: { type: 'string' },
    isActive: { type: 'boolean' },
    isVerified: { type: 'boolean' },
    role: { type: 'string', enum: ['user', 'admin'] },
  },
};

export const getUserParamsSchema = {
  $id: 'getUserParamsSchema',
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

export const updateUserParamsSchema = {
  $id: 'updateUserParamsSchema',
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

export const deleteUserParamsSchema = {
  $id: 'deleteUserParamsSchema',
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

export const getUsersQuerySchema = {
  $id: 'getUsersQuerySchema',
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
    search: { type: 'string' },
    role: { type: 'string', enum: ['user', 'admin'] },
    isActive: { type: 'boolean' },
  },
};

export const userSchemas = [
  createUserSchema,
  updateUserSchema,
  getUserParamsSchema,
  updateUserParamsSchema,
  deleteUserParamsSchema,
  getUsersQuerySchema,
];

