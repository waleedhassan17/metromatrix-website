import { Icon } from "@/components/ui/Icon";
import type { City, CityStage } from "@/content/types";
import { cn } from "@/lib/utils";

interface CityRolloutProps {
  title: string;
  intro: string;
  stages: ReadonlyArray<{ id: CityStage; label: string }>;
  cities: City[];
}

/** Lahore → Pakistan's major cities → Gulf and global cities, as three steps. */
export function CityRollout({ title, intro, stages, cities }: CityRolloutProps) {
  return (
    <div className="rounded-(--radius-panel) border border-line bg-surface p-6 shadow-card sm:p-10">
      <h3 className="text-display-sm text-ink">{title}</h3>
      <p className="mt-2 text-body-md text-muted">{intro}</p>
      <ol className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.6fr_1fr]">
        {stages.map((stage, i) => {
          const list = cities.filter((c) => c.stage === stage.id);
          const first = stage.id === "launching";
          return (
            <li
              key={stage.id}
              data-theme={first ? "dark" : undefined}
              className={cn(
                "rounded-(--radius-card) border p-5",
                first ? "border-transparent bg-bg text-ink" : "border-line bg-[#fafaf7]",
              )}
            >
              <p className="flex items-center gap-2 text-overline text-muted uppercase">
                <span className="text-ink tabular-nums">0{i + 1}</span>
                <span aria-hidden="true">·</span>
                {stage.label}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {list.map((city) => (
                  <li
                    key={city.name}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-label-md whitespace-nowrap",
                      first
                        ? "border-mint/40 text-mint"
                        : "border-line-strong bg-surface text-ink",
                    )}
                  >
                    <Icon
                      name={stage.id === "global" ? "globe" : "map-pin"}
                      className="size-3.5"
                    />
                    {city.name}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
