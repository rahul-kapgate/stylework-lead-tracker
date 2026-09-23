import type {
  ReactNode,
} from "react";

import {
  createElement,
} from "react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  toast,
} from "sonner";

import {
  updateBulkLeadStatus,
  updateLeadStatus,
} from "../api/lead.api";

import {
  useBulkUpdateLeadStatus,
  useUpdateLeadStatus,
} from "./useLeadStatus";

vi.mock(
  "../api/lead.api",
  () => ({
    updateLeadStatus:
      vi.fn(),

    updateBulkLeadStatus:
      vi.fn(),
  }),
);

vi.mock(
  "sonner",
  () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }),
);

vi.mock(
  "@/api/client",
  () => ({
    getApiErrorMessage:
      vi.fn(
        (
          _error,
          fallback,
        ) => fallback,
      ),
  }),
);

describe("lead status hooks", () => {
  let queryClient: QueryClient;

  function wrapper({
    children,
  }: {
    children: ReactNode;
  }) {
    return createElement(
      QueryClientProvider,
      {
        client: queryClient,
      },
      children,
    );
  }

  beforeEach(() => {
    queryClient =
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },

          mutations: {
            retry: false,
          },
        },
      });
  });

  it("updates a single lead status", async () => {
    vi.mocked(
      updateLeadStatus,
    ).mockResolvedValue({
      success: true,
      message: "Updated",
      data: {} as never,
    });

    const { result } =
      renderHook(
        () =>
          useUpdateLeadStatus(),
        {
          wrapper,
        },
      );

    act(() => {
      result.current.mutate({
        leadId: "lead-1",
        status: "QUALIFIED",
      });
    });

    await waitFor(() => {
      expect(
        updateLeadStatus,
      ).toHaveBeenCalledWith(
        "lead-1",
        {
          status:
            "QUALIFIED",
        },
      );
    });

    await waitFor(() => {
      expect(
        toast.success,
      ).toHaveBeenCalled();
    });
  });

  it("updates multiple leads", async () => {
    vi.mocked(
      updateBulkLeadStatus,
    ).mockResolvedValue({
      success: true,
      message: "Updated",
      count: 2,
      data: [],
    });

    const { result } =
      renderHook(
        () =>
          useBulkUpdateLeadStatus(),
        {
          wrapper,
        },
      );

    act(() => {
      result.current.mutate({
        leadIds: [
          "lead-1",
          "lead-2",
        ],

        status:
          "CONVERTED",
      });
    });

    await waitFor(() => {
      expect(
        updateBulkLeadStatus,
      ).toHaveBeenCalledWith({
        leadIds: [
          "lead-1",
          "lead-2",
        ],

        status:
          "CONVERTED",
      });
    });

    await waitFor(() => {
      expect(
        toast.success,
      ).toHaveBeenCalledWith(
        expect.stringContaining(
          "2 leads",
        ),
      );
    });
  });

  it("shows error toast when single update fails", async () => {
    vi.mocked(
      updateLeadStatus,
    ).mockRejectedValue(
      new Error("Failed"),
    );

    const { result } =
      renderHook(
        () =>
          useUpdateLeadStatus(),
        {
          wrapper,
        },
      );

    act(() => {
      result.current.mutate({
        leadId: "lead-1",
        status: "LOST",
      });
    });

    await waitFor(() => {
      expect(
        toast.error,
      ).toHaveBeenCalledWith(
        "Unable to update lead status.",
      );
    });
  });

  it("shows error toast when bulk update fails", async () => {
    vi.mocked(
      updateBulkLeadStatus,
    ).mockRejectedValue(
      new Error("Failed"),
    );

    const { result } =
      renderHook(
        () =>
          useBulkUpdateLeadStatus(),
        {
          wrapper,
        },
      );

    act(() => {
      result.current.mutate({
        leadIds: [
          "1",
          "2",
        ],

        status:
          "QUALIFIED",
      });
    });

    await waitFor(() => {
      expect(
        toast.error,
      ).toHaveBeenCalledWith(
        "Unable to update selected leads.",
      );
    });
  });
});