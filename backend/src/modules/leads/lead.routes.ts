// src/modules/leads/lead.routes.ts

import { Router } from "express";

import { createLead, getLeads, updateLeadStatus } from "./lead.controller.js";

const router = Router();

router.post("/", createLead);

router.get("/", getLeads);

router.patch("/:id/status", updateLeadStatus);

export default router;
