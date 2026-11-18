"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface SnapRowProps {
  /** Names the region for screen readers, e.g. "Services". */
  label: string;
  items: ReactNode[];
  /** Keys for the items (stable ids). */
  keys: string[];
  /** Width of the row breakpoint: below it the row swipes, from it the grid applies. */
  until?: "sm" | "md";
  /** Grid classes applied from the breakpoint up, e.g. "sm:grid-cols-2 lg:grid-cols-3". */
  gridClassName: string;
  /** Classes on every item (all widths). */
  itemClassName?: string;
  className?: string;
}

// Literal class sets so Tailwind can see them.
const LAYOUT = {
  sm: {
    list: "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 -mx-4 pb-1 sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0",
    item: "w-[84%] shrink-0 snap-start sm:w-auto",
    controls: "sm:hidden",
  },
  md: {
    list: "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 -mx-4 pb-1 sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:grid md:gap-6 md:overflow-visible md:px-0 md:pb-0",
    item: "shrink-0 snap-center md:w-auto",
    controls: "md:hidden",
  },
} as const;

/**
 * A row of cards that swipes on phones and becomes a normal grid from the
 * breakpoint up. The next card peeks in so the row reads as scrollable;
 * Previous/Next buttons and position dots give the same control without a
 * swipe, and arrow keys move one card at a time. Never autoplays.
 */
export function SnapRow({
  label,
  items,
  keys,
  until = "sm",
  gridClassName,
  itemClassName,
  className,
}: SnapRowProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [announce, setAnnounce] = useState("");
  const id = useId();
  const layout = LAYOUT[until];
  const count = items.length;

  // Track the card that is most in view (no scroll math, no forced layout).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.intersectionRatio);
        let best = -1;
        let bestRatio = 0;
        Array.from(list.children).forEach((child, i) => {
          const r = ratios.get(child) ?? 0;
          if (r > bestRatio + 0.01) {
            bestRatio = r;
            best = i;
          }
        });
        if (best >= 0) setActive(best);
      },
      { root: list, threshold: [0.25, 0.5, 0.75, 1] },
    );
    Array.from(list.children).forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [count]);

  const go = useCallback(
    (index: number) => {
      const list = listRef.current;
      if (!list) return;
      const next = Math.max(0, Math.min(count - 1, index));
      const child = list.children[next] as HTMLElement | undefined;
      const firstChild = list.children[0] as HTMLElement | undefined;
      if (!child || !firstChild) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      list.scrollTo({
        left: child.offsetLeft - firstChild.offsetLeft,
        behavior: reduce ? "auto" : "smooth",
      });
      setAnnounce(`${next + 1} of ${count}`);
    },
    [count],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  };

  const buttonClass =
    "inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-surface text-ink transition-[background-color,opacity] duration-(--dur-fast) hover:bg-sand disabled:cursor-default disabled:opacity-35";

  return (
    <div className={className}>
      {/* The region takes focus and arrow keys; the list inside stays a real list. */}
      <div
        role="region"
        aria-label={label}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="rounded-(--radius-card)"
      >
        <ul
          ref={listRef}
          id={`${id}-list`}
          className={cn("relative", layout.list, gridClassName)}
        >
          {items.map((item, i) => (
            <li key={keys[i]} className={cn("flex", layout.item, itemClassName)}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn("mt-5 flex items-center justify-between gap-4", layout.controls)}
      >
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {items.map((_, i) => (
            <span
              key={keys[i]}
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-(--dur-base)",
                i === active ? "w-5 bg-ink" : "w-1.5 bg-line-strong",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={buttonClass}
            onClick={() => go(active - 1)}
            disabled={active === 0}
            aria-controls={`${id}-list`}
            aria-label={`Previous (${label})`}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => go(active + 1)}
            disabled={active === count - 1}
            aria-controls={`${id}-list`}
            aria-label={`Next (${label})`}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </div>
  );
}
