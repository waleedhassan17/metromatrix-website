import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Bike,
  Building2,
  CalendarCheck,
  Check,
  ChefHat,
  Clock,
  Globe,
  HeartPulse,
  House,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Percent,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  Store,
  Truck,
  UserRound,
  UtensilsCrossed,
  Video,
  Wallet,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/types";

const icons: Record<IconName, LucideIcon> = {
  utensils: UtensilsCrossed,
  stethoscope: Stethoscope,
  "shopping-bag": ShoppingBag,
  "chef-hat": ChefHat,
  store: Store,
  bike: Bike,
  building: Building2,
  percent: Percent,
  "shield-check": ShieldCheck,
  "user-round": UserRound,
  wallet: Wallet,
  bell: Bell,
  lock: Lock,
  "map-pin": MapPin,
  mail: Mail,
  "message-circle": MessageCircle,
  "arrow-right": ArrowRight,
  check: Check,
  clock: Clock,
  video: Video,
  "calendar-check": CalendarCheck,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
  smartphone: Smartphone,
  "badge-check": BadgeCheck,
  globe: Globe,
  truck: Truck,
  star: Star,
  receipt: Receipt,
  layers: Layers,
  home: House,
};

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
}

/** Resolves a content-layer icon name to a lucide icon. Decorative by default. */
export function Icon({ name, "aria-hidden": ariaHidden = true, ...props }: IconProps) {
  const Cmp = icons[name];
  return <Cmp aria-hidden={ariaHidden} focusable="false" {...props} />;
}
