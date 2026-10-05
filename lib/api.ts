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
  students?: any[];
  faculty?: any[];
  stats?: any;
  count?: number;
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
    getAll: (params?: { department?: string; year?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.department) q.set("department", params.department);
      if (params?.year) q.set("year", params.year);
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch(`/students${qs ? `?${qs}` : ""}`);
    },
    create: (data: any) => apiFetch("/students", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiFetch(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/students/${id}`, { method: "DELETE" }),
  },
  faculty: {
    getAll: (params?: { department?: string; designation?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.department) q.set("department", params.department);
      if (params?.designation) q.set("designation", params.designation);
      if (params?.status) q.set("status", params.status);
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch(`/faculty${qs ? `?${qs}` : ""}`);
    },
    create: (data: any) => apiFetch("/faculty", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiFetch(`/faculty/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/faculty/${id}`, { method: "DELETE" }),
  },
  hods: {
    getAll: () => apiFetch("/hods"),
    create: (data: any) => apiFetch("/hods", { method: "POST", body: JSON.stringify(data) }),
  },
  director: {
    getStats: () => apiFetch("/director/stats"),
    getProfile: () => apiFetch("/director/profile"),
    updateProfile: (data: { name?: string; employeeId?: string }) =>
      apiFetch("/director/profile", { method: "PUT", body: JSON.stringify(data) }),
    // director-scoped student/faculty (go through /director prefix)
    getStudents: (params?: { department?: string; year?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.department) q.set("department", params.department);
      if (params?.year) q.set("year", params.year);
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch(`/director/students${qs ? `?${qs}` : ""}`);
    },
    createStudent: (data: any) =>
      apiFetch("/director/students", { method: "POST", body: JSON.stringify(data) }),
    updateStudent: (id: string, data: any) =>
      apiFetch(`/director/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteStudent: (id: string) =>
      apiFetch(`/director/students/${id}`, { method: "DELETE" }),
    getFaculty: (params?: { department?: string; designation?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.department) q.set("department", params.department);
      if (params?.designation) q.set("designation", params.designation);
      if (params?.status) q.set("status", params.status);
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch(`/director/faculty${qs ? `?${qs}` : ""}`);
    },
    createFaculty: (data: any) =>
      apiFetch("/director/faculty", { method: "POST", body: JSON.stringify(data) }),
    updateFaculty: (id: string, data: any) =>
      apiFetch(`/director/faculty/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteFaculty: (id: string) =>
      apiFetch(`/director/faculty/${id}`, { method: "DELETE" }),
  },
};
