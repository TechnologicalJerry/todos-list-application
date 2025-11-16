import { Request, Response } from "express";
import {
  CreateTodoInput,
  DeleteTodoInput,
  GetTodoInput,
  UpdateTodoInput,
} from "../schema/todo.schema";
import {
  createTodo,
  deleteTodo,
  findTodo,
  listTodos,
  updateTodo,
} from "../service/todo.service";
import logger from "../utils/logger";

export async function createTodoHandler(
  req: Request<{}, {}, CreateTodoInput>,
  res: Response
) {
  try {
    const userId = res.locals.user._id;
    const todo = await createTodo({ user: userId, ...req.body });
    return res.status(201).send(todo);
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Failed to create todo");
  }
}

export async function listTodosHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id;
    const { completed } = req.query as { completed?: string };
    const filter: any = { user: userId };
    if (completed === "true") filter.completed = true;
    if (completed === "false") filter.completed = false;
    const todos = await listTodos(filter);
    return res.send(todos);
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Failed to list todos");
  }
}

export async function getTodoHandler(
  req: Request<GetTodoInput>,
  res: Response
) {
  const userId = res.locals.user._id;
  const { todoId } = req.params;
  const todo = await findTodo({ _id: todoId, user: userId });
  if (!todo) return res.sendStatus(404);
  return res.send(todo);
}

export async function updateTodoHandler(
  req: Request<UpdateTodoInput["params"], {}, UpdateTodoInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const { todoId } = req.params;
  const existing = await findTodo({ _id: todoId, user: userId });
  if (!existing) return res.sendStatus(404);
  const updated = await updateTodo({ _id: todoId, user: userId }, req.body);
  return res.send(updated);
}

export async function deleteTodoHandler(
  req: Request<DeleteTodoInput>,
  res: Response
) {
  const userId = res.locals.user._id;
  const { todoId } = req.params;
  const existing = await findTodo({ _id: todoId, user: userId });
  if (!existing) return res.sendStatus(404);
  await deleteTodo({ _id: todoId, user: userId });
  return res.sendStatus(200);
}


