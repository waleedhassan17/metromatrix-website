import Image from "next/image";
import type { ImageAsset } from "@/content/types";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  image: ImageAsset;
  /** Preload (only for an above-the-fold image that is the LCP element). */
  priority?: boolean;
  /** Width hint for responsive image selection. */
  sizes?: string;
  /** Width classes for the device, e.g. "w-[300px]". */
  className?: string;
  caption?: string;
}

/**
 * An iPhone 15 Pro, drawn in CSS. Every measurement is a share of the device's
 * width (container query units), so the proportions hold at any size:
 * titanium band 1.2%, bezel 3.3%, display corner 13%, Dynamic Island
 * 126 × 37 pt on a 393 pt display. The screenshot sets the display's aspect
 * ratio, so nothing shifts while it loads.
 */
export function PhoneFrame({
  image,
  priority = false,
  sizes = "(min-width: 1024px) 320px, 280px",
  className = "w-[280px]",
  caption,
}: PhoneFrameProps) {
  return (
    <figure className={cn("@container relative mx-auto", className)}>
      {/* Side buttons: action + volume on the left, side button on the right. */}
      <span
        aria-hidden="true"
        className="absolute top-[17%] -left-[0.7cqw] h-[4.5%] w-[1cqw] rounded-l-sm bg-[#9a9ea2]"
      />
      <span
        aria-hidden="true"
        className="absolute top-[25%] -left-[0.7cqw] h-[8.5%] w-[1cqw] rounded-l-sm bg-[#9a9ea2]"
      />
      <span
        aria-hidden="true"
        className="absolute top-[35.5%] -left-[0.7cqw] h-[8.5%] w-[1cqw] rounded-l-sm bg-[#9a9ea2]"
      />
      <span
        aria-hidden="true"
        className="absolute top-[28%] -right-[0.7cqw] h-[13%] w-[1cqw] rounded-r-sm bg-[#9a9ea2]"
      />

      {/* Titanium band */}
      <div className="relative rounded-[17.5cqw] bg-[linear-gradient(145deg,#c9ccce_0%,#8d9195_22%,#d5d7d9_48%,#7d8185_74%,#b9bcbf_100%)] p-[1.2cqw] shadow-phone">
        {/* Bezel */}
        <div className="rounded-[16.3cqw] bg-black p-[3.3cqw]">
          {/* Display */}
          <div
            className="relative overflow-hidden rounded-[13cqw] bg-white"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={sizes}
              priority={priority}
              className="h-full w-full object-cover"
            />
            {/* Dynamic Island */}
            <span
              aria-hidden="true"
              className="absolute top-[2.55cqw] left-1/2 h-[8.6cqw] w-[29.2cqw] -translate-x-1/2 rounded-full bg-black"
            />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-5 text-center text-caption text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
