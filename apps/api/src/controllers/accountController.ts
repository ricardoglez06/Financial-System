import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { accountService } from "../services/accountService";

export class AccountController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const account = await accountService.create(req.userId!, req.body);
      res.status(201).json({ success: true, data: account });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const accounts = await accountService.findAll(req.userId!);
      res.json({ success: true, data: accounts });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const account = await accountService.findById(
        req.userId!,
        req.params.id
      );
      res.json({ success: true, data: account });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const account = await accountService.update(
        req.userId!,
        req.params.id,
        req.body
      );
      res.json({ success: true, data: account });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await accountService.delete(req.userId!, req.params.id);
      res.json({ success: true, message: "Account deleted" });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

export const accountController = new AccountController();
