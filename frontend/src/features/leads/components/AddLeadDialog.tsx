// src/features/leads/components/AddLeadDialog.tsx

import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2, Mail, Plus, UserRound } from "lucide-react";

import { PhoneInput } from "react-international-phone";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getApiErrorMessage } from "@/api/client";

import { createLead } from "../api/lead.api";

import { leadKeys } from "../hooks/useLeads";

import {
  leadFormSchema,
  LEAD_NAME_MAX_LENGTH,
  normalizeLeadForm,
  type LeadFormValues,
} from "../validation/lead.validation";

export function AddLeadDialog() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    watch,

    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),

    mode: "onBlur",

    reValidateMode: "onChange",

    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const name = watch("name");

  const mutation = useMutation({
    mutationFn: createLead,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: leadKeys.all,
      });

      toast.success("Lead created successfully", {
        description: "The lead has been added to your pipeline.",
      });

      reset();

      setOpen(false);
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Unable to create lead."));
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFocus("name");
    }, 100);

    return () => window.clearTimeout(timer);
  }, [open, setFocus]);

  const submitting = mutation.isPending || isSubmitting;

  function handleOpenChange(nextOpen: boolean) {
    if (submitting) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  }

  function onSubmit(values: LeadFormValues) {
    const payload = normalizeLeadForm(values);

    mutation.mutate(payload);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="
            h-10
            gap-2
            rounded-lg

            border
            border-brand-600

            bg-brand-600

            px-4

            text-sm
            font-semibold
            text-white

            shadow-[0_2px_8px_rgba(11,138,89,0.20)]

            transition-all
            duration-200

            hover:border-brand-700
            hover:bg-brand-700

            hover:shadow-[0_4px_12px_rgba(11,138,89,0.24)]

            active:scale-[0.98]

            focus-visible:ring-4
            focus-visible:ring-brand-100
          "
        >
          <Plus className="size-4" />
          Add Lead
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          gap-0
          overflow-visible
          rounded-[18px]
          border
          border-[#D6E4DC]
          bg-[#FBFDFC]
          p-0
          shadow-[0_24px_80px_rgba(22,55,38,0.18)]
          sm:max-w-[500px]
          [&>button]:rounded-full
          [&>button]:p-1.5
          [&>button]:text-[#6B7C73]
          [&>button]:transition-colors
          [&>button:hover]:bg-[#EEF5F1]
          [&>button:hover]:text-[#17211C]
        "
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div
            className="
    rounded-t-[17px]
    bg-[#FBFDFC]
    px-6
    pb-5
    pt-6
  "
          >
            <DialogHeader
              className="
                space-y-0
                text-left
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    size-10
                    shrink-0
                    items-center
                    justify-center

                    rounded-xl

                    bg-brand-50
                    text-brand-700

                    ring-1
                    ring-brand-100
                  "
                >
                  <UserRound
                    className="
                      size-[18px]
                    "
                  />
                </div>

                <div
                  className="
                    pt-0.5
                  "
                >
                  <DialogTitle
                    className="
                      text-lg
                      font-semibold

                      tracking-[-0.02em]

                      text-[#17211C]
                    "
                  >
                    Add new lead
                  </DialogTitle>

                  <DialogDescription
                    className="
                      mt-1

                      text-sm
                      leading-5

                      text-[#6B7C73]
                    "
                  >
                    Create a new contact in your sales pipeline.
                  </DialogDescription>
                </div>
              </div>

              <div
                className="
                  mt-4

                  inline-flex
                  w-fit
                  items-center
                  gap-1.5

                  rounded-full

                  bg-brand-50

                  px-2.5
                  py-1

                  text-[11px]
                  font-semibold
                  text-brand-700
                "
              >
                <span
                  className="
                    size-1.5
                    rounded-full
                    bg-brand-500
                  "
                />
                Starts as New
              </div>
            </DialogHeader>
          </div>

          <div
            className="
              h-px
              bg-[#E5EEE9]
            "
          />

          {/* Form body */}
          <div
            className="
              space-y-5

              bg-[#FBFDFC]

              px-6
              py-6
            "
          >
            {/* Name */}
            <FormField
              label="Full name"
              required
              error={errors.name?.message}
              helper={`${name.length}/${LEAD_NAME_MAX_LENGTH}`}
            >
              <div
                className="
                  relative
                "
              >
                <UserRound
                  className="
                    pointer-events-none

                    absolute
                    left-3.5
                    top-1/2

                    size-4

                    -translate-y-1/2

                    text-[#91A098]
                  "
                />

                <Input
                  autoComplete="name"
                  maxLength={LEAD_NAME_MAX_LENGTH}
                  placeholder="e.g. Rahul Kapgate"
                  aria-invalid={Boolean(errors.name)}
                  className="
                    h-11

                    rounded-lg

                    border-[#DCE8E1]

                    bg-[#F6FAF8]

                    pl-10

                    text-sm
                    text-[#17211C]

                    shadow-none

                    transition-all
                    duration-200

                    placeholder:text-[#91A098]

                    hover:border-[#C9DCD1]
                    hover:bg-white

                    focus-visible:border-brand-500
                    focus-visible:bg-white
                    focus-visible:ring-4
                    focus-visible:ring-brand-50

                    aria-invalid:border-rose-300
                    aria-invalid:ring-rose-50
                  "
                  {...register("name")}
                />
              </div>
            </FormField>

            {/* Email */}
            <FormField
              label="Email address"
              required
              error={errors.email?.message}
            >
              <div
                className="
                  relative
                "
              >
                <Mail
                  className="
                    pointer-events-none

                    absolute
                    left-3.5
                    top-1/2

                    size-4

                    -translate-y-1/2

                    text-[#91A098]
                  "
                />

                <Input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  placeholder="name@company.com"
                  aria-invalid={Boolean(errors.email)}
                  className="
                    h-11

                    rounded-lg

                    border-[#DCE8E1]

                    bg-[#F6FAF8]

                    pl-10

                    text-sm
                    text-[#17211C]

                    shadow-none

                    transition-all
                    duration-200

                    placeholder:text-[#91A098]

                    hover:border-[#C9DCD1]
                    hover:bg-white

                    focus-visible:border-brand-500
                    focus-visible:bg-white
                    focus-visible:ring-4
                    focus-visible:ring-brand-50

                    aria-invalid:border-rose-300
                    aria-invalid:ring-rose-50
                  "
                  {...register("email")}
                />
              </div>
            </FormField>

            {/* Phone */}
            <FormField
              label="Phone number"
              required
              error={errors.phone?.message}
              helper="International format"
            >
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <PhoneInput
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    defaultCountry="in"
                    preferredCountries={["in", "us", "gb", "ae", "sg"]}
                    forceDialCode
                    placeholder="Phone number"
                    onBlur={field.onBlur}
                    onChange={(phone) => {
                      field.onChange(phone);
                    }}
                    inputProps={{
                      autoComplete: "tel",

                      inputMode: "tel",

                      "aria-invalid": fieldState.invalid,
                    }}
                    className={`
                      lead-phone-input

                      ${fieldState.invalid ? "lead-phone-input--error" : ""}
                    `}
                  />
                )}
              />
            </FormField>
          </div>

          {/* Footer */}
          <div
            className="
    flex
    items-center
    justify-end
    gap-2.5

    rounded-b-[17px]

    border-t
    border-[#E5EEE9]

    bg-[#F7FAF8]

    px-6
    py-4
  "
          >
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => setOpen(false)}
              className="
                inline-flex
                h-10
                min-w-[92px]
                items-center
                justify-center

                rounded-lg

                border-[#D5E2DA]

                bg-white

                px-4

                text-sm
                font-medium
                text-[#526158]

                shadow-none

                transition-all
                duration-150

                hover:border-[#BFD2C6]
                hover:bg-[#F3F7F5]
                hover:text-[#17211C]

                active:scale-[0.98]

                focus-visible:ring-4
                focus-visible:ring-brand-50
              "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting}
              className="
                inline-flex
                h-10
                min-w-[132px]
                items-center
                justify-center
                gap-2

                rounded-lg

                border
                border-brand-600

                bg-brand-600

                px-5

                text-sm
                font-semibold
                text-white

                shadow-[0_2px_6px_rgba(11,138,89,0.18)]

                transition-all
                duration-150

                hover:border-brand-700
                hover:bg-brand-700

                hover:shadow-[0_4px_10px_rgba(11,138,89,0.22)]

                active:scale-[0.98]

                focus-visible:ring-4
                focus-visible:ring-brand-100

                disabled:pointer-events-none
                disabled:opacity-60
                disabled:shadow-none
              "
            >
              {submitting ? (
                <>
                  <Loader2
                    className="
                      size-4
                      animate-spin
                    "
                  />
                  Creating...
                </>
              ) : (
                "Create lead"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  required,
  error,
  helper,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="
          mb-2

          flex
          min-h-[18px]
          items-center
          justify-between
          gap-4
        "
      >
        <label
          className="
            text-[13px]
            font-semibold

            text-[#37483F]
          "
        >
          {label}

          {required && (
            <span
              className="
                ml-0.5
                text-rose-500
              "
            >
              *
            </span>
          )}
        </label>

        {error ? (
          <span
            role="alert"
            className="
              max-w-[280px]

              text-right
              text-[11px]
              font-medium
              leading-4

              text-rose-600
            "
          >
            {error}
          </span>
        ) : helper ? (
          <span
            className="
              text-[11px]
              font-medium

              text-[#91A098]
            "
          >
            {helper}
          </span>
        ) : null}
      </div>

      {children}
    </div>
  );
}
