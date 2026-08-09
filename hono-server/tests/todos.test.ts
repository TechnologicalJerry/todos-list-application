import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/app.js';
import { createTestDatabase } from './test-utils.js';

describe('Todo Endpoints (/api/v1/todos)', () => {
  let userAToken: string;
  let userBToken: string;

  beforeEach(async () => {
    createTestDatabase();

    // Register User A
    const resA = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'userA@example.com',
        password: 'Password123!',
        fullName: 'User A',
      }),
    });
    const bodyA = await resA.json();
    userAToken = bodyA.data.accessToken;

    // Register User B
    const resB = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'userB@example.com',
        password: 'Password123!',
        fullName: 'User B',
      }),
    });
    const bodyB = await resB.json();
    userBToken = bodyB.data.accessToken;
  });

  describe('POST /api/v1/todos', () => {
    it('should create a new todo for authenticated user', async () => {
      const res = await app.request('/api/v1/todos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userAToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Buy Groceries',
          description: 'Milk, Eggs, Bread',
          priority: 'HIGH',
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.id).toBeDefined();
      expect(body.data.title).toBe('Buy Groceries');
      expect(body.data.priority).toBe('HIGH');
      expect(body.data.isCompleted).toBe(false);
    });
  });

  describe('GET /api/v1/todos', () => {
    beforeEach(async () => {
      await app.request('/api/v1/todos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userAToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Task 1', priority: 'LOW', isCompleted: false }),
      });

      await app.request('/api/v1/todos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userAToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Task 2', priority: 'HIGH', isCompleted: true }),
      });
    });

    it('should retrieve user list of todos with pagination', async () => {
      const res = await app.request('/api/v1/todos?page=1&limit=10', {
        method: 'GET',
        headers: { Authorization: `Bearer ${userAToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.length).toBe(2);
      expect(body.meta.total).toBe(2);
    });

    it('should filter todos by isCompleted', async () => {
      const res = await app.request('/api/v1/todos?isCompleted=true', {
        method: 'GET',
        headers: { Authorization: `Bearer ${userAToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.length).toBe(1);
      expect(body.data[0].title).toBe('Task 2');
    });

    it('should search todos by query string q', async () => {
      const res = await app.request('/api/v1/todos?q=Task 1', {
        method: 'GET',
        headers: { Authorization: `Bearer ${userAToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.length).toBe(1);
      expect(body.data[0].title).toBe('Task 1');
    });
  });

  describe('Todo CRUD & Boundary / Isolation Checks', () => {
    let userATodoId: string;

    beforeEach(async () => {
      const res = await app.request('/api/v1/todos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userAToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'User A Private Todo' }),
      });
      const body = await res.json();
      userATodoId = body.data.id;
    });

    it('should allow User A to retrieve their own todo', async () => {
      const res = await app.request(`/api/v1/todos/${userATodoId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${userAToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.title).toBe('User A Private Todo');
    });

    it('should PREVENT User B from reading User A todo (404 Not Found)', async () => {
      const res = await app.request(`/api/v1/todos/${userATodoId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${userBToken}` },
      });

      expect(res.status).toBe(404);
    });

    it('should PREVENT User B from updating User A todo (404 Not Found)', async () => {
      const res = await app.request(`/api/v1/todos/${userATodoId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${userBToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Hacked Title' }),
      });

      expect(res.status).toBe(404);
    });

    it('should PREVENT User B from deleting User A todo (404 Not Found)', async () => {
      const res = await app.request(`/api/v1/todos/${userATodoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userBToken}` },
      });

      expect(res.status).toBe(404);
    });

    it('should allow User A to update their todo', async () => {
      const res = await app.request(`/api/v1/todos/${userATodoId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${userAToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: true }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.isCompleted).toBe(true);
    });

    it('should allow User A to bulk delete their todos', async () => {
      // Create a second todo for User A
      const res2 = await app.request('/api/v1/todos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userAToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Second Todo' }),
      });
      const body2 = await res2.json();
      const secondTodoId = body2.data.id;

      const bulkRes = await app.request('/api/v1/todos/bulk', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userAToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [userATodoId, secondTodoId] }),
      });

      expect(bulkRes.status).toBe(200);
      const bulkBody = await bulkRes.json();
      expect(bulkBody.data.deletedCount).toBe(2);
    });
  });
});
