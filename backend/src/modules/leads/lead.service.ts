// src/modules/leads/lead.service.ts

import * as leadRepository from "./lead.repository.js";
import type { LeadStatus } from "./lead.types.js";
import { AppError } from "../../utils/AppError.js";

interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
}

interface ListLeadParams {
  search?: string;
  status?: LeadStatus;
  page: number;
  limit: number;
}

export async function createLead(data: CreateLeadData) {
  return leadRepository.createLead(data);
}

export async function getLeads(params: ListLeadParams) {
  const result = await leadRepository.getLeads(params);

  const totalPages = Math.ceil(result.total / params.limit);

  return {
    data: result.leads,

    pagination: {
      page: params.page,
      limit: params.limit,
      total: result.total,
      totalPages,
    },
  };
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  note?: string,
) {
  const journeyNote = note || `Lead status changed to ${status}`;

  const lead = await leadRepository.updateLeadStatus(id, status, journeyNote);

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return lead;
}
