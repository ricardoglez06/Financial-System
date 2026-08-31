import { Router } from "express";
import { accountController } from "../controllers/accountController";
import { validate } from "../middlewares/validate";
import {
  createAccountSchema,
  updateAccountSchema,
} from "@financial-system/shared";

const router = Router();

router.post("/", validate(createAccountSchema), accountController.create);
router.get("/", accountController.findAll);
router.get("/:id", accountController.findById);
router.put("/:id", validate(updateAccountSchema), accountController.update);
router.delete("/:id", accountController.delete);

export default router;
