import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { recurringService } from "../services/recurringService";

export class RecurringController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recurring = await recurringService.create(
        req.userId!,
        req.body
      );
      res.status(201).json({ success: true, data: recurring });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recurring = await recurringService.findAll(req.userId!);
      res.json({ success: true, data: recurring });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recurring = await recurringService.update(
        req.userId!,
        req.params.id,
        req.body
      );
      res.json({ success: true, data: recurring });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await recurringService.delete(req.userId!, req.params.id);
      res.json({ success: true, message: "Recurring transaction deleted" });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async generate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const transaction = await recurringService.generateNext(
        req.userId!,
        req.params.id
      );
      res.status(201).json({ success: true, data: transaction });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

export const recurringController = new RecurringController();
