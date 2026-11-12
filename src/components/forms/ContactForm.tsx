"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useForm, type FieldError, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import type { ContactRole, ContactRoleOption } from "@/content/types";
import {
  LIMITS,
  type ContactFieldName,
  type ContactResponse,
} from "@/lib/contact-constants";
import type { ContactData, ContactInput } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { RolePreselect } from "./RolePreselect";

export interface ContactFormCopy {
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successDetail: string;
  privacyNote: string;
}

interface ContactFormProps {
  roles: ContactRoleOption[];
  cities: string[];
  copy: ContactFormCopy;
  fallbackEmail: string;
}

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const EMPTY: ContactInput = {
  name: "",
  email: "",
  phone: "",
  role: "" as ContactInput["role"],
  city: "",
  message: "",
  website: "",
};

/**
 * The zod schema and resolver load on first validation (blur or submit), so
 * they stay out of the initial bundle. It is the same schema the API uses.
 */
let resolverPromise: Promise<Resolver<ContactInput, unknown, ContactData>> | undefined;
const lazyResolver: Resolver<ContactInput, unknown, ContactData> = async (
  values,
  context,
  options,
) => {
  resolverPromise ??= Promise.all([
    import("@hookform/resolvers/zod"),
    import("@/lib/contact-schema"),
  ]).then(([{ zodResolver }, { contactSchema }]) => zodResolver(contactSchema));
  const resolve = await resolverPromise;
  return resolve(values, context, options);
};

const inputClass =
  "block w-full rounded-lg border border-line-strong bg-bg px-4 text-body-md text-ink transition-[border-color,box-shadow] placeholder:text-subtle focus:border-brand focus:bg-surface focus:ring-2 focus:ring-brand/20 focus:outline-none aria-[invalid=true]:border-[#b42318] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#b42318]/15";

export function ContactForm({ roles, cities, copy, fallbackEmail }: ContactFormProps) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const successRef = useRef<HTMLDivElement>(null);
  const formId = useId();
  const cityListId = `${formId}-cities`;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: lazyResolver,
    defaultValues: EMPTY,
    mode: "onTouched",
  });

  const onRole = useCallback(
    (role: ContactRole) =>
      setValue("role", role, { shouldValidate: false, shouldDirty: true }),
    [setValue],
  );

  // Move focus to the confirmation so keyboard and screen reader users land on it.
  useEffect(() => {
    if (status.state === "success") successRef.current?.focus();
  }, [status.state]);

  const onSubmit = async (data: ContactData) => {
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, website: getValues("website") ?? "" }),
      });
      const body = (await res.json().catch(() => null)) as ContactResponse | null;
      if (body?.ok) {
        setStatus({ state: "success" });
        reset(EMPTY);
        return;
      }
      if (body && !body.ok) {
        if (body.fieldErrors) {
          for (const [field, messages] of Object.entries(body.fieldErrors)) {
            if (messages?.[0])
              setError(field as ContactFieldName, {
                type: "server",
                message: messages[0],
              });
          }
        }
        const message =
          body.error === "rate_limited" && body.retryAfter
            ? `${body.message} You can try again in about ${Math.ceil(body.retryAfter / 60)} minute${body.retryAfter > 60 ? "s" : ""}.`
            : body.message;
        setStatus({ state: "error", message });
        return;
      }
      setStatus({
        state: "error",
        message: `Something went wrong. Please try again, or email us at ${fallbackEmail}.`,
      });
    } catch {
      setStatus({
        state: "error",
        message: `You seem to be offline. Check your connection and try again, or email us at ${fallbackEmail}.`,
      });
    }
  };

  if (status.state === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 py-6 focus:outline-none"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-deep">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h3 className="text-display-sm text-ink">{copy.successTitle}</h3>
        <p className="text-body-md text-muted">{copy.successDetail}</p>
        <Button variant="secondary" onClick={() => setStatus({ state: "idle" })}>
          Send another request
        </Button>
      </div>
    );
  }

  const submitting = status.state === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-describedby={`${formId}-note`}
    >
      <Suspense fallback={null}>
        <RolePreselect onRole={onRole} />
      </Suspense>

      {status.state === "error" && (
        <div
          role="alert"
          className="mb-6 flex gap-3 rounded-lg border border-[#fecdca] bg-[#fef3f2] p-4 text-body-sm text-[#912018]"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>{status.message}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${formId}-name`} label="Name" error={errors.name}>
          <input
            id={`${formId}-name`}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name.max}
            className={cn(inputClass, "h-12")}
            {...register("name")}
            {...a11y(`${formId}-name`, errors.name)}
          />
        </Field>
        <Field id={`${formId}-email`} label="Email" error={errors.email}>
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email.max}
            className={cn(inputClass, "h-12")}
            {...register("email")}
            {...a11y(`${formId}-email`, errors.email)}
          />
        </Field>
        <Field id={`${formId}-phone`} label="Phone" optional error={errors.phone}>
          <input
            id={`${formId}-phone`}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+92 300 1234567"
            maxLength={LIMITS.phone.max}
            className={cn(inputClass, "h-12")}
            {...register("phone")}
            {...a11y(`${formId}-phone`, errors.phone)}
          />
        </Field>
        <Field id={`${formId}-role`} label="I am a" error={errors.role}>
          <select
            id={`${formId}-role`}
            className={cn(
              inputClass,
              "h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
            )}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235b6661' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
            {...register("role")}
            {...a11y(`${formId}-role`, errors.role)}
          >
            <option value="" disabled>
              Select one
            </option>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id={`${formId}-city`}
          label="City"
          error={errors.city}
          className="sm:col-span-2"
        >
          <input
            id={`${formId}-city`}
            type="text"
            autoComplete="address-level2"
            list={cityListId}
            placeholder="Lahore"
            maxLength={LIMITS.city.max}
            className={cn(inputClass, "h-12")}
            {...register("city")}
            {...a11y(`${formId}-city`, errors.city)}
          />
          <datalist id={cityListId}>
            {cities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </Field>
        <Field
          id={`${formId}-message`}
          label="Message"
          error={errors.message}
          className="sm:col-span-2"
        >
          <textarea
            id={`${formId}-message`}
            rows={5}
            maxLength={LIMITS.message.max}
            placeholder="Tell us about your business, or what you'd like to use MetroMatrix for."
            className={cn(inputClass, "resize-y py-3 leading-relaxed")}
            {...register("message")}
            {...a11y(`${formId}-message`, errors.message)}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${formId}-note`} className="text-caption text-muted sm:max-w-xs">
          {copy.privacyNote}
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          aria-disabled={submitting}
          leading={
            submitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : undefined
          }
        >
          {submitting ? copy.submittingLabel : copy.submitLabel}
        </Button>
      </div>
    </form>
  );
}

function a11y(id: string, error?: FieldError) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

function Field({
  id,
  label,
  optional = false,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: FieldError;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-label-md text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error?.message && (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1.5 text-body-sm text-[#b42318]"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error.message}
        </p>
      )}
    </div>
  );
}
