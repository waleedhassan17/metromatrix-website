import { Container } from "@/components/layout/Container";
import type { KeyFact } from "@/content/types";

/** Plain facts about the product, set large. No invented user numbers. */
export function KeyFacts({ facts }: { facts: KeyFact[] }) {
  return (
    <section
      aria-label="MetroMatrix at a glance"
      className="border-b border-line bg-surface"
    >
      <Container>
        <dl className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={
                "flex flex-col border-line py-8 lg:px-8 lg:first:pl-0 " +
                (i % 2 === 1 ? "border-l pl-6 lg:border-l-0 " : "pr-6 ") +
                (i < 2 ? "border-b lg:border-b-0" : "")
              }
            >
              <dt className="order-2 mt-2 text-label-md text-muted">{f.label}</dt>
              <dd className="order-1 text-display-lg text-ink">{f.value}</dd>
              <dd className="order-3 mt-1 text-body-sm text-muted">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
