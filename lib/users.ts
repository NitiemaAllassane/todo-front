import { cookies } from "next/headers";
import type { User } from "@/types";
import { apiFetch } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;



export async function getCurrentUserServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  const response = await fetch(`${API_URL}/users/profil`, {
    headers: { Cookie: `access_token=${token}` },
    cache: "no-store",
  });

  if (!response.ok) return null;

  return response.json();
}



export async function getCurrentUser() {
  return apiFetch<User>("/users/me");
}