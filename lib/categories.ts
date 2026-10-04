import { apiFetch } from "./api";
import type { Category } from "@/types";
import type { CategoryFormValues } from "./validations/category.schema";

export async function getCategories() {
  return apiFetch<Category[]>("/categories");
}

export async function createCategory(data: CategoryFormValues) {
  return apiFetch<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: CategoryFormValues) {
  return apiFetch<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string) {
  return apiFetch<{ message: string }>(`/categories/${id}`, {
    method: "DELETE",
  });
}