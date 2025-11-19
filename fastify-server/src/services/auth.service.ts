import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { User } from '../models/user.model';
import { UserSignup, UserLogin, AuthTokens, UserResponse } from '../types/user.type';
import { hashPassword, comparePassword } from '../utils/password.util';
import { createTokenPayload } from '../utils/jwt.util';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../utils/error.util';
import { envConfig } from '../config/env.config';

export class AuthService {
  constructor(private app?: FastifyInstance) {}

  async register(userData: UserSignup): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { userName: userData.userName }],
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new ConflictError('User with this email already exists');
      }
      if (existingUser.userName === userData.userName) {
        throw new ConflictError('User with this username already exists');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Return user without password
    const userResponse = this.toUserResponse(user);

    return { user: userResponse, tokens };
  }

  async login(loginData: UserLogin): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Find user with password
    const user = await User.findOne({ email: loginData.email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await comparePassword(loginData.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Return user without password
    const userResponse = this.toUserResponse(user);

    return { user: userResponse, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      let decoded: any;

      if (this.app) {
        // Verify refresh token using @fastify/jwt
        decoded = this.app.jwt.verify(refreshToken);
      } else {
        // Fallback for testing
        decoded = JSON.parse(refreshToken);
        if (decoded.exp && decoded.exp < Date.now()) {
          throw new UnauthorizedError('Token expired');
        }
      }

      // Verify token type
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedError('Invalid token type');
      }

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      return await this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    // In a real implementation, you would add the token to a blacklist
    // or remove it from the database
    // For now, we'll just verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
  }

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    // Find user by email
    const user = await User.findOne({ email });

    // Always return success message for security (don't reveal if email exists)
    if (!user) {
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiration (1 hour from now)
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    // In production, send email with reset link
    // For now, we'll return the token in development (remove in production)
    const resetUrl = `${envConfig.NODE_ENV === 'development' ? `http://localhost:${envConfig.PORT}` : ''}/auth/reset-password?token=${resetToken}`;

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, resetUrl);

    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset URL: ${resetUrl}`);

    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Only include token in development for testing
      ...(envConfig.NODE_ENV === 'development' && { resetToken }),
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    await user.save();

    return {
      message: 'Password has been reset successfully',
    };
  }

  private async generateTokens(user: any): Promise<AuthTokens> {
    const payload = createTokenPayload(user);

    if (this.app) {
      // Use @fastify/jwt to sign tokens
      const accessToken = this.app.jwt.sign(
        { ...payload, type: 'access' },
        { expiresIn: envConfig.JWT_EXPIRES_IN }
      );
      const refreshToken = this.app.jwt.sign(
        { ...payload, type: 'refresh' },
        { expiresIn: envConfig.JWT_REFRESH_EXPIRES_IN }
      );
      return { accessToken, refreshToken };
    }

    // Fallback if app is not available (for testing)
    const accessToken = JSON.stringify({
      ...payload,
      type: 'access',
      exp: Date.now() + 15 * 60 * 1000,
    });
    const refreshToken = JSON.stringify({
      ...payload,
      type: 'refresh',
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, refreshToken };
  }

  private toUserResponse(user: any): UserResponse {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj as UserResponse;
  }
}

// AuthService instance will be created with app instance in routes
export let authService: AuthService = new AuthService();

export function initAuthService(app: FastifyInstance) {
  authService = new AuthService(app);
}

