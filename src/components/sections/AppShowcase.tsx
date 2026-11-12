import { Section } from "@/components/layout/Section";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import type { Service } from "@/content/types";
import { cn, toneClass } from "@/lib/utils";

interface AppShowcaseProps {
  title: string;
  intro: string;
  services: Service[];
}

/**
 * One iPhone per service. On phones the devices sit in a swipeable row that
 * scrolls inside its own region (never the page); from 768px they stand side
 * by side.
 */
export function AppShowcase({ title, intro, services }: AppShowcaseProps) {
  return (
    <Section id="app" eyebrow="The app" title={title} intro={intro} tone="sand">
      <div
        role="region"
        aria-label="App screens"
        tabIndex={0}
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
      >
        {services.map((s) => (
          <div
            key={s.id}
            className={cn(
              toneClass[s.id],
              "flex shrink-0 snap-center flex-col items-center",
            )}
          >
            <PhoneFrame
              image={s.screen}
              className="w-[232px] lg:w-[260px]"
              sizes="260px"
            />
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
        ))}
      </div>
    </Section>
  );
}
