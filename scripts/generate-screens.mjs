// Renders the iPhone screens in public/screens (iPhone 15, 393 × 852 pt, at 2×).
//  - home: the app's real home screen, rebuilt from its source (scripts/screens/home.mjs)
//  - food, health, shopping, rider: SVG mockups that mirror the app's screens,
//    using the photos the app ships with (scripts/screen-photos/CREDITS.md)
// Every screen carries the iOS status bar and home indicator (scripts/screens/ios.mjs).
//
// Run: npm run screens:generate   (sharp and next/og ship with Next.js; no extra dependency)
// Then delete .next/cache/images so a running server stops serving old copies.
import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { DEVICE, iosChromeSvg } from "./screens/ios.mjs";
import { renderHome } from "./screens/home.mjs";

const here = fileURLToPath(import.meta.url);
const root = path.join(path.dirname(here), "..");

// The SVG renderer finds Inter through a project-local fontconfig file. It must
// be set before the renderer starts, so the script re-runs itself with it.
if (!process.env.FONTCONFIG_FILE) {
  const r = spawnSync(process.execPath, [here, ...process.argv.slice(2)], {
    stdio: "inherit",
    env: {
      ...process.env,
      FONTCONFIG_FILE: path.join(root, "scripts", "fonts", "fonts.conf"),
    },
  });
  process.exit(r.status ?? 1);
}
const { default: sharp } = await import("sharp");

const W = DEVICE.width;
const H = DEVICE.height;
const S = 2; // export scale
const photoDir = path.join(root, "scripts", "screen-photos");
const outDir = path.join(root, "public", "screens");

const c = {
  bg: "#F6F7F5",
  white: "#FFFFFF",
  ink: "#111827",
  text: "#1F2937",
  muted: "#6B7280",
  line: "#E5E7EB",
  brand: "#117658",
  brandSoft: "#E3F4EC",
  food: "#C2185B",
  foodDeep: "#A81059",
  foodSoft: "#FCE4EF",
  health: "#1E6BE1",
  healthDeep: "#1757B8",
  healthSoft: "#E8F0FD",
  healthGround: "#F3F7FE",
  shop: "#C25200",
  shopDeep: "#A84500",
  shopSoft: "#FDEEE3",
  red: "#D32F2F",
};

// Inter stands in for SF Pro (the app uses the system font).
const FONT = `font-family="Inter, 'Noto Sans', 'DejaVu Sans', sans-serif"`;
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let uid = 0;
const nextId = (p) => `${p}${++uid}`;

/* ---------------- primitives ---------------- */

