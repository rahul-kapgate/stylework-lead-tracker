import { useMemo } from "react";

import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

import { CalendarDays, Inbox, Mail, Phone } from "lucide-react";

import { LeadStatusSelect } from "./LeadStatusSelect";

import type { Lead, LeadStatus } from "../types/lead.types";

interface LeadsTableProps {
  leads: Lead[];
  total: number;

  page: number;
  limit: number;

  loading: boolean;

  selectionModel: GridRowSelectionModel;

  onSelectionChange: (model: GridRowSelectionModel) => void;

  onPaginationChange: (page: number, limit: number) => void;

  onStatusChange: (leadId: string, status: LeadStatus) => void;

  updatingLeadId?: string | null;
}

function getInitials(name?: string) {
  if (!name?.trim()) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function formatDateTime(date?: string) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(parsedDate);
}

function NoRowsOverlay() {
  return (
    <div
      className="
        flex
        h-full
        min-h-[200px]
        w-full
        flex-col
        items-center
        justify-center
        px-6
        text-center
      "
    >
      <div
        className="
          flex
          size-11
          items-center
          justify-center
          rounded-xl
          bg-[#EEF7F2]
          text-[#0B8A59]
        "
      >
        <Inbox className="size-5" />
      </div>

      <p
        className="
          mt-3
          text-sm
          font-semibold
          text-[#17211C]
        "
      >
        No leads found
      </p>

      <p
        className="
          mt-1
          max-w-xs
          text-xs
          leading-5
          text-[#819087]
        "
      >
        Leads matching your current filters will appear here.
      </p>
    </div>
  );
}

export function LeadsTable({
  leads,
  total,
  page,
  limit,
  loading,
  selectionModel,
  onSelectionChange,
  onPaginationChange,
  onStatusChange,
  updatingLeadId,
}: LeadsTableProps) {
  const columns = useMemo<GridColDef<Lead>[]>(
    () => [
      {
        field: "name",
        headerName: "Lead",

        flex: 1.1,
        minWidth: 220,

        sortable: false,

        renderCell: ({ row }) => {
          const name = row.name?.trim() || "Unnamed lead";

          return (
            <div
              className="
                  flex
                  h-full
                  min-w-0
                  items-center
                  gap-3
                "
            >
              <div
                className="
                    flex
                    size-9
                    shrink-0
                    items-center
                    justify-center

                    rounded-lg

                    border
                    border-emerald-100

                    bg-emerald-50

                    text-xs
                    font-bold
                    text-emerald-700
                  "
              >
                {getInitials(row.name)}
              </div>

              <div className="min-w-0">
                <p
                  title={name}
                  className="
                      truncate
                      text-sm
                      font-semibold
                      text-[#17211C]
                    "
                >
                  {name}
                </p>

                <p
                  className="
                      mt-0.5
                      text-xs
                      text-[#91A098]
                    "
                >
                  Customer lead
                </p>
              </div>
            </div>
          );
        },
      },

      {
        field: "email",
        headerName: "Email",

        flex: 1.25,
        minWidth: 230,

        sortable: false,

        renderCell: ({ value }) => {
          const email = typeof value === "string" && value.trim() ? value : "—";

          return (
            <div
              className="
                  flex
                  h-full
                  min-w-0
                  items-center
                  gap-2

                  text-sm
                  text-[#607168]
                "
            >
              <Mail
                className="
                    size-4
                    shrink-0
                    text-[#9AACA2]
                  "
              />

              <span title={email} className="truncate">
                {email}
              </span>
            </div>
          );
        },
      },

      {
        field: "phone",
        headerName: "Phone",

        flex: 0.8,
        minWidth: 180,

        sortable: false,

        renderCell: ({ value }) => {
          const phone = typeof value === "string" && value.trim() ? value : "—";

          return (
            <div
              className="
                  flex
                  h-full
                  min-w-0
                  items-center
                  gap-2

                  text-sm
                  text-[#607168]
                "
            >
              <Phone
                className="
                    size-4
                    shrink-0
                    text-[#9AACA2]
                  "
              />

              <span title={phone} className="truncate">
                {phone}
              </span>
            </div>
          );
        },
      },

      {
        field: "status",
        headerName: "Status",

        width: 175,

        sortable: false,

        renderCell: ({ row }) => (
          <div
            className="
        flex
        h-full
        items-center
      "
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <LeadStatusSelect
              value={row.status}
              disabled={updatingLeadId === String(row.id)}
              onChange={(status) => {
                onStatusChange(String(row.id), status);
              }}
            />
          </div>
        ),
      },

      {
        field: "createdAt",
        headerName: "Created",

        width: 225,

        sortable: false,

        renderCell: ({ row }) => (
          <div
            className="
        flex
        h-full
        items-center
        gap-2
        text-sm
        text-[#6B7C73]
      "
          >
            <CalendarDays
              className="
          size-4
          shrink-0
          text-[#9AACA2]
        "
            />

            <span
              className="whitespace-nowrap"
              title={formatDateTime(row.createdAt)}
            >
              {formatDateTime(row.createdAt)}
            </span>
          </div>
        ),
      },
    ],
    [onStatusChange, updatingLeadId],
  );

  const tableHeight = Math.min(Math.max(105 + leads.length * 64, 310), 690);

  return (
    <div
      className="
        w-full
        overflow-hidden
        bg-white
      "
      style={{
        height: tableHeight,
      }}
    >
      <DataGrid
        aria-label="Leads table"
        rows={leads}
        columns={columns}
        loading={loading}
        /* Server pagination */
        rowCount={total}
        paginationMode="server"
        paginationModel={{
          page: Math.max(page - 1, 0),
          pageSize: limit,
        }}
        onPaginationModelChange={(model: GridPaginationModel) => {
          onPaginationChange(model.page + 1, model.pageSize);
        }}
        pageSizeOptions={[10, 20, 50]}
        /* Selection */
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={onSelectionChange}
        disableRowSelectionExcludeModel
        keepNonExistentRowsSelected
        /* Grid */
        disableColumnMenu
        rowHeight={64}
        columnHeaderHeight={48}
        hideFooterSelectedRowCount
        slots={{
          noRowsOverlay: NoRowsOverlay,
        }}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",

            noRowsVariant: "skeleton",
          },
        }}
        sx={{
          border: 0,

          fontFamily: "inherit",

          color: "#37483F",

          backgroundColor: "#FFFFFF",

          /*
           * Sticky table header
           */
          "& .MuiDataGrid-columnHeaders": {
            position: "sticky",

            top: 0,

            zIndex: 5,

            borderBottom: "1px solid #E5EEE9",

            backgroundColor: "#F7FAF8",

            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
          },

          "& .MuiDataGrid-columnHeader": {
            paddingLeft: "18px",

            paddingRight: "18px",

            backgroundColor: "#F7FAF8",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "0.6875rem",

            fontWeight: 700,

            letterSpacing: "0.055em",

            textTransform: "uppercase",

            color: "#708178",
          },

          "& .MuiDataGrid-columnSeparator": {
            color: "#E8EFEB",
          },

          /*
           * Cells
           */
          "& .MuiDataGrid-cell": {
            paddingLeft: "18px",

            paddingRight: "18px",

            borderBottom: "1px solid #EDF3EF",
          },

          /*
           * IMPORTANT
           * Checkbox selection column fix
           */
          "& .MuiDataGrid-columnHeaderCheckbox": {
            padding: "0 !important",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            overflow: "visible",
          },

          "& .MuiDataGrid-cellCheckbox": {
            padding: "0 !important",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            overflow: "visible",
          },

          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
            {
              width: "100%",

              padding: "0 !important",

              justifyContent: "center",

              overflow: "visible",
            },

          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainerContent":
            {
              overflow: "visible",
            },

          /*
           * Checkbox
           */
          "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root, & .MuiDataGrid-cellCheckbox .MuiCheckbox-root":
            {
              margin: 0,

              padding: "8px",

              color: "#B7C7BE",
            },

          "& .MuiCheckbox-root:hover": {
            backgroundColor: "#EAF7F0",
          },

          "& .MuiCheckbox-root.Mui-checked": {
            color: "#0B8A59",
          },

          "& .MuiCheckbox-root.MuiCheckbox-indeterminate": {
            color: "#0B8A59",
          },

          /*
           * Rows
           */
          "& .MuiDataGrid-row": {
            transition: "background-color 120ms ease",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F7FAF8",
          },

          /*
           * Selected row
           */
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#ECF8F2",

            "&:hover": {
              backgroundColor: "#E5F5ED",
            },
          },

          /*
           * Loading bar
           */
          "& .MuiLinearProgress-root": {
            backgroundColor: "#E5F4EC",
          },

          "& .MuiLinearProgress-bar": {
            backgroundColor: "#0B8A59",
          },

          /*
           * Footer
           */
          "& .MuiDataGrid-footerContainer": {
            minHeight: 56,

            borderTop: "1px solid #E5EEE9",

            backgroundColor: "#FAFCFB",
          },

          "& .MuiTablePagination-root": {
            color: "#607168",
          },

          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: "0.8125rem",
            },

          "& .MuiTablePagination-select": {
            fontSize: "0.8125rem",
          },

          "& .MuiTablePagination-actions button": {
            borderRadius: "8px",

            transition: "background-color 120ms ease",
          },

          "& .MuiTablePagination-actions button:hover": {
            backgroundColor: "#EEF5F1",
          },

          /*
           * Remove default focus border
           */
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },

          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },

          /*
           * Scrollbar
           */
          "& .MuiDataGrid-scrollbar": {
            scrollbarWidth: "thin",

            scrollbarColor: "#CBD8D1 transparent",
          },

          /*
           * Empty overlay
           */
          "& .MuiDataGrid-overlay": {
            backgroundColor: "#FFFFFF",
          },
        }}
      />
    </div>
  );
}
