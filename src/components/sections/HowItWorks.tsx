import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import type { HowItWorksAudience } from "@/content/types";
import { HowItWorksToggle } from "./HowItWorksToggle";

interface HowItWorksProps {
  eyebrow: string;
  title: string;
  intro: string;
  audiences: HowItWorksAudience[];
}

export function HowItWorks({ eyebrow, title, intro, audiences }: HowItWorksProps) {
  return (
    <Section id="how-it-works" eyebrow={eyebrow} title={title} intro={intro}>
      {/* Steps rise in order and the connector draws (data-reveal on this wrapper). */}
      <Reveal stagger targets=":scope ol > li">
        <HowItWorksToggle audiences={audiences} />
      </Reveal>
    </Section>
  );
}
