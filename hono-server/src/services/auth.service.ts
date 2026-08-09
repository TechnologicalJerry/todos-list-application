import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db/index.js';
import { users, refreshTokens, User } from '../db/schema.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import { AuthUserPayload } from '../types/env.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_access_token_secret_key_32_bytes_long!!';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_token_secret_key_32_bytes_long!!';

export class AuthService {
  private static accessSecretKey = new TextEncoder().encode(JWT_SECRET);
  private static refreshSecretKey = new TextEncoder().encode(JWT_REFRESH_SECRET);

  public static async generateAccessToken(user: { id: string; email: string; fullName: string }): Promise<string> {
    return await new SignJWT({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || '15m')
      .sign(this.accessSecretKey);
  }

  public static async generateRefreshToken(user: { id: string }): Promise<{ token: string; expiresAt: Date }> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const token = await new SignJWT({
      sub: user.id,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '7d')
      .sign(this.refreshSecretKey);

    return { token, expiresAt };
  }

  public static sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  public static async register(input: RegisterInput) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (existingUser) {
      throw new HTTPException(409, { message: 'Email address is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const [newUser] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash,
        fullName: input.fullName,
      })
      .returning();

    const accessToken = await this.generateAccessToken(newUser);
    const { token: refreshToken, expiresAt } = await this.generateRefreshToken(newUser);

    await db.insert(refreshTokens).values({
      userId: newUser.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      user: this.sanitizeUser(newUser),
      accessToken,
      refreshToken,
    };
  }

  public static async login(input: LoginInput) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (!user) {
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    const accessToken = await this.generateAccessToken(user);
    const { token: refreshToken, expiresAt } = await this.generateRefreshToken(user);

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  public static async refreshTokens(refreshTokenStr: string) {
    let payload;
    try {
      const verified = await jwtVerify(refreshTokenStr, this.refreshSecretKey);
      payload = verified.payload;
    } catch {
      throw new HTTPException(401, { message: 'Invalid or expired refresh token' });
    }

    const storedToken = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, refreshTokenStr),
    });

    if (!storedToken) {
      throw new HTTPException(401, { message: 'Refresh token has been revoked or is invalid' });
    }

    if (new Date() > storedToken.expiresAt) {
      await db.delete(refreshTokens).where(eq(refreshTokens.id, storedToken.id));
      throw new HTTPException(401, { message: 'Refresh token expired' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, storedToken.userId),
    });

    if (!user) {
      throw new HTTPException(401, { message: 'Associated user account not found' });
    }

    // Token Rotation: Delete old refresh token, issue new token pair
    await db.delete(refreshTokens).where(eq(refreshTokens.id, storedToken.id));

    const newAccessToken = await this.generateAccessToken(user);
    const { token: newRefreshToken, expiresAt } = await this.generateRefreshToken(user);

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: newRefreshToken,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  public static async logout(refreshTokenStr: string) {
    const deleted = await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, refreshTokenStr))
      .returning();

    return { success: true, count: deleted.length };
  }
}
