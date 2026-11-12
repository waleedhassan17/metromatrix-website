import { Badge } from "./Badge";
import type { RoadmapStatus } from "@/content/types";

const tones: Record<RoadmapStatus, "brand" | "health" | "shop" | "outline"> = {
  live: "brand",
  next: "health",
  later: "shop",
  future: "outline",
};

/** Roadmap status: a tinted badge with a dot and a label (brand rule). */
export function StatusChip({
  status,
  label,
  className,
}: {
  status: RoadmapStatus;
  label: string;
  className?: string;
}) {
  return (
    <Badge tone={tones[status]} dot className={className}>
      {label}
    </Badge>
  );
}
