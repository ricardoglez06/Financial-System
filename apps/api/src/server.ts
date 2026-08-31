import app from "./app";
import { config } from "./config";
import logger from "./config/logger";
import prisma from "./config/database";

async function main() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

const shutdown = async () => {
  logger.info("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main();
