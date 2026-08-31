import { Router } from "express";
import { analyticsController } from "../controllers/analyticsController";

const router = Router();

router.get("/summary", analyticsController.getSummary);
router.get("/cashflow", analyticsController.getCashFlow);
router.get("/categories", analyticsController.getCategoryBreakdown);
router.get("/trends", analyticsController.getTrends);
router.get("/tax-report", analyticsController.getTaxReport);

export default router;
