/**
 * Typed content model. Components receive these via props; no copy lives in
 * components. The shapes are deliberately plain so a CMS could feed them later.
 */

export type ServiceId = "food" | "health" | "shop";

/** Tokens that map to CSS utilities (service-food, service-health, ...). */
export type ServiceTone = ServiceId | "brand";

/** Names resolved to lucide icons in components/ui/Icon.tsx. */
export type IconName =
  | "utensils"
  | "stethoscope"
  | "shopping-bag"
  | "chef-hat"
  | "store"
  | "bike"
  | "building"
  | "percent"
  | "shield-check"
  | "user-round"
  | "wallet"
  | "bell"
  | "lock"
  | "map-pin"
  | "mail"
  | "message-circle"
  | "arrow-right"
  | "check"
  | "clock"
  | "video"
  | "calendar-check"
  | "heart-pulse"
  | "sparkles"
  | "smartphone"
  | "badge-check"
  | "globe"
  | "truck"
  | "star"
  | "receipt"
  | "layers"
  | "home";

export type ContactRole =
  | "customer"
  | "home-kitchen"
  | "restaurant"
  | "doctor"
  | "brand"
  | "rider"
  | "investor"
  | "other";

export interface NavLink {
  label: string;
  href: `#${string}` | `/${string}`;
}

export interface Cta {
  label: string;
  href: string;
  role?: ContactRole;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Focal point for tight crops (CSS object-position), e.g. "75% 50%". */
  focus?: string;
}

export interface StoreBadge {
  store: "apple" | "google";
  label: string;
  status: "coming-soon";
}

export interface KeyFact {
  value: string;
  label: string;
  detail: string;
}

export interface Service {
  id: ServiceId;
  name: string;
  badge: string;
  tagline: string;
  /** Short line for the floating hero tile. */
  heroLabel: string;
  description: string;
  features: string[];
  icon: IconName;
  screen: ImageAsset;
  /** Brand-guide line for the service ("Every local food vendor, under one roof."). */
  brandLine: string;
  /** The app's own card photo for the service. */
  photo: ImageAsset;
}

export interface PlatformFeature {
  icon: IconName;
  title: string;
  detail: string;
}

export interface Step {
  title: string;
  detail: string;
}

export interface HowItWorksAudience {
  id: "customers" | "partners";
  label: string;
  intro: string;
  steps: Step[];
}

export interface PartnerAudience {
  id: ContactRole;
  icon: IconName;
  tone: ServiceTone;
  title: string;
  description: string;
  points: string[];
  cta: Cta;
}

export interface SavingsExample {
  monthlyOrders: number;
  averageOrderValue: number;
  commissionLow: number;
  commissionHigh: number;
  commissionDefault: number;
  /** What MetroMatrix charges per month (0 while free during launch). */
  metroCost: number;
  sourceNote: string;
}

export type PlanStatus = "planned";

export interface Plan {
  id: string;
  name: string;
  audience: string;
  tone: ServiceTone;
  /** Monthly price in PKR. A range uses `priceMax`. */
  price: number;
  priceMax?: number;
  currency: "PKR";
  period: "month";
  description: string;
  features: string[];
  cta: Cta;
  highlighted?: boolean;
  /** Offered in the savings calculator's plan selector. */
  inCalculator?: boolean;
}

export interface PricingContent {
  eyebrow: string;
  title: string;
  intro: string;
  launchBanner: { title: string; detail: string };
  founderNote: string;
  disclaimer: string;
  /** Small label on the highlighted plan. Must stay factual (no "most popular"). */
  highlightLabel: string;
  plans: Plan[];
}

export type RoadmapStatus = "live" | "next" | "later" | "future";

export interface RoadmapItem {
  title: string;
  detail?: string;
}

export interface RoadmapColumn {
  status: RoadmapStatus;
  label: string;
  description: string;
  items: RoadmapItem[];
}

export type CityStage = "launching" | "pakistan" | "global";

export interface City {
  name: string;
  stage: CityStage;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactRoleOption {
  value: ContactRole;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
  placeholder?: boolean;
}
