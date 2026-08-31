import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import {
  CreateInvestmentInput,
  UpdateInvestmentInput,
} from "@financial-system/shared";

export class InvestmentService {
  async create(userId: string, data: CreateInvestmentInput) {
    return prisma.investment.create({
      data: {
        ...data,
        userId,
        purchaseDate: new Date(data.purchaseDate),
      },
    });
  }

  async findAll(userId: string) {
    return prisma.investment.findMany({
      where: { userId },
      orderBy: { purchaseDate: "desc" },
    });
  }

  async findById(userId: string, id: string) {
    const investment = await prisma.investment.findFirst({
      where: { id, userId },
    });
    if (!investment) {
      throw new AppError("Investment not found", 404);
    }
    return investment;
  }

  async update(userId: string, id: string, data: UpdateInvestmentInput) {
    const existing = await prisma.investment.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Investment not found", 404);
    }

    const updateData: any = { ...data };
    if (data.purchaseDate) {
      updateData.purchaseDate = new Date(data.purchaseDate);
    }

    return prisma.investment.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(userId: string, id: string) {
    const existing = await prisma.investment.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Investment not found", 404);
    }

    await prisma.investment.delete({ where: { id } });
  }

  async getSummary(userId: string) {
    const investments = await prisma.investment.findMany({
      where: { userId },
    });

    const totalPrincipal = investments.reduce(
      (sum, i) => sum + Number(i.principal),
      0
    );
    const totalCurrentValue = investments.reduce(
      (sum, i) => sum + Number(i.currentValue),
      0
    );
    const totalYield = investments.reduce(
      (sum, i) => sum + Number(i.currentYield),
      0
    );

    const byType: Record<
      string,
      { count: number; principal: number; currentValue: number }
    > = {};

    for (const inv of investments) {
      if (!byType[inv.type]) {
        byType[inv.type] = { count: 0, principal: 0, currentValue: 0 };
      }
      byType[inv.type].count += 1;
      byType[inv.type].principal += Number(inv.principal);
      byType[inv.type].currentValue += Number(inv.currentValue);
    }

    return {
      totalPrincipal: Math.round(totalPrincipal * 100) / 100,
      totalCurrentValue: Math.round(totalCurrentValue * 100) / 100,
      totalYield: Math.round(totalYield * 100) / 100,
      totalReturn:
        totalPrincipal > 0
          ? Math.round(
              ((totalCurrentValue - totalPrincipal) / totalPrincipal) *
                10000
            ) / 100
          : 0,
      investmentCount: investments.length,
      byType: Object.entries(byType).map(([type, data]) => ({
        type,
        ...data,
        principal: Math.round(data.principal * 100) / 100,
        currentValue: Math.round(data.currentValue * 100) / 100,
      })),
    };
  }
}

export const investmentService = new InvestmentService();
