"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { HowItWorksAudience } from "@/content/types";
import { cn } from "@/lib/utils";

interface HowItWorksToggleProps {
  audiences: HowItWorksAudience[];
}

export function HowItWorksToggle({ audiences }: HowItWorksToggleProps) {
  const [index, setIndex] = useState(0);
  const baseId = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (i: number) => {
    const next = (i + audiences.length) % audiences.length;
    setIndex(next);
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
        role="tablist"
        aria-label="Choose an audience"
        className="inline-flex rounded-full border border-line bg-surface p-1"
      >
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
              onClick={() => setIndex(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "cursor-pointer rounded-full px-5 py-2.5 text-label-md transition-colors",
                selected ? "bg-ink text-ivory" : "text-muted hover:text-ink",
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
            {/* connecting line */}
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[1.375rem] w-px bg-line lg:top-[1.375rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
            />
            {a.steps.map((step, n) => (
              <li
                key={step.title}
                className="relative flex gap-5 motion-safe:animate-[fade-in_0.45s_var(--ease-out-soft)_both] lg:flex-col lg:gap-4"
                style={{ animationDelay: `${n * 60}ms` }}
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
