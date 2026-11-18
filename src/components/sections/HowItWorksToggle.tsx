"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { HowItWorksAudience } from "@/content/types";
import { cn } from "@/lib/utils";

interface HowItWorksToggleProps {
  audiences: HowItWorksAudience[];
}

export function HowItWorksToggle({ audiences }: HowItWorksToggleProps) {
  const [index, setIndex] = useState(0);
  // Steps replay their entrance only after the visitor switches audience;
  // the first showing is handled by the section's scroll reveal.
  const [switched, setSwitched] = useState(false);
  const baseId = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const pillRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // The selected-tab background is one pill that slides between tabs.
  useEffect(() => {
    const pill = pillRef.current;
    const tab = tabs.current[index];
    if (!pill || !tab) return;
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.transform = `translateX(${tab.offsetLeft - 4}px)`;
    // Until the pill is placed, the selected tab paints its own ink background
    // (server render, no JS); from here the pill takes over.
    listRef.current?.setAttribute("data-ready", "");
  }, [index]);

  const select = (i: number) => {
    if (i !== index) setSwitched(true);
    setIndex(i);
  };

  const move = (i: number) => {
    const next = (i + audiences.length) % audiences.length;
    select(next);
    tabs.current[next]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(audiences.length - 1);
    }
  };

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        aria-label="Choose an audience"
        className="group/tabs relative inline-flex rounded-full border border-line bg-surface p-1"
      >
        <span
          ref={pillRef}
          aria-hidden="true"
          className="absolute top-1 left-1 h-11 w-0 rounded-full bg-ink opacity-0 transition-[transform,width] duration-300 ease-out-soft group-data-[ready]/tabs:opacity-100"
        />
        {audiences.map((a, i) => {
          const selected = i === index;
          return (
            <button
              key={a.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${a.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${a.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative inline-flex h-11 cursor-pointer items-center rounded-full px-5 text-label-md transition-colors duration-(--dur-base)",
                selected
                  ? "bg-ink text-ivory group-data-[ready]/tabs:bg-transparent"
                  : "text-muted hover:text-ink",
              )}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      {audiences.map((a, i) => (
        <div
          key={a.id}
          role="tabpanel"
          id={`${baseId}-panel-${a.id}`}
          aria-labelledby={`${baseId}-tab-${a.id}`}
          hidden={i !== index}
          className="mt-10"
        >
          <p className="max-w-2xl text-body-lg text-muted">{a.intro}</p>
          <ol className="relative mt-10 grid gap-6 lg:grid-cols-5 lg:gap-4">
            {/* Connecting line: draws in with the reveal (and again on switch). */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-0 bottom-0 left-[1.375rem] w-px draw-line bg-line-strong lg:top-[1.375rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto",
                switched &&
                  "motion-safe:animate-[draw-y_900ms_var(--ease-out-soft)_both] lg:motion-safe:animate-[draw-x_900ms_var(--ease-out-soft)_both]",
              )}
            />
            {a.steps.map((step, n) => (
              <li
                key={step.title}
                className={cn(
                  "relative flex gap-5 lg:flex-col lg:gap-4",
                  switched &&
                    "motion-safe:animate-[rise_500ms_var(--ease-out-soft)_both]",
                )}
                style={switched ? { animationDelay: `${120 + n * 70}ms` } : undefined}
              >
                <span className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-bg text-label-lg text-brand tabular-nums">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <div className="pb-2 lg:pr-4">
                  <h3 className="text-h4 text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-body-sm text-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
