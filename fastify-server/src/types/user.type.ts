export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type UserRole = 'user' | 'admin';

export interface UserSignup {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone?: string;
  gender?: Gender;
  dob?: Date;
  password: string;
  profilePicture?: string;
  isActive: boolean;
  isVerified: boolean;
  role: UserRole;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserDocument extends Omit<UserSignup, 'password'> {
  _id: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse extends Omit<UserDocument, 'password'> {}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

