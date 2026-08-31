import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savingsGoalsApi } from "@/lib/apiClient";

export function useSavingsGoals() {
  return useQuery({
    queryKey: ["savingsGoals"],
    queryFn: () => savingsGoalsApi.list().then((r) => r.data.data),
  });
}

export function useCreateSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: savingsGoalsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });
}

export function useContributeToGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      savingsGoalsApi.contribute(id, amount),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });
}

export function useDeleteSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: savingsGoalsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });
}
