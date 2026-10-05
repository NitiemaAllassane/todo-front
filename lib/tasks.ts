// lib/tasks.ts
import { apiFetch } from "./api";
import type { Task } from "@/types";
import type { TaskFormValues } from "./validations/task.schema";

export async function getTasks() {
  return apiFetch<Task[]>("/tasks");
}

export async function createTask(data: TaskFormValues) {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTask(id: string, data: Partial<TaskFormValues>) {
  return apiFetch<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id: string) {
  return apiFetch<{ message: string }>(`/tasks/${id}`, {
    method: "DELETE",
  });
}