import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { investmentsApi } from "@/lib/apiClient";

export function useInvestments() {
  return useQuery({
    queryKey: ["investments"],
    queryFn: () => investmentsApi.list().then((r) => r.data.data),
  });
}

export function useInvestmentSummary() {
  return useQuery({
    queryKey: ["investmentSummary"],
    queryFn: () => investmentsApi.summary().then((r) => r.data.data),
  });
}

export function useCreateInvestment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: investmentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["investments"] });
      qc.invalidateQueries({ queryKey: ["investmentSummary"] });
    },
  });
}

export function useUpdateInvestment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      investmentsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["investments"] });
      qc.invalidateQueries({ queryKey: ["investmentSummary"] });
    },
  });
}

export function useDeleteInvestment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: investmentsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["investments"] });
      qc.invalidateQueries({ queryKey: ["investmentSummary"] });
    },
  });
}
