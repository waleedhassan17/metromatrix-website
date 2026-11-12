import { z } from "zod";

/**
 * Environment validation.
 *
 * - `publicEnv` is safe to import anywhere (client or server). Only
 *   NEXT_PUBLIC_* values are read, and they are referenced literally so
 *   Next.js can inline them at build time.
 * - `getServerEnv()` is for server code only (Route Handlers, instrumentation).
 *   Secrets are optional so a build/preview without Resend still succeeds;
 *   the contact route reports a clear "email not configured" error instead.
 */

const booleanish = z
  .string()
  .optional()
  .transform((v) => v === "true" || v === "1");

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_ENABLE_ANALYTICS: booleanish,
});

const serverSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
  // Either "name@domain" or "Name <name@domain>".
  CONTACT_FROM_EMAIL: z
    .string()
    .regex(/^(?:[^<>]+<)?[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+>?$/, "Invalid sender address")
    .optional(),
});

export type PublicEnv = z.infer<typeof publicSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
}

const parsedPublic = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
});

if (!parsedPublic.success) {
  throw new Error(`Invalid public environment: ${formatIssues(parsedPublic.error)}`);
}

export const publicEnv: PublicEnv = parsedPublic.data;

/** Parsed on each call (cheap), so tests and env changes are picked up. */
export function getServerEnv(): ServerEnv {
  const parsed = serverSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || undefined,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || undefined,
  });
  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${formatIssues(parsed.error)}`);
  }
  return parsed.data;
}

/** True when every variable needed to send email is present. */
export function isEmailConfigured(env: ServerEnv = getServerEnv()): boolean {
  return Boolean(env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL);
}

/** Called once at server start (see src/instrumentation.ts). */
export function assertServerEnv(): void {
  const env = getServerEnv();
  if (!isEmailConfigured(env)) {
    console.warn(
      "[env] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not fully set — the contact form will report 'email not configured'.",
    );
  }
}
