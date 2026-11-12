import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import type { SavingsExample } from "@/content/types";
import { SavingsCalculator, type SavingsLabels } from "./SavingsCalculator";

interface SavingsProps {
  eyebrow: string;
  title: string;
  intro: string;
  labels: SavingsLabels;
  exampleCopy: string;
  footnote: string;
  example: SavingsExample;
}

export function Savings({
  eyebrow,
  title,
  intro,
  labels,
  exampleCopy,
  footnote,
  example,
}: SavingsProps) {
  return (
    <Section
      id="savings"
      tone="dark"
      eyebrow={eyebrow}
      title={title}
      intro={intro}
      // Rendered eagerly: contrast checkers can't see the dark background of a
      // content-visibility-skipped section and report false failures.
      deferRender={false}
    >
      <Reveal>
        <SavingsCalculator labels={labels} example={example} footnote={footnote} />
      </Reveal>
      <div className="mt-8 grid gap-4 text-body-sm text-muted lg:grid-cols-[2fr_1fr]">
        <p>{exampleCopy}</p>
        <p className="lg:text-right">
          <span className="text-label-md text-ink">Source: </span>
          {example.sourceNote}
        </p>
      </div>
    </Section>
  );
}
