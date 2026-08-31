import { Router } from "express";
import { authController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";
import { registerSchema, loginSchema } from "@financial-system/shared";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
router.post("/refresh", authController.refresh);

export default router;
