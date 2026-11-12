import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";
import type { City, CityStage, RoadmapColumn } from "@/content/types";
import { CityRollout } from "./CityRollout";

interface RoadmapProps {
  eyebrow: string;
  title: string;
  intro: string;
  columns: RoadmapColumn[];
  rollout: {
    title: string;
    intro: string;
    stages: ReadonlyArray<{ id: CityStage; label: string }>;
    cities: City[];
  };
}

export function Roadmap({ eyebrow, title, intro, columns, rollout }: RoadmapProps) {
  return (
    <Section id="roadmap" eyebrow={eyebrow} title={title} intro={intro}>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col, i) => (
          <Reveal as="li" key={col.status} delay={i * 0.06} className="flex">
            <Card className="flex w-full flex-col" padding="md">
              <div className="flex items-center justify-between gap-3">
                <StatusChip status={col.status} label={col.label} />
                <span className="text-caption text-muted tabular-nums" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-3 text-body-sm text-muted">{col.description}</p>
              <ul className="mt-4 space-y-3 border-t border-line pt-4">
                {col.items.map((item) => (
                  <li key={item.title}>
                    <p className="text-h4 text-ink">{item.title}</p>
                    {item.detail && (
                      <p className="mt-0.5 text-body-sm text-muted">{item.detail}</p>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </ol>
      <Reveal className="mt-14">
        <CityRollout {...rollout} />
      </Reveal>
    </Section>
  );
}
