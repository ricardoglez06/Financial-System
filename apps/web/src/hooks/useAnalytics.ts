import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/apiClient";

export function useAnalyticsSummary(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["analytics", "summary", params],
    queryFn: () => analyticsApi.summary(params).then((r) => r.data.data),
  });
}

export function useCashFlow(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["analytics", "cashflow", params],
    queryFn: () => analyticsApi.cashflow(params).then((r) => r.data.data),
  });
}

export function useCategoryBreakdown(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["analytics", "categories", params],
    queryFn: () => analyticsApi.categories(params).then((r) => r.data.data),
  });
}

export function useTrends(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["analytics", "trends", params],
    queryFn: () => analyticsApi.trends(params).then((r) => r.data.data),
  });
}

export function useTaxReport(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["analytics", "taxReport", params],
    queryFn: () => analyticsApi.taxReport(params).then((r) => r.data.data),
  });
}
