"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Cta } from "@/content/types";
import { cn } from "@/lib/utils";

interface MobileCtaBarProps {
  cta: Cta;
  note: string;
  detail: string;
}

/**
 * Phones only, home page only: once the hero has scrolled away, a slim bar
 * keeps the main action one tap away. It steps aside while the contact form or
 * footer is on screen, so it never covers the form or the last links.
 * Visibility comes from IntersectionObserver, never from scroll math.
 */
export function MobileCtaBar({ cta, note, detail }: MobileCtaBarProps) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    const hero = document.getElementById("top");
    const contact = document.getElementById("contact");
    const footer = document.querySelector("footer");
    const watched = [hero, contact, footer].filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!hero) return;
    const inView = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) inView.set(e.target, e.isIntersecting);
      const heroOn = inView.get(hero) ?? true;
      const endOn = [contact, footer].some((el) => el && inView.get(el));
      setVisible(!heroOn && !endOn);
    });
    watched.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  if (!onHome) return null;

  return (
    <div
      data-theme="light"
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[#fafaf7]/92 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-24px_rgb(15_26_23/0.5)] backdrop-blur-md transition-transform duration-300 ease-out-soft sm:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0">
          <span className="block text-label-md text-ink">{note}</span>
          <span className="block truncate text-caption text-muted">{detail}</span>
        </p>
        <Button
          href={cta.href}
          size="md"
          trailing={<Icon name="arrow-right" className="size-4" />}
        >
          {cta.label}
        </Button>
      </div>
    </div>
  );
}
