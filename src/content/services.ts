import { screens, servicePhotos } from "./images";
import type {
  HowItWorksAudience,
  PartnerAudience,
  SavingsExample,
  Service,
} from "./types";

export const servicesSection = {
  eyebrow: "The platform",
  title: "Three services. One city. One account.",
  intro:
    "Every provider is verified before going live, prices are the provider's own, and every order or booking is paid to the provider directly.",
  showcaseTitle: "Inside the app",
  showcaseIntro:
    "Each service keeps its own colour and its own tools, under one MetroMatrix account.",
};

export const services: Service[] = [
  {
    id: "food",
    name: "Food Court",
    badge: "Food",
    tagline: "Restaurants, food vendors and home kitchens.",
    heroLabel: "Menu prices, vendor's own riders",
    description:
      "Menu prices, not inflated app prices. Vendors run their own storefront, take payment directly and deliver with their own riders.",
    features: [
      "Storefronts with item add-ons",
      "Cash on delivery or direct bank / wallet transfer to the vendor",
      "Live order tracking",
      "Home-kitchen tools: “cooking today” menu, portion limits, pre-order slots",
      "Rider view for the vendor's own riders",
    ],
    icon: "utensils",
    screen: screens.food,
    brandLine: "Every local food vendor, under one roof.",
    photo: servicePhotos.food,
  },
  {
    id: "health",
    name: "Digital Health",
    badge: "Health",
    tagline: "Find and book verified doctors for video or clinic visits.",
    heroLabel: "PMDC-verified doctors",
    description:
      "Every doctor passes PMDC registration and qualification checks before going live. Book, get reminded and keep your records private.",
    features: [
      "PMDC registration and qualification checks before a doctor goes live",
      "Video or clinic appointments",
      "Appointment reminders",
      "Private health records",
      "Emergency shortcut",
    ],
    icon: "stethoscope",
    screen: screens.health,
    brandLine: "Care, without the waiting room.",
    photo: servicePhotos.health,
  },
  {
    id: "shop",
    name: "Smart Shopping",
    badge: "Shopping",
    tagline: "Verified brand stores, direct from the brand.",
    heroLabel: "Verified brand stores",
    description:
      "Shop real brand storefronts with their stories, browse by category and keep a wishlist and order history in one place.",
    features: [
      "Verified brand stores",
      "Brand stories",
      "Categories, bag and wishlist",
      "Order history",
    ],
    icon: "shopping-bag",
    screen: screens.shopping,
    brandLine: "Trusted brands, secure checkout.",
    photo: servicePhotos.shopping,
  },
];

export const howItWorksSection = {
  eyebrow: "How it works",
  title: "Simple for customers. Fair for partners.",
  intro: "Switch between the two sides of the app.",
};

export const howItWorks: HowItWorksAudience[] = [
  {
    id: "customers",
    label: "For customers",
    intro: "One account for food, health and shopping. No markups, no surprises.",
    steps: [
      {
        title: "Create one account",
        detail:
          "Sign up once and use every service with the same profile and notifications.",
      },
      {
        title: "Browse verified providers",
        detail:
          "Restaurants, home kitchens, doctors and brand stores near you, each checked before going live.",
      },
      {
        title: "Order or book at the provider's own price",
        detail: "You see menu prices and consultation fees as the provider set them.",
      },
      {
        title: "Pay the provider directly",
        detail:
          "Cash on delivery or a direct bank or wallet transfer. Nothing is routed through us.",
      },
      {
        title: "Track, then rate",
        detail:
          "Follow your order live or join your consultation, then rate the provider to help others.",
      },
    ],
  },
  {
    id: "partners",
    label: "For partners",
    intro: "Keep 100% of every order. No commission, and no fees during launch.",
    steps: [
      {
        title: "Join and pass verification",
        detail: "Identity and licence checks so customers know every provider is real.",
      },
      {
        title: "Set up your menu, services or products",
        detail:
          "Add items, add-ons, consultation types or catalogue, and define your delivery area.",
      },
      {
        title: "Customers order or book and pay you directly",
        detail: "Cash on delivery or a transfer straight to your bank or wallet.",
      },
      {
        title: "Deliver or consult your way",
        detail: "Your own rider delivers, or you consult by video or in your clinic.",
      },
      {
        title: "Earn ratings, build reputation",
        detail:
          "Customers rate you after every order or visit. Your reputation stays yours.",
      },
    ],
  },
];

