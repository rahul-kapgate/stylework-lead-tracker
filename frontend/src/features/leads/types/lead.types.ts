export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadJourney {
  status: LeadStatus;
  timestamp: string;
  note: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  leadJourney: LeadJourney[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: Pagination;
}

export interface GetLeadsParams {
  search?: string;
  status?: LeadStatus;
  page: number;
  limit: number;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone: string;
}

export interface BulkCreateLeadPayload {
  leads: CreateLeadPayload[];
}

export interface UpdateLeadStatusPayload {
  status: LeadStatus;
  note?: string;
}

export interface BulkUpdateLeadStatusPayload {
  leadIds: string[];
  status: LeadStatus;
  note?: string;
}
