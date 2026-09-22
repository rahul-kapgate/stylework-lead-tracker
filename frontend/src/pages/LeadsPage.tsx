import { useEffect, useMemo, useState } from "react";

import type { GridRowSelectionModel } from "@mui/x-data-grid";

import { motion, useReducedMotion } from "motion/react";

import { Filter, RefreshCw, Search, Sparkles, Users, X } from "lucide-react";

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

const DEBOUNCE_MS = 350;

export default function LeadsPage() {
  const prefersReducedMotion = useReducedMotion();

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
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  const params = useMemo(
    () => ({
      search: search || undefined,

      status,

      page,

      limit,
    }),
    [search, status, page, limit],
  );

  const { data, isLoading, isFetching, isError, refetch } = useLeads(params);

  const selectedCount =
    selectionModel.type === "include" ? selectionModel.ids.size : 0;

  const hasFilters = Boolean(searchInput) || Boolean(status);

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus(undefined);
    setPage(1);
  }

  function handleStatus(value: string) {
    setStatus(value === "ALL" ? undefined : (value as LeadStatus));

    setPage(1);

    setSelectionModel({
      type: "include",
      ids: new Set(),
    });
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-slate-50
      "
    >
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-[420px]
          bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_40%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_38%)]
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-indigo-300/40
          to-transparent
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-[1500px]
          px-4
          pb-12
          pt-7
          sm:px-6
          lg:px-8
          lg:pt-9
        "
      >
        <motion.header
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: -8,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mb-7
            flex flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-indigo-100
                bg-white/80
                px-2.5 py-1.5
                text-xs
                font-semibold
                text-indigo-700
                shadow-sm
                backdrop-blur
              "
            >
              <span
                className="
                  flex size-5
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-100
                "
              >
                <img src="/image.png" alt="Logo" className="size-4" />
              </span>
              Stylework CRM
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  hidden size-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-indigo-600
                  to-indigo-500
                  text-white
                  shadow-lg
                  shadow-indigo-200/60
                  sm:flex
                "
              >
                <Users className="size-5" />
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-[-0.025em]
                    text-slate-950
                    sm:text-3xl
                  "
                >
                  Leads
                </h1>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Manage your pipeline, track conversations and move
                  opportunities forward.
                </p>
              </div>
            </div>
          </div>

          <AddLeadDialog />
        </motion.header>

        <motion.section
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 10,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.36,
            delay: 0.05,

            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="
              mb-4
              rounded-2xl
              border
              border-slate-200/80
              bg-white/85
              p-3
              shadow-sm
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex flex-col
                gap-3
                lg:flex-row
                lg:items-center
              "
            >
              <div
                className="
                  relative
                  min-w-0
                  flex-1
                "
              >
                <Search
                  aria-hidden
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by name, email or phone..."
                  aria-label="Search leads"
                  className="
                    h-11
                    rounded-xl
                    border-slate-200
                    bg-slate-50/60
                    pl-10
                    pr-10
                    shadow-none
                    transition-all
                    duration-200
                    placeholder:text-slate-400
                    hover:bg-white
                    focus-visible:border-indigo-400
                    focus-visible:bg-white
                    focus-visible:ring-4
                    focus-visible:ring-indigo-100
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
                      right-2.5
                      top-1/2
                      flex size-7
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

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                "
              >
                <Select value={status ?? "ALL"} onValueChange={handleStatus}>
                  <SelectTrigger
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border-slate-200
                      bg-white
                      shadow-none
                      sm:w-[190px]
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
                    onClick={clearFilters}
                    className="
                      h-11
                      rounded-xl
                      px-3
                      text-slate-500
                      hover:bg-slate-100
                      hover:text-slate-800
                    "
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                justify-between
                gap-2
                border-t
                border-slate-100
                px-1
                pt-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-slate-500
                "
              >
                <span
                  className="
                    font-semibold
                    text-slate-700
                  "
                >
                  {data?.pagination.total ?? 0}
                </span>

                {data?.pagination.total === 1 ? "lead" : "leads"}

                {selectedCount > 0 && (
                  <>
                    <span className="text-slate-300">•</span>

                    <span
                      className="
                        font-semibold
                        text-indigo-600
                      "
                    >
                      {selectedCount} selected
                    </span>
                  </>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isFetching}
                onClick={() => void refetch()}
                className="
                  h-8
                  gap-1.5
                  rounded-lg
                  text-xs
                  text-slate-500
                  hover:text-indigo-700
                "
              >
                <RefreshCw
                  className={`
                    size-3.5
                    ${isFetching ? "animate-spin" : ""}
                  `}
                />
                Refresh
              </Button>
            </div>
          </div>

          {isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : (
            <div className="relative">
              {isFetching && !isLoading && (
                <div
                  className="
                      absolute
                      left-4
                      right-4
                      top-0
                      z-20
                      h-[2px]
                      overflow-hidden
                      rounded-full
                      bg-indigo-100
                    "
                >
                  <motion.div
                    className="
                        h-full
                        w-1/3
                        rounded-full
                        bg-indigo-600
                      "
                    animate={{
                      x: ["-100%", "400%"],
                    }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              )}

              <LeadsTable
                leads={data?.data ?? []}
                total={data?.pagination.total ?? 0}
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
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-rose-200
        bg-white
        px-6 py-14
        text-center
        shadow-sm
      "
    >
      <div
        className="
          mx-auto
          flex size-11
          items-center
          justify-center
          rounded-xl
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
        We couldn't load your leads
      </h3>

      <p
        className="
          mx-auto
          mt-1
          max-w-md
          text-sm
          leading-6
          text-slate-500
        "
      >
        There may be a temporary connection problem. Your data hasn't been
        changed.
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="
          mt-5
          gap-2
          rounded-xl
        "
      >
        <RefreshCw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
