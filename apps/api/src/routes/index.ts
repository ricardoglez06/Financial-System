import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import authRoutes from "./auth";
import transactionRoutes from "./transactions";
import categoryRoutes from "./categories";
import accountRoutes from "./accounts";
import budgetRoutes from "./budgets";
import analyticsRoutes from "./analytics";
import investmentRoutes from "./investments";
import savingsGoalRoutes from "./savingsGoals";
import recurringRoutes from "./recurring";

const router = Router();

router.use("/auth", authRoutes);

router.use("/transactions", authenticate, transactionRoutes);
router.use("/categories", authenticate, categoryRoutes);
router.use("/accounts", authenticate, accountRoutes);
router.use("/budgets", authenticate, budgetRoutes);
router.use("/analytics", authenticate, analyticsRoutes);
router.use("/investments", authenticate, investmentRoutes);
router.use("/savings-goals", authenticate, savingsGoalRoutes);
router.use("/recurring", authenticate, recurringRoutes);

export default router;
