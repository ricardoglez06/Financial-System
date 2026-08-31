import { Router } from "express";
import { savingsGoalController } from "../controllers/savingsGoalController";

const router = Router();

router.post("/", savingsGoalController.create);
router.get("/", savingsGoalController.findAll);
router.put("/:id", savingsGoalController.update);
router.delete("/:id", savingsGoalController.delete);
router.post("/:id/contribute", savingsGoalController.contribute);

export default router;
