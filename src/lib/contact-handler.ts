import { Resend } from "resend";
import { z } from "zod/mini";
import { contactRoles, site } from "@/content/site";
import {
  LIMITS,
  contactSchema,
  type ContactData,
  type ContactErrorCode,
  type ContactResponse,
} from "./contact-schema";
import { getServerEnv, isEmailConfigured } from "./env";
import { clientIp, createRateLimiter } from "./rate-limit";

/** 5 submissions per 10 minutes per IP, per server instance. */
export const contactRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
});

const MESSAGES: Record<ContactErrorCode, string> = {
  unsupported_media_type: "Send the form as JSON.",
  payload_too_large: "That message is too long. Please shorten it and try again.",
  invalid_json: "We couldn't read that request. Please try again.",
  validation_error: "Some fields need attention.",
  rate_limited: "Too many requests. Please wait a few minutes and try again.",
  email_not_configured: `Our email service isn't set up yet. Please email us directly at ${site.contact.email}.`,
  send_failed: `We couldn't send your message just now. Please try again, or email us at ${site.contact.email}.`,
};

function json(
  body: ContactResponse,
  status: number,
  headers?: Record<string, string>,
): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function fail(
  error: ContactErrorCode,
  status: number,
  extra: Partial<ContactResponse> = {},
  headers?: Record<string, string>,
) {
  return json(
    { ok: false, error, message: MESSAGES[error], ...extra } as ContactResponse,
    status,
    headers,
  );
}

function roleLabel(role: ContactData["role"]): string {
  return contactRoles.find((r) => r.value === role)?.label ?? role;
}

export function buildEmail(data: ContactData) {
  const subject = `Early access: ${roleLabel(data.role)} · ${data.name} (${data.city})`;
  const text = [
    `New early-access request from ${site.name}`,
    "",
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Phone:   ${data.phone || "—"}`,
    `I am a:  ${roleLabel(data.role)}`,
    `City:    ${data.city}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
  return { subject, text };
}

export interface ContactHandlerDeps {
  send?: (args: {
    apiKey: string;
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
  }) => Promise<{ ok: boolean }>;
}

async function sendWithResend(
  args: Parameters<NonNullable<ContactHandlerDeps["send"]>>[0],
) {
  const resend = new Resend(args.apiKey);
  const { error } = await resend.emails.send({
    from: args.from,
    to: args.to,
    replyTo: args.replyTo,
    subject: args.subject,
    text: args.text,
  });
  if (error) console.error("[contact] Resend error:", error.name, error.message);
  return { ok: !error };
}

/**
 * POST /api/contact
 * JSON only → size cap → parse → rate limit → honeypot → validate → send.
 */
export async function handleContact(
  request: Request,
  deps: ContactHandlerDeps = {},
): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return fail("unsupported_media_type", 415);
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > LIMITS.bodyBytes) return fail("payload_too_large", 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail("invalid_json", 400);
  }
  if (new TextEncoder().encode(raw).byteLength > LIMITS.bodyBytes) {
    return fail("payload_too_large", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("invalid_json", 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return fail("invalid_json", 400);
  }

  const limited = contactRateLimiter.check(clientIp(request.headers));
  if (!limited.allowed) {
    return fail(
      "rate_limited",
      429,
      { retryAfter: limited.retryAfter },
      { "Retry-After": String(limited.retryAfter) },
    );
  }

  // Honeypot: pretend success so bots learn nothing.
  const honeypot = (body as Record<string, unknown>).website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return fail("validation_error", 400, { fieldErrors });
  }

  const env = getServerEnv();
  if (!isEmailConfigured(env)) {
    console.warn("[contact] Email not configured; request not sent.");
    return fail("email_not_configured", 503);
  }

  const { subject, text } = buildEmail(parsed.data);
  try {
    const result = await (deps.send ?? sendWithResend)({
      apiKey: env.RESEND_API_KEY!,
      from: env.CONTACT_FROM_EMAIL!,
      to: env.CONTACT_TO_EMAIL!,
      replyTo: parsed.data.email,
      subject,
      text,
    });
    if (!result.ok) return fail("send_failed", 502);
  } catch (error) {
    console.error(
      "[contact] Send threw:",
      error instanceof Error ? error.message : error,
    );
    return fail("send_failed", 502);
  }

  return json({ ok: true }, 200);
}
