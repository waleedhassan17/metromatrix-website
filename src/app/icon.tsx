import { ImageResponse } from "next/og";
import { logoMarkSvg, svgDataUri } from "@/lib/logo-svg";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <img src={svgDataUri(logoMarkSvg())} width={32} height={32} alt="" />
    </div>,
    { ...size },
  );
}
