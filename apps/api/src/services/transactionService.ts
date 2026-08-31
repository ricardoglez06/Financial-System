import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
} from "@financial-system/shared";

export class TransactionService {
  async create(userId: string, data: CreateTransactionInput) {
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
    });
    if (!account) {
      throw new AppError("Account not found", 404);
    }

    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const balanceChange =
      data.type === "INCOME" ? data.amount : -data.amount;

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          accountId: data.accountId,
          categoryId: data.categoryId,
          amount: data.amount,
          type: data.type,
          date: new Date(data.date),
          description: data.description,
          notes: data.notes,
          isDeductible: data.isDeductible ?? false,
          isRecurring: data.isRecurring ?? false,
        },
        include: {
          account: true,
          category: true,
        },
      }),
      prisma.account.update({
        where: { id: data.accountId },
        data: { balance: { increment: balanceChange } },
      }),
    ]);

    return transaction;
  }

  async findAll(userId: string, filters: TransactionFilter) {
    const {
      page,
      limit,
      type,
      categoryId,
      accountId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
      sortBy,
      sortOrder,
    } = filters;

    const where: any = { userId };

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (accountId) where.accountId = accountId;
    if (startDate) where.date = { ...where.date, gte: new Date(startDate) };
    if (endDate) where.date = { ...where.date, lte: new Date(endDate) };
    if (minAmount) where.amount = { ...where.amount, gte: minAmount };
    if (maxAmount) where.amount = { ...where.amount, lte: maxAmount };
    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, colorHex: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(userId: string, id: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: true,
        category: true,
      },
    });
    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }
    return transaction;
  }

  async update(
    userId: string,
    id: string,
    data: UpdateTransactionInput
  ) {
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Transaction not found", 404);
    }

    const oldBalanceChange =
      existing.type === "INCOME"
        ? Number(existing.amount)
        : -Number(existing.amount);

    const newType = data.type || existing.type;
    const newAmount = data.amount || Number(existing.amount);
    const newBalanceChange =
      newType === "INCOME" ? newAmount : -newAmount;

    const balanceDiff = newBalanceChange - oldBalanceChange;
    const accountId = data.accountId || existing.accountId;

    const [transaction] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id },
        data: {
          ...(data.accountId && { accountId: data.accountId }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.amount !== undefined && { amount: data.amount }),
          ...(data.type && { type: data.type }),
          ...(data.date && { date: new Date(data.date) }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.notes !== undefined && { notes: data.notes }),
          ...(data.isDeductible !== undefined && {
            isDeductible: data.isDeductible,
          }),
        },
        include: {
          account: true,
          category: true,
        },
      }),
      prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: balanceDiff } },
      }),
    ]);

    return transaction;
  }

  async delete(userId: string, id: string) {
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Transaction not found", 404);
    }

    const balanceChange =
      existing.type === "INCOME"
        ? -Number(existing.amount)
        : Number(existing.amount);

    await prisma.$transaction([
      prisma.transaction.delete({ where: { id } }),
      prisma.account.update({
        where: { id: existing.accountId },
        data: { balance: { increment: balanceChange } },
      }),
    ]);
  }

  async bulkCreate(
    userId: string,
    accountId: string,
    transactions: Array<{
      amount: number;
      type: "INCOME" | "EXPENSE";
      date: Date;
      description?: string;
      categoryId: string;
    }>
  ) {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) {
      throw new AppError("Account not found", 404);
    }

    const created = await prisma.transaction.createMany({
      data: transactions.map((t) => ({
        userId,
        accountId,
        categoryId: t.categoryId,
        amount: t.amount,
        type: t.type,
        date: t.date,
        description: t.description,
      })),
    });

    const totalChange = transactions.reduce((sum, t) => {
      return sum + (t.type === "INCOME" ? t.amount : -t.amount);
    }, 0);

    await prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: totalChange } },
    });

    return { count: created.count };
  }
}

export const transactionService = new TransactionService();
