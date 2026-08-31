import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("Demo1234!", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      passwordHash,
      categories: {
        create: [
          { name: "Salary", type: "INCOME", colorHex: "#22c55e" },
          { name: "Freelance", type: "INCOME", colorHex: "#10b981" },
          { name: "Investments", type: "INCOME", colorHex: "#06b6d4" },
          { name: "Food & Dining", type: "EXPENSE", colorHex: "#f97316" },
          { name: "Transport", type: "EXPENSE", colorHex: "#3b82f6" },
          { name: "Housing", type: "EXPENSE", colorHex: "#8b5cf6" },
          { name: "Entertainment", type: "EXPENSE", colorHex: "#ec4899" },
          { name: "Health", type: "EXPENSE", colorHex: "#ef4444" },
          { name: "Shopping", type: "EXPENSE", colorHex: "#f59e0b" },
          { name: "Utilities", type: "EXPENSE", colorHex: "#06b6d4" },
          { name: "Education", type: "EXPENSE", colorHex: "#14b8a6" },
          { name: "Other", type: "EXPENSE", colorHex: "#6366f1" },
        ],
      },
      accounts: {
        create: [
          { name: "Checking Account", type: "CHECKING", balance: 5000 },
          { name: "Savings Account", type: "SAVINGS", balance: 15000 },
          { name: "Cash", type: "CASH", balance: 500 },
        ],
      },
    },
  });

  console.log(`Created user: ${user.email}`);

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  });

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
  });

  const checkingAccount = accounts.find((a) => a.type === "CHECKING")!;

  const now = new Date();
  const transactions = [];

  for (let day = 1; day <= 28; day++) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);

    if (day === 1 || day === 15) {
      transactions.push({
        userId: user.id,
        accountId: checkingAccount.id,
        categoryId: categories.find((c) => c.name === "Salary")!.id,
        amount: 3500,
        type: "INCOME" as const,
        date,
        description: "Bi-weekly salary",
      });
    }

    if (day % 3 === 0) {
      transactions.push({
        userId: user.id,
        accountId: checkingAccount.id,
        categoryId: categories.find((c) => c.name === "Food & Dining")!.id,
        amount: 25 + Math.random() * 50,
        type: "EXPENSE" as const,
        date,
        description: "Groceries",
      });
    }

    if (day % 5 === 0) {
      transactions.push({
        userId: user.id,
        accountId: checkingAccount.id,
        categoryId: categories.find((c) => c.name === "Transport")!.id,
        amount: 15 + Math.random() * 30,
        type: "EXPENSE" as const,
        date,
        description: "Gas / Transit",
      });
    }

    if (day % 7 === 0) {
      transactions.push({
        userId: user.id,
        accountId: checkingAccount.id,
        categoryId: categories.find((c) => c.name === "Entertainment")!.id,
        amount: 20 + Math.random() * 40,
        type: "EXPENSE" as const,
        date,
        description: "Entertainment",
        isDeductible: false,
      });
    }

    if (day === 5) {
      transactions.push({
        userId: user.id,
        accountId: checkingAccount.id,
        categoryId: categories.find((c) => c.name === "Housing")!.id,
        amount: 1200,
        type: "EXPENSE" as const,
        date,
        description: "Rent payment",
      });
    }

    if (day === 10) {
      transactions.push({
        userId: user.id,
        accountId: checkingAccount.id,
        categoryId: categories.find((c) => c.name === "Utilities")!.id,
        amount: 150,
        type: "EXPENSE" as const,
        date,
        description: "Electric bill",
        isDeductible: true,
      });
    }
  }

  await prisma.transaction.createMany({ data: transactions });
  console.log(`Created ${transactions.length} transactions`);

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");
  const budgetData = expenseCategories.slice(0, 6).map((cat) => ({
    userId: user.id,
    categoryId: cat.id,
    monthlyLimit: 200 + Math.random() * 800,
    month: currentMonth,
    year: currentYear,
  }));

  await prisma.budget.createMany({ data: budgetData });
  console.log(`Created ${budgetData.length} budgets`);

  await prisma.investment.createMany({
    data: [
      {
        userId: user.id,
        name: "Vanguard S&P 500 ETF",
        type: "ETF",
        ticker: "VOO",
        principal: 10000,
        currentYield: 850,
        currentValue: 10850,
        purchaseDate: new Date(currentYear - 1, 0, 15),
      },
      {
        userId: user.id,
        name: "Apple Inc.",
        type: "STOCK",
        ticker: "AAPL",
        principal: 5000,
        currentYield: 1200,
        currentValue: 6200,
        purchaseDate: new Date(currentYear - 1, 3, 10),
      },
      {
        userId: user.id,
        name: "US Treasury Bond",
        type: "BOND",
        principal: 20000,
        currentYield: 600,
        currentValue: 20600,
        purchaseDate: new Date(currentYear - 1, 6, 1),
      },
    ],
  });
  console.log("Created investments");

  await prisma.savingsGoal.createMany({
    data: [
      {
        userId: user.id,
        name: "Emergency Fund",
        targetAmount: 30000,
        currentAmount: 15000,
        targetDate: new Date(currentYear + 1, 11, 31),
      },
      {
        userId: user.id,
        name: "Vacation Fund",
        targetAmount: 5000,
        currentAmount: 2500,
        targetDate: new Date(currentYear, 7, 1),
      },
    ],
  });
  console.log("Created savings goals");

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
