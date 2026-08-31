import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Target, DollarSign } from "lucide-react";
import { formatCurrency } from "@financial-system/shared";
import { useSavingsGoals, useCreateSavingsGoal, useContributeToGoal, useDeleteSavingsGoal } from "@/hooks/useSavingsGoals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SavingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState("");

  const { data: goals, isLoading } = useSavingsGoals();
  const createGoal = useCreateSavingsGoal();
  const contribute = useContributeToGoal();
  const deleteGoal = useDeleteSavingsGoal();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: "", targetAmount: 0 },
  });

  const onSubmit = async (data: any) => {
    await createGoal.mutateAsync(data);
    reset();
    setDialogOpen(false);
  };

  const handleContribute = async () => {
    if (contributeId && contributeAmount) {
      await contribute.mutateAsync({ id: contributeId, amount: parseFloat(contributeAmount) });
      setContributeId(null);
      setContributeAmount("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Savings Goals</h2>
          <p className="text-muted-foreground">Track progress towards your financial goals</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Savings Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input placeholder="e.g., Emergency Fund" {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input type="number" step="0.01" placeholder="0.00" {...register("targetAmount", { valueAsNumber: true })} />
              </div>
              <Button type="submit" className="w-full" disabled={createGoal.isPending}>
                {createGoal.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          (goals || []).map((goal: any) => (
            <Card key={goal.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{goal.name}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(goal.currentAmount)}</div>
                    <p className="text-xs text-muted-foreground">
                      of {formatCurrency(goal.targetAmount)} ({goal.percentage}%)
                    </p>
                  </div>
                  <Progress value={goal.percentage} indicatorClassName="bg-primary" />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setContributeId(goal.id)}
                    >
                      <DollarSign className="mr-1 h-3 w-3" />
                      Contribute
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGoal.mutate(goal.id)}
                      aria-label={`Delete savings goal ${goal.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Delete savings goal</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!contributeId} onOpenChange={() => setContributeId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Contribute to Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleContribute} disabled={contribute.isPending}>
              {contribute.isPending ? "Contributing..." : "Contribute"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
