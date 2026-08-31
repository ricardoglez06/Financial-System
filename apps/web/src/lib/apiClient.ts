import api from "@/lib/api";

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (email: string, password: string) =>
    api.post("/auth/register", { email, password }),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),

  refresh: () => api.post("/auth/refresh"),
};

export const transactionsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get("/transactions", { params }),

  get: (id: string) => api.get(`/transactions/${id}`),

  create: (data: any) => api.post("/transactions", data),

  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),

  delete: (id: string) => api.delete(`/transactions/${id}`),

  bulk: (data: any) => api.post("/transactions/bulk", data),
};

export const categoriesApi = {
  list: (type?: string) =>
    api.get("/categories", { params: type ? { type } : {} }),

  get: (id: string) => api.get(`/categories/${id}`),

  create: (data: any) => api.post("/categories", data),

  update: (id: string, data: any) => api.put(`/categories/${id}`, data),

  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const accountsApi = {
  list: () => api.get("/accounts"),

  get: (id: string) => api.get(`/accounts/${id}`),

  create: (data: any) => api.post("/accounts", data),

  update: (id: string, data: any) => api.put(`/accounts/${id}`, data),

  delete: (id: string) => api.delete(`/accounts/${id}`),
};

export const budgetsApi = {
  list: (params?: Record<string, number>) =>
    api.get("/budgets", { params }),

  summary: (params?: Record<string, number>) =>
    api.get("/budgets/summary", { params }),

  create: (data: any) => api.post("/budgets", data),

  update: (id: string, data: any) => api.put(`/budgets/${id}`, data),

  delete: (id: string) => api.delete(`/budgets/${id}`),
};

export const analyticsApi = {
  summary: (params?: Record<string, string>) =>
    api.get("/analytics/summary", { params }),

  cashflow: (params?: Record<string, string>) =>
    api.get("/analytics/cashflow", { params }),

  categories: (params?: Record<string, string>) =>
    api.get("/analytics/categories", { params }),

  trends: (params?: Record<string, string | number>) =>
    api.get("/analytics/trends", { params }),

  taxReport: (params?: Record<string, string | number>) =>
    api.get("/analytics/tax-report", { params }),
};

export const investmentsApi = {
  list: () => api.get("/investments"),

  get: (id: string) => api.get(`/investments/${id}`),

  summary: () => api.get("/investments/summary"),

  create: (data: any) => api.post("/investments", data),

  update: (id: string, data: any) => api.put(`/investments/${id}`, data),

  delete: (id: string) => api.delete(`/investments/${id}`),
};

export const savingsGoalsApi = {
  list: () => api.get("/savings-goals"),

  create: (data: any) => api.post("/savings-goals", data),

  update: (id: string, data: any) => api.put(`/savings-goals/${id}`, data),

  delete: (id: string) => api.delete(`/savings-goals/${id}`),

  contribute: (id: string, amount: number) =>
    api.post(`/savings-goals/${id}/contribute`, { amount }),
};

export const recurringApi = {
  list: () => api.get("/recurring"),

  create: (data: any) => api.post("/recurring", data),

  update: (id: string, data: any) => api.put(`/recurring/${id}`, data),

  delete: (id: string) => api.delete(`/recurring/${id}`),

  generate: (id: string) => api.post(`/recurring/${id}/generate`),
};
