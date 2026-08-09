import { z } from 'zod';

export const priorityEnumSchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim(),
  description: z.string().max(1000, 'Description must not exceed 1000 characters').nullable().optional(),
  priority: priorityEnumSchema.default('MEDIUM').optional(),
  isCompleted: z.boolean().default(false).optional(),
  dueDate: z
    .string()
    .datetime({ message: 'Invalid ISO 8601 date format for dueDate' })
    .nullable()
    .optional(),
});

export const updateTodoSchema = z
  .object({
    title: z.string().min(1, 'Title cannot be empty').max(255).trim().optional(),
    description: z.string().max(1000).nullable().optional(),
    isCompleted: z.boolean().optional(),
    priority: priorityEnumSchema.optional(),
    dueDate: z
      .string()
      .datetime({ message: 'Invalid ISO 8601 date format for dueDate' })
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update a todo',
  });

export const todoParamSchema = z.object({
  id: z.string().uuid('Invalid Todo ID format (must be UUID)'),
});

export const todoQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 10)),
  isCompleted: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    }),
  priority: priorityEnumSchema.optional(),
  q: z.string().trim().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'dueDate', 'priority']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const bulkDeleteTodoSchema = z.object({
  ids: z
    .array(z.string().uuid('Each item must be a valid UUID'))
    .min(1, 'At least one todo ID must be provided')
    .max(100, 'Cannot bulk delete more than 100 todos at once'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoParamInput = z.infer<typeof todoParamSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;
export type BulkDeleteTodoInput = z.infer<typeof bulkDeleteTodoSchema>;
