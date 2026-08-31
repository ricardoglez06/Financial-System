import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";

export class SavingsGoalService {
  async create(
    userId: string,
    data: {
      name: string;
      targetAmount: number;
      targetDate?: string;
    }
  ) {
    return prisma.savingsGoal.create({
      data: {
        userId,
        name: data.name,
        targetAmount: data.targetAmount,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      },
    });
  }

  async findAll(userId: string) {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return goals.map((g) => {
      const target = Number(g.targetAmount);
      const current = Number(g.currentAmount);
      const percentage = target > 0 ? (current / target) * 100 : 0;

      return {
        ...g,
        targetAmount: target,
        currentAmount: current,
        percentage: Math.round(percentage * 10) / 10,
      };
    });
  }

  async findById(userId: string, id: string) {
    const goal = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!goal) {
      throw new AppError("Savings goal not found", 404);
    }
    return goal;
  }

  async update(
    userId: string,
    id: string,
    data: {
      name?: string;
      targetAmount?: number;
      targetDate?: string;
    }
  ) {
    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Savings goal not found", 404);
    }

    const updateData: any = { ...data };
    if (data.targetDate) {
      updateData.targetDate = new Date(data.targetDate);
    }

    return prisma.savingsGoal.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(userId: string, id: string) {
    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Savings goal not found", 404);
    }

    await prisma.savingsGoal.delete({ where: { id } });
  }

  async contribute(userId: string, id: string, amount: number) {
    const goal = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!goal) {
      throw new AppError("Savings goal not found", 404);
    }

    return prisma.savingsGoal.update({
      where: { id },
      data: { currentAmount: { increment: amount } },
    });
  }
}

export const savingsGoalService = new SavingsGoalService();
