import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { navLinks, notFound } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container
      size="narrow"
      className="flex flex-col items-center py-24 text-center sm:py-32"
    >
      <LogoMark size={72} title="" />
      <p className="mt-8 text-overline text-brand-deep uppercase">{notFound.eyebrow}</p>
      <h1 className="mt-3 text-hero-md text-ink">{notFound.title}</h1>
      <p className="mt-4 max-w-md text-body-lg text-muted">{notFound.detail}</p>
      <div className="mt-8">
        <Button href="/" size="lg" leading={<Icon name="home" className="size-4" />}>
          {notFound.homeLabel}
        </Button>
      </div>
      <nav aria-label="Sections" className="mt-10">
        <ul className="flex flex-wrap justify-center gap-2">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={`/${l.href}`}
                className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-label-md text-ink hover:border-line-strong"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
