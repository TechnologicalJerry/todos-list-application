import { eq, and, or, ilike, count, inArray, asc, desc, SQL } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db/index.js';
import { todos, Todo } from '../db/schema.js';
import { CreateTodoInput, UpdateTodoInput, TodoQueryInput } from '../schemas/todo.schema.js';

export class TodoService {
  public static async getTodos(userId: string, query: TodoQueryInput) {
    const { page, limit, isCompleted, priority, q, sortBy, sortOrder } = query;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [eq(todos.userId, userId)];

    if (isCompleted !== undefined) {
      conditions.push(eq(todos.isCompleted, isCompleted));
    }

    if (priority !== undefined) {
      conditions.push(eq(todos.priority, priority));
    }

    if (q) {
      const searchPattern = `%${q}%`;
      conditions.push(
        or(
          ilike(todos.title, searchPattern),
          ilike(todos.description, searchPattern)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Get total count matching conditions
    const [countResult] = await db
      .select({ total: count() })
      .from(todos)
      .where(whereClause);

    const total = Number(countResult?.total || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    // Sorting column selection
    let sortColumn;
    switch (sortBy) {
      case 'updatedAt':
        sortColumn = todos.updatedAt;
        break;
      case 'title':
        sortColumn = todos.title;
        break;
      case 'dueDate':
        sortColumn = todos.dueDate;
        break;
      case 'priority':
        sortColumn = todos.priority;
        break;
      case 'createdAt':
      default:
        sortColumn = todos.createdAt;
        break;
    }

    const orderFn = sortOrder === 'asc' ? asc : desc;

    const data = await db
      .select()
      .from(todos)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  public static async getTodoById(userId: string, todoId: string): Promise<Todo> {
    const todo = await db.query.todos.findFirst({
      where: and(eq(todos.id, todoId), eq(todos.userId, userId)),
    });

    if (!todo) {
      throw new HTTPException(404, { message: 'Todo item not found' });
    }

    return todo;
  }

  public static async createTodo(userId: string, input: CreateTodoInput): Promise<Todo> {
    const [newTodo] = await db
      .insert(todos)
      .values({
        userId,
        title: input.title,
        description: input.description,
        priority: input.priority || 'MEDIUM',
        isCompleted: input.isCompleted ?? false,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      })
      .returning();

    return newTodo;
  }

  public static async updateTodo(userId: string, todoId: string, input: UpdateTodoInput): Promise<Todo> {
    // Ownership check
    const existingTodo = await db.query.todos.findFirst({
      where: and(eq(todos.id, todoId), eq(todos.userId, userId)),
    });

    if (!existingTodo) {
      throw new HTTPException(404, { message: 'Todo item not found' });
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.isCompleted !== undefined) updateData.isCompleted = input.isCompleted;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.dueDate !== undefined) {
      updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    }

    const [updatedTodo] = await db
      .update(todos)
      .set(updateData)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();

    return updatedTodo;
  }

  public static async deleteTodo(userId: string, todoId: string) {
    const deleted = await db
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();

    if (deleted.length === 0) {
      throw new HTTPException(404, { message: 'Todo item not found' });
    }

    return { message: 'Todo item deleted successfully' };
  }

  public static async bulkDeleteTodos(userId: string, todoIds: string[]) {
    return await db.transaction(async (tx) => {
      const deletedRecords = await tx
        .delete(todos)
        .where(and(eq(todos.userId, userId), inArray(todos.id, todoIds)))
        .returning({ id: todos.id });

      return {
        message: 'Bulk deletion completed',
        deletedCount: deletedRecords.length,
        deletedIds: deletedRecords.map((r) => r.id),
      };
    });
  }
}
