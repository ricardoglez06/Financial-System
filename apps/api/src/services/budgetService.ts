import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import {
  CreateBudgetInput,
  UpdateBudgetInput,
} from "@financial-system/shared";

export class BudgetService {
  async create(userId: string, data: CreateBudgetInput) {
    const existing = await prisma.budget.findFirst({
      where: {
        userId,
        categoryId: data.categoryId,
        month: data.month,
        year: data.year,
      },
    });
    if (existing) {
      throw new AppError(
        "Budget already exists for this category and period",
        409
      );
    }

    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return prisma.budget.create({
      data: { ...data, userId },
      include: { category: true },
    });
  }

  async findAll(userId: string, month?: number, year?: number) {
    const where: any = { userId };
    if (month) where.month = month;
    if (year) where.year = year;

    const budgets = await prisma.budget.findMany({
      where,
      include: { category: true },
      orderBy: { month: "desc" },
    });

    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0);

        const result = await prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: "EXPENSE",
            date: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        });

        const spent = Number(result._sum.amount || 0);
        const limit = Number(budget.monthlyLimit);
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;

        return {
          ...budget,
          monthlyLimit: limit,
          spent,
          remaining: limit - spent,
          percentage: Math.round(percentage * 10) / 10,
          status:
            percentage >= 100
              ? "danger"
              : percentage >= 80
              ? "warning"
              : "healthy",
        };
      })
    );

    return budgetsWithProgress;
  }

  async findById(userId: string, id: string) {
    const budget = await prisma.budget.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!budget) {
      throw new AppError("Budget not found", 404);
    }
    return budget;
  }

  async update(userId: string, id: string, data: UpdateBudgetInput) {
    const existing = await prisma.budget.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Budget not found", 404);
    }

    return prisma.budget.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(userId: string, id: string) {
    const existing = await prisma.budget.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Budget not found", 404);
    }

    await prisma.budget.delete({ where: { id } });
  }

  async getSummary(userId: string, month: number, year: number) {
    const budgets = await this.findAll(userId, month, year);

    const totalBudgeted = budgets.reduce(
      (sum, b) => sum + Number(b.monthlyLimit),
      0
    );
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    return {
      totalBudgeted,
      totalSpent,
      totalRemaining: totalBudgeted - totalSpent,
      percentage:
        totalBudgeted > 0
          ? Math.round((totalSpent / totalBudgeted) * 1000) / 10
          : 0,
      budgets,
    };
  }
}

export const budgetService = new BudgetService();
