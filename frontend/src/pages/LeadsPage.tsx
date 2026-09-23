import { useEffect, useMemo, useState } from "react";

import type { GridRowSelectionModel } from "@mui/x-data-grid";

import { motion, useReducedMotion } from "motion/react";

import { Filter, LoaderCircle, RefreshCw, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AddLeadDialog } from "@/features/leads/components/AddLeadDialog";

import { LeadsSearch } from "@/features/leads/components/LeadsSearch";

import { LeadsTable } from "@/features/leads/components/LeadsTable";

import { useDebouncedValue } from "@/features/leads/hooks/useDebouncedValue";

import { useLeads } from "@/features/leads/hooks/useLeads";

import type { LeadStatus } from "@/features/leads/types/lead.types";

import {
  normalizeLeadSearch,
  validateLeadSearch,
} from "@/features/leads/validation/leadSearch";

import {
  useBulkUpdateLeadStatus,
  useUpdateLeadStatus,
} from "@/features/leads/hooks/useLeadStatus";

const SEARCH_DELAY = 350;

export default function LeadsPage() {
  const reduceMotion = useReducedMotion();

  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DELAY);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<LeadStatus | undefined>();

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  const updateStatusMutation = useUpdateLeadStatus();

  const bulkStatusMutation = useBulkUpdateLeadStatus();

  const updatingLeadId = updateStatusMutation.isPending
    ? (updateStatusMutation.variables?.leadId ?? null)
    : null;

  /*
   * Validate the debounced search.
   *
   * We validate the debounced value instead
   * of every single key press so the user
   * doesn't immediately see an error after
   * typing one character.
   */
  const searchError = validateLeadSearch(debouncedSearch);

  /*
   * Update actual API search only when:
   *
   * 1. debounce completes
   * 2. input is valid
   *
   * Page resets to 1 whenever the
   * search changes.
   */
  useEffect(() => {
    if (searchError) {
      return;
    }

    const normalized = normalizeLeadSearch(debouncedSearch);

    setSearch((current) => {
      if (current === normalized) {
        return current;
      }

      setPage(1);

      return normalized;
    });
  }, [debouncedSearch, searchError]);

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

  const selectedLeadIds =
    selectionModel.type === "include"
      ? Array.from(selectionModel.ids).map(String)
      : [];

  const selectedCount = selectedLeadIds.length;

  const hasFilters = Boolean(search) || Boolean(status);

  /*
   * Search spinner appears when:
   *
   * - debounce has finished
   * - valid search exists
   * - React Query is fetching
   */
  const isSearching = Boolean(search) && isFetching;

  function clearFilters() {
    setSearchInput("");

    setSearch("");

    setStatus(undefined);

    setPage(1);
  }

  function handleSearchChange(value: string) {
    /*
     * Prevent more than 80 chars
     * even if something is pasted.
     */
    setSearchInput(value.slice(0, 80));
  }

  function handleStatusChange(value: string) {
    setStatus(value === "ALL" ? undefined : (value as LeadStatus));

    setPage(1);
  }

  function handleLeadStatusChange(leadId: string, newStatus: LeadStatus) {
    updateStatusMutation.mutate({
      leadId,
      status: newStatus,
    });
  }

  function handleBulkStatusChange(value: string) {
    if (selectedLeadIds.length === 0) {
      return;
    }

    const newStatus = value as LeadStatus;

    bulkStatusMutation.mutate(
      {
        leadIds: selectedLeadIds,

        status: newStatus,
      },

      {
        onSuccess: () => {
          setSelectionModel({
            type: "include",
            ids: new Set(),
          });
        },
      },
    );
  }

  function clearSelection() {
    setSelectionModel({
      type: "include",
      ids: new Set(),
    });
  }

  return (
    <main
      className="
        min-h-[calc(100vh-64px)]
        bg-[#f7f8fc]
      "
    >
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
        {/* Heading */}

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

        {/* Main card */}

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
                lg:items-start
                lg:justify-between
              "
            >
              {/* Search + Filters */}

              <div
                className="
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  gap-3

                  sm:flex-row
                  sm:items-start
                "
              >
                <div
                  className="
                    w-full

                    sm:max-w-md
                  "
                >
                  <LeadsSearch
                    value={searchInput}
                    onChange={handleSearchChange}
                    error={searchError}
                    isSearching={isSearching}
                  />
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
      transition-colors
      hover:bg-slate-50
      focus:ring-2
      focus:ring-emerald-100
      sm:w-[180px]
    "
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="size-4 shrink-0 text-slate-400" />

                      <SelectValue placeholder="All statuses" />
                    </div>
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    sideOffset={6}
                    align="start"
                    className="
      w-[180px]
      rounded-xl
      border
      border-slate-200
      bg-white
      p-1
      shadow-lg
    "
                  >
                    <SelectItem
                      value="ALL"
                      className="
        h-9
        cursor-pointer
        rounded-lg
        px-3
        text-sm
        focus:bg-emerald-50
        focus:text-emerald-800
      "
                    >
                      All statuses
                    </SelectItem>

                    <SelectItem
                      value="NEW"
                      className="
        h-9
        cursor-pointer
        rounded-lg
        px-3
        text-sm
        focus:bg-emerald-50
        focus:text-emerald-800
      "
                    >
                      New
                    </SelectItem>

                    <SelectItem
                      value="CONTACTED"
                      className="
        h-9
        cursor-pointer
        rounded-lg
        px-3
        text-sm
        focus:bg-emerald-50
        focus:text-emerald-800
      "
                    >
                      Contacted
                    </SelectItem>

                    <SelectItem
                      value="QUALIFIED"
                      className="
        h-9
        cursor-pointer
        rounded-lg
        px-3
        text-sm
        focus:bg-emerald-50
        focus:text-emerald-800
      "
                    >
                      Qualified
                    </SelectItem>

                    <SelectItem
                      value="CONVERTED"
                      className="
        h-9
        cursor-pointer
        rounded-lg
        px-3
        text-sm
        focus:bg-emerald-50
        focus:text-emerald-800
      "
                    >
                      Converted
                    </SelectItem>

                    <SelectItem
                      value="LOST"
                      className="
        h-9
        cursor-pointer
        rounded-lg
        px-3
        text-sm
        focus:bg-emerald-50
        focus:text-emerald-800
      "
                    >
                      Lost
                    </SelectItem>
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
      flex
      flex-wrap
      items-center
      gap-2

      rounded-xl

      border
      border-emerald-100

      bg-emerald-50/70

      p-1.5
      pl-3
    "
                  >
                    <span
                      className="
        whitespace-nowrap

        text-xs
        font-semibold
        text-emerald-800
      "
                    >
                      {selectedCount} {selectedCount === 1 ? "lead" : "leads"}{" "}
                      selected
                    </span>

                    <div
                      className="
        h-5
        w-px
        bg-emerald-200
      "
                    />

                    <Select
                      disabled={bulkStatusMutation.isPending}
                      onValueChange={handleBulkStatusChange}
                    >
                      <SelectTrigger
                        className="
          h-8
          w-[160px]

          rounded-lg

          border-emerald-200

          bg-white

          text-xs

          shadow-none

          focus:ring-2
          focus:ring-emerald-100
        "
                      >
                        {bulkStatusMutation.isPending ? (
                          <div
                            className="
              flex
              items-center
              gap-2
            "
                          >
                            <LoaderCircle
                              className="
                size-3.5
                animate-spin
              "
                            />
                            Updating...
                          </div>
                        ) : (
                          <SelectValue placeholder="Update status" />
                        )}
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        side="bottom"
                        sideOffset={8}
                        align="start"
                        className="
    z-[100]
    w-[200px]

    rounded-xl

    border
    border-slate-200

    bg-white

    p-1.5

    shadow-[0_12px_32px_rgba(15,23,42,0.14)]
  "
                      >
                        <SelectItem
                          value="NEW"
                          className="
      h-9
      cursor-pointer
      rounded-lg
      px-3
      text-sm
      text-slate-700

      focus:bg-emerald-50
      focus:text-emerald-800
    "
                        >
                          New
                        </SelectItem>

                        <SelectItem
                          value="CONTACTED"
                          className="
      h-9
      cursor-pointer
      rounded-lg
      px-3
      text-sm
      text-slate-700

      focus:bg-emerald-50
      focus:text-emerald-800
    "
                        >
                          Contacted
                        </SelectItem>

                        <SelectItem
                          value="QUALIFIED"
                          className="
      h-9
      cursor-pointer
      rounded-lg
      px-3
      text-sm
      text-slate-700

      focus:bg-emerald-50
      focus:text-emerald-800
    "
                        >
                          Qualified
                        </SelectItem>

                        <SelectItem
                          value="CONVERTED"
                          className="
      h-9
      cursor-pointer
      rounded-lg
      px-3
      text-sm
      text-slate-700

      focus:bg-emerald-50
      focus:text-emerald-800
    "
                        >
                          Converted
                        </SelectItem>

                        <SelectItem
                          value="LOST"
                          className="
      h-9
      cursor-pointer
      rounded-lg
      px-3
      text-sm
      text-slate-700

      focus:bg-emerald-50
      focus:text-emerald-800
    "
                        >
                          Lost
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={bulkStatusMutation.isPending}
                      onClick={clearSelection}
                      className="
        h-8

        rounded-lg

        px-2.5

        text-xs
        text-slate-500

        hover:bg-white
        hover:text-slate-800
      "
                    >
                      Clear
                    </Button>
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

                  <span
                    className="
                      hidden
                      sm:inline
                    "
                  >
                    Refresh
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}

          {isError && !data ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : leads.length === 0 && !isLoading && !isFetching ? (
            <EmptyState
              hasFilters={hasFilters}
              search={search}
              onClear={clearFilters}
            />
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
              onStatusChange={handleLeadStatusChange}
              updatingLeadId={updatingLeadId}
            />
          )}
        </section>
      </motion.div>
    </main>
  );
}

function EmptyState({
  hasFilters,
  search,
  onClear,
}: {
  hasFilters: boolean;
  search: string;
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
        {search
          ? `No leads found matching "${search}". Try a different name, email or phone number.`
          : hasFilters
            ? "No leads match the selected filters."
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
