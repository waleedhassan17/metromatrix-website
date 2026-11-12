import { Container } from "./Container";
import type { LegalDoc } from "@/content/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <div
        role="note"
        className="mb-10 rounded-lg border border-[#fedf89] bg-[#fffaeb] p-4 text-body-sm text-[#93370d]"
      >
        <strong className="font-semibold">Placeholder. </strong>
        {doc.placeholderNotice}
      </div>
      <h1 className="text-hero-md text-ink sm:text-hero-lg">{doc.title}</h1>
      <p className="mt-3 text-body-sm text-muted">Last updated: {doc.updated}</p>
      <div className="mt-10 space-y-10">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-h3 text-ink">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-body-md text-muted">
              {section.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
