import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Instrument_Sans, Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";
import { footer, hero, navLinks, primaryCta, seo, site } from "@/content/site";
import { publicEnv } from "@/lib/env";
import "@/styles/globals.css";

/**
 * FinMatrix's pair, so CRON's products read as one family: Instrument Sans for
 * headings only (weight 600), Roboto for everything else. Only the display face
 * is preloaded; the headline is the LCP element.
 */
const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-instrument",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-roboto",
  display: "swap",
  preload: false,
});

const title = `${site.name} | ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: seo.keywords,
  authors: [{ name: site.company.name, url: site.company.url }],
  creator: site.company.name,
  publisher: site.company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${hero.headline} ${hero.headlineAccent}`,
    description: site.description,
    locale: seo.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${hero.headline} ${hero.headlineAccent}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f1a17",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <JsonLd siteUrl={publicEnv.NEXT_PUBLIC_SITE_URL} />
        {/* Own boundaries so React hydrates header, page and footer as separate units. */}
        <Suspense>
          <Navbar links={navLinks} cta={primaryCta} siteName={site.name} />
        </Suspense>
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Suspense>
          <Footer
            siteName={site.name}
            positioning={site.positioning}
            brandLine={site.brandLine}
            navLinks={navLinks}
            legalLinks={footer.legalLinks}
            socials={site.socials}
            company={site.company}
            productOf={footer.productOf}
            rights={footer.rights}
            columns={footer.columns}
            contactEmail={site.contact.email}
            year={new Date().getFullYear()}
          />
        </Suspense>
        {publicEnv.NEXT_PUBLIC_ENABLE_ANALYTICS && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
