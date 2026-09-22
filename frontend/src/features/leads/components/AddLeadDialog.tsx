import { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2, Plus, UserPlus } from "lucide-react";

import { z } from "zod";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { getApiErrorMessage } from "@/api/client";

import { createLead } from "../api/lead.api";

import { leadKeys } from "../hooks/useLeads";

const schema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters").max(150),

  email: z.string().trim().email("Enter a valid email address"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long"),
});

type FormValues = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
      {message}
    </p>
  );
}

export function AddLeadDialog() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,

    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createLead,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: leadKeys.all,
      });

      toast.success("Lead created successfully");

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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (submitting) {
          return;
        }

        setOpen(nextOpen);

        if (!nextOpen) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="
            h-10
            gap-2
            rounded-xl
            bg-indigo-600
            px-4
            font-semibold
            text-white
            shadow-sm
            shadow-indigo-200/70
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-indigo-700
            hover:shadow-md
            hover:shadow-indigo-200
            active:translate-y-0
          "
        >
          <Plus className="size-4" />
          Add Lead
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          overflow-hidden
          border-slate-200
          p-0
          sm:max-w-[520px]
        "
      >
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div
            className="
              border-b
              border-slate-100
              bg-gradient-to-br
              from-indigo-50/80
              via-white
              to-white
              px-6 py-6
            "
          >
            <DialogHeader>
              <div
                className="
                  mb-3
                  flex size-10
                  items-center justify-center
                  rounded-xl
                  bg-indigo-600
                  text-white
                  shadow-sm
                  shadow-indigo-200
                "
              >
                <UserPlus className="size-5" />
              </div>

              <DialogTitle className="text-xl">Add new lead</DialogTitle>

              <DialogDescription>
                Add a new contact to your sales pipeline. The lead will start
                with New status.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <label
                htmlFor="lead-name"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-slate-700
                "
              >
                Full name
              </label>

              <Input
                id="lead-name"
                autoComplete="name"
                placeholder="e.g. Rahul Kapgate"
                className="
                  h-11 rounded-xl
                  border-slate-200
                  bg-white
                  transition-all
                  focus-visible:border-indigo-400
                  focus-visible:ring-indigo-100
                "
                {...register("name")}
              />

              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label
                htmlFor="lead-email"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-slate-700
                "
              >
                Email address
              </label>

              <Input
                id="lead-email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className="
                  h-11 rounded-xl
                  border-slate-200
                  bg-white
                  focus-visible:border-indigo-400
                  focus-visible:ring-indigo-100
                "
                {...register("email")}
              />

              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <label
                htmlFor="lead-phone"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-slate-700
                "
              >
                Phone number
              </label>

              <Input
                id="lead-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className="
                  h-11 rounded-xl
                  border-slate-200
                  bg-white
                  focus-visible:border-indigo-400
                  focus-visible:ring-indigo-100
                "
                {...register("phone")}
              />

              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          <DialogFooter
            className="
              border-t
              border-slate-100
              bg-slate-50/70
              px-6 py-4
            "
          >
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting}
              className="
                min-w-[120px]
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-700
              "
            >
              {submitting ? (
                <>
                  <Loader2
                    className="
                      mr-2 size-4
                      animate-spin
                    "
                  />
                  Creating...
                </>
              ) : (
                "Create lead"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
