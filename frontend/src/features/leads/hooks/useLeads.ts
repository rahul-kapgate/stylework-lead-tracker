import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getLeads } from "../api/lead.api";

import type { GetLeadsParams } from "../types/lead.types";

export const leadKeys = {
  all: ["leads"] as const,

  list: (params: GetLeadsParams) => [...leadKeys.all, "list", params] as const,
};

export function useLeads(params: GetLeadsParams) {
  return useQuery({
    queryKey: leadKeys.list(params),

    queryFn: () => getLeads(params),

    placeholderData: keepPreviousData,

    staleTime: 30_000,
  });
}
