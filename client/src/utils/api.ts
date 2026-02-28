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
export async function fetchProviderOrders(token: string) {
  return apiRequest("/provider/orders", "GET", undefined, token);
}

//provider menu management
export async function updateOrderStatus(id: number | string, status: string, token: string) {
  return apiRequest(`/provider/orders/${id}`, "PATCH", { status }, token);
}

export async function addMeal(mealData: any, token: string) {
  return apiRequest("/provider/meals", "POST", mealData, token);
}

export async function deleteMeal(id: number | string, token: string) {
  return apiRequest(`/provider/meals/${id}`, "DELETE", undefined, token);
}

export async function fetchProviderMeals(token: string) {
  return apiRequest("/provider/meals", "GET", undefined, token);
}

export async function fetchCategories() {
  return apiRequest("/categories", "GET");
}

// REVIEWS FETCHERS
export async function submitReview(reviewData: { mealId: number; rating: number; comment: string }, token: string) {
  return apiRequest("/reviews", "POST", reviewData, token);
}
// ADMIN FETCHERS
export async function fetchAdminStats(token: string) {
  return apiRequest("/admin/stats", "GET", undefined, token);
}


//user management fetchers
export async function fetchAllUsers(token: string) {
  return apiRequest("/admin/users", "GET", undefined, token);
}

export async function toggleUserStatus(id: number | string, isActive: boolean, token: string) {
  return apiRequest(`/admin/users/${id}`, "PATCH", { isActive }, token);
}
//order fetcher
export async function fetchAllOrders(token: string) {
  return apiRequest("/admin/orders", "GET", undefined, token);
}

// Category management fetchers
export async function addAdminCategory(name: string, token: string) {
  return apiRequest("/admin/categories", "POST", { name }, token);
}

export async function deleteAdminCategory(id: number | string, token: string) {
  return apiRequest(`/admin/categories/${id}`, "DELETE", undefined, token);
}

// USER PROFILE FETCHERS
export async function fetchMe(token: string) {
  return apiRequest("/auth/me", "GET", undefined, token);
}

export async function updateUserProfile(profileData: any, token: string) {
  return apiRequest("/auth/profile", "PATCH", profileData, token);
}