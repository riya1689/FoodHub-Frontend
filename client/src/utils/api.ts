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
}


  export async function fetchMeals() {
  return apiRequest("/meals", "GET");
}

  export async function fetchProviders() {
  return apiRequest("/providers", "GET");
}

//single provider
export async function fetchProviderById(id: string | number) {
  return apiRequest(`/providers/${id}`, "GET");
}
//single meal
export async function fetchMealById(id: string | number) {
  return apiRequest(`/meals/${id}`, "GET");
}

export async function createOrder(orderData: any, token: string) {
  return apiRequest("/orders", "POST", orderData, token);
}
export async function fetchMyOrders(token: string) {
  return apiRequest("/orders", "GET", undefined, token);
}

export async function fetchOrderById(id: string | number, token: string) {
  return apiRequest(`/orders/${id}`, "GET", undefined, token);
}
// PROVIDER (PRIVATE) FETCHERS 
export async function fetchProviderStats(token: string) {
  return apiRequest("/provider/stats", "GET", undefined, token);
}