import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionIntroProps {
  /** Id for the section's aria-labelledby. */
  id: string;
  overline: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/**
 * Overline, heading and lede that open every section, so the rhythm between
 * them is set once. The heading is always an <h2>; the page's only <h1> is in
 * the hero.
 */
export function SectionIntro({
  id,
  overline,
  title,
  intro,
  align = "left",
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <p className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-overline text-brand-deep uppercase">
        {overline}
      </p>
      <h2
        id={id}
        className="mt-4 max-w-[760px] text-display-sm text-ink sm:text-display-md lg:text-display-lg"
      >
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-[640px] text-body-lg text-muted">{intro}</p>}
    </div>
  );
}
