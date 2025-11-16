import { object, string, boolean, date, TypeOf, optional } from "zod";

export const createTodoSchema = object({
  body: object({
    title: string({ required_error: "Title is required" }).min(1),
    description: string().optional(),
    completed: boolean().optional(),
    dueDate: string().datetime().optional(),
  }),
});

export const updateTodoSchema = object({
  params: object({
    todoId: string({ required_error: "todoId is required" }),
  }),
  body: object({
    title: string().min(1).optional(),
    description: string().optional(),
    completed: boolean().optional(),
    dueDate: string().datetime().optional(),
  }),
});

export const getTodoSchema = object({
  params: object({
    todoId: string({ required_error: "todoId is required" }),
  }),
});

export const deleteTodoSchema = object({
  params: object({
    todoId: string({ required_error: "todoId is required" }),
  }),
});

export const listTodosSchema = object({
  query: object({
    completed: string().optional(), // "true"/"false"
  }).optional(),
});

export type CreateTodoInput = TypeOf<typeof createTodoSchema>["body"];
export type UpdateTodoInput = TypeOf<typeof updateTodoSchema>;
export type GetTodoInput = TypeOf<typeof getTodoSchema>["params"];
export type DeleteTodoInput = TypeOf<typeof deleteTodoSchema>["params"];


