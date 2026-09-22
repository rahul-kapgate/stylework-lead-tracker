import { useMemo } from "react";

import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

import { CalendarDays, Inbox, Mail, Phone } from "lucide-react";

import { LeadStatusBadge } from "./LeadStatusBadge";

import type { Lead } from "../types/lead.types";

interface LeadsTableProps {
  leads: Lead[];
  total: number;

  page: number;
  limit: number;

  loading: boolean;

  selectionModel: GridRowSelectionModel;

  onSelectionChange: (model: GridRowSelectionModel) => void;

  onPaginationChange: (page: number, limit: number) => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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
}: LeadsTableProps) {
  const columns = useMemo<GridColDef<Lead>[]>(
    () => [
      {
        field: "name",
        headerName: "Lead",
        flex: 1.15,
        minWidth: 210,

        sortable: false,

        renderCell: ({ row }) => (
          <div
            className="
                flex h-full
                min-w-0
                items-center
                gap-3
              "
          >
            <div
              className="
                  flex size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-indigo-100
                  bg-indigo-50
                  text-xs
                  font-bold
                  tracking-wide
                  text-indigo-700
                "
            >
              {initials(row.name)}
            </div>

            <div className="min-w-0">
              <div
                className="
                    truncate
                    text-sm
                    font-semibold
                    text-slate-900
                  "
              >
                {row.name}
              </div>

              <div
                className="
                    mt-0.5
                    text-xs
                    text-slate-400
                  "
              >
                Lead
              </div>
            </div>
          </div>
        ),
      },

      {
        field: "email",
        headerName: "Email",
        flex: 1.35,
        minWidth: 240,
        sortable: false,

        renderCell: ({ value }) => (
          <div
            className="
                flex h-full
                min-w-0
                items-center
                gap-2
                text-sm
                text-slate-600
              "
          >
            <Mail
              className="
                  size-4 shrink-0
                  text-slate-400
                "
            />

            <span className="truncate">{String(value)}</span>
          </div>
        ),
      },

      {
        field: "phone",
        headerName: "Phone",
        flex: 0.9,
        minWidth: 170,
        sortable: false,

        renderCell: ({ value }) => (
          <div
            className="
                flex h-full
                items-center
                gap-2
                text-sm
                text-slate-600
              "
          >
            <Phone className="size-4 text-slate-400" />

            {String(value)}
          </div>
        ),
      },

      {
        field: "status",
        headerName: "Status",
        width: 145,
        sortable: false,

        renderCell: ({ row }) => (
          <div className="flex h-full items-center">
            <LeadStatusBadge status={row.status} />
          </div>
        ),
      },

      {
        field: "createdAt",
        headerName: "Created",
        width: 170,
        sortable: false,

        renderCell: ({ row }) => (
          <div
            className="
                flex h-full
                items-center
                gap-2
                text-sm
                text-slate-500
              "
          >
            <CalendarDays className="size-4 text-slate-400" />

            {formatDate(row.createdAt)}
          </div>
        ),
      },
    ],
    [],
  );

  function handlePagination(model: GridPaginationModel) {
    onPaginationChange(model.page + 1, model.pageSize);
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/90
        bg-white
        shadow-[0_1px_2px_rgba(15,23,42,0.03),0_6px_24px_rgba(15,23,42,0.04)]
        transition-shadow
        duration-300
        hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_rgba(15,23,42,0.06)]
      "
    >
      <DataGrid
        rows={leads}
        columns={columns}
        loading={loading}
        rowCount={total}
        paginationMode="server"
        paginationModel={{
          page: Math.max(page - 1, 0),

          pageSize: limit,
        }}
        onPaginationModelChange={handlePagination}
        pageSizeOptions={[10, 20, 50, 100]}
        checkboxSelection
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={onSelectionChange}
        disableRowSelectionOnClick
        disableRowSelectionExcludeModel
        keepNonExistentRowsSelected
        rowHeight={68}
        columnHeaderHeight={52}
        slots={{
          noRowsOverlay: EmptyLeadsOverlay,
        }}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "skeleton",
          },
        }}
        sx={{
          border: 0,

          minHeight: 420,

          fontFamily: "inherit",

          color: "#334155",

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8faff",
            borderBottom: "1px solid #e8eaf3",
          },

          "& .MuiDataGrid-columnHeader": {
            paddingLeft: "16px",
            paddingRight: "16px",
            backgroundColor: "#f8faff",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.025em",
            textTransform: "uppercase",
            color: "#64748b",
          },

          "& .MuiDataGrid-cell": {
            borderColor: "#f1f5f9",
            paddingLeft: "16px",
            paddingRight: "16px",
          },

          "& .MuiDataGrid-row": {
            transition: "background-color 140ms ease",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#fafaff",
          },

          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#eef2ff",

            "&:hover": {
              backgroundColor: "#e8edff",
            },
          },

          "& .MuiDataGrid-footerContainer": {
            minHeight: 58,
            borderTop: "1px solid #eef2f7",
            backgroundColor: "#ffffff",
          },

          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },

          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },

          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
        }}
      />
    </div>
  );
}

function EmptyLeadsOverlay() {
  return (
    <div
      className="
        flex h-full
        min-h-[300px]
        flex-col
        items-center
        justify-center
        px-6
        text-center
      "
    >
      <div
        className="
          flex size-12
          items-center
          justify-center
          rounded-2xl
          bg-indigo-50
          text-indigo-600
        "
      >
        <Inbox className="size-5" />
      </div>

      <h3
        className="
          mt-4
          text-sm
          font-semibold
          text-slate-900
        "
      >
        No leads found
      </h3>

      <p
        className="
          mt-1
          max-w-xs
          text-sm
          leading-6
          text-slate-500
        "
      >
        Try adjusting your search or status filter.
      </p>
    </div>
  );
}
