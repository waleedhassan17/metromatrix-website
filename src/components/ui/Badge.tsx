import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "food" | "health" | "shop" | "outline";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  /** Status badges carry a dot (brand rule: tinted badge with a dot and a label). */
  dot?: boolean;
  className?: string;
  as?: "span" | "p" | "div";
}

const tones: Record<Tone, string> = {
  neutral: "bg-ink/6 text-ink",
  brand: "bg-brand-soft text-brand-deep",
  food: "bg-food-soft text-food-text",
  health: "bg-health-soft text-health-text",
  shop: "bg-shop-soft text-shop-text",
  outline: "border border-line-strong text-muted",
};

const dots: Record<Tone, string> = {
  neutral: "bg-ink",
  brand: "bg-brand",
  food: "bg-food",
  health: "bg-health",
  shop: "bg-shop",
  outline: "bg-muted",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className,
  as = "span",
}: BadgeProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("inline-flex size-1.5 rounded-full", dots[tone])}
          aria-hidden="true"
        />
      )}
      {children}
    </Tag>
  );
}
