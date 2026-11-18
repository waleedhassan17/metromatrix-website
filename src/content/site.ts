import type {
  ContactRoleOption,
  Cta,
  KeyFact,
  NavLink,
  PlatformFeature,
  SocialLink,
  StoreBadge,
} from "./types";

/**
 * Feature switches.
 * showPricing: planned plans and prices stay in content/pricing.ts but are not
 * rendered while MetroMatrix is free. Set to true to bring back the section,
 * its nav link and the "Reserve founder pricing" calls to action.
 */
export const features = {
  showPricing: false,
} as const;

export const site = {
  name: "MetroMatrix",
  tagline: "Smart City Services",
  brandLine: "Your city, one app.",
  positioning:
    "Verified providers, direct prices, zero commission. Pakistan first, then the world's major cities.",
  description:
    "MetroMatrix is one app for your city's food, health and shopping. Verified restaurants, home kitchens, doctors and brand stores, zero commission on every order, and free during launch in Lahore.",
  launchCity: "Lahore",
  launchPill: "Launching in Lahore",
  /** The company that builds and publishes MetroMatrix. */
  company: {
    name: "CRON Technologies",
    url: "https://cron-technologies.vercel.app",
    /** CRON's other live product, named on the CRON site. */
    sibling: "FinMatrix",
  },
  /** Public contact details (email and WhatsApp). */
  contact: {
    email: "waleedhassansfd@gmail.com",
    phone: "+92 312 4890176",
    whatsappNumber: "+92 312 4890176",
    /** wa.me wants the number with the country code and no "+", spaces or leading 0. */
    whatsappHref: "https://wa.me/923124890176",
    placeholder: false,
  },
  /** Official profiles only. Empty until real accounts exist, so no link points nowhere. */
  socials: [] as SocialLink[],
  /** Source note for every commission figure on the site. */
  commissionSource:
    "Based on reporting by Dawn and Profit on restaurant commission disputes.",
};

const allNavLinks: (NavLink & { pricing?: boolean })[] = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Partners", href: "#partners" },
  { label: "Pricing", href: "#pricing", pricing: true },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

export const navLinks: NavLink[] = allNavLinks
  .filter((l) => !l.pricing || features.showPricing)
  .map(({ label, href }) => ({ label, href }));

export const primaryCta: Cta = {
  label: "Get early access",
  href: "/?role=customer#contact",
  role: "customer",
};

export const hero = {
  overline: "MetroMatrix · Smart city super-app",
  headline: "Your city's food, health and shopping. One app.",
  headlineAccent: "Zero commission.",
  subheadline:
    "Order from verified restaurants and home kitchens, book PMDC-verified doctors and shop verified brand stores. You pay the provider's own price, and the provider keeps all of it.",
  primaryCta,
  secondaryCta: {
    label: "List your business",
    href: "/?role=partner#contact",
  } satisfies Cta,
  proof: ["Free during launch", "PMDC-verified doctors", "Pay providers directly"],
  storeBadges: [
    { store: "apple", label: "App Store", status: "coming-soon" },
    { store: "google", label: "Google Play", status: "coming-soon" },
  ] satisfies StoreBadge[],
  screenCaption: "The MetroMatrix home screen: one account, three live services.",
};

/** Plain facts from the product itself. No user counts, ratings or downloads. */
export const keyFacts: KeyFact[] = [
  {
    value: "3",
    label: "Live services",
    detail: "Food Court, Digital Health and Smart Shopping",
  },
  { value: "0%", label: "Commission", detail: "Providers keep 100% of every order" },
  { value: "1", label: "Account", detail: "One login, profile and notification centre" },
  { value: "6", label: "Cities in Pakistan", detail: "Lahore first, then five more" },
];

export const platformFeatures: PlatformFeature[] = [
  {
    icon: "user-round",
    title: "One account",
    detail: "A single profile across Food Court, Digital Health and Smart Shopping.",
  },
  {
    icon: "badge-check",
    title: "Verification centre",
    detail:
      "Identity and licence checks for every provider before they appear in the app.",
  },
  {
    icon: "bell",
    title: "Notifications",
    detail: "Order updates, appointment reminders and delivery alerts in one place.",
  },
  {
    icon: "receipt",
    title: "FinMatrix bookkeeping",
    detail:
      "Optional bookkeeping for vendors, from CRON's FinMatrix. Planned for a later release.",
  },
];

export const trustSection = {
  eyebrow: "Trust & verification",
  title: "Verified before it goes live. Private by default.",
  intro:
    "A city app only works if people trust who is on the other side. These are the checks and rules MetroMatrix runs on.",
  items: [
    {
      icon: "badge-check",
      title: "Identity and licence checks",
      detail:
        "Restaurants, home kitchens, brands and riders pass identity and licence checks in the verification centre before they can take an order.",
    },
    {
      icon: "stethoscope",
      title: "PMDC checks for every doctor",
      detail:
        "A doctor's PMDC registration and qualifications are checked before their profile goes live. MetroMatrix books verified doctors; it does not give medical advice.",
    },
    {
      icon: "lock",
      title: "Private health records",
      detail: "Records belong to the patient and stay private to them.",
    },
    {
      icon: "wallet",
      title: "Payments go to the provider",
      detail:
        "Customers pay the provider directly, by cash on delivery or a bank or wallet transfer. MetroMatrix never holds the money.",
    },
  ] satisfies PlatformFeature[],
};

export const contactRoles: ContactRoleOption[] = [
  { value: "customer", label: "Customer" },
  { value: "home-kitchen", label: "Home kitchen" },
  { value: "restaurant", label: "Restaurant" },
  { value: "doctor", label: "Doctor or clinic" },
  { value: "brand", label: "Brand" },
  { value: "rider", label: "Rider" },
  { value: "investor", label: "Investor or partner" },
  { value: "other", label: "Other" },
];

export const contactSection = {
  eyebrow: "Early access",
  title: "Be first in your city.",
  intro:
    "Customers get a place on the launch list. Partners get help with verification and setup, free during launch. Tell us who you are and we will reply by email.",
  directTitle: "Prefer to talk directly?",
  successTitle: "Thanks, you're on the list.",
  successDetail:
    "We have your details and will reply by email. Keep an eye on your inbox.",
  submitLabel: "Request early access",
  submittingLabel: "Sending…",
  privacyNote:
    "We only use your details to reply to this request. No newsletters unless you ask.",
};

export const notFound = {
  eyebrow: "404",
  title: "This page isn't on the map.",
  detail:
    "The page you're looking for doesn't exist or has moved. Head back home, or jump to a section below.",
  homeLabel: "Back to home",
};

export const seo = {
  keywords: [
    "MetroMatrix",
    "smart city app",
    "zero commission food delivery",
    "Lahore food delivery",
    "home kitchens Lahore",
    "PMDC verified doctors",
    "book doctor online Pakistan",
    "verified brand stores",
    "CRON Technologies",
  ],
  ogImageAlt:
    "MetroMatrix: your city's food, health and shopping. One app. Zero commission.",
  locale: "en_PK",
};

export const footer = {
  productOf: "A product of",
  rights: "All rights reserved.",
  columns: {
    product: "Product",
    company: "Company",
    legal: "Legal",
  },
  legalLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ] satisfies NavLink[],
};

/** The sticky call-to-action bar on phones (home page only). */
export const mobileCta = {
  note: "Free during launch",
  detail: "Launching in Lahore",
};
