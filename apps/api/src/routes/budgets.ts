import { Router } from "express";
import { budgetController } from "../controllers/budgetController";
import { validate } from "../middlewares/validate";
import {
  createBudgetSchema,
  updateBudgetSchema,
} from "@financial-system/shared";

const router = Router();

router.post("/", validate(createBudgetSchema), budgetController.create);
router.get("/summary", budgetController.getSummary);
router.get("/", budgetController.findAll);
router.get("/:id", budgetController.findById);
router.put("/:id", validate(updateBudgetSchema), budgetController.update);
router.delete("/:id", budgetController.delete);

export default router;
