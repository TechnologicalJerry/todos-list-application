import { eq, and, ne } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { UpdateProfileInput, UpdatePasswordInput } from '../schemas/user.schema.js';
import { AuthService } from './auth.service.js';

export class UserService {
  public static async getProfile(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return AuthService.sanitizeUser(user);
  }

  public static async updateProfile(userId: string, input: UpdateProfileInput) {
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!currentUser) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    if (input.email && input.email !== currentUser.email) {
      const emailCollision = await db.query.users.findFirst({
        where: and(eq(users.email, input.email), ne(users.id, userId)),
      });

      if (emailCollision) {
        throw new HTTPException(409, { message: 'Email address is already in use by another account' });
      }
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (input.fullName !== undefined) updateData.fullName = input.fullName;
    if (input.email !== undefined) updateData.email = input.email;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return AuthService.sanitizeUser(updatedUser);
  }

  public static async updatePassword(userId: string, input: UpdatePasswordInput) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(input.currentPassword, user.passwordHash);

    if (!isValidPassword) {
      throw new HTTPException(400, { message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(input.newPassword, salt);

    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { message: 'Password updated successfully' };
  }

  public static async deleteAccount(userId: string) {
    const deleted = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (deleted.length === 0) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    return { message: 'Account deleted successfully' };
  }
}
