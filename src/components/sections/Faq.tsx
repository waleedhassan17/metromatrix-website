import { Section } from "@/components/layout/Section";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Accordion } from "@/components/ui/Accordion";
import type { FaqItem } from "@/content/types";

interface FaqProps {
  eyebrow: string;
  title: string;
  intro: string;
  items: FaqItem[];
}

export function Faq({ eyebrow, title, intro, items }: FaqProps) {
  return (
    <Section id="faq" labelledBy="faq-title" tone="sand">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionIntro id="faq-title" overline={eyebrow} title={title} intro={intro} />
        </div>
        <Accordion
          items={items.map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
        />
      </div>
    </Section>
  );
}
