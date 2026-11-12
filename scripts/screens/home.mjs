// The MetroMatrix customer home screen, rebuilt from the app's own code so the
// landing page shows the real screen on an iPhone:
//   ~/MetroMatrix_App/screens/customer-home-screen/CustomerHome.tsx
//   ~/MetroMatrix_App/Components/home/{HomeParts,ServiceCard,serviceCatalog}.tsx
//   ~/MetroMatrix_App/theme/{tokens,services,typography}.ts
// Values below are copied from those files. One deliberate edit for the
// marketing shot: the card photo is 124 pt (app: 160) and the gaps are a
// little tighter, so all three service cards sit fully above the home
// indicator on a 393 × 852 pt iPhone.
//
// Rendered with next/og (Satori + resvg, bundled with Next.js): flexbox and
// real text measurement, no browser needed. Inter stands in for SF Pro.
import { createElement as h } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { DEVICE, HOME_INDICATOR, STATUS, statusIconsSvg } from "./ios.mjs";

const T = {
  canvas: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceSunk: "#F1F5F9",
  ink: "#0F172A",
  inkMuted: "#475569",
  brand: "#047857",
  danger: "#B91C1C",
  scrim: "rgba(15, 23, 42, 0.62)",
  scrimClear: "rgba(15, 23, 42, 0)",
  neutral: { accentSoft: "#ECFDF5", accentDeep: "#065F46" },
  food: "#D90F66",
  health: "#1E6AE1",
  shop: "#C25100",
};

const ART = 124; // app: size.serviceArt = 160

const CARDS = [
  {
    photo: "service-food.jpg",
    title: "Food Court",
    category: "FOOD COURT",
    description: "Fast-food brands, restaurants and home kitchens from your city.",
    accent: T.food,
  },
  {
    photo: "service-health.jpg",
    title: "Digital Health",
    category: "MEDICAL",
    description: "Connect with certified doctors and manage health records seamlessly.",
    accent: T.health,
  },
  {
    photo: "service-shopping.jpg",
    title: "Smart Shopping",
    category: "RETAIL",
    description:
      "Explore the latest trends and everyday essentials delivered to your doorstep.",
    accent: T.shop,
  },
];

const svgUri = (svg) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

/** An Ionicons glyph (outline extracted from the app's icon font), centred in a size × size box. */
function ionIcon(glyphs, name, size, color) {
  const g = glyphs[name];
  const [x0, y0, x1, y1] = g.bounds;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  // The app renders icons at fontSize = size; the em box is 512 units.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${cx - 256} ${cy - 256} 512 512"><path d="${g.d}" fill="${color}"/></svg>`;
  return h("img", {
    src: svgUri(svg),
    width: size,
    height: size,
    style: { width: size, height: size, flexShrink: 0 },
  });
}

const text = (content, style) =>
  h("div", { style: { display: "flex", ...style } }, content);

const font = (size, lineHeight, weight, letterSpacing = 0) => ({
  fontSize: size,
  lineHeight: `${lineHeight}px`,
  fontWeight: weight,
  letterSpacing,
});

const TYPE = {
  logo: font(28, 34, 700),
  body: font(14, 20, 400),
  heading: font(22, 28, 700, -0.3),
  cardTitle: font(20, 26, 700),
  caption: font(12, 16, 400),
  chip: font(12, 16, 600),
  tag: font(10, 12, 700, 0.5),
  micro: font(11, 14, 600),
};

function dot(size, color, border) {
  return h("div", {
    style: {
      width: size,
      height: size,
      borderRadius: size,
      backgroundColor: color,
      ...(border ? { border: `1px solid ${border}` } : {}),
    },
  });
}

function badge(children, style) {
  return h(
    "div",
    {
      style: {
        position: "absolute",
        top: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 8,
        ...style,
      },
    },
    ...children,
  );
}

