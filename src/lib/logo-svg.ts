/**
 * The official MetroMatrix mark as SVG strings for generated images (icons,
 * OG image), where React components can't be used. Geometry matches the brand
 * kit and LogoMark.tsx: four 34-unit tiles, 8-unit gap, rx 8.
 */
const tiles = (hubFill: string, mStroke: string) =>
  `<rect x="0" y="0" width="34" height="34" rx="8" fill="#C25200"/><rect x="42" y="0" width="34" height="34" rx="8" fill="#A8105A"/><rect x="0" y="42" width="34" height="34" rx="8" fill="#1E6BE1"/><rect x="42" y="42" width="34" height="34" rx="8" fill="${hubFill}"/><path d="M49 68.5 L49 49.5 L59 59.5 L69 49.5 L69 68.5" fill="none" stroke="${mStroke}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;

/** The app icon (brand kit "app icon (LIGHT)" / "(DARK)"): mark on a rounded tile. */
export function appIconSvg({
  dark = false,
  rounded = true,
}: { dark?: boolean; rounded?: boolean } = {}): string {
  const bg = dark ? "#0F1A17" : "#FAFAF7";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="${bg}"/><g transform="translate(123 123) scale(3.5)">${dark ? tiles("#FFFFFF", "#057857") : tiles("#057857", "#FFFFFF")}</g></svg>`;
}

/** The mark alone, cropped to its tiles (for small favicons). */
export function logoMarkSvg({ dark = false }: { dark?: boolean } = {}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76">${dark ? tiles("#FFFFFF", "#057857") : tiles("#057857", "#FFFFFF")}</svg>`;
}

export const svgDataUri = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
