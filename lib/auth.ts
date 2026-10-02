import { apiFetch } from "./api";
import type { RegisterFormValues, LoginFormValues } from "./validations/auth.schema";

export async function registerUser(data: RegisterFormValues) {
  return apiFetch<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: LoginFormValues) {
  return apiFetch<{ message: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logoutUser() {
  return apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
}