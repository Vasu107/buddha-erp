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
  attendance?: any[];
  summary?: any[];
  totals?: any;
  subjects?: any[];
  overall?: number;
  totalClasses?: number;
  totalAttended?: number;
  department?: string;
  criticalCount?: number;
  warningCount?: number;
  student?: any;
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
    getMyStudents: (params?: { department?: string; branch?: string; year?: string; section?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.department) q.set("department", params.department);
      if (params?.branch) q.set("branch", params.branch);
      if (params?.year) q.set("year", params.year);
      if (params?.section) q.set("section", params.section);
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch(`/roles/faculty/students${qs ? `?${qs}` : ""}`);
    },
    getAttendance: (params?: { date?: string; subjectId?: string; timeSlot?: string; studentId?: string; section?: string }) => {
      const q = new URLSearchParams();
      if (params?.date) q.set("date", params.date);
      if (params?.subjectId) q.set("subjectId", params.subjectId);
      if (params?.timeSlot) q.set("timeSlot", params.timeSlot);
      if (params?.studentId) q.set("studentId", params.studentId);
      if (params?.section) q.set("section", params.section);
      const qs = q.toString();
      return apiFetch(`/roles/faculty/attendance${qs ? `?${qs}` : ""}`);
    },
    getAttendanceSummary: (params?: { subjectId?: string; branch?: string; section?: string; fromDate?: string; toDate?: string }) => {
      const q = new URLSearchParams();
      if (params?.subjectId) q.set("subjectId", params.subjectId);
      if (params?.branch) q.set("branch", params.branch);
      if (params?.section) q.set("section", params.section);
      if (params?.fromDate) q.set("fromDate", params.fromDate);
      if (params?.toDate) q.set("toDate", params.toDate);
      const qs = q.toString();
      return apiFetch(`/roles/faculty/attendance/summary${qs ? `?${qs}` : ""}`);
    },
    saveBulkAttendance: (data: { date: string; subjectId?: string; timeSlot?: string; branch?: string; department?: string; section?: string; records: { studentId: string; status: "PRESENT" | "ABSENT" }[] }) =>
      apiFetch("/roles/faculty/attendance/bulk", { method: "POST", body: JSON.stringify(data) }),
    submitAttendance: (data: { date: string; subjectId?: string; timeSlot?: string; branch?: string; department?: string; section?: string }) =>
      apiFetch("/roles/faculty/attendance/submit", { method: "POST", body: JSON.stringify(data) }),
    create: (data: any) => apiFetch("/faculty", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiFetch(`/faculty/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/faculty/${id}`, { method: "DELETE" }),
  },
  hods: {
    getAll: () => apiFetch("/hods"),
    create: (data: any) => apiFetch("/hods", { method: "POST", body: JSON.stringify(data) }),
    getAttendance: (params?: { branch?: string; section?: string; year?: string; date?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.branch) q.set("branch", params.branch);
      if (params?.section) q.set("section", params.section);
      if (params?.year) q.set("year", params.year);
      if (params?.date) q.set("date", params.date);
      if (params?.status) q.set("status", params.status);
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch(`/roles/hod/attendance${qs ? `?${qs}` : ""}`);
    },
    getAttendanceSummary: (params?: { section?: string; year?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.section) q.set("section", params.section);
      if (params?.year) q.set("year", params.year);
      if (params?.status) q.set("status", params.status);
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch(`/roles/hod/attendance/summary${qs ? `?${qs}` : ""}`);
    },
  },
  studentRole: {
    getAttendance: () => apiFetch("/roles/student/attendance"),
    getAttendanceSummary: () => apiFetch("/roles/student/attendance/summary"),
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
    getAttendance: (params?: { department?: string; branch?: string; section?: string; date?: string; fromDate?: string; toDate?: string; year?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.department) q.set("department", params.department);
      if (params?.branch) q.set("branch", params.branch);
      if (params?.section) q.set("section", params.section);
      if (params?.date) q.set("date", params.date);
      if (params?.fromDate) q.set("fromDate", params.fromDate);
      if (params?.toDate) q.set("toDate", params.toDate);
      if (params?.year) q.set("year", params.year);
      if (params?.status) q.set("status", params.status);
      if (params?.search) q.set("search", params.search);
      const qs = q.toString();
      return apiFetch(`/roles/director/attendance${qs ? `?${qs}` : ""}`);
    },
    getAttendanceSummary: (params?: { department?: string; branch?: string; section?: string; date?: string; fromDate?: string; toDate?: string; year?: string }) => {
      const q = new URLSearchParams();
      if (params?.department) q.set("department", params.department);
      if (params?.branch) q.set("branch", params.branch);
      if (params?.section) q.set("section", params.section);
      if (params?.date) q.set("date", params.date);
      if (params?.fromDate) q.set("fromDate", params.fromDate);
      if (params?.toDate) q.set("toDate", params.toDate);
      if (params?.year) q.set("year", params.year);
      const qs = q.toString();
      return apiFetch(`/roles/director/attendance/summary${qs ? `?${qs}` : ""}`);
    },
  },
};
