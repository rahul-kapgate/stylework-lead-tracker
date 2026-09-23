import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { beforeEach, describe, expect, it, vi } from "vitest";

import LeadsPage from "./LeadsPage";

const mocks = vi.hoisted(() => ({
  useLeads: vi.fn(),

  updateMutate: vi.fn(),

  bulkMutate: vi.fn(),

  refetch: vi.fn(),
}));

/*
 * Motion is not what we are testing here.
 * Replace animation components with
 * normal HTML elements.
 */
vi.mock("motion/react", () => ({
  useReducedMotion: () => true,

  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

/*
 * Debounce itself has its own unit tests.
 * For LeadsPage integration tests we
 * return the value immediately.
 */
vi.mock("@/features/leads/hooks/useDebouncedValue", () => ({
  useDebouncedValue: (value: string) => value,
}));

/*
 * Mock leads query.
 */
vi.mock("@/features/leads/hooks/useLeads", () => ({
  useLeads: (query: unknown) => mocks.useLeads(query),
}));

/*
 * Mock mutations.
 */
vi.mock("@/features/leads/hooks/useLeadStatus", () => ({
  useUpdateLeadStatus: () => ({
    mutate: mocks.updateMutate,

    isPending: false,

    variables: undefined,
  }),

  useBulkUpdateLeadStatus: () => ({
    mutate: mocks.bulkMutate,

    isPending: false,

    variables: undefined,
  }),
}));

/*
 * AddLeadDialog does not need to
 * be tested inside LeadsPage.
 */
vi.mock("@/features/leads/components/AddLeadDialog", () => ({
  AddLeadDialog: () => <button type="button">Add Lead</button>,
}));

/*
 * Simple search input mock.
 */
vi.mock("@/features/leads/components/LeadsSearch", () => ({
  LeadsSearch: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      aria-label="Search leads"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

/*
 * Mock the complex MUI table.
 *
 * We only care about testing
 * LeadsPage -> LeadsTable interactions.
 */
vi.mock("@/features/leads/components/LeadsTable", () => ({
  LeadsTable: ({
    onStatusChange,
    onSelectionChange,
    onPaginationChange,
  }: any) => (
    <div>
      <div data-testid="leads-table">Leads table</div>

      <button
        type="button"
        onClick={() => onStatusChange("lead-1", "QUALIFIED")}
      >
        Change lead status
      </button>

      <button
        type="button"
        onClick={() =>
          onSelectionChange({
            type: "include",

            ids: new Set(["lead-1", "lead-2"]),
          })
        }
      >
        Select two leads
      </button>

      <button type="button" onClick={() => onPaginationChange(2, 20)}>
        Go to page two
      </button>
    </div>
  ),
}));

describe("LeadsPage", () => {
  beforeEach(() => {
    mocks.useLeads.mockReturnValue({
      data: {
        data: [
          {
            id: "lead-1",

            name: "Rahul Kapgate",

            email: "rahul@example.com",

            phone: "9876543210",

            status: "NEW",

            createdAt: "2026-09-23T08:00:00Z",

            updatedAt: "2026-09-23T08:00:00Z",

            leadJourney: [],
          },
        ],

        pagination: {
          total: 1,

          page: 1,

          limit: 10,

          totalPages: 1,
        },
      },

      isLoading: false,

      isFetching: false,

      isError: false,

      refetch: mocks.refetch,
    });
  });

  it("loads leads with default pagination", () => {
    render(<LeadsPage />);

    expect(mocks.useLeads).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        limit: 10,
      }),
    );
  });

  it("renders the leads table", () => {
    render(<LeadsPage />);

    expect(screen.getByTestId("leads-table")).toBeInTheDocument();
  });

  it("updates search query when user searches", async () => {
    const user = userEvent.setup();

    render(<LeadsPage />);

    const input = screen.getByRole("textbox", {
      name: /search leads/i,
    });

    await user.type(input, "Rahul");

    await waitFor(() => {
      expect(mocks.useLeads).toHaveBeenLastCalledWith(
        expect.objectContaining({
          search: "Rahul",

          page: 1,
        }),
      );
    });
  });

  it("updates a single lead status", async () => {
    const user = userEvent.setup();

    render(<LeadsPage />);

    await user.click(
      screen.getByRole("button", {
        name: /change lead status/i,
      }),
    );

    expect(mocks.updateMutate).toHaveBeenCalledWith({
      leadId: "lead-1",

      status: "QUALIFIED",
    });
  });

  it("shows selected lead count", async () => {
    const user = userEvent.setup();

    render(<LeadsPage />);

    await user.click(
      screen.getByRole("button", {
        name: /select two leads/i,
      }),
    );

    expect(screen.getByText(/2 leads selected/i)).toBeInTheDocument();
  });

  it("clears selected leads", async () => {
    const user = userEvent.setup();

    render(<LeadsPage />);

    await user.click(
      screen.getByRole("button", {
        name: /select two leads/i,
      }),
    );

    expect(screen.getByText(/2 leads selected/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /^clear$/i,
      }),
    );

    expect(screen.queryByText(/2 leads selected/i)).not.toBeInTheDocument();
  });

  it("updates pagination", async () => {
    const user = userEvent.setup();

    render(<LeadsPage />);

    await user.click(
      screen.getByRole("button", {
        name: /go to page two/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.useLeads).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 2,

          limit: 20,
        }),
      );
    });
  });

  it("refreshes lead data", async () => {
    const user = userEvent.setup();

    render(<LeadsPage />);

    await user.click(
      screen.getByRole("button", {
        name: /refresh/i,
      }),
    );

    expect(mocks.refetch).toHaveBeenCalledTimes(1);
  });
});
