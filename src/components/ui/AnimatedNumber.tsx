"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  /** Milliseconds for a change of value. */
  duration?: number;
  /**
   * Count up from 0 the first time the number scrolls into view. Numbers that
   * are already on screen at load are left alone, so nothing flickers.
   */
  countUp?: boolean;
  className?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const COUNT_UP_MS = 1300;

/**
 * Tweens between values with requestAnimationFrame (no animation library).
 * The server renders the real value; motion only ever starts from it.
 * Jumps straight to the value when the user prefers reduced motion.
 * Rendered text is aria-hidden by callers that provide a separate live region.
 */
export function AnimatedNumber({
  value,
  format,
  duration = 450,
  countUp = false,
  className,
}: AnimatedNumberProps) {
  const [shown, setShown] = useState(value);
  const spanRef = useRef<HTMLSpanElement>(null);
  const fromRef = useRef(value);
  const valueRef = useRef(value);
  const frameRef = useRef(0);
  const waitingRef = useRef(false); // armed off-screen, waiting to count up

  const tween = useCallback((to: number, ms: number) => {
    cancelAnimationFrame(frameRef.current);
    const from = fromRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min((now - start) / ms, 1);
      const next = from + (to - from) * easeOut(t);
      fromRef.current = next;
      setShown(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  // Follow value changes (sliders).
  useEffect(() => {
    valueRef.current = value;
    if (waitingRef.current || fromRef.current === value) return;
    tween(value, duration);
  }, [value, duration, tween]);

  // Optional count-up on first view.
  useEffect(() => {
    const el = spanRef.current;
    if (!countUp || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        if (first) {
          first = false;
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            observer.disconnect();
            return;
          }
          waitingRef.current = true;
          fromRef.current = 0;
          setShown(0);
          return;
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();
        waitingRef.current = false;
        tween(valueRef.current, COUNT_UP_MS);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [countUp, tween]);

  return (
    <span ref={spanRef} className={className}>
      {format(shown)}
    </span>
  );
}
