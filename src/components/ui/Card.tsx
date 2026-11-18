import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Lift slightly on hover (for cards that are links). */
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  /** Emphasise with a 2px ring in the scoped service colour (--service). */
  accent?: boolean;
}

const pads = { none: "", sm: "p-5", md: "p-6", lg: "p-6 sm:p-8" } as const;

/** White card on the ivory canvas: hairline border, the one card shadow. */
export function Card({
  as,
  children,
  className,
  interactive = false,
  padding = "md",
  accent = false,
}: CardProps) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={cn(
        "rounded-(--radius-card) border bg-surface shadow-card",
        accent ? "border-(--service) ring-1 ring-(--service)" : "border-line",
        pads[padding],
        // Actionable cards lift 2px with a deeper shadow; keyboard focus inside
        // the card gets the same treatment as a pointer hover.
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-300 ease-out-soft focus-within:border-line-strong focus-within:shadow-card-hover hover:border-line-strong hover:shadow-card-hover motion-safe:focus-within:-translate-y-0.5 motion-safe:hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
