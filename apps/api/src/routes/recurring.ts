import { Router } from "express";
import { recurringController } from "../controllers/recurringController";

const router = Router();

router.post("/", recurringController.create);
router.get("/", recurringController.findAll);
router.put("/:id", recurringController.update);
router.delete("/:id", recurringController.delete);
router.post("/:id/generate", recurringController.generate);

export default router;
