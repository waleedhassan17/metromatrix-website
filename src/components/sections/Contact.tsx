import { Section } from "@/components/layout/Section";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ContactForm, type ContactFormCopy } from "@/components/forms/ContactForm";
import type { ContactRoleOption } from "@/content/types";

interface ContactProps {
  eyebrow: string;
  title: string;
  intro: string;
  directTitle: string;
  copy: ContactFormCopy;
  roles: ContactRoleOption[];
  cities: string[];
  email: string;
  whatsappNumber: string;
  whatsappHref: string;
}

export function Contact({
  eyebrow,
  title,
  intro,
  directTitle,
  copy,
  roles,
  cities,
  email,
  whatsappNumber,
  whatsappHref,
}: ContactProps) {
  const direct = [
    {
      icon: "mail" as const,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      external: false,
    },
    {
      icon: "message-circle" as const,
      label: "WhatsApp (opens in a new tab)",
      value: whatsappNumber,
      href: whatsappHref,
      external: true,
    },
  ];
  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div>
          <SectionIntro
            id="contact-title"
            overline={eyebrow}
            title={title}
            intro={intro}
          />
          <div className="mt-10">
            <h3 className="text-label-md text-muted">{directTitle}</h3>
            <ul className="mt-4 space-y-3">
              {direct.map((d) => (
                <li key={d.label}>
                  <a
                    href={d.href}
                    {...(d.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-4 rounded-(--radius-card) border border-line bg-surface p-4 transition-colors hover:border-line-strong"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
                      <Icon name={d.icon} className="size-5" />
                    </span>
                    <span>
                      <span className="block text-caption text-muted">{d.label}</span>
                      <span className="text-label-lg text-ink">{d.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Card padding="lg">
          <ContactForm roles={roles} cities={cities} copy={copy} fallbackEmail={email} />
        </Card>
      </div>
    </Section>
  );
}
