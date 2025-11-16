import { Express } from "express";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createTodoHandler,
  deleteTodoHandler,
  getTodoHandler,
  listTodosHandler,
  updateTodoHandler,
} from "../controller/todo.controller";
import {
  createTodoSchema,
  deleteTodoSchema,
  getTodoSchema,
  listTodosSchema,
  updateTodoSchema,
} from "../schema/todo.schema";

export default function registerTodoRoutes(app: Express) {
  /**
   * @openapi
   * '/api/todos':
   *  get:
   *     tags:
   *     - Todos
   *     summary: List user's todos
   *     responses:
   *       200:
   *         description: List of todos
   *  post:
   *     tags:
   *     - Todos
   *     summary: Create a todo
   */
  app.get("/api/todos", requireUser, validateResource(listTodosSchema), listTodosHandler);
  app.post("/api/todos", requireUser, validateResource(createTodoSchema), createTodoHandler);

  /**
   * @openapi
   * '/api/todos/{todoId}':
   *  get:
   *     tags:
   *     - Todos
   *     summary: Get a todo
   *  put:
   *     tags:
   *     - Todos
   *     summary: Update a todo
   *  delete:
   *     tags:
   *     - Todos
   *     summary: Delete a todo
   */
  app.get("/api/todos/:todoId", requireUser, validateResource(getTodoSchema), getTodoHandler);
  app.put("/api/todos/:todoId", requireUser, validateResource(updateTodoSchema), updateTodoHandler);
  app.delete("/api/todos/:todoId", requireUser, validateResource(deleteTodoSchema), deleteTodoHandler);
}


