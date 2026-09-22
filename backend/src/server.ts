import app from "./app.js";
import { connectDatabase, db } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });

    async function shutdown(signal: string) {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        try {
          await db.end();

          console.log("Database connection closed");
          console.log("Server shut down successfully");

          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown:", error);

          process.exit(1);
        }
      });
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
}

startServer();
