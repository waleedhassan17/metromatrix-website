import type { StaticImageData } from "next/image";
import homeShot from "../../public/screens/home.png";
import foodShot from "../../public/screens/food.png";
import healthShot from "../../public/screens/health.png";
import shoppingShot from "../../public/screens/shopping.png";
import riderShot from "../../public/screens/rider.png";
import foodPhoto from "../../public/images/services/food.jpg";
import healthPhoto from "../../public/images/services/health.jpg";
import shoppingPhoto from "../../public/images/services/shopping.jpg";
import type { ImageAsset } from "./types";

/**
 * Images are imported, not referenced by path: the build gives each file a
 * content-hashed URL, so a regenerated screenshot can never be served from a
 * stale browser or image-optimiser cache. Dimensions come from the file.
 */
const asset = (img: StaticImageData, alt: string): ImageAsset => ({
  src: img.src,
  width: img.width,
  height: img.height,
  alt,
});

/**
 * All raster assets with alt text. Screens are rendered by
 * `npm run screens:generate` to mirror the real app screens, using the app's
 * own licensed photos (scripts/screen-photos/CREDITS.md). Replace them with
 * device captures at the same size when available (public/screens/README.md).
 */
/** iPhone 15 (393 × 852 pt) at 2×. */
export const SCREEN_SIZE = { width: 786, height: 1704 } as const;

export const screens = {
  home: asset(
    homeShot,
    "MetroMatrix home screen on an iPhone: a Live services label above three photo cards for Food Court, Digital Health and Smart Shopping, each marked Open now with an Explore button",
  ),
  food: asset(
    foodShot,
    "Food Court home: delivery address, dish search, cuisine shortcuts, deals from nearby restaurants and popular dishes with menu prices",
  ),
  health: asset(
    healthShot,
    "Digital Health home: video consultation, clinic visit and available-today cards, an upcoming visit with a PMDC-verified doctor, and specialties",
  ),
  shopping: asset(
    shoppingShot,
    "Smart Shopping home: brand search, a seasonal banner, featured brands and a verified brand store card",
  ),
  rider: asset(
    riderShot,
    "Rider view for a new delivery: cash to collect, a route map, pickup and drop-off details, and an Accept delivery button",
  ),
} satisfies Record<string, ImageAsset>;

/** The app's own service card photos (licences: scripts/screen-photos/CREDITS.md). */
// `focus` keeps the subject in frame when a card crops the photo tall and
// narrow (tablet layout): the burger, the doctor, the nearer shopper.
export const servicePhotos = {
  food: {
    ...asset(foodPhoto, "A smash burger and fries on a dark table"),
    focus: "78% 50%",
  },
  health: {
    ...asset(healthPhoto, "A doctor and a colleague reviewing information on a screen"),
    focus: "52% 25%",
  },
  shopping: {
    ...asset(shoppingPhoto, "Two shoppers smiling in a busy shopping centre"),
    focus: "30% 35%",
  },
} satisfies Record<string, ImageAsset>;

export const appIcon: ImageAsset = {
  src: "/images/app-icon.png",
  alt: "MetroMatrix app icon: four rounded tiles in orange, berry, blue and green with a white M",
  width: 512,
  height: 512,
};
