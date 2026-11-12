"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  /** Milliseconds. */
  duration?: number;
  className?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Tweens between values with requestAnimationFrame (no animation library).
 * Jumps straight to the value when the user prefers reduced motion.
 * Rendered text is aria-hidden by callers that provide a separate live region.
 */
export function AnimatedNumber({
  value,
  format,
  duration = 450,
  className,
}: AnimatedNumberProps) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    if (from === value) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min((now - start) / duration, 1);
      const next = from + (value - from) * easeOut(t);
      fromRef.current = next;
      setShown(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span className={className}>{format(shown)}</span>;
}
