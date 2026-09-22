// src/app.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);

app.use(express.json());

app.use(pinoHttp());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Lead Tracker API is running",
  });
});

export default app;
