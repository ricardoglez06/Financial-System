import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
    expiresIn: "15m",
    refreshExpiresIn: "7d",
  },
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  logLevel: process.env.LOG_LEVEL || "info",
  bcrypt: {
    saltRounds: 12,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
} as const;
