// src/features/leads/validation/lead.validation.ts

import { z } from "zod";

import { parsePhoneNumberFromString } from "libphonenumber-js/max";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 254;

const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;

function validatePhoneNumber(value: string): string | null {
  if (!value?.trim()) {
    return "Phone number is required";
  }

  try {
    const phone = parsePhoneNumberFromString(value);

    if (!phone) {
      return "Enter a valid phone number";
    }

    if (!phone.isValid()) {
      return "Enter a valid phone number for the selected country";
    }

    /*
     * India-specific mobile rule.
     *
     * Indian mobile numbers:
     * - exactly 10 national digits
     * - normally start with 6, 7, 8 or 9
     */
    if (phone.country === "IN") {
      const nationalNumber = phone.nationalNumber;

      if (
        nationalNumber.length !== 10 ||
        !/^[6-9]\d{9}$/.test(nationalNumber)
      ) {
        return "Indian mobile number must be exactly 10 digits and start with 6–9";
      }
    }

    return null;
  } catch {
    return "Enter a valid phone number";
  }
}

const phoneSchema = z
  .string()
  .trim()
  .superRefine((value, context) => {
    const error = validatePhoneNumber(value);

    if (!error) {
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,

      message: error,
    });
  });

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters`)
    .max(NAME_MAX_LENGTH, `Name cannot exceed ${NAME_MAX_LENGTH} characters`)
    .regex(
      NAME_REGEX,
      "Name can only contain letters, spaces, apostrophes, hyphens and periods",
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .max(EMAIL_MAX_LENGTH, `Email cannot exceed ${EMAIL_MAX_LENGTH} characters`)
    .email("Enter a valid email address"),

  phone: phoneSchema,
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

/**
 * Convert form data into the normalized
 * payload expected by our API.
 */
export function normalizeLeadForm(values: LeadFormValues) {
  const parsedPhone = parsePhoneNumberFromString(values.phone);

  return {
    name: values.name.trim().replace(/\s+/g, " "),

    email: values.email.trim().toLowerCase(),

    // Store phone numbers using E.164:
    // +919876543210
    phone: parsedPhone?.number ?? values.phone,
  };
}

export const LEAD_NAME_MAX_LENGTH = NAME_MAX_LENGTH;
