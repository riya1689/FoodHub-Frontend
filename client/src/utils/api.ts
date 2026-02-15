const API_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

export async function apiRequest(endpoint: string, method: string, body?: any, token?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
  // Add this to the bottom of client/src/utils/api.ts
  export async function fetchMeals() {
  return apiRequest("/meals", "GET");
  }

  export async function fetchProviders() {
  return apiRequest("/providers", "GET");
  }
}