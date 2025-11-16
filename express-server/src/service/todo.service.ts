import TodoModel, { TodoDocument, TodoInput } from "../models/todo.model";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";

export async function createTodo(input: TodoInput): Promise<TodoDocument> {
  return await TodoModel.create(input);
}

export async function findTodo(
  query: FilterQuery<TodoDocument>,
  options: QueryOptions = { lean: true }
) {
  return await TodoModel.findOne(query, {}, options);
}

export async function listTodos(
  query: FilterQuery<TodoDocument>,
  options: QueryOptions = { lean: true }
) {
  return await TodoModel.find(query, {}, options).sort({ createdAt: -1 });
}

export async function updateTodo(
  query: FilterQuery<TodoDocument>,
  update: UpdateQuery<TodoDocument>,
  options: QueryOptions = { new: true }
) {
  return await TodoModel.findOneAndUpdate(query, update, options);
}

export async function deleteTodo(query: FilterQuery<TodoDocument>) {
  return await TodoModel.deleteOne(query);
}


