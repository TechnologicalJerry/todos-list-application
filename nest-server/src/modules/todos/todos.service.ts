import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<TodoDocument> {
    const newTodo = new this.todoModel({
      ...createTodoDto,
      user: new mongoose.Types.ObjectId(userId),
    });
    return newTodo.save();
  }

  async findAll(userId: string, query: QueryTodoDto): Promise<TodoDocument[]> {
    const filter: any = { user: new mongoose.Types.ObjectId(userId) };
    if (query.completed !== undefined) {
      filter.completed = query.completed;
    }
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }
    return this.todoModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(userId: string, todoId: string): Promise<TodoDocument> {
    const todo = await this.todoModel
      .findOne({ _id: new mongoose.Types.ObjectId(todoId), user: new mongoose.Types.ObjectId(userId) })
      .exec();
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }
    return todo;
  }

  async update(userId: string, todoId: string, updateTodoDto: UpdateTodoDto): Promise<TodoDocument> {
    const updatedTodo = await this.todoModel
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(todoId), user: new mongoose.Types.ObjectId(userId) },
        { $set: updateTodoDto },
        { new: true },
      )
      .exec();
    if (!updatedTodo) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }
    return updatedTodo;
  }

  async remove(userId: string, todoId: string): Promise<{ success: boolean }> {
    const result = await this.todoModel
      .deleteOne({ _id: new mongoose.Types.ObjectId(todoId), user: new mongoose.Types.ObjectId(userId) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }
    return { success: true };
  }
}
