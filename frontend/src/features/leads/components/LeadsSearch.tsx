import { LoaderCircle, Search, X } from "lucide-react";

interface LeadsSearchProps {
  value: string;
  onChange: (value: string) => void;

  isSearching?: boolean;

  error?: string | null;
}

export function LeadsSearch({
  value,
  onChange,
  isSearching = false,
  error,
}: LeadsSearchProps) {
  return (
    <div className="w-full">
      <div className="relative w-full max-w-md">
        <Search
          className="
            absolute
            left-3
            top-1/2
            size-4
            -translate-y-1/2
            text-[#91A098]
          "
        />

        <input
          type="search"
          value={value}
          maxLength={80}
          autoComplete="off"
          spellCheck={false}
          placeholder="Search name, email or phone..."
          aria-label="Search leads"
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          className={`
            h-10
            w-full
            rounded-lg
            border
            bg-white
            pl-10
            pr-10

            text-sm
            text-[#17211C]

            outline-none

            transition-all

            placeholder:text-[#9AACA2]

            ${
              error
                ? `
                  border-red-300
                  focus:border-red-400
                  focus:ring-2
                  focus:ring-red-100
                `
                : `
                  border-[#DCE7E1]
                  hover:border-[#C8D8D0]
                  focus:border-[#0B8A59]
                  focus:ring-2
                  focus:ring-[#0B8A59]/10
                `
            }
          `}
        />

        <div
          className="
            absolute
            right-3
            top-1/2
            flex
            -translate-y-1/2
            items-center
          "
        >
          {isSearching ? (
            <LoaderCircle
              className="
                size-4
                animate-spin
                text-[#0B8A59]
              "
            />
          ) : value ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onChange("")}
              className="
                rounded
                p-0.5
                text-[#91A098]

                transition-colors

                hover:bg-[#EEF4F1]
                hover:text-[#17211C]
              "
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
