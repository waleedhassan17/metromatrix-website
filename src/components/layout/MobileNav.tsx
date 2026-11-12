"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import type { Cta, NavLink } from "@/content/types";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  links: NavLink[];
  cta: Cta;
  siteName: string;
  /** Resolves a nav href for the current page ("#x" or "/#x"). */
  resolveHref: (href: NavLink["href"]) => string;
  /** The header is over the dark hero: draw the trigger in white. */
  dark?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible slide-in drawer: focus is trapped while open, Esc closes it,
 * focus returns to the trigger, body scroll is locked, and it auto-closes
 * when the viewport grows to the desktop breakpoint.
 */
export function MobileNav({
  links,
  cta,
  siteName,
  resolveHref,
  dark = false,
}: MobileNavProps) {
  const [requestedOpen, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const panelId = `mobile-menu-${id}`;
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // The drawer can never be open at desktop widths.
  const open = requestedOpen && !isDesktop;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const activeEl = document.activeElement;
      if (e.shiftKey && (activeEl === first || !panelRef.current.contains(activeEl))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      setOpen(false);
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        className={cn(
          "inline-flex size-11 cursor-pointer items-center justify-center rounded-full",
          dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-ink/5",
        )}
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      {/* Overlay */}
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer */}
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        data-theme="light"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col bg-[#fafaf7] text-[#0f1a17] shadow-2xl transition-transform duration-300 ease-out-soft",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#e4e7e2] px-4">
          <Logo height={22} title={siteName} />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full hover:bg-black/5"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={resolveHref(link.href)}
                  onClick={close}
                  className="block rounded-xl px-4 py-3 text-h4 hover:bg-black/5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-[#e4e7e2] p-4">
          <Button href={cta.href} fullWidth size="lg">
            {cta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