export const partnersSection = {
  eyebrow: "Partners",
  title: "Built for the people who actually do the work.",
  intro:
    "Whether you cook from home, run a restaurant, see patients or sell a brand, the deal is the same: verified listing, direct payment, zero commission.",
  otherApps: {
    title: "Already on another app?",
    detail:
      "Keep it. There is no exclusivity. Run MetroMatrix alongside and keep 100% of every order that comes through us.",
    cta: { label: "List your business", href: "/?role=partner#contact" },
  },
  riderShowcase: {
    eyebrow: "Rider view",
    title: "Your riders, your deliveries.",
    detail:
      "Vendors deliver with their own riders. The rider view shows each assigned order with pickup, drop-off and the amount to collect, and updates the customer's live tracking.",
    points: [
      "Assigned deliveries in one list",
      "Pickup and drop-off details",
      "Amount to collect on delivery",
      "Status updates that feed live order tracking",
    ],
    screen: screens.rider,
  },
};

export const partners: PartnerAudience[] = [
  {
    id: "home-kitchen",
    icon: "chef-hat",
    tone: "food",
    title: "Home kitchens",
    description: "Sell what you cook today, in the portions you can make.",
    points: [
      "“Cooking today” menu",
      "Portion limits and pre-order slots",
      "Cash or direct transfer",
    ],
    cta: {
      label: "List your kitchen",
      href: "/?role=home-kitchen#contact",
      role: "home-kitchen",
    },
  },
  {
    id: "restaurant",
    icon: "utensils",
    tone: "food",
    title: "Restaurants & food vendors",
    description:
      "Your storefront, your prices, your riders. Keep every rupee of every order.",
    points: [
      "Storefront with item add-ons",
      "Live order tracking",
      "Rider view for your own riders",
    ],
    cta: {
      label: "List your restaurant",
      href: "/?role=restaurant#contact",
      role: "restaurant",
    },
  },
  {
    id: "doctor",
    icon: "stethoscope",
    tone: "health",
    title: "Doctors & clinics",
    description:
      "Verified listing, video or clinic bookings and reminders that cut no-shows.",
    points: [
      "PMDC verification before going live",
      "Video and clinic appointments",
      "Automatic reminders",
    ],
    cta: { label: "Join as a doctor", href: "/?role=doctor#contact", role: "doctor" },
  },
  {
    id: "brand",
    icon: "store",
    tone: "shop",
    title: "Brands & retailers",
    description: "A verified brand store with your story, categories and direct orders.",
    points: [
      "Verified brand storefront",
      "Brand story and categories",
      "Wishlist and order history",
    ],
    cta: { label: "Open a brand store", href: "/?role=brand#contact", role: "brand" },
  },
  {
    id: "rider",
    icon: "bike",
    tone: "brand",
    title: "Vendor riders",
    description: "Ride for the vendors you already know, with a simple delivery view.",
    points: [
      "Assigned deliveries in one list",
      "Pickup and drop-off details",
      "Status updates customers can see",
    ],
    cta: { label: "Ride with a vendor", href: "/?role=rider#contact", role: "rider" },
  },
];

export const savingsSection = {
  eyebrow: "Zero commission",
  title: "See what a commission app takes. Then keep all of it.",
  intro:
    "Commission apps take a percentage of every order. MetroMatrix takes none, and it is free for partners during launch. Move the sliders to match your business.",
  labels: {
    orders: "Orders per month",
    averageOrder: "Average order value",
    commission: "Commission app rate",
    gross: "Monthly sales",
    commissionTakes: "Commission app takes",
    metroCost: "MetroMatrix takes",
    metroCostNote: "Free during launch",
    keptWithCommission: "You keep with a commission app",
    keptWithMetro: "You keep with MetroMatrix",
    extraKept: "Extra you keep every month",
  },
  exampleCopy:
    "Example: a restaurant doing 300 orders at PKR 1,200 sells PKR 360,000 a month. A commission app at 25–30% takes PKR 90,000–108,000, leaving PKR 252,000–270,000. On MetroMatrix the restaurant keeps the full PKR 360,000.",
  footnote: "MetroMatrix is free during launch. Figures exclude taxes and payment fees.",
};

export const savingsExample: SavingsExample = {
  monthlyOrders: 300,
  averageOrderValue: 1200,
  commissionLow: 0.25,
  commissionHigh: 0.3,
  commissionDefault: 0.28,
  metroCost: 0,
  sourceNote: "Based on reporting by Dawn and Profit on restaurant commission disputes.",
};
