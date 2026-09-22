import type { LeadStatus } from "../types/lead.types";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<
  LeadStatus,
  {
    label: string;
    dot: string;
    className: string;
  }
> = {
  NEW: {
    label: "New",
    dot: "bg-blue-500",

    className: "border-blue-200 bg-blue-50 text-blue-700",
  },

  CONTACTED: {
    label: "Contacted",
    dot: "bg-amber-500",

    className: "border-amber-200 bg-amber-50 text-amber-700",
  },

  QUALIFIED: {
    label: "Qualified",
    dot: "bg-violet-500",

    className: "border-violet-200 bg-violet-50 text-violet-700",
  },

  CONVERTED: {
    label: "Converted",
    dot: "bg-emerald-500",

    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  LOST: {
    label: "Lost",
    dot: "bg-rose-500",

    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5

        rounded-full
        border

        px-2.5
        py-1

        text-xs
        font-semibold

        ${config.className}
      `}
    >
      <span
        aria-hidden
        className={`
          size-1.5
          rounded-full
          ${config.dot}
        `}
      />

      {config.label}
    </span>
  );
}
