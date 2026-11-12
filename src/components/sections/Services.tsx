import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
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

export function Services({ eyebrow, title, intro, services, platform }: ServicesProps) {
  return (
    <Section id="services" eyebrow={eyebrow} title={title} intro={intro}>
      <ul className="grid gap-6 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal
            as="li"
            key={s.id}
            delay={i * 0.06}
            className={cn(toneClass[s.id], "flex")}
          >
            <Card
              as="article"
              padding="none"
              className="flex w-full flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/8] overflow-hidden bg-sand">
                <Image
                  src={s.photo.src}
                  alt={s.photo.alt}
                  width={s.photo.width}
                  height={s.photo.height}
                  sizes="(min-width: 1200px) 380px, (min-width: 768px) 33vw, 100vw"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3 left-3">
                  <Badge tone={badgeTone[s.id]} dot className="bg-white">
                    Live
                  </Badge>
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--service) text-white">
                    <Icon name={s.icon} className="size-[18px]" />
                  </span>
                  <h3 className="text-h3 text-ink">{s.name}</h3>
                </div>
                <p className="mt-4 text-label-lg text-(--service-text)">{s.brandLine}</p>
                <p className="mt-2 text-body-md text-muted">{s.description}</p>
                <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-body-sm text-ink">
                  {s.features.map((f) => (
                    <li key={f} className="check-item">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>

      <div className="mt-16 border-t border-line pt-10">
        <h3 className="text-label-md text-muted">Shared across every service</h3>
        <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        </ul>
      </div>
    </Section>
  );
}
