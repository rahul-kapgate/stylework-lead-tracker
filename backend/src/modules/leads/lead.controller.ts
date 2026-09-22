// src/modules/leads/lead.controller.ts

import type { Request, Response, NextFunction } from "express";

import * as leadService from "./lead.service.js";

import {
  createLeadSchema,
  listLeadsQuerySchema,
  updateLeadStatusSchema,
  createBulkLeadsSchema,
  bulkUpdateLeadStatusSchema,
} from "./lead.schema.js";

export async function createLead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = createLeadSchema.parse(req.body);

    const lead = await leadService.createLead(data);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLeads(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = listLeadsQuerySchema.parse(req.query);

    const result = await leadService.getLeads(query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLeadStatus(
 req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const data = updateLeadStatusSchema.parse(req.body);

    const lead = await leadService.updateLeadStatus(id, data.status, data.note);

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

export async function createBulkLeads(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { leads } =
      createBulkLeadsSchema.parse(req.body);

    const createdLeads =
      await leadService.createBulkLeads(leads);

    res.status(201).json({
      success: true,
      message: `${createdLeads.length} leads created successfully`,
      count: createdLeads.length,
      data: createdLeads,
    });
  } catch (error) {
    next(error);
  }
}


export async function updateBulkLeadStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      leadIds,
      status,
      note,
    } = bulkUpdateLeadStatusSchema.parse(
      req.body,
    );

    const updatedLeads =
      await leadService.updateBulkLeadStatus(
        leadIds,
        status,
        note,
      );

    res.status(200).json({
      success: true,
      message: `${updatedLeads.length} leads updated successfully`,
      count: updatedLeads.length,
      data: updatedLeads,
    });
  } catch (error) {
    next(error);
  }
}