import { httpClient } from './http';
import type { LoginCredentials, SignupData, AuthResponse } from '@/types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    if (response.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/signup', data);
    if (response.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    await httpClient.post('/auth/logout');
  },

  async forgotPassword(email: string): Promise<void> {
    await httpClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await httpClient.post('/auth/reset-password', { token, password });
  },

  async getCurrentUser() {
    return httpClient.get('/auth/me');
  },
};

