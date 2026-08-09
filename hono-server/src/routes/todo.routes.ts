import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AppEnv } from '../types/env.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createTodoSchema,
  updateTodoSchema,
  todoParamSchema,
  todoQuerySchema,
  bulkDeleteTodoSchema,
} from '../schemas/todo.schema.js';
import { TodoService } from '../services/todo.service.js';

export const todoRoutes = new Hono<AppEnv>();

todoRoutes.use('*', authMiddleware);

todoRoutes.get('/', zValidator('query', todoQuerySchema), async (c) => {
  const userId = c.get('userId');
  const query = c.req.valid('query');
  const result = await TodoService.getTodos(userId, query);
  return c.json(
    {
      success: true,
      data: result.data,
      meta: result.meta,
    },
    200
  );
});

todoRoutes.post('/', zValidator('json', createTodoSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');
  const todo = await TodoService.createTodo(userId, body);
  return c.json(
    {
      success: true,
      data: todo,
    },
    201
  );
});

todoRoutes.delete('/bulk', zValidator('json', bulkDeleteTodoSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');
  const result = await TodoService.bulkDeleteTodos(userId, body.ids);
  return c.json(
    {
      success: true,
      data: result,
    },
    200
  );
});

todoRoutes.get('/:id', zValidator('param', todoParamSchema), async (c) => {
  const userId = c.get('userId');
  const { id } = c.req.valid('param');
  const todo = await TodoService.getTodoById(userId, id);
  return c.json(
    {
      success: true,
      data: todo,
    },
    200
  );
});

todoRoutes.patch(
  '/:id',
  zValidator('param', todoParamSchema),
  zValidator('json', updateTodoSchema),
  async (c) => {
    const userId = c.get('userId');
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const updatedTodo = await TodoService.updateTodo(userId, id, body);
    return c.json(
      {
        success: true,
        data: updatedTodo,
      },
      200
    );
  }
);

todoRoutes.delete('/:id', zValidator('param', todoParamSchema), async (c) => {
  const userId = c.get('userId');
  const { id } = c.req.valid('param');
  const result = await TodoService.deleteTodo(userId, id);
  return c.json(
    {
      success: true,
      message: result.message,
    },
    200
  );
});
