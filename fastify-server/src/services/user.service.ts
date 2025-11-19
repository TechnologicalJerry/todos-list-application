import { User } from '../models/user.model';
import { UserSignup, UserResponse } from '../types/user.type';
import { hashPassword } from '../utils/password.util';
import { NotFoundError, ConflictError } from '../utils/error.util';

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface PaginatedUsers {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserService {
  async getUsers(query: GetUsersQuery): Promise<PaginatedUsers> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { userName: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.role) {
      filter.role = query.role;
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    // Get users and total count
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map((user) => this.toUserResponse(user)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.toUserResponse(user);
  }

  async createUser(userData: UserSignup): Promise<UserResponse> {
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

    return this.toUserResponse(user);
  }

  async updateUser(id: string, updateData: Partial<UserSignup>): Promise<UserResponse> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check for email/username conflicts if they're being updated
    if (updateData.email || updateData.userName) {
      const existingUser = await User.findOne({
        _id: { $ne: id },
        $or: [
          ...(updateData.email ? [{ email: updateData.email }] : []),
          ...(updateData.userName ? [{ userName: updateData.userName }] : []),
        ],
      });

      if (existingUser) {
        if (existingUser.email === updateData.email) {
          throw new ConflictError('User with this email already exists');
        }
        if (existingUser.userName === updateData.userName) {
          throw new ConflictError('User with this username already exists');
        }
      }
    }

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    return this.toUserResponse(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
  }

  private toUserResponse(user: any): UserResponse {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj as UserResponse;
  }
}

export const userService = new UserService();

