import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { budgetService } from "../services/budgetService";

export class BudgetController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const budget = await budgetService.create(req.userId!, req.body);
      res.status(201).json({ success: true, data: budget });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const month = req.query.month ? parseInt(req.query.month as string) : undefined;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const budgets = await budgetService.findAll(req.userId!, month, year);
      res.json({ success: true, data: budgets });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const budget = await budgetService.findById(req.userId!, req.params.id);
      res.json({ success: true, data: budget });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const budget = await budgetService.update(
        req.userId!,
        req.params.id,
        req.body
      );
      res.json({ success: true, data: budget });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await budgetService.delete(req.userId!, req.params.id);
      res.json({ success: true, message: "Budget deleted" });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const now = new Date();
      const month = req.query.month
        ? parseInt(req.query.month as string)
        : now.getMonth() + 1;
      const year = req.query.year
        ? parseInt(req.query.year as string)
        : now.getFullYear();

      const summary = await budgetService.getSummary(req.userId!, month, year);
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

export const budgetController = new BudgetController();
