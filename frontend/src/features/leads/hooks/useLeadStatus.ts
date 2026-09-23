import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { getApiErrorMessage } from "@/api/client";

import { updateBulkLeadStatus, updateLeadStatus } from "../api/lead.api";

import type { LeadStatus } from "../types/lead.types";

import { leadKeys } from "./useLeads";

type UpdateLeadStatusVariables = {
  leadId: string;
  status: LeadStatus;
};

type BulkUpdateLeadStatusVariables = {
  leadIds: string[];
  status: LeadStatus;
};

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, status }: UpdateLeadStatusVariables) =>
      updateLeadStatus(leadId, {
        status,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: leadKeys.all,
      });

      toast.success("Lead status updated successfully");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Unable to update lead status."));
    },
  });
}

export function useBulkUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadIds, status }: BulkUpdateLeadStatusVariables) =>
      updateBulkLeadStatus({
        leadIds,
        status,
      }),

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: leadKeys.all,
      });

      toast.success(
        `${variables.leadIds.length} ${
          variables.leadIds.length === 1 ? "lead" : "leads"
        } updated successfully`,
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to update selected leads."),
      );
    },
  });
}
