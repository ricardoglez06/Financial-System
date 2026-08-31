import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

export class RecurringService {
  async create(
    userId: string,
    data: {
      accountId: string;
      categoryId: string;
      amount: number;
      type: "INCOME" | "EXPENSE";
      frequency: string;
      startDate: string;
      endDate?: string;
      description?: string;
      isDeductible?: boolean;
    }
  ) {
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
    });
    if (!account) throw new AppError("Account not found", 404);

    return prisma.recurringTransaction.create({
      data: {
        userId,
        accountId: data.accountId,
        categoryId: data.categoryId,
        amount: data.amount,
        type: data.type,
        frequency: data.frequency as any,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
        isDeductible: data.isDeductible ?? false,
      },
    });
  }

  async findAll(userId: string) {
    return prisma.recurringTransaction.findMany({
      where: { userId },
      orderBy: { startDate: "desc" },
    });
  }

  async update(
    userId: string,
    id: string,
    data: {
      amount?: number;
      frequency?: string;
      endDate?: string;
      description?: string;
      isActive?: boolean;
    }
  ) {
    const existing = await prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new AppError("Recurring transaction not found", 404);

    const updateData: any = { ...data };
    if (data.frequency) updateData.frequency = data.frequency;
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return prisma.recurringTransaction.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(userId: string, id: string) {
    const existing = await prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new AppError("Recurring transaction not found", 404);

    await prisma.recurringTransaction.delete({ where: { id } });
  }

  async generateNext(userId: string, id: string) {
    const recurring = await prisma.recurringTransaction.findFirst({
      where: { id, userId, isActive: true },
    });
    if (!recurring) {
      throw new AppError("Active recurring transaction not found", 404);
    }

    const lastDate = recurring.lastGenerated
      ? new Date(recurring.lastGenerated)
      : new Date(recurring.startDate);

    let nextDate: Date;
    switch (recurring.frequency) {
      case "DAILY":
        nextDate = addDays(lastDate, 1);
        break;
      case "WEEKLY":
        nextDate = addWeeks(lastDate, 1);
        break;
      case "BIWEEKLY":
        nextDate = addWeeks(lastDate, 2);
        break;
      case "MONTHLY":
        nextDate = addMonths(lastDate, 1);
        break;
      case "QUARTERLY":
        nextDate = addMonths(lastDate, 3);
        break;
      case "YEARLY":
        nextDate = addYears(lastDate, 1);
        break;
      default:
        throw new AppError("Invalid frequency", 400);
    }

    if (recurring.endDate && nextDate > recurring.endDate) {
      throw new AppError("Recurring transaction has ended", 400);
    }

    const balanceChange =
      recurring.type === "INCOME"
        ? Number(recurring.amount)
        : -Number(recurring.amount);

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          accountId: recurring.accountId,
          categoryId: recurring.categoryId,
          amount: recurring.amount,
          type: recurring.type,
          date: nextDate,
          description: recurring.description,
          isDeductible: recurring.isDeductible,
          isRecurring: true,
          recurringId: id,
        },
      }),
      prisma.recurringTransaction.update({
        where: { id },
        data: { lastGenerated: nextDate },
      }),
      prisma.account.update({
        where: { id: recurring.accountId },
        data: { balance: { increment: balanceChange } },
      }),
    ]);

    return transaction;
  }
}

export const recurringService = new RecurringService();
