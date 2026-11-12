import { cn } from "@/lib/utils";

interface LogoMarkProps {
  /** Rendered size in px (width and height). */
  size?: number;
  /** `light` for light grounds (green hub tile), `dark` for ink grounds (white hub tile). */
  variant?: "light" | "dark";
  className?: string;
  /** Accessible label; pass an empty string to mark decorative. */
  title?: string;
}

/** The official MetroMatrix mark: four service tiles, the M tile as the hub. */
export function LogoMark({
  size = 32,
  variant = "light",
  className,
  title = "MetroMatrix",
}: LogoMarkProps) {
  const decorative = title === "";
  const dark = variant === "dark";
  return (
    <svg
      viewBox="0 0 76 76"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
    >
      <rect x="0" y="0" width="34" height="34" rx="8" fill="#C25200" />
      <rect x="42" y="0" width="34" height="34" rx="8" fill="#A8105A" />
      <rect x="0" y="42" width="34" height="34" rx="8" fill="#1E6BE1" />
      <rect
        x="42"
        y="42"
        width="34"
        height="34"
        rx="8"
        fill={dark ? "#FFFFFF" : "#057857"}
      />
      <path
        d="M49 68.5 L49 49.5 L59 59.5 L69 49.5 L69 68.5"
        fill="none"
        stroke={dark ? "#057857" : "#FFFFFF"}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
