import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import {
  CreateAccountInput,
  UpdateAccountInput,
} from "@financial-system/shared";

export class AccountService {
  async create(userId: string, data: CreateAccountInput) {
    return prisma.account.create({
      data: { ...data, userId },
    });
  }

  async findAll(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(userId: string, id: string) {
    const account = await prisma.account.findFirst({
      where: { id, userId },
    });
    if (!account) {
      throw new AppError("Account not found", 404);
    }
    return account;
  }

  async update(userId: string, id: string, data: UpdateAccountInput) {
    const existing = await prisma.account.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Account not found", 404);
    }

    return prisma.account.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const existing = await prisma.account.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Account not found", 404);
    }

    const transactionCount = await prisma.transaction.count({
      where: { accountId: id },
    });
    if (transactionCount > 0) {
      throw new AppError(
        "Cannot delete account with existing transactions",
        409
      );
    }

    await prisma.account.delete({ where: { id } });
  }
}

export const accountService = new AccountService();
