"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds before the (first) element starts. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /**
   * Reveal the direct children one after another instead of the wrapper as a
   * whole. The number is the gap between children in seconds.
   */
  stagger?: boolean | number;
  /**
   * With `stagger`: which descendants to reveal, as a selector relative to the
   * wrapper (default: its direct children). E.g. ":scope ul > li".
   */
  targets?: string;
  as?: "div" | "li" | "ol" | "ul" | "section" | "span";
  /** Passed through for lists and landmarks. */
  "aria-label"?: string;
}

const EASE = "cubic-bezier(0.22, 0.8, 0.28, 1)";
const DEFAULT_STAGGER = 0.07;

/**
 * Fade/rise-in on scroll that never hides server-rendered content:
 * - SSR output is fully visible (no opacity:0 in the HTML), so no CLS and
 *   content stays readable if JS fails.
 * - Only elements that start below the viewport are hidden, and only after the
 *   IntersectionObserver's first report, so hydration never forces a layout.
 * - Sets data-reveal="pending" | "done" on the wrapper so CSS can draw lines
 *   and bars in step with the reveal (see .draw-line / .draw-bar).
 * - Honors prefers-reduced-motion by doing nothing.
 * Uses the Web Animations API, so it adds no animation library weight.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
  stagger = false,
  targets: targetSelector,
  as = "div",
  "aria-label": ariaLabel,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const setNode = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);
  const step = stagger === true ? DEFAULT_STAGGER : stagger || 0;

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof node.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = step
      ? (
          Array.from(
            targetSelector ? node.querySelectorAll(targetSelector) : node.children,
          ) as HTMLElement[]
        ).filter((c) => typeof c.animate === "function")
      : [node];
    const hidden = { opacity: 0, transform: `translateY(${y}px)` };
    const shown = { opacity: 1, transform: "translateY(0px)" };
    let holds: Animation[] = [];
    let first = true;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        if (first) {
          first = false;
          // Already on screen, or above it: leave it alone.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            observer.disconnect();
            return;
          }
          node.dataset.reveal = "pending";
          holds = targets.map((t) =>
            t.animate([hidden, hidden], { duration: 1, fill: "forwards" }),
          );
          return;
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();
        node.dataset.reveal = "done";
        targets.forEach((t, i) => {
          t.animate([hidden, shown], {
            duration: 600,
            delay: (delay + i * step) * 1000,
            easing: EASE,
            fill: "backwards",
          });
        });
        holds.forEach((h) => h.cancel());
        holds = [];
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      holds.forEach((h) => h.cancel());
    };
  }, [delay, y, step, targetSelector]);

  const Tag = as;
  return (
    <Tag ref={setNode} className={className} aria-label={ariaLabel}>
      {children}
    </Tag>
  );
}
