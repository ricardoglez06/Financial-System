import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@financial-system/shared";

export class CategoryService {
  async create(userId: string, data: CreateCategoryInput) {
    const existing = await prisma.category.findFirst({
      where: {
        userId,
        name: data.name,
        type: data.type,
      },
    });
    if (existing) {
      throw new AppError(
        `Category '${data.name}' already exists for this type`,
        409
      );
    }

    if (data.parentId) {
      const parent = await prisma.category.findFirst({
        where: { id: data.parentId, userId },
      });
      if (!parent) {
        throw new AppError("Parent category not found", 404);
      }
    }

    return prisma.category.create({
      data: { ...data, userId },
      include: { children: true },
    });
  }

  async findAll(userId: string, type?: "INCOME" | "EXPENSE") {
    const where: any = { userId };
    if (type) where.type = type;

    return prisma.category.findMany({
      where,
      include: { children: true },
      orderBy: { name: "asc" },
    });
  }

  async findById(userId: string, id: string) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
      include: { children: true },
    });
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return category;
  }

  async update(userId: string, id: string, data: UpdateCategoryInput) {
    const existing = await prisma.category.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    return prisma.category.update({
      where: { id },
      data,
      include: { children: true },
    });
  }

  async delete(userId: string, id: string) {
    const existing = await prisma.category.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id },
    });
    if (transactionCount > 0) {
      throw new AppError(
        "Cannot delete category with existing transactions. Reassign them first.",
        409
      );
    }

    await prisma.category.delete({ where: { id } });
  }
}

export const categoryService = new CategoryService();
