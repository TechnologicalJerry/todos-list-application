import { httpClient } from './http';
import type { User, UpdateUserData } from '@/types/user.types';

export const userService = {
  async getProfile(): Promise<User> {
    return httpClient.get<User>('/users/me');
  },

  async updateProfile(data: UpdateUserData): Promise<User> {
    return httpClient.put<User>('/users/me', data);
  },

  async getUserById(id: string): Promise<User> {
    return httpClient.get<User>(`/users/${id}`);
  },

  async getAllUsers(): Promise<User[]> {
    return httpClient.get<User[]>('/users');
  },
};

