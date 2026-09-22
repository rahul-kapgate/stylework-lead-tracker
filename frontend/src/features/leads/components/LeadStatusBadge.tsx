import type { LeadStatus } from "../types/lead.types";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const styles: Record<
  LeadStatus,
  {
    dot: string;
    container: string;
    label: string;
  }
> = {
  NEW: {
    dot: "bg-blue-500",

    container: "border-blue-200 bg-blue-50/80 text-blue-700",

    label: "New",
  },

  CONTACTED: {
    dot: "bg-amber-500",

    container: "border-amber-200 bg-amber-50/80 text-amber-700",

    label: "Contacted",
  },

  QUALIFIED: {
    dot: "bg-violet-500",

    container: "border-violet-200 bg-violet-50/80 text-violet-700",

    label: "Qualified",
  },

  CONVERTED: {
    dot: "bg-emerald-500",

    container: "border-emerald-200 bg-emerald-50/80 text-emerald-700",

    label: "Converted",
  },

  LOST: {
    dot: "bg-rose-500",

    container: "border-rose-200 bg-rose-50/80 text-rose-700",

    label: "Lost",
  },
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = styles[status];

  return (
    <span
      className={`
        inline-flex items-center
        gap-1.5
        rounded-full
        border
        px-2.5 py-1
        text-xs font-semibold
        ${config.container}
      `}
    >
      <span
        aria-hidden
        className={`
          size-1.5 rounded-full
          ${config.dot}
        `}
      />

      {config.label}
    </span>
  );
}