const text = (x, y, s, o = {}) => {
  const {
    size = 14,
    weight = 400,
    fill = c.text,
    anchor = "start",
    ls = 0,
    opacity = 1,
  } = o;
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" opacity="${opacity}" ${FONT}>${esc(s)}</text>`;
};
const rect = (x, y, w, h, fill, r = 0, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const circle = (cx, cy, r, fill, extra = "") =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;

const topRounded = (x, y, w, h, r) =>
  `M${x} ${y + h}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h}Z`;
const bottomRounded = (x, y, w, h, r) =>
  `M${x} ${y}H${x + w}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}Z`;

// Lucide icon paths (ISC licence), drawn on a 24px grid.
const ICONS = {
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  bell: ["M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9", "M10.3 21a1.94 1.94 0 0 0 3.4 0"],
  chevronLeft: ["m15 18-6-6 6-6"],
  chevronRight: ["m9 18 6-6-6-6"],
  chevronDown: ["m6 9 6 6 6-6"],
  heart: [
    "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
  ],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "m21 21-4.3-4.3"],
  bag: [
    "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
    "M3 6h18",
    "M16 10a4 4 0 0 1-8 0",
  ],
  pin: [
    "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",
    "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  ],
  phone: [
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  ],
  navigate: ["M3 11 22 2l-9 19-2-8-8-2Z"],
  home: ["M3 10 12 3l9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z", "M9 22V12h6v10"],
  receipt: [
    "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
    "M8 8h8",
    "M8 12h8",
    "M8 16h5",
  ],
  user: ["M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z", "M20 21a8 8 0 0 0-16 0"],
  calendar: [
    "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
    "M16 2v4",
    "M8 2v4",
    "M3 10h18",
  ],
  video: [
    "m22 8-6 4 6 4V8Z",
    "M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z",
  ],
  file: [
    "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
    "M14 2v4a2 2 0 0 0 2 2h4",
    "M9 13h6",
    "M9 17h6",
  ],
  check: ["M20 6 9 17l-5-5"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"],
  store: ["M3 9h18l-2-6H5Z", "M4 9v12h16V9", "M9 21v-6h6v6"],
  bowl: [
    "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z",
    "M7 21h10",
    "M9 8c0-1 1-2 1-3",
    "M14 8c0-1 1-2 1-3",
  ],
  flame: [
    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z",
  ],
  burger: [
    "M4 11a8 6 0 0 1 16 0Z",
    "M3 14h18",
    "M4 17h16a0 0 0 0 1 0 0 3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z",
  ],
  fries: ["M7 8 6 3", "M10 8V2", "M14 8V2", "M17 8l1-5", "M5 8h14l-2 13H7Z"],
  pizza: ["M12 2 2 20h20Z", "M9 13h.01", "M14 15h.01", "M12 9h.01"],
  baby: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M6 21v-2a6 6 0 0 1 12 0v2"],
  heartPulse: [
    "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
    "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",
  ],
  sparkle: ["M12 3 14 10 21 12 14 14 12 21 10 14 3 12 10 10Z"],
  stethoscope: [
    "M5 2v6a5 5 0 0 0 10 0V2",
    "M10 13v3a5 5 0 0 0 10 0v-2",
    "M20 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  bike: [
    "M5.5 21a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
    "M18.5 21a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
    "M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    "M12 17.5V14l-3-3 4-3 2 3h2",
  ],
  utensils: [
    "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",
    "M7 2v20",
    "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",
  ],
};

const icon = (name, x, y, size = 22, color = c.text, sw = 2, fill = "none") =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[
    name
  ]
    .map((d) => `<path d="${d}"/>`)
    .join("")}</g>`;

/** Load a photo, crop it to w×h (at export scale) and return an <image>, optionally clipped. */
async function photo(file, x, y, w, h, { r = 0, clip, position = "centre" } = {}) {
  const buf = await sharp(path.join(photoDir, file))
    .resize(Math.round(w * S), Math.round(h * S), { fit: "cover", position })
    .jpeg({ quality: 82 })
    .toBuffer();
  const href = `data:image/jpeg;base64,${buf.toString("base64")}`;
  const id = nextId("clip");
  const clipPath =
    clip ??
    `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  return `<clipPath id="${id}"><path d="${clipPath}"/></clipPath><image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" clip-path="url(#${id})"/>`;
}

