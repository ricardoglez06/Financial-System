import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { createInvestmentSchema, type CreateInvestmentInput, formatCurrency } from "@financial-system/shared";
import { useInvestments, useInvestmentSummary, useCreateInvestment, useDeleteInvestment } from "@/hooks/useInvestments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function InvestmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: investments, isLoading } = useInvestments();
  const { data: summary } = useInvestmentSummary();
  const createInvestment = useCreateInvestment();
  const deleteInvestment = useDeleteInvestment();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateInvestmentInput>({
    resolver: zodResolver(createInvestmentSchema),
    defaultValues: {
      type: "ETF",
      purchaseDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (data: CreateInvestmentInput) => {
    await createInvestment.mutateAsync(data);
    reset();
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Investments</h2>
          <p className="text-muted-foreground">Track your portfolio performance</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Investment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="e.g., Vanguard S&P 500 ETF" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue="ETF" onValueChange={(v: any) => setValue("type", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETF">ETF</SelectItem>
                      <SelectItem value="STOCK">Stock</SelectItem>
                      <SelectItem value="BOND">Bond</SelectItem>
                      <SelectItem value="CRYPTO">Crypto</SelectItem>
                      <SelectItem value="MUTUAL_FUND">Mutual Fund</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ticker</Label>
                  <Input placeholder="e.g., VOO" {...register("ticker")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Principal Amount</Label>
                <Input type="number" step="0.01" placeholder="0.00" {...register("principal", { valueAsNumber: true })} />
                {errors.principal && <p className="text-sm text-destructive">{errors.principal.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Value</Label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("currentValue", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Current Yield</Label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("currentYield", { valueAsNumber: true })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Purchase Date</Label>
                <Input type="date" {...register("purchaseDate")} />
              </div>

              <Button type="submit" className="w-full" disabled={createInvestment.isPending}>
                {createInvestment.isPending ? "Adding..." : "Add Investment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalPrincipal || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalCurrentValue || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(summary?.totalReturn || 0) >= 0 ? "text-success" : "text-destructive"}`}>
              {summary?.totalReturn || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : (
                (investments || []).map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.name}</TableCell>
                    <TableCell>
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs">{inv.type}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{inv.ticker || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(inv.purchaseDate), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(inv.principal))}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(Number(inv.currentValue))}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteInvestment.mutate(inv.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
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
