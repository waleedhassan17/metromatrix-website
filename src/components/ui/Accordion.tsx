"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Heading level wrapping each trigger, per the WAI-ARIA accordion pattern. */
  headingLevel?: 2 | 3 | 4;
  /** Allow several panels open at once. */
  multiple?: boolean;
  className?: string;
}

/**
 * WAI-ARIA accordion: each trigger is a <button> inside a heading with
 * aria-expanded / aria-controls; each panel is a region labelled by its
 * trigger. Collapsed panels are `inert` so their content is neither
 * focusable nor announced. Height animates with the grid-rows technique and
 * is disabled under prefers-reduced-motion by the global CSS guard.
 */
export function Accordion({
  items,
  headingLevel = 3,
  multiple = true,
  className,
}: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const baseId = useId();
  const Heading = `h${headingLevel}` as const;

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div
      className={cn(
        "divide-y divide-line rounded-(--radius-panel) border border-line bg-surface shadow-card",
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div key={item.id}>
            <Heading className="font-body">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full cursor-pointer items-center justify-between gap-6 px-5 py-5 text-left text-h4 text-ink sm:px-6"
              >
                <span>{item.title}</span>
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition-[transform,background-color,border-color] duration-300",
                    isOpen
                      ? "rotate-180 border-ink bg-ink text-ivory"
                      : "group-hover:bg-sand",
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out-soft",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl px-5 pr-14 pb-6 text-body-md text-muted sm:px-6">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
