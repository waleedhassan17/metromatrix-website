import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import type { NavLink, SocialLink } from "@/content/types";
import { Container } from "./Container";

interface FooterProps {
  siteName: string;
  positioning: string;
  brandLine: string;
  navLinks: NavLink[];
  legalLinks: NavLink[];
  socials: SocialLink[];
  company: { name: string; url: string; sibling: string };
  productOf: string;
  rights: string;
  columns: { product: string; company: string; legal: string };
  contactEmail: string;
  year: number;
}

const linkClass = "text-body-sm text-white/65 transition-colors hover:text-white";

/** Ink footer. Every link goes somewhere real. */
export function Footer({
  siteName,
  positioning,
  brandLine,
  navLinks,
  legalLinks,
  socials,
  company,
  productOf,
  rights,
  columns,
  contactEmail,
  year,
}: FooterProps) {
  return (
    <footer data-theme="dark" className="bg-bg text-ink">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo variant="dark" height={28} title={siteName} />
            <p className="mt-6 text-h4 text-white">{brandLine}</p>
            <p className="mt-2 text-body-sm text-white/65">{positioning}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-overline text-white/50 uppercase">{columns.product}</h2>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-overline text-white/50 uppercase">{columns.company}</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {company.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <Link href="/#contact" className={linkClass}>
                  Contact
                </Link>
              </li>
              <li>
                <a href={`mailto:${contactEmail}`} className={linkClass}>
                  {contactEmail}
                </a>
              </li>
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-overline text-white/50 uppercase">{columns.legal}</h2>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-body-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {siteName} is {productOf.toLowerCase()}{" "}
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              {company.name}
            </a>
            , the team behind {company.sibling}.
          </p>
          <p>
            © {year} {company.name}. {rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
