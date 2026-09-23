import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Lead } from "../types/lead.types";

import { LeadsTable } from "./LeadsTable";

const mocks = vi.hoisted(() => ({
  dataGridProps: null as any,
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: (props: any) => {
    mocks.dataGridProps = props;

    return <div data-testid="data-grid">Data grid</div>;
  },
}));

vi.mock("./LeadStatusSelect", () => ({
  LeadStatusSelect: ({ value, onChange, disabled }: any) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange("QUALIFIED")}
    >
      {value}
    </button>
  ),
}));

const lead = {
  id: "lead-1",

  name: "Rahul Kapgate",

  email: "rahul@example.com",

  phone: "+919876543210",

  status: "NEW",

  createdAt: "2026-09-23T08:40:00.000Z",

  updatedAt: "2026-09-23T08:40:00.000Z",

  leadJourney: [],
} as unknown as Lead;

describe("LeadsTable", () => {
  beforeEach(() => {
    mocks.dataGridProps = null;
  });

  function renderTable(overrides: Record<string, unknown> = {}) {
    const props = {
      leads: [lead],

      total: 1,

      page: 1,

      limit: 10,

      loading: false,

      selectionModel: {
        type: "include",
        ids: new Set(),
      },

      onSelectionChange: vi.fn(),

      onPaginationChange: vi.fn(),

      onStatusChange: vi.fn(),

      updatingLeadId: null,

      ...overrides,
    };

    render(<LeadsTable {...(props as any)} />);

    return props;
  }

  it("passes leads to DataGrid", () => {
    renderTable();

    expect(mocks.dataGridProps.rows).toEqual([lead]);

    expect(mocks.dataGridProps.rowCount).toBe(1);
  });

  it("converts API page to MUI zero-based page", () => {
    renderTable({
      page: 2,
    });

    expect(mocks.dataGridProps.paginationModel).toEqual({
      page: 1,
      pageSize: 10,
    });
  });

  it("converts MUI pagination back to API page", () => {
    const onPaginationChange = vi.fn();

    renderTable({
      onPaginationChange,
    });

    mocks.dataGridProps.onPaginationModelChange({
      page: 1,
      pageSize: 20,
    });

    expect(onPaginationChange).toHaveBeenCalledWith(2, 20);
  });

  it("renders lead name column correctly", () => {
    renderTable();

    const nameColumn = mocks.dataGridProps.columns.find(
      (column: any) => column.field === "name",
    );

    render(
      nameColumn.renderCell({
        row: lead,
      }),
    );

    expect(screen.getByText("Rahul Kapgate")).toBeInTheDocument();

    expect(screen.getByText("Customer lead")).toBeInTheDocument();
  });

  it("renders email", () => {
    renderTable();

    const emailColumn = mocks.dataGridProps.columns.find(
      (column: any) => column.field === "email",
    );

    render(
      emailColumn.renderCell({
        value: lead.email,
        row: lead,
      }),
    );

    expect(screen.getByText("rahul@example.com")).toBeInTheDocument();
  });

  it("renders phone", () => {
    renderTable();

    const phoneColumn = mocks.dataGridProps.columns.find(
      (column: any) => column.field === "phone",
    );

    render(
      phoneColumn.renderCell({
        value: lead.phone,
        row: lead,
      }),
    );

    expect(screen.getByText("+919876543210")).toBeInTheDocument();
  });

  it("calls status change with correct lead id", async () => {
    const user = userEvent.setup();

    const onStatusChange = vi.fn();

    renderTable({
      onStatusChange,
    });

    const statusColumn = mocks.dataGridProps.columns.find(
      (column: any) => column.field === "status",
    );

    render(
      statusColumn.renderCell({
        row: lead,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "NEW",
      }),
    );

    expect(onStatusChange).toHaveBeenCalledWith("lead-1", "QUALIFIED");
  });

  it("disables status select for updating lead", () => {
    renderTable({
      updatingLeadId: "lead-1",
    });

    const statusColumn = mocks.dataGridProps.columns.find(
      (column: any) => column.field === "status",
    );

    render(
      statusColumn.renderCell({
        row: lead,
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "NEW",
      }),
    ).toBeDisabled();
  });

  it("shows fallback for missing email", () => {
    renderTable();

    const emailColumn = mocks.dataGridProps.columns.find(
      (column: any) => column.field === "email",
    );

    render(
      emailColumn.renderCell({
        value: "",
        row: lead,
      }),
    );

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows formatted created date", () => {
    renderTable();

    const createdColumn = mocks.dataGridProps.columns.find(
      (column: any) => column.field === "createdAt",
    );

    render(
      createdColumn.renderCell({
        row: lead,
      }),
    );

    expect(screen.getByText(/23 Sep(?:t)? 2026/i)).toBeInTheDocument();
  });
});
