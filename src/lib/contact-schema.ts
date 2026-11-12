import { z } from "zod/mini";
import { CONTACT_ROLES, LIMITS, type ContactFieldName } from "./contact-constants";

export { CONTACT_ROLES, LIMITS, parseRole } from "./contact-constants";
export type { ContactErrorCode, ContactResponse } from "./contact-constants";

/** Removes HTML tags and control characters, collapses whitespace, trims. */
export function stripHtml(value: string, { multiline = false } = {}): string {
  let out = value
    .replace(/<[^>]*>?/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  out = multiline
    ? out
        .replace(/\r\n?/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
    : out.replace(/\s+/g, " ");
  return out.trim();
}

const capitalised = (label: string) => `${label[0]!.toUpperCase()}${label.slice(1)}`;

/** Single-line text: strip HTML, then length checks with friendly messages. */
const line = (min: number, max: number, label: string) =>
  z.pipe(
    z.pipe(
      z.string({ error: `Enter your ${label}` }),
      z.transform((v: string) => stripHtml(v)),
    ),
    z
      .string()
      .check(
        z.minLength(1, { error: `Enter your ${label}` }),
        z.minLength(min, { error: `${capitalised(label)} is too short` }),
        z.maxLength(max, { error: `Keep it under ${max} characters` }),
      ),
  );

// zod/mini keeps the client bundle small; the API is functional but the
// schema is the same one the server validates with.
export const contactSchema = z.object({
  name: line(LIMITS.name.min, LIMITS.name.max, "name"),
  email: z.pipe(
    z
      .string({ error: "Enter your email" })
      .check(
        z.trim(),
        z.maxLength(LIMITS.email.max, { error: "That email is too long" }),
      ),
    z.email({ error: "Enter a valid email address" }),
  ),
  phone: z._default(
    z.optional(
      z.string().check(
        z.trim(),
        z.maxLength(LIMITS.phone.max, { error: "That number is too long" }),
        z.refine((v) => v === "" || /^\+?[\d\s()-]{7,}$/.test(v), {
          error: "Use digits only, e.g. +92 300 1234567",
        }),
      ),
    ),
    "",
  ),
  role: z.enum(CONTACT_ROLES, { error: "Choose the option that fits you best" }),
  city: line(LIMITS.city.min, LIMITS.city.max, "city"),
  message: z.pipe(
    z.pipe(
      z.string({ error: "Add a short message" }),
      z.transform((v: string) => stripHtml(v, { multiline: true })),
    ),
    z.string().check(
      z.minLength(1, { error: "Add a short message" }),
      z.minLength(LIMITS.message.min, {
        error: `Add a little more detail (at least ${LIMITS.message.min} characters)`,
      }),
      z.maxLength(LIMITS.message.max, {
        error: `Keep it under ${LIMITS.message.max} characters`,
      }),
    ),
  ),
  /** Honeypot: humans never see or fill this field. */
  website: z._default(z.optional(z.string().check(z.maxLength(200))), ""),
});

/** What the form holds (before transforms). */
export type ContactInput = z.input<typeof contactSchema>;
/** What the server works with (after transforms). */
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;

// Keep the hand-written field list in sync with the schema.
type _Check = [ContactField] extends [ContactFieldName]
  ? [ContactFieldName] extends [ContactField]
    ? true
    : never
  : never;
const _fieldsInSync: _Check = true;
