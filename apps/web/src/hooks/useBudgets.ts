import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetsApi } from "@/lib/apiClient";

export function useBudgets(params?: Record<string, number>) {
  return useQuery({
    queryKey: ["budgets", params],
    queryFn: () => budgetsApi.list(params).then((r) => r.data.data),
  });
}

export function useBudgetSummary(params?: Record<string, number>) {
  return useQuery({
    queryKey: ["budgetSummary", params],
    queryFn: () => budgetsApi.summary(params).then((r) => r.data.data),
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: budgetsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budgetSummary"] });
    },
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      budgetsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budgetSummary"] });
    },
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: budgetsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budgetSummary"] });
    },
  });
}
