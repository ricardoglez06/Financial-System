import { Router } from "express";
import { investmentController } from "../controllers/investmentController";
import { validate } from "../middlewares/validate";
import {
  createInvestmentSchema,
  updateInvestmentSchema,
} from "@financial-system/shared";

const router = Router();

router.post("/", validate(createInvestmentSchema), investmentController.create);
router.get("/summary", investmentController.getSummary);
router.get("/", investmentController.findAll);
router.get("/:id", investmentController.findById);
router.put("/:id", validate(updateInvestmentSchema), investmentController.update);
router.delete("/:id", investmentController.delete);

export default router;
