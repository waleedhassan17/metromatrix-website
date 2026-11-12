import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contactRateLimiter, handleContact } from "./contact-handler";
import { contactSchema, parseRole, stripHtml } from "./contact-schema";
import { clientIp, createRateLimiter } from "./rate-limit";

const valid = {
  name: "Ayesha Khan",
  email: "ayesha@example.com",
  phone: "+92 300 1234567",
  role: "restaurant",
  city: "Lahore",
  message: "We run a karahi place in Gulberg and want to list it.",
  website: "",
};

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("contact schema", () => {
  it("accepts a valid submission and strips HTML", () => {
    const r = contactSchema.parse({
      ...valid,
      name: "<b>Ayesha</b> Khan",
      message: "<script>x</script>Hello there team!",
    });
    expect(r.name).toBe("Ayesha Khan");
    expect(r.message).toBe("xHello there team!");
  });

  it("allows an empty phone and rejects a malformed one", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: undefined }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
  });

  it("rejects unknown roles, bad emails and over-long fields", () => {
    expect(contactSchema.safeParse({ ...valid, role: "hacker" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, name: "x".repeat(81) }).success).toBe(
      false,
    );
    expect(contactSchema.safeParse({ ...valid, message: "short" }).success).toBe(false);
  });

  it("collapses whitespace and newlines in single-line fields", () => {
    expect(stripHtml("  Ayesha\r\nKhan  ")).toBe("Ayesha Khan");
    expect(stripHtml("a\n\n\n\nb", { multiline: true })).toBe("a\n\nb");
  });

  it("parses roles from URLs", () => {
    expect(parseRole("restaurant")).toBe("restaurant");
    expect(parseRole("DOCTOR")).toBe("doctor");
    expect(parseRole("partner")).toBeUndefined();
    expect(parseRole(null)).toBeUndefined();
  });
});

describe("rate limiter", () => {
  it("allows up to the limit, then blocks until the window passes", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.check("a", 0).allowed).toBe(true);
    expect(rl.check("a", 10).allowed).toBe(true);
    const blocked = rl.check("a", 20);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBe(1);
    expect(rl.check("b", 20).allowed).toBe(true);
    expect(rl.check("a", 1001).allowed).toBe(true);
  });

  it("reads the first forwarded IP", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe(
      "1.1.1.1",
    );
    expect(clientIp(new Headers({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("POST /api/contact", () => {
  const env = { ...process.env };
  beforeEach(() => {
    contactRateLimiter.reset();
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_TO_EMAIL = "team@example.com";
    process.env.CONTACT_FROM_EMAIL = "MetroMatrix <noreply@example.com>";
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    process.env = { ...env };
    vi.restoreAllMocks();
  });

  it("sends the email and returns ok", async () => {
    const send = vi.fn().mockResolvedValue({ ok: true });
    const res = await handleContact(post(valid), { send });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledOnce();
    const args = send.mock.calls[0]![0];
    expect(args.to).toBe("team@example.com");
    expect(args.replyTo).toBe("ayesha@example.com");
    expect(args.subject).toContain("Restaurant");
    expect(args.text).toContain("Gulberg");
  });

  it("rejects non-JSON requests", async () => {
    const res = await handleContact(
      post("name=x", { "content-type": "application/x-www-form-urlencoded" }),
    );
    expect(res.status).toBe(415);
  });

  it("rejects bodies over 10 KB", async () => {
    const res = await handleContact(post({ ...valid, message: "x".repeat(12_000) }));
    expect(res.status).toBe(413);
  });

  it("rejects invalid JSON", async () => {
    const res = await handleContact(post("{not json"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_json");
  });

  it("returns field errors on validation failure", async () => {
    const res = await handleContact(post({ ...valid, email: "bad", role: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("validation_error");
    expect(body.fieldErrors.email).toBeDefined();
    expect(body.fieldErrors.role).toBeDefined();
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const send = vi.fn();
    const res = await handleContact(post({ ...valid, website: "spam.example" }), {
      send,
    });
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("rate limits after five requests from one IP", async () => {
    const send = vi.fn().mockResolvedValue({ ok: true });
    for (let i = 0; i < 5; i++)
      expect((await handleContact(post(valid), { send })).status).toBe(200);
    const res = await handleContact(post(valid), { send });
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
    expect((await res.json()).error).toBe("rate_limited");
  });

  it("fails gracefully when no API key is set", async () => {
    delete process.env.RESEND_API_KEY;
    const send = vi.fn();
    const res = await handleContact(post(valid), { send });
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe("email_not_configured");
    expect(body.message).toMatch(/email us directly/i);
    expect(send).not.toHaveBeenCalled();
  });

  it("reports send failures", async () => {
    const res = await handleContact(post(valid), {
      send: vi.fn().mockResolvedValue({ ok: false }),
    });
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("send_failed");
    const thrown = await handleContact(post(valid), {
      send: vi.fn().mockRejectedValue(new Error("boom")),
    });
    expect(thrown.status).toBe(502);
  });
});
