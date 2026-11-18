import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SnapRow } from "@/components/ui/SnapRow";
import type { PlatformFeature, Service } from "@/content/types";
import { cn, toneClass } from "@/lib/utils";

interface ServicesProps {
  eyebrow: string;
  title: string;
  intro: string;
  services: Service[];
  platform: PlatformFeature[];
}

const badgeTone = { food: "food", health: "health", shop: "shop" } as const;

/**
 * Phones: a swipe row of portrait cards. Tablets: one wide card per row, photo
 * on the left. Desktop: three portrait cards side by side.
 */
export function Services({ eyebrow, title, intro, services, platform }: ServicesProps) {
  const cards = services.map((s) => (
    <Card
      key={s.id}
      as="article"
      padding="none"
      className={cn(
        toneClass[s.id],
        "group flex w-full flex-col overflow-hidden sm:flex-row lg:flex-col",
      )}
    >
      <div className="relative aspect-[16/8] overflow-hidden bg-sand sm:aspect-auto sm:w-[40%] sm:shrink-0 lg:aspect-[16/8] lg:w-auto">
        <Image
          src={s.photo.src}
          alt={s.photo.alt}
          width={s.photo.width}
          height={s.photo.height}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 40vw, 84vw"
          style={{ objectPosition: s.photo.focus }}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out-soft motion-safe:group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3">
          <Badge tone={badgeTone[s.id]} dot className="bg-white">
            Live
          </Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--service) text-white">
            <Icon name={s.icon} className="size-[18px]" />
          </span>
          <h3 className="text-h3 text-ink">{s.name}</h3>
        </div>
        <p className="mt-4 text-label-lg text-(--service-text)">{s.brandLine}</p>
        <p className="mt-2 max-w-[60ch] text-body-md text-muted">{s.description}</p>
        <ul className="mt-5 grid gap-2.5 border-t border-line pt-5 text-body-sm text-ink md:grid-cols-2 md:gap-x-6 lg:grid-cols-1">
          {s.features.map((f) => (
            <li key={f} className="check-item">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  ));

  return (
    <Section id="services" eyebrow={eyebrow} title={title} intro={intro}>
      <Reveal stagger targets=":scope ul > li">
        <SnapRow
          label="Services"
          items={cards}
          keys={services.map((s) => s.id)}
          gridClassName="sm:grid-cols-1 lg:grid-cols-3"
        />
      </Reveal>

      <div className="mt-16 border-t border-line pt-10">
        <h3 className="text-label-md text-muted">Shared across every service</h3>
        <Reveal as="ul" stagger className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {platform.map((f) => (
            <li key={f.title} className="flex gap-4">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand">
                <Icon name={f.icon} className="size-[18px]" />
              </span>
              <span>
                <span className="block text-h4 text-ink">{f.title}</span>
                <span className="mt-1 block text-body-sm text-muted">{f.detail}</span>
              </span>
            </li>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
