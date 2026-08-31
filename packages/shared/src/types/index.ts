export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  colorHex: string;
  icon?: string;
  parentId?: string;
  createdAt: Date;
  children?: Category[];
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: Date;
  description?: string;
  notes?: string;
  isDeductible: boolean;
  isRecurring: boolean;
  recurringId?: string;
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
  category?: Category;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  monthlyLimit: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  spent?: number;
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  type: InvestmentType;
  ticker?: string;
  principal: number;
  currentYield: number;
  currentValue: number;
  purchaseDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  frequency: RecurringFrequency;
  startDate: Date;
  endDate?: Date;
  description?: string;
  isDeductible: boolean;
  isActive: boolean;
  lastGenerated?: Date;
  createdAt: Date;
}

export type AccountType =
  | "CHECKING"
  | "SAVINGS"
  | "CASH"
  | "CREDIT"
  | "INVESTMENT";
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type InvestmentType =
  | "ETF"
  | "STOCK"
  | "BOND"
  | "CRYPTO"
  | "MUTUAL_FUND"
  | "OTHER";
export type RecurringFrequency =
  | "DAILY"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY";

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  totalBalance: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  colorHex: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface CashFlowDataPoint {
  date: string;
  income: number;
  expenses: number;
  net: number;
}

export interface BudgetProgress {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  colorHex: string;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "healthy" | "warning" | "danger";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
