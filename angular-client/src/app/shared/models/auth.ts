export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupRequest {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: number;
  gender: string;
  dob: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ForgotPasswordResponse {
  message: string;
}
