const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
  profile?: any;
  token?: string;
  error?: string;
  errors?: any[];
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bit_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string; role?: string }) =>
      apiFetch("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    getMe: () => apiFetch("/auth/me", { method: "GET" }),
    logout: () => apiFetch("/auth/logout", { method: "POST" }),
  },
  users: {
    getAll: () => apiFetch("/users"),
    getById: (id: string) => apiFetch(`/users/${id}`),
    create: (data: any) => apiFetch("/users", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/users/${id}`, { method: "DELETE" }),
  },
  students: {
    getAll: () => apiFetch("/students"),
    create: (data: any) => apiFetch("/students", { method: "POST", body: JSON.stringify(data) }),
  },
  faculty: {
    getAll: () => apiFetch("/faculty"),
    create: (data: any) => apiFetch("/faculty", { method: "POST", body: JSON.stringify(data) }),
  },
  hods: {
    getAll: () => apiFetch("/hods"),
    create: (data: any) => apiFetch("/hods", { method: "POST", body: JSON.stringify(data) }),
  },
};
