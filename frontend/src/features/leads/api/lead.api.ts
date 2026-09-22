import { apiClient } from "@/api/client";

import type {
  BulkCreateLeadPayload,
  BulkUpdateLeadStatusPayload,
  CreateLeadPayload,
  GetLeadsParams,
  Lead,
  LeadsResponse,
  UpdateLeadStatusPayload,
} from "../types/lead.types";

export async function getLeads(params: GetLeadsParams): Promise<LeadsResponse> {
  const { data } = await apiClient.get<LeadsResponse>("/leads", {
    params: {
      ...params,

      search: params.search || undefined,

      status: params.status || undefined,
    },
  });

  return data;
}

export async function createLead(payload: CreateLeadPayload) {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    data: Lead;
  }>("/leads", payload);

  return data;
}

export async function createBulkLeads(payload: BulkCreateLeadPayload) {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    count: number;
    data: Lead[];
  }>("/leads/bulk", payload);

  return data;
}

export async function updateLeadStatus(
  id: string,
  payload: UpdateLeadStatusPayload,
) {
  const { data } = await apiClient.patch<{
    success: boolean;
    message: string;
    data: Lead;
  }>(`/leads/${id}/status`, payload);

  return data;
}

export async function updateBulkLeadStatus(
  payload: BulkUpdateLeadStatusPayload,
) {
  const { data } = await apiClient.patch<{
    success: boolean;
    message: string;
    count: number;
    data: Lead[];
  }>("/leads/bulk/status", payload);

  return data;
}
