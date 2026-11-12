"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import type { Cta, NavLink } from "@/content/types";
import { useActiveSection, useHeaderState } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

interface NavbarProps {
  links: NavLink[];
  cta: Cta;
  siteName: string;
}

/**
 * Fixed header. On the home page it sits transparent over the ink hero with the
 * dark lockup, and becomes the ivory bar once the hero has scrolled away.
 * Every other page gets the ivory bar from the first paint.
 */
export function Navbar({ links, cta, siteName }: NavbarProps) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const { scrolled, overHero } = useHeaderState("top");
  const dark = onHome && overHero;
  const sectionIds = links.map((l) => l.href.replace(/^\/?#/, ""));
  const active = useActiveSection(onHome ? sectionIds : []);

  const resolveHref = useCallback(
    (href: NavLink["href"]) => (href.startsWith("#") && !onHome ? `/${href}` : href),
    [onHome],
  );

  return (
    <>
      <header
        data-theme={dark ? "dark" : undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-300",
          dark
            ? scrolled
              ? "border-white/10 bg-[#0f1a17]/85 backdrop-blur-md"
              : "border-transparent bg-transparent"
            : "border-line bg-[#fafaf7]/90 backdrop-blur-md",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6 sm:h-[72px]">
          <Link href="/" className="rounded-md" aria-label={`${siteName} home`}>
            <Logo
              variant="dark"
              height={26}
              title=""
              className={dark ? "block" : "hidden"}
            />
            <Logo
              variant="light"
              height={26}
              title=""
              className={dark ? "hidden" : "block"}
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => {
                const id = link.href.replace(/^\/?#/, "");
                const isActive = active === id;
                return (
                  <li key={link.href}>
                    <Link
                      href={resolveHref(link.href)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "rounded-full px-3.5 py-2 text-label-md transition-colors",
                        dark
                          ? isActive
                            ? "bg-white/10 text-white"
                            : "text-white/75 hover:text-white"
                          : isActive
                            ? "bg-brand-soft text-brand-deep"
                            : "text-muted hover:text-ink",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <Button href={cta.href} size="sm">
                {cta.label}
              </Button>
            </div>
            <MobileNav
              links={links}
              cta={cta}
              siteName={siteName}
              resolveHref={resolveHref}
              dark={dark}
            />
          </div>
        </Container>
      </header>
      {/* The hero runs under the fixed header; other pages need its height reserved. */}
      {!onHome && <div aria-hidden="true" className="h-16 sm:h-[72px]" />}
    </>
  );
}
