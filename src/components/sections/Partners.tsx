import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import type { Cta, ImageAsset, PartnerAudience } from "@/content/types";
import { cn, toneClass } from "@/lib/utils";

interface PartnersProps {
  eyebrow: string;
  title: string;
  intro: string;
  partners: PartnerAudience[];
  otherApps: { title: string; detail: string; cta: Cta };
  riderShowcase: {
    eyebrow: string;
    title: string;
    detail: string;
    points: string[];
    screen: ImageAsset;
  };
}

export function Partners({
  eyebrow,
  title,
  intro,
  partners,
  otherApps,
  riderShowcase,
}: PartnersProps) {
  return (
    <Section id="partners" eyebrow={eyebrow} title={title} intro={intro}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p, i) => (
          <Reveal
            as="li"
            key={p.id}
            delay={(i % 3) * 0.06}
            className={cn(toneClass[p.tone], "flex")}
          >
            <Card interactive className="group relative flex w-full flex-col">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-(--service-soft) text-(--service-text)">
                <Icon name={p.icon} className="size-5" />
              </span>
              <h3 className="mt-5 text-h3 text-ink">{p.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{p.description}</p>
              <ul className="mt-5 space-y-2 text-body-sm text-ink">
                {p.points.map((pt) => (
                  <li key={pt} className="check-item">
                    {pt}
                  </li>
                ))}
              </ul>
              <Link
                href={p.cta.href}
                className="mt-auto inline-flex items-center gap-1.5 pt-6 text-label-md text-(--service-text) after:absolute after:inset-0 after:rounded-(--radius-card)"
              >
                {p.cta.label}
                <Icon
                  name="arrow-right"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Card>
          </Reveal>
        ))}
        <Reveal as="li" delay={0.12} className="flex">
          <div
            data-theme="dark"
            className="flex w-full flex-col justify-between rounded-(--radius-card) bg-bg p-6 text-ink"
          >
            <div>
              <h3 className="text-h3">{otherApps.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{otherApps.detail}</p>
            </div>
            <div className="mt-6">
              <Button
                href={otherApps.cta.href}
                size="sm"
                trailing={<Icon name="arrow-right" className="size-4" />}
              >
                {otherApps.cta.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </ul>

      <Reveal className="mt-16">
        <Card padding="none" className="overflow-hidden">
          <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
            <div className="max-w-xl">
              <p className="text-overline text-brand-deep uppercase">
                {riderShowcase.eyebrow}
              </p>
              <h3 className="mt-3 text-display-sm text-ink">{riderShowcase.title}</h3>
              <p className="mt-4 text-body-md text-muted">{riderShowcase.detail}</p>
              <ul className="mt-6 grid gap-3 text-body-sm text-ink sm:grid-cols-2">
                {riderShowcase.points.map((pt) => (
                  <li key={pt} className="check-item">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <PhoneFrame
              image={riderShowcase.screen}
              className="w-[232px] sm:w-[256px]"
              sizes="256px"
            />
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
