import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isSessionCheck = error.config?.url?.includes("/auth/me");
      const isAuthEndpoint = error.config?.url?.includes("/auth/login") || 
                             error.config?.url?.includes("/auth/register");
      
      if (!isSessionCheck && !isAuthEndpoint) {
        useAuthStore.getState().clearAuth();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
