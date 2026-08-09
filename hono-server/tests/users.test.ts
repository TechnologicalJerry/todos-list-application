import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/app.js';
import { createTestDatabase } from './test-utils.js';

describe('User Endpoints (/api/v1/users)', () => {
  let accessToken: string;
  const userCredentials = {
    email: 'user.test@example.com',
    password: 'InitialPassword123!',
    fullName: 'Test User',
  };

  beforeEach(async () => {
    createTestDatabase();

    const regRes = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userCredentials),
    });

    const regBody = await regRes.json();
    accessToken = regBody.data.accessToken;
  });

  describe('GET /api/v1/users/me', () => {
    it('should return 401 when no token is provided', async () => {
      const res = await app.request('/api/v1/users/me', {
        method: 'GET',
      });

      expect(res.status).toBe(401);
    });

    it('should return current authenticated user profile', async () => {
      const res = await app.request('/api/v1/users/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.email).toBe(userCredentials.email);
      expect(body.data.fullName).toBe(userCredentials.fullName);
    });
  });

  describe('PATCH /api/v1/users/me', () => {
    it('should update user full name', async () => {
      const res = await app.request('/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: 'Updated Name' }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.fullName).toBe('Updated Name');
    });
  });

  describe('PUT /api/v1/users/me/password', () => {
    it('should update password and allow login with new password', async () => {
      const newPassword = 'NewSecretPassword123!';

      const res = await app.request('/api/v1/users/me/password', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: userCredentials.password,
          newPassword,
        }),
      });

      expect(res.status).toBe(200);

      // Verify login with new password
      const loginRes = await app.request('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userCredentials.email,
          password: newPassword,
        }),
      });

      expect(loginRes.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/users/me', () => {
    it('should delete user account', async () => {
      const res = await app.request('/api/v1/users/me', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(res.status).toBe(200);

      // Profile access should now fail with 401 (invalid user/token)
      const profileRes = await app.request('/api/v1/users/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(profileRes.status).toBe(404);
    });
  });
});
