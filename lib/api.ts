const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: "Une erreur est survenue" }));
    throw new Error(errorBody.message || "Une erreur est survenue");
  }

  return response.json();
}