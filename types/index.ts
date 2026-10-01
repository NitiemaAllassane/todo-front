// types/index.ts
export type User = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Category = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate?: string;
  dueDate?: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
};