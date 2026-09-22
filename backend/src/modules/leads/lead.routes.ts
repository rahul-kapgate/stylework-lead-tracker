// src/modules/leads/lead.routes.ts

import { Router } from "express";

import {
  createLead,
  getLeads,
  updateLeadStatus,
  createBulkLeads,
  updateBulkLeadStatus,
} from "./lead.controller.js";

const router = Router();

router.post("/", createLead);

router.get("/", getLeads);

router.patch("/:id/status", updateLeadStatus);

router.post("/bulk", createBulkLeads);

router.patch("/bulk/status", updateBulkLeadStatus);

export default router;
