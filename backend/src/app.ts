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

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stylework-lead-tracker.rahulkapgate.in",
    ],
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
