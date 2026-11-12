import { cn } from "@/lib/utils";

interface LogoProps {
  /** `light` = METRO ink + MATRIX green; `dark` = METRO white + MATRIX mint. */
  variant?: "light" | "dark";
  /** Rendered height in px; width follows the lockup's proportions. */
  height?: number;
  className?: string;
  /** Alt text; pass "" when a parent link already names it. */
  title?: string;
}

const RATIO = 505.79 / 76;

/**
 * The official horizontal lockup from the brand kit, cropped to its artwork
 * (public/brand/logo-*.svg). Served as a cached file rather than inlined, so
 * the wordmark's outlines are not repeated in every page's HTML and script.
 */
export function Logo({
  variant = "light",
  height = 28,
  className,
  title = "MetroMatrix",
}: LogoProps) {
  return (
    // An SVG file: next/image would pass it through unoptimised anyway.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/logo-${variant}.svg`}
      alt={title}
      width={Math.round(height * RATIO)}
      height={height}
      className={cn("shrink-0", className)}
      decoding="async"
    />
  );
}
