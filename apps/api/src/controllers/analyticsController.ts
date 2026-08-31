import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { analyticsService } from "../services/analyticsService";

export class AnalyticsController {
  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const start = (startDate as string) || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const end = (endDate as string) || new Date().toISOString();

      const summary = await analyticsService.getSummary(
        req.userId!,
        start,
        end
      );
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async getCashFlow(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate, groupBy } = req.query;
      const start = (startDate as string) || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const end = (endDate as string) || new Date().toISOString();

      const cashflow = await analyticsService.getCashFlow(
        req.userId!,
        start,
        end,
        (groupBy as "day" | "week" | "month") || "day"
      );
      res.json({ success: true, data: cashflow });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async getCategoryBreakdown(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate, type } = req.query;
      const start = (startDate as string) || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const end = (endDate as string) || new Date().toISOString();

      const breakdown = await analyticsService.getCategoryBreakdown(
        req.userId!,
        start,
        end,
        (type as "INCOME" | "EXPENSE") || "EXPENSE"
      );
      res.json({ success: true, data: breakdown });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async getTrends(req: AuthRequest, res: Response): Promise<void> {
    try {
      const months = req.query.months ? parseInt(req.query.months as string) : 6;
      const trends = await analyticsService.getTrends(req.userId!, months);
      res.json({ success: true, data: trends });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async getTaxReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const year = req.query.year
        ? parseInt(req.query.year as string)
        : new Date().getFullYear();

      const report = await analyticsService.getTaxReport(req.userId!, year);
      res.json({ success: true, data: report });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

export const analyticsController = new AnalyticsController();
