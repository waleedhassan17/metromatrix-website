"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
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

  // One pill that slides to the active link instead of each link lighting up
  // on its own. Positioned from the link's box; read only when `active` changes.
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const el = active ? linkRefs.current[active] : null;
    if (!el) {
      pill.style.opacity = "0";
      return;
    }
    const wasHidden = pill.style.opacity !== "1";
    if (wasHidden) pill.style.transition = "none";
    pill.style.width = `${el.offsetWidth}px`;
    // The link is positioned inside its <li>; measure the <li> against the list.
    const item = (el.parentElement ?? el) as HTMLElement;
    pill.style.transform = `translateX(${item.offsetLeft}px)`;
    pill.style.opacity = "1";
    if (wasHidden) {
      void pill.offsetWidth; // apply the jump before re-enabling the slide
      pill.style.transition = "";
    }
  }, [active]);

  const resolveHref = useCallback(
    (href: NavLink["href"]) => (href.startsWith("#") && !onHome ? `/${href}` : href),
    [onHome],
  );

  return (
    <>
      <header
        data-theme={dark ? "dark" : undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
          dark
            ? scrolled
              ? "border-white/10 bg-[#0f1a17]/85 backdrop-blur-md"
              : "border-transparent bg-transparent"
            : "border-line bg-[#fafaf7]/90 shadow-[0_10px_30px_-24px_rgb(15_26_23/0.45)] backdrop-blur-md",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6 sm:h-[72px]">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md"
            aria-label={`${siteName} home`}
          >
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
            <ul className="relative flex items-center gap-1">
              <span
                ref={pillRef}
                aria-hidden="true"
                style={{ opacity: 0 }}
                className={cn(
                  "absolute top-0 left-0 h-10 rounded-full transition-[transform,width,opacity,background-color] duration-300 ease-out-soft",
                  dark ? "bg-white/10" : "bg-brand-soft",
                )}
              />
              {links.map((link) => {
                const id = link.href.replace(/^\/?#/, "");
                const isActive = active === id;
                return (
                  <li key={link.href} className="relative">
                    <Link
                      ref={(el) => {
                        linkRefs.current[id] = el;
                      }}
                      href={resolveHref(link.href)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "inline-flex h-10 items-center rounded-full px-3.5 text-label-md transition-colors duration-(--dur-base)",
                        dark
                          ? isActive
                            ? "text-white"
                            : "text-white/75 hover:text-white"
                          : isActive
                            ? "text-brand-deep"
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
            <div className="hidden sm:block">
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
