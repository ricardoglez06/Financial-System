import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { investmentService } from "../services/investmentService";

export class InvestmentController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const investment = await investmentService.create(
        req.userId!,
        req.body
      );
      res.status(201).json({ success: true, data: investment });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const investments = await investmentService.findAll(req.userId!);
      res.json({ success: true, data: investments });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const investment = await investmentService.findById(
        req.userId!,
        req.params.id
      );
      res.json({ success: true, data: investment });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const investment = await investmentService.update(
        req.userId!,
        req.params.id,
        req.body
      );
      res.json({ success: true, data: investment });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await investmentService.delete(req.userId!, req.params.id);
      res.json({ success: true, message: "Investment deleted" });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const summary = await investmentService.getSummary(req.userId!);
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

export const investmentController = new InvestmentController();
