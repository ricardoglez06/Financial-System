import prisma from "../config/database";

export class AnalyticsService {
  async getSummary(
    userId: string,
    startDate: string,
    endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [incomeResult, expenseResult, accounts] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          type: "INCOME",
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
      }),
      prisma.account.findMany({
        where: { userId },
        select: { balance: true },
      }),
    ]);

    const totalIncome = Number(incomeResult._sum.amount || 0);
    const totalExpenses = Number(expenseResult._sum.amount || 0);
    const totalBalance = accounts.reduce(
      (sum, a) => sum + Number(a.balance),
      0
    );

    return {
      totalIncome,
      totalExpenses,
      netFlow: totalIncome - totalExpenses,
      totalBalance,
      period: { startDate, endDate },
    };
  }

  async getCashFlow(
    userId: string,
    startDate: string,
    endDate: string,
    groupBy: "day" | "week" | "month" = "day"
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: start, lte: end },
      },
      select: {
        date: true,
        amount: true,
        type: true,
      },
      orderBy: { date: "asc" },
    });

    const grouped: Record<
      string,
      { income: number; expenses: number }
    > = {};

    for (const t of transactions) {
      const date = new Date(t.date);
      let key: string;

      if (groupBy === "day") {
        key = date.toISOString().split("T")[0];
      } else if (groupBy === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      if (!grouped[key]) {
        grouped[key] = { income: 0, expenses: 0 };
      }

      const amount = Number(t.amount);
      if (t.type === "INCOME") {
        grouped[key].income += amount;
      } else {
        grouped[key].expenses += amount;
      }
    }

    return Object.entries(grouped).map(([date, data]) => ({
      date,
      income: Math.round(data.income * 100) / 100,
      expenses: Math.round(data.expenses * 100) / 100,
      net: Math.round((data.income - data.expenses) * 100) / 100,
    }));
  }

  async getCategoryBreakdown(
    userId: string,
    startDate: string,
    endDate: string,
    type: "INCOME" | "EXPENSE" = "EXPENSE"
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const results = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type,
        date: { gte: start, lte: end },
      },
      _sum: { amount: true },
      _count: true,
    });

    const categories = await prisma.category.findMany({
      where: {
        id: { in: results.map((r) => r.categoryId) },
      },
      select: { id: true, name: true, colorHex: true },
    });

    const categoryMap = new Map(
      categories.map((c) => [c.id, c])
    );

    const total = results.reduce(
      (sum, r) => sum + Number(r._sum.amount || 0),
      0
    );

    return results
      .map((r) => {
        const cat = categoryMap.get(r.categoryId);
        const amount = Number(r._sum.amount || 0);
        return {
          categoryId: r.categoryId,
          categoryName: cat?.name || "Unknown",
          colorHex: cat?.colorHex || "#6366f1",
          amount: Math.round(amount * 100) / 100,
          percentage:
            total > 0
              ? Math.round((amount / total) * 1000) / 10
              : 0,
          transactionCount: r._count,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  async getTrends(userId: string, months: number = 6) {
    const now = new Date();
    const trends = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const [income, expenses] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            userId,
            type: "INCOME",
            date: { gte: start, lte: end },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            userId,
            type: "EXPENSE",
            date: { gte: start, lte: end },
          },
          _sum: { amount: true },
        }),
      ]);

      trends.push({
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        income: Number(income._sum.amount || 0),
        expenses: Number(expenses._sum.amount || 0),
        net:
          Number(income._sum.amount || 0) -
          Number(expenses._sum.amount || 0),
      });
    }

    return trends;
  }

  async getTaxReport(userId: string, year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    const deductible = await prisma.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        isDeductible: true,
        date: { gte: start, lte: end },
      },
      include: {
        category: { select: { name: true, colorHex: true } },
      },
      orderBy: { date: "asc" },
    });

    const byCategory: Record<
      string,
      { categoryName: string; total: number; count: number }
    > = {};

    let totalDeductible = 0;

    for (const t of deductible) {
      const amount = Number(t.amount);
      totalDeductible += amount;
      const catName = t.category.name;

      if (!byCategory[catName]) {
        byCategory[catName] = { categoryName: catName, total: 0, count: 0 };
      }
      byCategory[catName].total += amount;
      byCategory[catName].count += 1;
    }

    return {
      year,
      totalDeductible: Math.round(totalDeductible * 100) / 100,
      transactionCount: deductible.length,
      byCategory: Object.values(byCategory).map((c) => ({
        ...c,
        total: Math.round(c.total * 100) / 100,
      })),
      transactions: deductible.map((t) => ({
        id: t.id,
        date: t.date,
        description: t.description,
        amount: Number(t.amount),
        category: t.category.name,
      })),
    };
  }
}

export const analyticsService = new AnalyticsService();
