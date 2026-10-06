import { apiFetch } from "./api";
import type { User } from "@/types";
import type { ProfileFormValues } from "./validations/profile.schema";

export async function getCurrentUser() {
  return apiFetch<User>("/users/profil");
}

export async function updateProfile(data: ProfileFormValues) {
  return apiFetch<User>("/users/profil", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAccount() {
  return apiFetch<{ message: string }>("/users/profil", {
    method: "DELETE",
  });
}