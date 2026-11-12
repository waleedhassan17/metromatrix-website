// iOS 17 chrome for an iPhone 15 (393 × 852 pt): status bar centred on the
// Dynamic Island's line (island: 126 × 37 pt, 11 pt from the top) and the home
// indicator. Shared by the SVG screens and the next/og home screen.

export const DEVICE = { width: 393, height: 852, safeTop: 59, safeBottom: 34 };

const ISLAND_CENTER_Y = 11 + 37 / 2; // 29.5
const ICONS_W = 75; // signal 18 + 7 + wifi 16 + 7 + battery 27

/** Signal, Wi-Fi and battery glyphs as an SVG string (75 × 13), in `color`. */
export function statusIconsSvg(color) {
  const bars = [4.5, 7, 9.5, 12]
    .map(
      (h, i) =>
        `<rect x="${i * 5}" y="${12.5 - h}" width="3" height="${h}" rx="1" fill="${color}"/>`,
    )
    .join("");
  const wifi = `<g transform="translate(25 0.7)" fill="none" stroke="${color}" stroke-width="2.1" stroke-linecap="round">
    <path d="M1.3 5.1 A9.5 9.5 0 0 1 14.7 5.1"/><path d="M3.9 7.8 A5.8 5.8 0 0 1 12.1 7.8"/>
    <path d="M8 11.8 L5.9 9.7 A3 3 0 0 1 10.1 9.7 Z" fill="${color}" stroke="none"/></g>`;
  const battery = `<g transform="translate(48 0)">
    <rect x="0.5" y="0.5" width="24" height="12" rx="3.6" fill="none" stroke="${color}" stroke-opacity="0.35"/>
    <rect x="2.5" y="2.5" width="20" height="8" rx="2" fill="${color}"/>
    <rect x="25.6" y="4.5" width="1.6" height="4" rx="0.8" fill="${color}" fill-opacity="0.4"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ICONS_W}" height="13" viewBox="0 0 ${ICONS_W} 13">${bars}${wifi}${battery}</svg>`;
}

/** Placement of the status bar parts, in points. */
export const STATUS = {
  time: { centerX: 66.75, baselineY: ISLAND_CENTER_Y + 6.2, size: 17, weight: 600 },
  icons: {
    x: 259.5 + (133.5 - ICONS_W) / 2,
    y: ISLAND_CENTER_Y - 6.5,
    width: ICONS_W,
    height: 13,
  },
};

export const HOME_INDICATOR = { width: 134, height: 5, bottom: 8 };

/** Full status bar + home indicator as SVG markup for the SVG screens. */
export function iosChromeSvg({
  color = "#000000",
  indicator = "#000000",
  font = "Inter",
} = {}) {
  const icons = statusIconsSvg(color).replace(/^<svg[^>]*>|<\/svg>$/g, "");
  const { time } = STATUS;
  return `
    <text x="${time.centerX}" y="${time.baselineY}" font-family="${font}" font-size="${time.size}" font-weight="${time.weight}" fill="${color}" text-anchor="middle" letter-spacing="-0.2">9:41</text>
    <g transform="translate(${STATUS.icons.x} ${STATUS.icons.y})">${icons}</g>
    <rect x="${(DEVICE.width - HOME_INDICATOR.width) / 2}" y="${DEVICE.height - HOME_INDICATOR.bottom - HOME_INDICATOR.height}" width="${HOME_INDICATOR.width}" height="${HOME_INDICATOR.height}" rx="2.5" fill="${indicator}"/>
  `;
}
