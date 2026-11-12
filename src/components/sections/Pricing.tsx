import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Plan, PricingContent } from "@/content/types";
import { formatNumber } from "@/lib/savings";
import { cn, toneClass } from "@/lib/utils";

interface PricingProps {
  content: PricingContent;
}

function price(plan: Plan): string {
  return plan.priceMax
    ? `${formatNumber(plan.price)}–${formatNumber(plan.priceMax)}`
    : formatNumber(plan.price);
}

export function Pricing({ content }: PricingProps) {
  return (
    <Section
      id="pricing"
      eyebrow={content.eyebrow}
      title={content.title}
      intro={content.intro}
      tone="sand"
    >
      <Reveal className="mb-10 rounded-(--radius-panel) bg-brand p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Icon name="sparkles" className="size-6" />
          </span>
          <div>
            <p className="text-display-sm">{content.launchBanner.title}</p>
            <p className="mt-1 max-w-2xl text-white/85">{content.launchBanner.detail}</p>
          </div>
        </div>
      </Reveal>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {content.plans.map((plan, i) => (
          <Reveal
            as="li"
            key={plan.id}
            delay={(i % 3) * 0.06}
            className={cn(toneClass[plan.tone], "flex")}
          >
            <Card
              className="relative flex w-full flex-col"
              padding="lg"
              accent={plan.highlighted}
            >
              <div className="flex items-start justify-between gap-3">
                <Badge tone={plan.tone === "brand" ? "brand" : plan.tone}>
                  {plan.audience}
                </Badge>
                {plan.highlighted && (
                  <span className="text-xs font-semibold text-(--service-text)">
                    {content.highlightLabel}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-h3">{plan.name}</h3>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-muted">PKR</span>
                <span className="font-heading text-4xl font-extrabold tracking-tight tabular-nums">
                  {price(plan)}
                </span>
                <span className="text-sm text-muted">/ month</span>
              </p>
              <p className="mt-1 text-xs font-semibold text-brand-deep">
                {content.disclaimer}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {plan.description}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="check-item">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <Button
                  href={plan.cta.href}
                  variant={plan.highlighted ? "primary" : "secondary"}
                  fullWidth
                  trailing={<Icon name="arrow-right" className="size-4" />}
                >
                  {plan.cta.label}
                </Button>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>

      <p className="mt-10 flex items-start gap-3 text-sm leading-relaxed text-muted">
        <Icon name="badge-check" className="mt-0.5 size-5 shrink-0 text-brand" />
        {content.founderNote}
      </p>
    </Section>
  );
}
