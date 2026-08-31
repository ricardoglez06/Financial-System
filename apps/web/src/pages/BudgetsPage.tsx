import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { createBudgetSchema, type CreateBudgetInput, formatCurrency } from "@financial-system/shared";
import { useBudgets, useCreateBudget, useDeleteBudget } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function BudgetsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: budgets, isLoading } = useBudgets({ month, year });
  const { data: categories } = useCategories("EXPENSE");
  const createBudget = useCreateBudget();
  const deleteBudget = useDeleteBudget();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateBudgetInput>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: { month, year },
  });

  const onSubmit = async (data: CreateBudgetInput) => {
    await createBudget.mutateAsync(data);
    reset();
    setDialogOpen(false);
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "danger":
        return "bg-destructive";
      case "warning":
        return "bg-warning";
      default:
        return "bg-success";
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">Track your spending limits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(v) => setValue("categoryId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories || []).map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monthly Limit</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("monthlyLimit", { valueAsNumber: true })}
                />
                {errors.monthlyLimit && (
                  <p className="text-sm text-destructive">{errors.monthlyLimit.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select
                    defaultValue={String(month)}
                    onValueChange={(v) => setValue("month", parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m, i) => (
                        <SelectItem key={i} value={String(i + 1)}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input type="number" {...register("year", { valueAsNumber: true })} />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createBudget.isPending}>
                {createBudget.isPending ? "Creating..." : "Create Budget"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select value={String(month)} onValueChange={(v) => setMonth(parseInt(v))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-28"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-6">
              {(budgets || []).map((budget: any) => (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: budget.category?.colorHex }}
                      />
                      <span className="font-medium">{budget.category?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.monthlyLimit)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBudget.mutate(budget.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(budget.percentage, 100)}
                    indicatorClassName={getProgressColor(budget.status)}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{budget.percentage}% used</span>
                    <span>
                      {budget.remaining > 0
                        ? `${formatCurrency(budget.remaining)} remaining`
                        : `${formatCurrency(Math.abs(budget.remaining))} over budget`}
                    </span>
                  </div>
                </div>
              ))}
              {(!budgets || budgets.length === 0) && (
                <p className="text-center text-muted-foreground">
                  No budgets set for this period
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
