import { Section } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import type { PlatformFeature } from "@/content/types";

interface TrustProps {
  eyebrow: string;
  title: string;
  intro: string;
  items: PlatformFeature[];
}

/** The rules the platform runs on. Statements of process only, no claims of scale. */
export function Trust({ eyebrow, title, intro, items }: TrustProps) {
  return (
    <Section id="trust" eyebrow={eyebrow} title={title} intro={intro} tone="sand">
      <ul className="grid overflow-hidden rounded-(--radius-panel) border border-line bg-surface shadow-card sm:grid-cols-2">
        {items.map((item, i) => (
          <li
            key={item.title}
            className={
              "flex gap-5 border-line p-6 sm:p-8 " +
              (i > 0 ? "border-t " : "") +
              (i === 1 ? "sm:border-t-0 " : "") +
              (i % 2 === 1 ? "sm:border-l" : "")
            }
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
              <Icon name={item.icon} className="size-5" />
            </span>
            <span>
              <h3 className="text-h3 text-ink">{item.title}</h3>
              <p className="mt-2 text-body-md text-muted">{item.detail}</p>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
