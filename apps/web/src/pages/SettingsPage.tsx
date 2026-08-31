import { useState } from "react";
import { useTaxReport } from "@/hooks/useAnalytics";
import { formatCurrency } from "@financial-system/shared";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download } from "lucide-react";

export function SettingsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: taxReport } = useTaxReport({ year });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings & Reports</h2>
        <p className="text-muted-foreground">Manage preferences and view reports</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tax Report
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-28"
              />
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {taxReport ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Deductible</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">
                      {formatCurrency(taxReport.totalDeductible)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{taxReport.transactionCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{taxReport.byCategory.length}</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="mb-4 font-medium">By Category</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(taxReport.byCategory || []).map((cat: any) => (
                      <TableRow key={cat.categoryName}>
                        <TableCell>{cat.categoryName}</TableCell>
                        <TableCell className="text-right">{formatCurrency(cat.total)}</TableCell>
                        <TableCell className="text-right">{cat.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="mb-4 font-medium">Deductible Transactions</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(taxReport.transactions || []).map((t: any) => (
                      <TableRow key={t.id}>
                        <TableCell>{format(new Date(t.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{t.description || "-"}</TableCell>
                        <TableCell>{t.category}</TableCell>
                        <TableCell className="text-right">{formatCurrency(t.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No deductible transactions found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
