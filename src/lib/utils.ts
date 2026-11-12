/**
 * Join class names, skipping falsy values. Deliberately tiny: the project
 * avoids conflicting utility classes instead of pulling in tailwind-merge.
 */
export function cn(...classes: Array<string | false | null | undefined | 0>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Literal class names for service color scoping. Tailwind only generates
 * classes it can find verbatim in source, so never build these with templates.
 */
export const toneClass = {
  food: "service-food",
  health: "service-health",
  shop: "service-shop",
  brand: "service-brand",
} as const;
