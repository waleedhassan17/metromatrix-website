import { ImageResponse } from "next/og";
import { appIconSvg, svgDataUri } from "@/lib/logo-svg";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Opaque, full bleed: iOS rounds the corners itself. */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <img
        src={svgDataUri(appIconSvg({ rounded: false }))}
        width={180}
        height={180}
        alt=""
      />
    </div>,
    { ...size },
  );
}