function card(c, photoUri, glyphs) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        backgroundColor: T.surface,
        boxShadow: "0px 3px 20px rgba(15, 23, 42, 0.07)",
        overflow: "hidden",
      },
    },
    // Photo panel
    h(
      "div",
      {
        style: {
          display: "flex",
          position: "relative",
          height: ART,
          backgroundColor: T.surfaceSunk,
        },
      },
      h("img", {
        src: photoUri,
        width: DEVICE.width - 40,
        height: ART,
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: DEVICE.width - 40,
          height: ART,
          objectFit: "cover",
        },
      }),
      h("div", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(to bottom, ${T.scrimClear} 0%, ${T.scrimClear} 35%, ${T.scrim} 100%)`,
        },
      }),
      badge([text(c.category, { ...TYPE.tag, color: T.inkMuted })], {
        left: 12,
        backgroundColor: T.surface,
        boxShadow: "0px 1px 4px rgba(15, 23, 42, 0.05)",
      }),
      badge([dot(6, "#FFFFFF"), text("OPEN NOW", { ...TYPE.tag, color: "#FFFFFF" })], {
        right: 12,
        backgroundColor: c.accent,
      }),
      text(c.title, {
        ...TYPE.cardTitle,
        color: "#FFFFFF",
        position: "absolute",
        left: 12,
        right: 16,
        bottom: 12,
      }),
    ),
    // Description and Explore
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingLeft: 14,
          paddingRight: 14,
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
      h(
        "div",
        {
          style: {
            display: "block",
            flex: 1,
            ...TYPE.caption,
            color: T.inkMuted,
            lineClamp: 2,
          },
        },
        c.description,
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 4,
            paddingLeft: 14,
            paddingRight: 14,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 20,
            backgroundColor: c.accent,
            flexShrink: 0,
          },
        },
        text("Explore", { ...TYPE.chip, color: "#FFFFFF" }),
        ionIcon(glyphs, "chevron-forward", 16, "#FFFFFF"),
      ),
    ),
  );
}

const SCALED = new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "gap",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingBottom",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marginBottom",
  "borderRadius",
  "fontSize",
  "letterSpacing",
]);
const scalePx = (str, k) =>
  str.replace(/(-?\d*\.?\d+)px/g, (_, n) => `${parseFloat(n) * k}px`);

function scaleStyle(style, k) {
  const out = {};
  for (const [key, v] of Object.entries(style)) {
    if (typeof v === "number" && SCALED.has(key)) out[key] = v * k;
    else if (
      typeof v === "string" &&
      (key === "lineHeight" || key === "boxShadow" || key === "border")
    )
      out[key] = scalePx(v, k);
    else out[key] = v;
  }
  return out;
}

/** Returns a copy of a React element tree with every length multiplied by k. */
function scaleTree(node, k) {
  if (!node || typeof node !== "object" || !("props" in node)) return node;
  const props = { ...node.props };
  if (props.style) props.style = scaleStyle(props.style, k);
  if (node.type === "img") {
    if (typeof props.width === "number") props.width *= k;
    if (typeof props.height === "number") props.height *= k;
  }
  const kids = props.children;
  delete props.children;
  const scaledKids =
    kids === undefined
      ? []
      : (Array.isArray(kids) ? kids : [kids]).map((c) => scaleTree(c, k));
  return h(node.type, props, ...scaledKids);
}

/** Renders the home screen and returns a PNG buffer at `scale`×. */
export async function renderHome({ root, scale = 2 }) {
  const { ImageResponse } = await import("next/og.js");
  const read = (p) => readFile(path.join(root, p));
  const [glyphsJson, i400, i600, i700, ...photos] = await Promise.all([
    read("scripts/screens/ionicons.json"),
    read("scripts/fonts/inter-latin-400.ttf"),
    read("scripts/fonts/inter-latin-600.ttf"),
    read("scripts/fonts/inter-latin-700.ttf"),
    ...CARDS.map((c) => read(`scripts/screen-photos/${c.photo}`)),
  ]);
  const glyphs = JSON.parse(glyphsJson.toString()).glyphs;
  const photoUris = photos.map((b) => `data:image/jpeg;base64,${b.toString("base64")}`);

  const screen = h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: DEVICE.width,
        height: DEVICE.height,
        backgroundColor: T.canvas,
        fontFamily: "Inter",
        color: T.ink,
        position: "relative",
      },
    },
    // Status bar
    text("9:41", {
      position: "absolute",
      top: STATUS.time.baselineY - 17 * 0.97 - 1,
      left: STATUS.time.centerX - 40,
      width: 80,
      justifyContent: "center",
      fontSize: 17,
      fontWeight: 600,
      letterSpacing: -0.2,
      color: "#000000",
    }),
    h("img", {
      src: svgUri(statusIconsSvg("#000000")),
      width: STATUS.icons.width,
      height: STATUS.icons.height,
      style: { position: "absolute", left: STATUS.icons.x, top: STATUS.icons.y },
    }),
    // Content below the safe area
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", paddingTop: DEVICE.safeTop } },
      // HomeHeader: menu · brand · bell
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
        h(
          "div",
          {
            style: {
              display: "flex",
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            },
          },
          ionIcon(glyphs, "menu", 24, T.ink),
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
          text("MetroMatrix", { ...TYPE.logo, color: T.brand }),
          text("Smart City Services", { ...TYPE.body, color: T.inkMuted }),
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              position: "relative",
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            },
          },
          ionIcon(glyphs, "notifications", 24, T.ink),
          h("div", {
            style: {
              position: "absolute",
              top: 10,
              right: 10,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: T.danger,
              border: `1px solid ${T.canvas}`,
            },
          }),
        ),
      ),
      // LIVE SERVICES badge
      h(
        "div",
        {
          style: {
            display: "flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: 8,
            marginLeft: 20,
            marginTop: 12,
            marginBottom: 16,
            paddingLeft: 14,
            paddingRight: 14,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 20,
            backgroundColor: T.neutral.accentSoft,
          },
        },
        dot(8, T.danger),
        text("LIVE SERVICES", { ...TYPE.micro, color: T.neutral.accentDeep }),
      ),
      // Section head
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 14,
          },
        },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          text("Our Services", { ...TYPE.heading, color: T.ink }),
          text("Choose what you need", { ...TYPE.body, color: T.inkMuted }),
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 20,
              backgroundColor: T.surfaceSunk,
            },
          },
          text(`${CARDS.length} Available`, { ...TYPE.chip, color: T.inkMuted }),
        ),
      ),
      // Cards
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingLeft: 20,
            paddingRight: 20,
          },
        },
        ...CARDS.map((c, i) => card(c, photoUris[i], glyphs)),
      ),
    ),
    // Home indicator
    h("div", {
      style: {
        position: "absolute",
        left: (DEVICE.width - HOME_INDICATOR.width) / 2,
        bottom: HOME_INDICATOR.bottom,
        width: HOME_INDICATOR.width,
        height: HOME_INDICATOR.height,
        borderRadius: 3,
        backgroundColor: "#000000",
      },
    }),
  );

  // Render at `scale`× by scaling every dimension in the tree. (A CSS transform
  // on a wrapper makes Satori drop images inside clipped children.)
  const canvas = scaleTree(screen, scale);

  const res = new ImageResponse(canvas, {
    width: DEVICE.width * scale,
    height: DEVICE.height * scale,
    fonts: [
      { name: "Inter", data: i400, weight: 400, style: "normal" },
      { name: "Inter", data: i600, weight: 600, style: "normal" },
      { name: "Inter", data: i700, weight: 700, style: "normal" },
    ],
  });
  return Buffer.from(await res.arrayBuffer());
}
