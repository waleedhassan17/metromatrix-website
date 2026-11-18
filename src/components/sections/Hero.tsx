import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import type { Cta, ImageAsset, StoreBadge } from "@/content/types";

interface HeroProps {
  overline: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  proof: string[];
  storeBadges: StoreBadge[];
  screen: ImageAsset;
}

/**
 * The page's only <h1>, on the ink ground (Ink is 30% of the brand palette).
 * The device on the right shows the app's real home screen, unobstructed.
 */
export function Hero({
  overline,
  headline,
  headlineAccent,
  subheadline,
  primaryCta,
  secondaryCta,
  proof,
  storeBadges,
  screen,
}: HeroProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      data-theme="dark"
      className="relative bg-bg text-ink"
    >
      {/* Phones stack; tablets get copy beside a smaller device so the hero fits one
          screen; desktops give the device more room. Entrance is CSS-only (--i
          sets the order); the h1 is the LCP element and is never animated. */}
      <Container className="grid items-center gap-14 pt-[104px] pb-16 sm:pt-[128px] sm:pb-20 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 md:pt-[120px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-[152px] lg:pb-28">
        <div className="max-w-[640px]">
          <p className="inline-flex hero-enter items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-overline text-white/85 uppercase [--i:0]">
            <span
              className="inline-flex size-1.5 rounded-full bg-mint"
              aria-hidden="true"
            />
            {overline}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-hero-md text-white sm:text-hero-lg md:text-hero-md lg:text-hero-lg xl:text-hero-xl"
          >
            {headline} <span className="text-mint">{headlineAccent}</span>
          </h1>

          <p className="mt-6 max-w-[560px] hero-enter text-body-lg text-white/75 [--i:1]">
            {subheadline}
          </p>

          <div className="mt-9 flex hero-enter flex-col gap-3 [--i:2] sm:flex-row">
            <Button
              href={primaryCta.href}
              size="lg"
              trailing={<Icon name="arrow-right" className="size-4" />}
            >
              {primaryCta.label}
            </Button>
            <Button href={secondaryCta.href} size="lg" variant="secondary">
              {secondaryCta.label}
            </Button>
          </div>

          <ul
            className="mt-8 flex hero-enter flex-wrap gap-x-6 gap-y-2 text-body-sm text-white/80 [--i:3]"
            aria-label="Highlights"
          >
            {proof.map((p) => (
              <li key={p} className="check-item [--check:var(--color-mint)]">
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 hero-enter border-t border-white/10 pt-6 [--i:4]">
            <p className="text-caption text-white/60">Available soon on</p>
            <ul className="mt-3 flex flex-wrap gap-3" aria-label="App availability">
              {storeBadges.map((b) => (
                <li
                  key={b.store}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 px-3.5 py-2 text-white"
                >
                  <Icon name="smartphone" className="size-5 text-white/80" />
                  <span className="flex flex-col leading-tight">
                    <span className="text-label-md">{b.label}</span>
                    <span className="text-caption text-white/60">Coming soon</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex hero-device-enter justify-center lg:justify-end">
          {/* Not preloaded: on phones it sits below the headline, which is the LCP element. */}
          <PhoneFrame
            image={screen}
            className="w-[264px] sm:w-[300px] md:w-[248px] lg:w-[320px]"
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 248px, (min-width: 640px) 300px, 264px"
          />
        </div>
      </Container>
    </section>
  );
}
