import type { ReactNode } from "react";
import { Container } from "./Container";
import { SectionIntro } from "./SectionIntro";
import { cn } from "@/lib/utils";

export interface SectionProps {
  id: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  /** `default` ivory, `sand` the alternate band, `dark` the ink band. */
  tone?: "default" | "sand" | "dark";
  align?: "left" | "center";
  className?: string;
  containerClassName?: string;
  /** Set when the section renders its own heading; points aria-labelledby at it. */
  labelledBy?: string;
  /** Skip rendering work while off-screen (content-visibility: auto). */
  deferRender?: boolean;
}

/** Page section: consistent rhythm, an accessible heading block, a tone. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  tone = "default",
  align = "left",
  className,
  containerClassName,
  labelledBy,
  deferRender = true,
}: SectionProps) {
  const headingId = `${id}-title`;
  const hasHeading = Boolean(title);
  return (
    <section
      id={id}
      aria-labelledby={hasHeading ? headingId : labelledBy}
      data-theme={tone === "dark" ? "dark" : undefined}
      className={cn(
        "scroll-mt-20 py-(--spacing-section) lg:py-(--spacing-section-lg)",
        deferRender && "cv-auto",
        tone === "sand" && "bg-sand",
        tone === "dark" && "bg-bg text-ink",
        className,
      )}
    >
      <Container className={containerClassName}>
        {hasHeading && (
          <SectionIntro
            id={headingId}
            overline={eyebrow ?? ""}
            title={title}
            intro={intro}
            align={align}
            className="mb-12 sm:mb-14"
          />
        )}
        {children}
      </Container>
    </section>
  );
}
