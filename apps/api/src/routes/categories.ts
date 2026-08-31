import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { validate } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@financial-system/shared";

const router = Router();

router.post("/", validate(createCategorySchema), categoryController.create);
router.get("/", categoryController.findAll);
router.get("/:id", categoryController.findById);
router.put("/:id", validate(updateCategorySchema), categoryController.update);
router.delete("/:id", categoryController.delete);

export default router;
