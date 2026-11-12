import { Suspense } from "react";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { KeyFacts } from "@/components/sections/KeyFacts";
import { Partners } from "@/components/sections/Partners";
import { Pricing } from "@/components/sections/Pricing";
import { Roadmap } from "@/components/sections/Roadmap";
import { Savings } from "@/components/sections/Savings";
import { Services } from "@/components/sections/Services";
import { Trust } from "@/components/sections/Trust";
import { faqSection, faqs } from "@/content/faq";
import { screens } from "@/content/images";
import { pricing } from "@/content/pricing";
import { cityRollout, roadmap, roadmapSection } from "@/content/roadmap";
import {
  howItWorks,
  howItWorksSection,
  partners,
  partnersSection,
  savingsExample,
  savingsSection,
  services,
  servicesSection,
} from "@/content/services";
import {
  contactRoles,
  contactSection,
  features,
  hero,
  keyFacts,
  platformFeatures,
  site,
  trustSection,
} from "@/content/site";

/**
 * Each section after the hero sits in its own <Suspense> boundary. Nothing
 * suspends (the page is fully static); the boundaries let React hydrate the
 * sections as separate units and yield between them.
 */
export default function Home() {
  return (
    <>
      <Hero
        overline={hero.overline}
        headline={hero.headline}
        headlineAccent={hero.headlineAccent}
        subheadline={hero.subheadline}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        proof={hero.proof}
        storeBadges={hero.storeBadges}
        screen={screens.home}
      />
      <Suspense>
        <KeyFacts facts={keyFacts} />
      </Suspense>
      <Suspense>
        <Services
          eyebrow={servicesSection.eyebrow}
          title={servicesSection.title}
          intro={servicesSection.intro}
          services={services}
          platform={platformFeatures}
        />
      </Suspense>
      <Suspense>
        <AppShowcase
          title={servicesSection.showcaseTitle}
          intro={servicesSection.showcaseIntro}
          services={services}
        />
      </Suspense>
      <Suspense>
        <HowItWorks {...howItWorksSection} audiences={howItWorks} />
      </Suspense>
      <Suspense>
        <Savings {...savingsSection} example={savingsExample} />
      </Suspense>
      <Suspense>
        <Partners {...partnersSection} partners={partners} />
      </Suspense>
      <Suspense>
        <Trust {...trustSection} />
      </Suspense>
      {features.showPricing && (
        <Suspense>
          <Pricing content={pricing} />
        </Suspense>
      )}
      <Suspense>
        <Roadmap {...roadmapSection} columns={roadmap} rollout={cityRollout} />
      </Suspense>
      <Suspense>
        <Faq {...faqSection} items={faqs} />
      </Suspense>
      <Suspense>
        <Contact
          eyebrow={contactSection.eyebrow}
          title={contactSection.title}
          intro={contactSection.intro}
          directTitle={contactSection.directTitle}
          copy={contactSection}
          roles={contactRoles}
          cities={cityRollout.cities
            .filter((c) => c.stage !== "global")
            .map((c) => c.name)}
          email={site.contact.email}
          whatsappNumber={site.contact.whatsappNumber}
          whatsappHref={site.contact.whatsappHref}
        />
      </Suspense>
    </>
  );
}
