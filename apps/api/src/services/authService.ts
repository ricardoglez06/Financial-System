import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { config } from "../config";
import { AppError } from "../middlewares/errorHandler";

export class AuthService {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    });

    const defaultCategories = [
      { name: "Salary", type: "INCOME" as const, colorHex: "#22c55e" },
      { name: "Freelance", type: "INCOME" as const, colorHex: "#10b981" },
      { name: "Food", type: "EXPENSE" as const, colorHex: "#f97316" },
      { name: "Transport", type: "EXPENSE" as const, colorHex: "#3b82f6" },
      { name: "Housing", type: "EXPENSE" as const, colorHex: "#8b5cf6" },
      { name: "Entertainment", type: "EXPENSE" as const, colorHex: "#ec4899" },
      { name: "Health", type: "EXPENSE" as const, colorHex: "#ef4444" },
      { name: "Shopping", type: "EXPENSE" as const, colorHex: "#f59e0b" },
      { name: "Utilities", type: "EXPENSE" as const, colorHex: "#06b6d4" },
      { name: "Other", type: "EXPENSE" as const, colorHex: "#6366f1" },
    ];

    await prisma.category.createMany({
      data: defaultCategories.map((c) => ({
        ...c,
        userId: user.id,
      })),
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        name: "Main Account",
        type: "CHECKING",
        balance: 0,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    return {
      user: { id: user.id, email: user.email },
      token,
      refreshToken,
    };
  }

  generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  generateRefreshToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);
  }

  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
}

export const authService = new AuthService();
