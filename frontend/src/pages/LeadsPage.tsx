import { useEffect, useMemo, useState } from "react";

import type { GridRowSelectionModel } from "@mui/x-data-grid";

import { motion, useReducedMotion } from "motion/react";

import { Filter, RefreshCw, Search, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AddLeadDialog } from "@/features/leads/components/AddLeadDialog";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { useLeads } from "@/features/leads/hooks/useLeads";

import type { LeadStatus } from "@/features/leads/types/lead.types";

const SEARCH_DELAY = 350;

export default function LeadsPage() {
  const reduceMotion = useReducedMotion();

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<LeadStatus | undefined>();

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DELAY);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const query = useMemo(
    () => ({
      search: search || undefined,
      status,
      page,
      limit,
    }),
    [search, status, page, limit],
  );

  const { data, isLoading, isFetching, isError, refetch } = useLeads(query);

  const total = data?.pagination.total ?? 0;

  const leads = data?.data ?? [];

  const selectedCount =
    selectionModel.type === "include" ? selectionModel.ids.size : 0;

  const hasFilters = Boolean(searchInput) || Boolean(status);

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus(undefined);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value === "ALL" ? undefined : (value as LeadStatus));

    setPage(1);
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f8fc]">
      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 8,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          mx-auto
          max-w-[1440px]
          px-5
          py-8
          sm:px-6
          lg:px-8
          lg:py-10
        "
      >
        {/* Page heading */}
        <div
          className="
            mb-6
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-[30px]
                font-bold
                tracking-[-0.035em]
                text-slate-950
              "
            >
              Leads
            </h1>

            <p
              className="
                mt-1.5
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              Manage contacts, track progress and move opportunities through
              your pipeline.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                hidden
                items-center
                gap-1.5
                text-sm
                text-slate-500
                sm:flex
              "
            >
              <span
                className="
                  font-semibold
                  text-slate-900
                "
              >
                {total}
              </span>

              <span>{total === 1 ? "lead" : "leads"}</span>
            </div>

            <AddLeadDialog />
          </div>
        </div>

        {/* Main leads surface */}
        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_24px_rgba(15,23,42,0.04)]
          "
        >
          {/* Toolbar */}
          <div
            className="
              border-b
              border-slate-100
              p-4
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Search + filters */}
              <div
                className="
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                "
              >
                <div
                  className="
                    relative
                    w-full
                    sm:max-w-md
                  "
                >
                  <Search
                    aria-hidden
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      size-4
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <Input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search name, email or phone"
                    aria-label="Search leads"
                    className="
                      h-10
                      rounded-xl
                      border-slate-200
                      bg-slate-50/70
                      pl-9
                      pr-9
                      shadow-none
                      transition-all
                      duration-200
                      placeholder:text-slate-400
                      hover:bg-white
                      focus-visible:border-indigo-400
                      focus-visible:bg-white
                      focus-visible:ring-4
                      focus-visible:ring-indigo-50
                    "
                  />

                  {searchInput && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => {
                        setSearchInput("");
                        setSearch("");
                        setPage(1);
                      }}
                      className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        size-7
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-slate-700
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500
                      "
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <Select
                  value={status ?? "ALL"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger
                    className="
                      h-10
                      w-full
                      rounded-xl
                      border-slate-200
                      bg-white
                      shadow-none
                      sm:w-[180px]
                    "
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="size-4 text-slate-400" />

                      <SelectValue />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ALL">All statuses</SelectItem>

                    <SelectItem value="NEW">New</SelectItem>

                    <SelectItem value="CONTACTED">Contacted</SelectItem>

                    <SelectItem value="QUALIFIED">Qualified</SelectItem>

                    <SelectItem value="CONVERTED">Converted</SelectItem>

                    <SelectItem value="LOST">Lost</SelectItem>
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="
                      h-10
                      rounded-xl
                      px-3
                      text-slate-500
                      hover:bg-slate-100
                      hover:text-slate-800
                    "
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                {selectedCount > 0 && (
                  <div
                    className="
                      inline-flex
                      h-9
                      items-center
                      rounded-lg
                      bg-indigo-50
                      px-3
                      text-xs
                      font-semibold
                      text-indigo-700
                    "
                  >
                    {selectedCount} selected
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isFetching}
                  onClick={() => void refetch()}
                  className="
                    h-10
                    gap-2
                    rounded-xl
                    border-slate-200
                    bg-white
                    px-3
                    text-slate-600
                    shadow-none
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  <RefreshCw
                    className={`
                      size-3.5
                      ${isFetching ? "animate-spin" : ""}
                    `}
                  />

                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          {isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : leads.length === 0 && !isLoading ? (
            <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
          ) : (
            <LeadsTable
              leads={leads}
              total={total}
              page={data?.pagination.page ?? page}
              limit={data?.pagination.limit ?? limit}
              loading={isLoading}
              selectionModel={selectionModel}
              onSelectionChange={setSelectionModel}
              onPaginationChange={(newPage, newLimit) => {
                setPage(newPage);
                setLimit(newLimit);
              }}
            />
          )}
        </section>
      </motion.div>
    </main>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div
      className="
        flex
        min-h-[320px]
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
          size-12
          items-center
          justify-center
          rounded-2xl
          bg-indigo-50
          text-indigo-600
        "
      >
        <Users className="size-5" />
      </div>

      <h3
        className="
          mt-4
          text-base
          font-semibold
          text-slate-900
        "
      >
        {hasFilters ? "No matching leads" : "No leads yet"}
      </h3>

      <p
        className="
          mt-1
          max-w-sm
          text-sm
          leading-6
          text-slate-500
        "
      >
        {hasFilters
          ? "Try changing your search or status filter."
          : "Create your first lead to start building your pipeline."}
      </p>

      {hasFilters && (
        <Button
          variant="outline"
          onClick={onClear}
          className="
            mt-5
            rounded-xl
          "
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="
        flex
        min-h-[320px]
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
          size-12
          items-center
          justify-center
          rounded-2xl
          bg-rose-50
          text-rose-600
        "
      >
        <X className="size-5" />
      </div>

      <h3
        className="
          mt-4
          font-semibold
          text-slate-900
        "
      >
        Unable to load leads
      </h3>

      <p
        className="
          mt-1
          text-sm
          text-slate-500
        "
      >
        Check your connection and try again.
      </p>

      <Button
        variant="outline"
        onClick={onRetry}
        className="
          mt-5
          rounded-xl
        "
      >
        Try again
      </Button>
    </div>
  );
}
