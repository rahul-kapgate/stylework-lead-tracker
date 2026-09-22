// src/modules/leads/lead.schema.ts

import { z } from "zod";
import { LEAD_STATUSES } from "./lead.types.js";

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(150),

  email: z.string().trim().email("Please provide a valid email"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long"),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),

  note: z.string().trim().max(500).optional(),
});

export const listLeadsQuerySchema = z.object({
  search: z.string().trim().optional(),

  status: z.enum(LEAD_STATUSES).optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});
