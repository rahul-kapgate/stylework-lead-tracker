import { LoaderCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { LeadStatusBadge } from "./LeadStatusBadge";

import type { LeadStatus } from "../types/lead.types";

interface LeadStatusSelectProps {
  value: LeadStatus;

  disabled?: boolean;

  onChange: (status: LeadStatus) => void;
}

const STATUS_OPTIONS: {
  value: LeadStatus;
  label: string;
}[] = [
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "CONTACTED",
    label: "Contacted",
  },
  {
    value: "QUALIFIED",
    label: "Qualified",
  },
  {
    value: "CONVERTED",
    label: "Converted",
  },
  {
    value: "LOST",
    label: "Lost",
  },
];

export function LeadStatusSelect({
  value,
  disabled = false,
  onChange,
}: LeadStatusSelectProps) {
  function handleChange(nextValue: string) {
    const nextStatus = nextValue as LeadStatus;

    if (nextStatus === value) {
      return;
    }

    onChange(nextStatus);
  }

  return (
    <Select value={value} disabled={disabled} onValueChange={handleChange}>
      <SelectTrigger
        aria-label="Update lead status"
        className="
          h-8
          w-auto
          min-w-[118px]

          gap-2

          rounded-lg

          border-transparent

          bg-transparent

          px-1.5

          shadow-none

          transition-colors

          hover:bg-slate-100

          focus:ring-2
          focus:ring-emerald-100

          data-[state=open]:bg-slate-100
        "
      >
        {disabled ? (
          <div
            className="
              flex
              items-center
              gap-2
              px-1
            "
          >
            <LoaderCircle
              className="
                size-3.5
                animate-spin
                text-emerald-600
              "
            />

            <span
              className="
                text-xs
                text-slate-500
              "
            >
              Updating
            </span>
          </div>
        ) : (
          <LeadStatusBadge status={value} />
        )}
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={6}
        align="start"
        className="
          min-w-[160px]

          rounded-xl

          border
          border-slate-200

          bg-white

          p-1

          shadow-lg
        "
      >
        {STATUS_OPTIONS.map((status) => (
          <SelectItem
            key={status.value}
            value={status.value}
            className="
                h-9

                cursor-pointer

                rounded-lg

                text-sm

                focus:bg-emerald-50
                focus:text-emerald-800
              "
          >
            <div
              className="
                  flex
                  items-center
                  gap-2
                "
            >
              <LeadStatusBadge status={status.value} />

              {value === status.value && (
                <span
                  className="
                      ml-auto
                      text-[10px]
                      text-slate-400
                    "
                >
                  Current
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
