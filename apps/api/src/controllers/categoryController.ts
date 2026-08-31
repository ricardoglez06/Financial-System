import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { categoryService } from "../services/categoryService";

export class CategoryController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const category = await categoryService.create(req.userId!, req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const type = req.query.type as "INCOME" | "EXPENSE" | undefined;
      const categories = await categoryService.findAll(req.userId!, type);
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async findById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const category = await categoryService.findById(
        req.userId!,
        req.params.id
      );
      res.json({ success: true, data: category });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const category = await categoryService.update(
        req.userId!,
        req.params.id,
        req.body
      );
      res.json({ success: true, data: category });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await categoryService.delete(req.userId!, req.params.id);
      res.json({ success: true, message: "Category deleted" });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

export const categoryController = new CategoryController();
