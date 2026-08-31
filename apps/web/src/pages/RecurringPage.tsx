import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Play } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@financial-system/shared";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recurringApi, categoriesApi, accountsApi } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function RecurringPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const qc = useQueryClient();

  const { data: recurring, isLoading } = useQuery({
    queryKey: ["recurring"],
    queryFn: () => recurringApi.list().then((r) => r.data.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then((r) => r.data.data),
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountsApi.list().then((r) => r.data.data),
  });

  const createRecurring = useMutation({
    mutationFn: recurringApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recurring"] });
      setDialogOpen(false);
    },
  });

  const deleteRecurring = useMutation({
    mutationFn: recurringApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });

  const generate = useMutation({
    mutationFn: recurringApi.generate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recurring"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const { register, handleSubmit, reset, setValue } = useForm<Record<string, any>>({
    defaultValues: {
      type: "EXPENSE",
      frequency: "MONTHLY",
      startDate: format(new Date(), "yyyy-MM-dd"),
      amount: 0,
      categoryId: "",
      accountId: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    await createRecurring.mutateAsync(data);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recurring Transactions</h2>
          <p className="text-muted-foreground">Automate your regular income and expenses</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Recurring
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Recurring Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue="EXPENSE" onValueChange={(v: any) => setValue("type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(v) => setValue("categoryId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {(categories || []).map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account</Label>
                <Select onValueChange={(v) => setValue("accountId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {(accounts || []).map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select defaultValue="MONTHLY" onValueChange={(v: any) => setValue("frequency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" {...register("startDate")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Optional" {...register("description")} />
              </div>

              <Button type="submit" className="w-full" disabled={createRecurring.isPending}>
                {createRecurring.isPending ? "Creating..." : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Recurring Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : (
                (recurring || []).map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.description || "No description"}</TableCell>
                    <TableCell className="capitalize">{r.frequency.toLowerCase()}</TableCell>
                    <TableCell className={r.type === "INCOME" ? "text-success" : "text-destructive"}>
                      {formatCurrency(Number(r.amount))}
                    </TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${r.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                        {r.isActive ? "Active" : "Paused"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.lastGenerated ? format(new Date(r.lastGenerated), "MMM d, yyyy") : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => generate.mutate(r.id)}
                          aria-label={`Generate next occurrence for ${r.description || "recurring transaction"}`}
                        >
                          <Play className="h-4 w-4" />
                          <span className="sr-only">Generate next occurrence</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRecurring.mutate(r.id)}
                          aria-label={`Delete recurring transaction ${r.description || ""}`}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Delete recurring transaction</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
