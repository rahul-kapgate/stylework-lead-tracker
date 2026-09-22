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

router.post("/bulk", createBulkLeads);

router.patch("/bulk/status", updateBulkLeadStatus);

router.patch("/:id/status", updateLeadStatus);


export default router;
