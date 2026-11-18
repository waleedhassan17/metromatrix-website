import { Section } from "@/components/layout/Section";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SnapRow } from "@/components/ui/SnapRow";
import type { Service } from "@/content/types";
import { cn, toneClass } from "@/lib/utils";

interface AppShowcaseProps {
  title: string;
  intro: string;
  services: Service[];
}

/**
 * One iPhone per service. Phones swipe between the devices; from 768px they
 * stand side by side, the middle one raised so the row reads as composed.
 */
export function AppShowcase({ title, intro, services }: AppShowcaseProps) {
  const devices = services.map((s, i) => (
    <div
      key={s.id}
      className={cn(
        toneClass[s.id],
        "flex w-full flex-col items-center",
        i === 1 && "md:-translate-y-6",
      )}
    >
      <PhoneFrame image={s.screen} className="w-[232px] lg:w-[264px]" sizes="264px" />
      <p className="mt-6 flex items-center gap-2 text-h4 text-ink">
        <span
          className="inline-flex size-2 rounded-full bg-(--service)"
          aria-hidden="true"
        />
        {s.name}
      </p>
      <p className="mt-1 max-w-[260px] text-center text-body-sm text-muted">
        {s.tagline}
      </p>
    </div>
  ));

  return (
    <Section id="app" eyebrow="The app" title={title} intro={intro} tone="sand">
      <Reveal stagger={0.1} targets=":scope ul > li">
        <SnapRow
          label="App screens"
          items={devices}
          keys={services.map((s) => s.id)}
          until="md"
          gridClassName="md:grid-cols-3 md:pt-6"
        />
      </Reveal>
    </Section>
  );
}
