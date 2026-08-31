import { Router } from "express";
import { transactionController } from "../controllers/transactionController";
import { validate } from "../middlewares/validate";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@financial-system/shared";

const router = Router();

router.post("/", validate(createTransactionSchema), transactionController.create);
router.get("/", transactionController.findAll);
router.get("/:id", transactionController.findById);
router.put("/:id", validate(updateTransactionSchema), transactionController.update);
router.delete("/:id", transactionController.delete);
router.post("/bulk", transactionController.bulkCreate);

export default router;
