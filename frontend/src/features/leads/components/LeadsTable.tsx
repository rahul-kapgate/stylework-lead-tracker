import { useMemo } from "react";

import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

import { CalendarDays, Mail, Phone } from "lucide-react";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
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

        flex: 1.1,
        minWidth: 220,

        sortable: false,

        renderCell: ({ row }) => (
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
                  border-brand-100

                  bg-brand-50

                  text-xs
                  font-bold
                  text-brand-700
                "
            >
              {getInitials(row.name)}
            </div>

            <div className="min-w-0">
              <p
                className="
                    truncate
                    text-sm
                    font-semibold
                    text-[#17211C]
                  "
              >
                {row.name}
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
        ),
      },

      {
        field: "email",
        headerName: "Email",

        flex: 1.25,
        minWidth: 230,

        sortable: false,

        renderCell: ({ value }) => (
          <div
            className="
                flex
                h-full
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

            <span className="truncate">{String(value)}</span>
          </div>
        ),
      },

      {
        field: "phone",
        headerName: "Phone",

        minWidth: 175,
        flex: 0.8,

        sortable: false,

        renderCell: ({ value }) => (
          <div
            className="
                flex
                h-full
                items-center
                gap-2

                text-sm
                text-[#607168]
              "
          >
            <Phone
              className="
                  size-4
                  text-[#9AACA2]
                "
            />

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
          <div
            className="
                flex
                h-full
                items-center
              "
          >
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
                  text-[#9AACA2]
                "
            />

            {formatDate(row.createdAt)}
          </div>
        ),
      },
    ],
    [],
  );

  const tableHeight = Math.min(Math.max(126 + leads.length * 64, 310), 680);

  return (
    <div
      style={{
        height: tableHeight,
      }}
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
        onPaginationModelChange={(model: GridPaginationModel) => {
          onPaginationChange(model.page + 1, model.pageSize);
        }}
        pageSizeOptions={[10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={onSelectionChange}
        disableRowSelectionExcludeModel
        keepNonExistentRowsSelected
        rowHeight={64}
        columnHeaderHeight={48}
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

          backgroundColor: "#FBFDFC",

          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "1px solid #E5EEE9",

            backgroundColor: "#F5F9F7",
          },

          "& .MuiDataGrid-columnHeader": {
            paddingLeft: "18px",

            paddingRight: "18px",

            backgroundColor: "#F5F9F7",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "0.6875rem",

            fontWeight: 700,

            letterSpacing: "0.055em",

            textTransform: "uppercase",

            color: "#708178",
          },

          "& .MuiDataGrid-cell": {
            paddingLeft: "18px",

            paddingRight: "18px",

            borderBottom: "1px solid #EDF3EF",
          },

          "& .MuiDataGrid-row": {
            transition: "background-color 120ms ease",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F6FAF8",
          },

          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#EAF8F1",

            "&:hover": {
              backgroundColor: "#E2F4EA",
            },
          },

          "& .MuiCheckbox-root": {
            color: "#B8C9BF",
          },

          "& .MuiCheckbox-root.Mui-checked": {
            color: "#0B8A59",
          },

          "& .MuiDataGrid-footerContainer": {
            minHeight: 56,

            borderTop: "1px solid #E5EEE9",

            backgroundColor: "#F8FBF9",
          },

          "& .MuiTablePagination-root": {
            color: "#6B7C73",
          },

          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },

          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },
        }}
      />
    </div>
  );
}