/** Dark fade over the bottom of a photo so white text stays legible. */
const fade = (x, y, w, h, clip, strength = 0.72) => {
  const id = nextId("fade");
  const cid = nextId("fclip");
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${strength}"/></linearGradient></defs><clipPath id="${cid}"><path d="${clip}"/></clipPath><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})" clip-path="url(#${cid})"/>`;
};

const roundedPath = (x, y, w, h, r) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;

const shadowDefs = `<defs>
  <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="7" flood-color="#0F1A16" flood-opacity="0.09"/></filter>
  <filter id="shadowSm" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0F1A16" flood-opacity="0.08"/></filter>
</defs>`;

/** iOS status bar (time, signal, Wi-Fi, battery); the home indicator is added by svgDoc. */
const statusBar = (fill = "#000000") =>
  iosChromeSvg({ color: fill, indicator: "none" }).replace(
    /<rect[^>]*fill="none"\/>\s*$/,
    "",
  );

const chip = (
  x,
  y,
  label,
  { bg, color, size = 10, ls = 1.1, h = 22, padX = 10, dot } = {},
) => {
  const w = Math.round(label.length * size * 0.68 + padX * 2 + (dot ? 12 : 0));
  return {
    w,
    svg: `${rect(x, y, w, h, bg, h / 2)}${dot ? circle(x + padX + 3, y + h / 2, 3, dot) : ""}${text(x + padX + (dot ? 12 : 0), y + h / 2 + size * 0.36, label, { size, weight: 700, fill: color, ls })}`,
  };
};

const tabBar = (items, activeIndex, color, soft) => {
  const n = items.length;
  const slot = W / n;
  return `
    ${rect(0, H - 82, W, 82, c.white)}
    <line x1="0" y1="${H - 82}" x2="${W}" y2="${H - 82}" stroke="${c.line}"/>
    ${items
      .map(([label, ic], i) => {
        const cx = slot * i + slot / 2;
        const on = i === activeIndex;
        return `${on ? rect(cx - 26, H - 72, 52, 30, soft, 15) : ""}${icon(ic, cx - 11, H - 68, 22, on ? color : "#9CA3AF", 2)}${text(cx, H - 26, label, { size: 11, weight: on ? 700 : 500, fill: on ? color : "#9CA3AF", anchor: "middle" })}`;
      })
      .join("")}
  `;
};

const homeIndicator = (fill = "#000000") =>
  rect((W - 134) / 2, H - 8 - 5, 134, 5, fill, 2.5);

const svgDoc = (body, bg = c.white) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${shadowDefs}${rect(0, 0, W, H, bg)}${body}${homeIndicator()}</svg>`;

/* ---------------- screens ---------------- */

/** Food Court home: magenta header, cuisines, deals, popular dishes. */
async function food() {
  const hdr = 236;
  let body = `
    <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C2185B"/><stop offset="1" stop-color="#A81059"/></linearGradient></defs>
    <path d="${bottomRounded(0, 0, W, hdr, 28)}" fill="url(#fg)"/>
    ${statusBar(c.white)}
    ${icon("chevronLeft", 18, 70, 24, c.white, 2.4)}
    ${text(56, 89, "Food Court", { size: 25, weight: 700, fill: c.white })}
    ${icon("heart", 344, 70, 23, c.white, 2)}
    ${icon("pin", 22, 120, 16, c.white, 2.2, c.white)}
    ${text(44, 133, "Delivering to Home · Gulberg III", { size: 14, weight: 700, fill: c.white })}
    ${icon("chevronDown", 290, 122, 15, c.white, 2.6)}
    ${rect(20, 160, W - 40, 50, c.white, 25)}
    ${icon("search", 38, 175, 19, "#6B7280", 2.2)}
    ${text(66, 190, "Search dishes and restaurants", { size: 14, fill: "#9CA3AF" })}
    ${text(20, 276, "Cuisines", { size: 19, weight: 700, fill: c.ink })}
  `;
  const cuisines = [
    ["Pakistani", "bowl"],
    ["BBQ", "flame"],
    ["Fast food", "fries"],
    ["Burgers", "burger"],
    ["Pizza", "pizza"],
  ];
  cuisines.forEach(([label, ic], i) => {
    const cx = 52 + i * 82;
    body += circle(cx, 322, 31, c.foodSoft) + icon(ic, cx - 12, 310, 24, c.food, 2.2);
    body += text(cx, 374, label, { size: 12.5, fill: c.text, anchor: "middle" });
  });
  body += text(20, 418, "Deals near you", { size: 19, weight: 700, fill: c.ink });
  const deals = [
    {
      x: 20,
      photo: "food-biryani.jpg",
      ribbon: "10% off over Rs 500",
      mono: "BB",
      monoBg: "#B45309",
      name: "Biryani Bazaar",
      meta: "Pakistani · Biryani · BBQ",
      meta2: "27–37 min · Rs 99 delivery · 700 m",
    },
    {
      x: 272,
      photo: "food-pizza.jpg",
      ribbon: "Free delivery over Rs 1,500",
      mono: "ST",
      monoBg: "#C2410C",
      name: "Slice Theory",
      meta: "Pizza · Fast food",
      meta2: "29–39 min · Rs 99 delivery",
    },
  ];
  for (const d of deals) {
    const dw = 240;
    const dy = 434;
    const dh = 132;
    body += await photo(d.photo, d.x, dy, dw, dh, { r: 16 });
    body += chip(d.x + 10, dy + 10, d.ribbon, {
      bg: c.food,
      color: c.white,
      size: 9,
      h: 20,
      padX: 8,
      ls: 0.2,
    }).svg;
    body += rect(
      d.x + 10,
      dy + dh - 46,
      36,
      36,
      d.monoBg,
      9,
      `stroke="${c.white}" stroke-width="2"`,
    );
    body += text(d.x + 28, dy + dh - 22, d.mono, {
      size: 13,
      weight: 700,
      fill: c.white,
      anchor: "middle",
    });
    body += text(d.x, dy + dh + 24, d.name, { size: 15, weight: 700, fill: c.ink });
    body += text(d.x, dy + dh + 43, d.meta, { size: 12, fill: c.muted });
    body += text(d.x, dy + dh + 61, d.meta2, { size: 12, fill: c.muted });
  }
  body += text(20, 656, "Popular", { size: 19, weight: 700, fill: c.ink });
  const popular = [
    { x: 20, photo: "food-burger.jpg", name: "Classic Smash", price: "Rs 790" },
    { x: 140, photo: "food-shawarma.jpg", name: "Chicken Shawarma", price: "Rs 450" },
    { x: 260, photo: "service-food.jpg", name: "Loaded Fries", price: "Rs 520" },
  ];
  for (const p of popular) {
    body += await photo(p.photo, p.x, 668, 110, 54, { r: 12 });
    body += text(p.x, 739, p.name, { size: 11.5, weight: 700, fill: c.ink });
    body += text(p.x, 755, p.price, { size: 11, fill: c.muted });
  }
  body += tabBar(
    [
      ["Home", "home"],
      ["Orders", "receipt"],
      ["Profile", "user"],
    ],
    0,
    c.food,
    c.foodSoft,
  );
  return svgDoc(body, c.white);
}

/** Digital Health home: blue header, photo bento, next visit, specialties. */
async function health() {
  let body = `
    <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2F7BEA"/><stop offset="1" stop-color="#1757B8"/></linearGradient></defs>
    <path d="${bottomRounded(0, 0, W, 196, 26)}" fill="url(#hg)"/>
    ${statusBar(c.white)}
    ${icon("chevronLeft", 18, 66, 24, c.white, 2.4)}
    ${text(54, 85, "Digital Health", { size: 24, weight: 700, fill: c.white })}
    ${text(54, 105, "Hi! How can we help you today?", { size: 12.5, fill: "#DCE8FC" })}
    ${rect(306, 68, 64, 26, "rgba(255,255,255,0.18)", 13)}${icon("pin", 314, 74, 14, c.white, 2.2)}${text(332, 86, "Lahore", { size: 11.5, weight: 700, fill: c.white })}
    ${rect(20, 124, W - 40, 48, c.white, 24)}
    ${icon("search", 38, 138, 19, "#6B7280", 2.2)}
    ${text(66, 153, "Search doctors, specialties", { size: 14, fill: "#9CA3AF" })}
  `;
  // Photo bento: one tall card, two stacked cards.
  const top = 196;
  const bigW = 172;
  const bigH = 226;
  body += `<g filter="url(#shadow)">${rect(20, top, bigW, bigH, c.white, 20)}</g>`;
  body += await photo("health-video.jpg", 20, top, bigW, 150, {
    clip: topRounded(20, top, bigW, 150, 20),
  });
  body += icon("video", 34, top + 164, 20, c.health, 2.2);
  body += text(34, top + 202, "Video", { size: 16, weight: 700, fill: c.ink });
  body += text(34, top + 219, "consultation", { size: 16, weight: 700, fill: c.ink });
  const rx = 204;
  const rw = W - rx - 20;
  const rh = 105;
  for (const [i, card] of [
    { photo: "health-clinic.jpg", title: "Clinic visit", sub: "Book a slot" },
    { photo: "health-available.jpg", title: "Available today", sub: "Doctors free now" },
  ].entries()) {
    const ry = top + i * (rh + 16);
    const clip = roundedPath(rx, ry, rw, rh, 18);
    body += `<g filter="url(#shadow)">${rect(rx, ry, rw, rh, c.white, 18)}</g>`;
    body += await photo(card.photo, rx, ry, rw, rh, { clip });
    body += fade(rx, ry, rw, rh, clip, 0.75);
    body += text(rx + 12, ry + rh - 28, card.title, {
      size: 14,
      weight: 700,
      fill: c.white,
    });
    body += text(rx + 12, ry + rh - 12, card.sub, { size: 11, fill: "#E5E7EB" });
  }
  // Next visit
  const ny = top + bigH + 26;
  body += text(20, ny + 6, "Your next visit", { size: 17, weight: 700, fill: c.ink });
  body += text(W - 20, ny + 6, "All appointments", {
    size: 12,
    weight: 600,
    fill: c.health,
    anchor: "end",
  });
  body += `<g filter="url(#shadow)">${rect(20, ny + 20, W - 40, 118, c.health, 20)}</g>`;
  body +=
    circle(56, ny + 58, 22, "#DCE8FC") +
    text(56, ny + 64, "BA", {
      size: 14,
      weight: 700,
      fill: c.healthDeep,
      anchor: "middle",
    });
  body += text(90, ny + 54, "Dr. Bilal Ahmed", {
    size: 15.5,
    weight: 700,
    fill: c.white,
  });
  body += text(90, ny + 72, "Dermatologist · MBBS, FCPS", { size: 12, fill: "#DCE8FC" });
  body +=
    rect(260, ny + 40, 92, 22, "rgba(255,255,255,0.18)", 11) +
    icon("check", 268, ny + 45, 12, c.white, 3) +
    text(284, ny + 55, "PMDC verified", { size: 9.5, weight: 700, fill: c.white });
  body +=
    icon("calendar", 36, ny + 92, 15, "#DCE8FC", 2.2) +
    text(56, ny + 104, "Tue 17 Nov · 4:00 PM · Video consult", {
      size: 12,
      fill: c.white,
    });
  // Specialty grid
  const sy = ny + 168;
  body += text(20, sy, "Find by specialty", { size: 17, weight: 700, fill: c.ink });
  body += text(W - 20, sy, "See all", {
    size: 12,
    weight: 600,
    fill: c.health,
    anchor: "end",
  });
  const specs = [
    ["General", "stethoscope", "#E8F0FD", c.health],
    ["Skin", "sparkle", "#FCE7F3", "#BE185D"],
    ["Children", "baby", "#FEF3C7", "#B45309"],
    ["Heart", "heartPulse", "#FEE2E2", "#B91C1C"],
  ];
  specs.forEach(([label, ic, bg, col], i) => {
    const cx = 20 + i * 90;
    body += `<g filter="url(#shadowSm)">${rect(cx, sy + 14, 80, 82, c.white, 16)}</g>`;
    body += circle(cx + 40, sy + 44, 19, bg) + icon(ic, cx + 30, sy + 34, 20, col, 2.2);
    body += text(cx + 40, sy + 84, label, {
      size: 11.5,
      weight: 600,
      fill: c.text,
      anchor: "middle",
    });
  });
  body += tabBar(
    [
      ["Home", "home"],
      ["Visits", "calendar"],
      ["Records", "file"],
      ["Profile", "user"],
    ],
    0,
    c.health,
    c.healthSoft,
  );
  return svgDoc(body, c.healthGround);
}

/** Smart Shopping: mirrors the app's brand-store home. */
async function shopping() {
  let body = `
    <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C25200"/><stop offset="1" stop-color="#A84500"/></linearGradient></defs>
    <path d="${bottomRounded(0, 0, W, 186, 28)}" fill="url(#sg)"/>
    ${statusBar(c.white)}
    ${icon("chevronLeft", 18, 66, 24, c.white, 2.4)}
    ${text(56, 84, "Smart Shopping", { size: 24, weight: 700, fill: c.white })}
    ${text(56, 104, "Browse brands and stores", { size: 12.5, fill: "#FDE7D6" })}
    ${icon("search", 306, 66, 22, c.white, 2.4)}
    ${icon("bag", 346, 66, 22, c.white, 2.2)}
    ${rect(20, 122, W - 40, 50, c.white, 25)}
    ${icon("search", 38, 137, 19, "#6B7280", 2.2)}
    ${text(66, 152, "Search brands", { size: 15, fill: "#9CA3AF" })}
  `;
  // Banner carousel
  const by = 202;
  const bw = W - 64;
  const bh = 178;
  const bclip = roundedPath(20, by, bw, bh, 18);
  body += await photo("shop-lawn.jpg", 20, by, bw, bh, {
    clip: bclip,
    position: "attention",
  });
  body += fade(20, by, bw, bh, bclip, 0.75);
  body += text(38, by + bh - 40, "The new lawn is here", {
    size: 20,
    weight: 700,
    fill: c.white,
  });
  body += text(38, by + bh - 18, "Lawn & Loom · Summer ’26", {
    size: 13,
    fill: "#F3F4F6",
  });
  body += await photo("shop-lawn-2.jpg", 20 + bw + 10, by, 60, bh, { r: 18 });
  body += rect(W / 2 - 34, by + bh + 12, 24, 7, c.shop, 3.5);
  [0, 1, 2].forEach(
    (i) => (body += circle(W / 2 + 2 + i * 12, by + bh + 15.5, 3.5, "#D1D5DB")),
  );
  // Featured brands
  const fy = by + bh + 58;
  body += text(20, fy, "Featured brands", { size: 19, weight: 700, fill: c.ink });
  body += text(20, fy + 20, "2 top brands", { size: 12.5, fill: c.muted });
  [
    ["LL", "#7F1D3F", "Lawn & Loom"],
    ["UT", "#111827", "Urban Thread"],
  ].forEach(([mono, col, name], i) => {
    const cx = 56 + i * 92;
    body +=
      circle(cx, fy + 70, 34, c.white, `stroke="${col}" stroke-width="2.5"`) +
      circle(cx, fy + 70, 28, col);
    body += text(cx, fy + 76, mono, {
      size: 16,
      weight: 700,
      fill: c.white,
      anchor: "middle",
    });
    body += text(cx, fy + 124, name, { size: 12, fill: "#374151", anchor: "middle" });
  });
  // All brands card
  const ay = fy + 160;
  body += text(20, ay, "All brands", { size: 19, weight: 700, fill: c.ink });
  body += text(W - 20, ay, "3 brands", { size: 12.5, fill: c.muted, anchor: "end" });
  const cy = ay + 16;
  const cclip = roundedPath(20, cy, W - 40, 200, 20);
  body += await photo("shop-lawn-2.jpg", 20, cy, W - 40, 200, {
    clip: cclip,
    position: "attention",
  });
  body += fade(20, cy, W - 40, 200, cclip, 0.82);
  body += text(38, cy + 98, "Lawn & Loom", { size: 21, weight: 700, fill: c.white });
  body +=
    circle(198, cy + 91, 10, "#059669") + icon("check", 192, cy + 85, 12, c.white, 3);
  body += text(38, cy + 120, "Hand-finished eastern wear from Lahore", {
    size: 12.5,
    fill: "#F3F4F6",
  });
  body += text(38, cy + 140, "Started in a two-room studio in Gulberg.", {
    size: 11.5,
    fill: "#E5E7EB",
  });
  body += tabBar(
    [
      ["Home", "home"],
      ["Bag", "bag"],
      ["Saved", "heart"],
      ["Orders", "receipt"],
    ],
    0,
    c.shop,
    c.shopSoft,
  );
  return svgDoc(body, c.white);
}

/** Vendor rider view: a new delivery to accept. */
async function rider() {
  let body = `
    <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C2185B"/><stop offset="1" stop-color="#A81059"/></linearGradient></defs>
    <path d="${bottomRounded(0, 0, W, 128, 26)}" fill="url(#rg)"/>
    ${statusBar(c.white)}
    ${icon("chevronLeft", 18, 66, 24, c.white, 2.4)}
    ${text(56, 84, "FC-JM32W3", { size: 24, weight: 700, fill: c.white })}
    ${text(56, 104, "New delivery", { size: 13, fill: "#FCE4EF" })}
    ${rect(20, 150, W - 40, 72, "#FDF0F5", 16)}
    ${text(38, 178, "Collect in cash", { size: 12.5, fill: c.foodDeep })}
    ${text(38, 206, "Rs 879", { size: 22, weight: 700, fill: c.foodDeep })}
  `;
  // Stylised map
  const my = 236;
  const mh = 200;
  const mclip = roundedPath(20, my, W - 40, mh, 16);
  const mid = nextId("map");
  body += `<clipPath id="${mid}"><path d="${mclip}"/></clipPath><g clip-path="url(#${mid})">`;
  body += rect(20, my, W - 40, mh, "#EEF0EC");
  const roads = [
    "M20 300 C 120 290, 220 320, 370 300",
    "M20 380 C 140 370, 240 395, 370 372",
    "M120 236 C 125 300, 110 360, 128 436",
    "M250 236 C 245 310, 262 360, 252 436",
    "M20 250 L 370 420",
  ];
  roads.forEach(
    (d) =>
      (body += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>`),
  );
  [
    "M60 236 L 70 436",
    "M190 236 L 182 436",
    "M320 236 L 330 436",
    "M20 340 L 370 330",
  ].forEach(
    (d) => (body += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="4"/>`),
  );
  body += `<path d="M252 270 C 230 320, 190 330, 152 384" fill="none" stroke="${c.food}" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>`;
  body += text(150, my + 60, "GULBERG", {
    size: 9.5,
    weight: 700,
    fill: "#6B7280",
    ls: 1.5,
  });
  body += text(276, my + 30, "Lahore Cantt", { size: 12, fill: "#374151" });
  body += `</g>`;
  body += circle(252, 270, 15, c.ink) + icon("home", 244, 262, 16, c.white, 2.2);
  body +=
    circle(152, 384, 17, c.food, `stroke="${c.white}" stroke-width="3"`) +
    icon("bike", 143, 375, 18, c.white, 2);
  body +=
    circle(186, 376, 15, c.foodDeep, `stroke="${c.white}" stroke-width="3"`) +
    icon("utensils", 179, 369, 14, c.white, 2.2);
  // Pickup / drop-off cards
  const stop = (y, label, name, lines, ic, extra) => `
    <g filter="url(#shadowSm)">${rect(20, y, W - 40, extra ? 112 : 96, c.white, 16)}</g>
    ${icon(ic, 36, y + 38, 20, c.food, 2)}
    ${text(70, y + 26, label, { size: 12, fill: c.muted })}
    ${text(70, y + 47, name, { size: 15, weight: 700, fill: c.ink })}
    ${lines.map((l, i) => text(70, y + 67 + i * 17, l, { size: 12, fill: "#4B5563" })).join("")}
    ${extra ? text(70, y + 101, extra, { size: 12, weight: 600, fill: "#059669" }) : ""}
    ${icon("phone", 300, y + 34, 20, c.text, 2)}${icon("navigate", 338, y + 34, 20, c.text, 2)}
  `;
  body += stop(
    452,
    "Collect from",
    "Smash Theory Burgers",
    ["Kitchen 12, Commercial Area (demo)", "Cavalry Ground"],
    "store",
    "Ready since 5:39 PM",
  );
  body += stop(
    578,
    "Deliver to",
    "Ayesha Khan",
    ["House 12, Street 4, Gulberg II"],
    "pin",
  );
  body += rect(20, 694, W - 40, 54, c.food, 27);
  body += text(W / 2, 727, "Accept delivery", {
    size: 16,
    weight: 700,
    fill: c.white,
    anchor: "middle",
  });
  body += text(W / 2, 790, "Hand it back", {
    size: 15,
    weight: 700,
    fill: c.foodDeep,
    anchor: "middle",
  });
  return svgDoc(body, "#FAFAFA");
}

/* ---------------- render ---------------- */

const screens = { food, health, shopping, rider };

await mkdir(outDir, { recursive: true });

const homePng = await renderHome({ root, scale: S });
await writeFile(path.join(outDir, "home.png"), homePng);
console.log(
  `wrote home.png (${W * S}x${H * S}, ${(homePng.length / 1024).toFixed(0)} KB)`,
);

for (const [name, build] of Object.entries(screens)) {
  const svg = await build();
  const png = await sharp(Buffer.from(svg), { density: 72 * S })
    .resize(W * S, H * S)
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  await writeFile(path.join(outDir, `${name}.png`), png);
  console.log(
    `wrote ${name}.png (${W * S}x${H * S}, ${(png.length / 1024).toFixed(0)} KB)`,
  );
}
