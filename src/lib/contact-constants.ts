import type { ContactRole } from "@/content/types";

/**
 * Contact constants and response types with no runtime dependencies, so
 * client code can import them without pulling the validation library into
 * the initial bundle. The zod schema lives in contact-schema.ts.
 */

export const CONTACT_ROLES = [
  "customer",
  "home-kitchen",
  "restaurant",
  "doctor",
  "brand",
  "rider",
  "investor",
  "other",
] as const satisfies readonly ContactRole[];

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  phone: { max: 24 },
  city: { min: 2, max: 60 },
  message: { min: 10, max: 2000 },
  /** Hard cap on the raw request body, in bytes. */
  bodyBytes: 10_000,
} as const;

export type ContactErrorCode =
  | "unsupported_media_type"
  | "payload_too_large"
  | "invalid_json"
  | "validation_error"
  | "rate_limited"
  | "email_not_configured"
  | "send_failed";

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      error: ContactErrorCode;
      message: string;
      fieldErrors?: Partial<Record<ContactFieldName, string[]>>;
      /** Seconds until another attempt is allowed (rate_limited only). */
      retryAfter?: number;
    };

/** Accepts a URL role value and returns a valid role, if any. */
export function parseRole(value: string | null | undefined): ContactRole | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase();
  return (CONTACT_ROLES as readonly string[]).includes(v)
    ? (v as ContactRole)
    : undefined;
}

export type ContactFieldName =
  "name" | "email" | "phone" | "role" | "city" | "message" | "website";
