"use client";

import { useEffect, useState } from "react";

/**
 * Header state for a page with a dark hero: `scrolled` once the page moves,
 * `overHero` while the element with `heroId` still sits under the header.
 * Pages without that element report overHero = false. Uses an
 * IntersectionObserver and scrollY only, so it never forces a layout.
 */
export function useHeaderState(
  heroId: string,
  headerHeight = 72,
): { scrolled: boolean; overHero: boolean } {
  const [overHero, setOverHero] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) {
      const t = window.setTimeout(() => setOverHero(false), 0);
      return () => window.clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) setOverHero(entry.isIntersecting);
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId, headerHeight]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return { scrolled, overHero };
}

/**
 * Id of the section currently occupying the middle band of the viewport.
 * Sections are looked up by id; missing ids are ignored.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");
  useEffect(() => {
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        if (visible.size === 0) {
          setActive(null);
          return;
        }
        // Prefer the section that appears first in document order among visible ones.
        const ordered = elements.map((el) => el.id).filter((id) => visible.has(id));
        setActive(ordered[0] ?? null);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.5] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
  return active;
}

/** Matches a CSS media query; false during SSR. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}
