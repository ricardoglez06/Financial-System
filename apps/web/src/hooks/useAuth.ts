import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { user, isAuthenticated, hasHydrated, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (res) => {
      setAuth(res.data.data.user, res.data.data.token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.register(email, password),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
    },
  });

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: () => authApi.me().then((r) => r.data.data),
    enabled: isAuthenticated && hasHydrated,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  if (sessionQuery.isError && isAuthenticated && !sessionQuery.isPending) {
    clearAuth();
  }

  return {
    user: sessionQuery.data || user,
    isAuthenticated,
    hasHydrated,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
}
