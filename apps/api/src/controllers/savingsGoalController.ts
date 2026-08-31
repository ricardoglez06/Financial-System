import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { savingsGoalService } from "../services/savingsGoalService";

export class SavingsGoalController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const goal = await savingsGoalService.create(req.userId!, req.body);
      res.status(201).json({ success: true, data: goal });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const goals = await savingsGoalService.findAll(req.userId!);
      res.json({ success: true, data: goals });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const goal = await savingsGoalService.update(
        req.userId!,
        req.params.id,
        req.body
      );
      res.json({ success: true, data: goal });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await savingsGoalService.delete(req.userId!, req.params.id);
      res.json({ success: true, message: "Savings goal deleted" });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async contribute(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { amount } = req.body;
      const goal = await savingsGoalService.contribute(
        req.userId!,
        req.params.id,
        amount
      );
      res.json({ success: true, data: goal });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

export const savingsGoalController = new SavingsGoalController();
