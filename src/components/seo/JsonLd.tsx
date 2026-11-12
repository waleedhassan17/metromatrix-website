import { appIcon } from "@/content/images";
import { site } from "@/content/site";

/**
 * Organization + MobileApplication structured data. No ratings, reviews or
 * download counts: none exist yet, and we don't invent them.
 */
export function JsonLd({ siteUrl }: { siteUrl: string }) {
  const url = siteUrl.replace(/\/$/, "");
  const sameAs = site.socials.filter((s) => !s.placeholder).map((s) => s.href);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: site.name,
        legalName: site.company.name,
        url,
        logo: `${url}${appIcon.src}`,
        description: site.positioning,
        slogan: site.brandLine,
        parentOrganization: {
          "@type": "Organization",
          name: site.company.name,
          url: site.company.url,
        },
        areaServed: { "@type": "City", name: site.launchCity },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: site.contact.email,
          telephone: site.contact.phone,
          availableLanguage: ["English", "Urdu"],
        },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "MobileApplication",
        "@id": `${url}/#app`,
        name: site.name,
        url,
        description: site.description,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Android, iOS",
        publisher: { "@id": `${url}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "PKR",
          description: "Free during launch",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: site.name,
        publisher: { "@id": `${url}/#organization` },
        inLanguage: "en-PK",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
