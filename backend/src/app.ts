// src/app.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";

import leadRoutes from "./modules/leads/lead.routes.js";

import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins =
  env.NODE_ENV === "production"
    ? [env.FRONTEND_URL]
    : ["http://localhost:5173", env.FRONTEND_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

if (env.NODE_ENV !== "test") {
  app.use(pinoHttp());
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Lead Tracker API is running",
  });
});

app.use("/api/leads", leadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
