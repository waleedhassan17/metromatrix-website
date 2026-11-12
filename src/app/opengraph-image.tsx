import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, seo, site } from "@/content/site";

export const alt = seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const file = (p: string) => readFile(join(process.cwd(), p));
  const [screen, lockup, display, body] = await Promise.all([
    file("public/screens/home.png"),
    file("public/brand/metromatrix-horizontal-dark.svg"),
    file("assets/fonts/instrument-sans-latin-600.woff"),
    file("assets/fonts/roboto-latin-400.woff"),
  ]);
  const screenUri = `data:image/png;base64,${screen.toString("base64")}`;
  const lockupUri = `data:image/svg+xml;base64,${lockup.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0F1A17",
        padding: "56px 72px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Roboto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 700 }}>
        {/* The brand kit's lockup carries one tile of clear space; offset it so the mark aligns left. */}
        <img
          src={lockupUri}
          width={326}
          height={90}
          alt=""
          style={{ marginLeft: -24, marginTop: -24 }}
        />
        <div
          style={{
            marginTop: 40,
            fontFamily: "Instrument Sans",
            fontSize: 58,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -1.6,
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>{hero.headline}</span>
          <span style={{ color: "#34C38F" }}>{hero.headlineAccent}</span>
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 24,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.4,
          }}
        >
          {site.positioning}
        </div>
        <div style={{ marginTop: "auto", fontSize: 20, color: "rgba(255,255,255,0.55)" }}>
          {`A product of ${site.company.name}`}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 84,
          top: 52,
          width: 296,
          height: 640,
          borderRadius: 52,
          background: "#26292b",
          padding: 4,
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            borderRadius: 48,
            background: "#000",
            padding: 10,
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src={screenUri}
            width={268}
            height={581}
            alt=""
            style={{ borderRadius: 38 }}
          />
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Instrument Sans", data: display, weight: 600, style: "normal" },
        { name: "Roboto", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
