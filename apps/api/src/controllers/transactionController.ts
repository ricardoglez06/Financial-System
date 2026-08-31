import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { transactionService } from "../services/transactionService";
import { transactionFilterSchema } from "@financial-system/shared";

export class TransactionController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const transaction = await transactionService.create(
        req.userId!,
        req.body
      );
      res.status(201).json({ success: true, data: transaction });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const filters = transactionFilterSchema.parse(req.query);
      const result = await transactionService.findAll(req.userId!, filters);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const transaction = await transactionService.findById(
        req.userId!,
        req.params.id
      );
      res.json({ success: true, data: transaction });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const transaction = await transactionService.update(
        req.userId!,
        req.params.id,
        req.body
      );
      res.json({ success: true, data: transaction });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await transactionService.delete(req.userId!, req.params.id);
      res.json({ success: true, message: "Transaction deleted" });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async bulkCreate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { accountId, transactions } = req.body;
      const result = await transactionService.bulkCreate(
        req.userId!,
        accountId,
        transactions
      );
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

export const transactionController = new TransactionController();
