// src/config/database.ts

import { Pool } from "pg";
import { env } from "./env.js";

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});

export async function connectDatabase() {
  const client = await db.connect();

  try {
    await client.query("SELECT 1");
    console.log("PostgreSQL connected successfully");
  } finally {
    client.release();
  }
}
