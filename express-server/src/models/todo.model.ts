import mongoose from "mongoose";

export interface TodoInput {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date;
}

export interface TodoDocument extends TodoInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new mongoose.Schema<TodoDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

const TodoModel = mongoose.model<TodoDocument>("Todo", todoSchema);

export default TodoModel;


