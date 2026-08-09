import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters long')
      .max(100, 'Full name must not exceed 100 characters')
      .trim()
      .optional(),
    email: z.string().email('Invalid email address').toLowerCase().trim().optional(),
  })
  .refine((data) => data.fullName !== undefined || data.email !== undefined, {
    message: 'At least one field (fullName or email) must be provided for update',
  });

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .max(100, 'New password must not exceed 100 characters'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
