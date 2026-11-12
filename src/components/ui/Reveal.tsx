"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  as?: "div" | "li" | "section" | "span";
}

const EASE = "cubic-bezier(0.22, 0.8, 0.28, 1)";

/**
 * Fade/slide-in on scroll that never hides server-rendered content:
 * - SSR output is fully visible (no opacity:0 in the HTML), so no CLS and
 *   content stays readable if JS fails.
 * - Only elements that start below the viewport are hidden, and only after the
 *   IntersectionObserver's first report, so hydration never forces a layout.
 * - Honors prefers-reduced-motion by doing nothing.
 * Uses the Web Animations API, so it adds no animation library weight.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const setNode = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof node.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hidden = { opacity: 0, transform: `translateY(${y}px)` };
    const shown = { opacity: 1, transform: "translateY(0px)" };
    let hold: Animation | null = null;
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
          hold = node.animate([hidden, hidden], { duration: 1, fill: "forwards" });
          return;
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();
        node.animate([hidden, shown], {
          duration: 600,
          delay: delay * 1000,
          easing: EASE,
          fill: "backwards",
        });
        hold?.cancel();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      hold?.cancel();
    };
  }, [delay, y]);

  const Tag = as;
  return (
    <Tag ref={setNode} className={className}>
      {children}
    </Tag>
  );
}
