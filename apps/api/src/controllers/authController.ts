import { Response, CookieOptions } from "express";
import { AuthRequest } from "../middlewares/auth";
import { authService } from "../services/authService";
import { config } from "../config";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token, refreshToken } = await authService.login(
        email,
        password
      );

      res.cookie("token", token, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);

      res.json({ success: true, data: { user, token } });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async logout(_req: AuthRequest, res: Response): Promise<void> {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out successfully" });
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getUser(req.userId!);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  async refresh(req: AuthRequest, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ success: false, error: "Refresh token required" });
        return;
      }

      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(
        refreshToken,
        config.jwt.refreshSecret
      ) as { userId: string; email: string };

      const newToken = authService.generateToken(decoded.userId, decoded.email);
      res.cookie("token", newToken, cookieOptions);

      res.json({ success: true, data: { token: newToken } });
    } catch (error: any) {
      res
        .status(401)
        .json({ success: false, error: "Invalid refresh token" });
    }
  }
}

export const authController = new AuthController();
