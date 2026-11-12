# MetroMatrix — marketing site

The public website for **MetroMatrix**, the smart-city super-app (Food Court, Digital Health,
Smart Shopping) by **CRON Technologies**. Static Next.js site with one serverless route that
emails early-access requests.

- **Stack:** Next.js 16 (App Router, static generation) · TypeScript (strict) · Tailwind CSS 4 ·
  react-hook-form + zod · Resend · lucide-react · Vitest
- **Pages:** `/` (landing), `/privacy`, `/terms`, branded 404. Every page is prerendered; the only
  server code is `POST /api/contact`.

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in the values below
npm run dev                    # http://localhost:3000
```

Node 20.9+ (22 recommended).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript + Prettier compatibility) |
| `npm run typecheck` | Route types + `tsc --noEmit` |
| `npm test` | Vitest: savings math, contact schema, rate limiter, every API response |
| `npm run format` | Prettier (with Tailwind class sorting) |
| `npm run screens:generate` | Re-render the iPhone screenshots in `public/screens/` |

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | server | Resend API key. Without it the form says email isn't configured and shows the direct email. |
| `CONTACT_TO_EMAIL` | server | Where requests are delivered (currently `waleedhassansfd@gmail.com`). |
| `CONTACT_FROM_EMAIL` | server | Sender, e.g. `MetroMatrix <noreply@yourdomain.com>`. **Must be on a domain verified in Resend** (a Gmail address cannot be a sender). |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URL for metadata, sitemap, robots, OG image. |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | public | `true` to load Vercel Analytics + Speed Insights. |

Variables are validated with zod in `src/lib/env.ts`; secrets never reach the browser.

## Editing content

All copy lives in typed files under `src/content/`; components only render props.

| File | Holds |
| --- | --- |
| `site.ts` | Brand lines, company (CRON Technologies), contact email/WhatsApp, nav, hero, key facts, trust section, footer, **feature flags** |
| `services.ts` | The three services, how-it-works steps, partners, zero-commission calculator copy |
| `roadmap.ts` · `faq.ts` · `legal.ts` | Roadmap and cities · FAQ · Privacy/Terms text |
| `pricing.ts` | Planned plans (hidden, see below) |
| `images.ts` | Every image with its alt text |

**Pricing is hidden** while MetroMatrix is free. Set `features.showPricing = true` in
`src/content/site.ts` to bring back the section, its nav link and the "Reserve founder pricing" buttons.

**Contact details:** `site.contact` in `src/content/site.ts` (email, phone, WhatsApp link).

## Design system

- **Colours** follow the MetroMatrix Brand Identity (Nov 2026): Ink `#0F1A17`, Ivory `#FAFAF7`
  (page canvas, never pure white), Green `#057857` (primary), Mint `#34C38F` (green on dark),
  Berry `#A8105A` / Blue `#1E6BE1` / Orange `#C25200` for Food / Health / Shopping only.
  Tokens are in `src/styles/globals.css` (`@theme`); dark bands use `data-theme="dark"`.
- **Type** matches FinMatrix: Instrument Sans 600 for headings, Roboto for everything else, with
  FinMatrix's roles (`text-hero-lg`, `text-display-lg`, `text-h3`, `text-body-md`, `text-label-md` …).
  Name a role in components, never a raw size.
- **Logo:** the official lockups and app icons from the brand kit are in `public/brand/`
  (`logo-light.svg` / `logo-dark.svg` are the cropped versions the site uses). Never recolour,
  reorder or stretch the tiles.
- One card shadow, hairline borders, status as a tinted badge with a dot. No decorative blobs
  or glows.

## App screenshots

`npm run screens:generate` renders `public/screens/*.png` at iPhone 15 size (393 × 852 pt @2×) with
the iOS status bar and home indicator:

- `home.png` is the app's real home screen, rebuilt from its source code
  (`~/MetroMatrix_App/screens/customer-home-screen/CustomerHome.tsx` and its components) with
  `next/og`. The only edit: shorter card photos so all three cards fit on screen.
- `food`, `health`, `shopping`, `rider` are faithful mockups using the app's own photos
  (licences in `scripts/screen-photos/CREDITS.md`).

To use real device captures instead, drop PNGs with the same names and size into `public/screens/`
(see the README there). After changing screenshots locally, delete `.next/cache/images` so a running
server stops serving old optimised copies.

## Contact form and email

`ContactForm` (react-hook-form) and `POST /api/contact` share one zod schema
(`src/lib/contact-schema.ts`). The route accepts JSON only, caps the body at 10 KB, strips HTML,
ignores honeypot submissions, rate-limits to 5 requests per 10 minutes per IP, then sends through
Resend with the visitor as `reply-to`. Responses are typed (`ContactResponse`).

The rate limiter is in-memory per server instance (`src/lib/rate-limit.ts`): enough to stop casual
abuse. For strict, global limits, replace it with Upstash Redis (`@upstash/ratelimit`).

### Resend setup

1. Create an account at resend.com and add your domain (for example `metromatrix.pk`).
2. Add the DNS records Resend shows (SPF/DKIM TXT records, plus the MX record for bounces) at your
   DNS provider, then click **Verify**.
3. Create an API key with "Sending access" and set `RESEND_API_KEY`.
4. Set `CONTACT_FROM_EMAIL` to an address on the verified domain, and `CONTACT_TO_EMAIL` to the inbox
   that should receive requests.

## Deploying to Vercel

1. Push the repository to GitHub/GitLab and **Import** it in Vercel (framework: Next.js, defaults are fine).
2. In **Settings → Environment Variables**, add the five variables above for Production (and Preview
   if you want the form to work there). Set `NEXT_PUBLIC_SITE_URL` to the final https URL.
3. Deploy. Every push to a branch gets a preview URL.
4. **Custom domain:** Settings → Domains → add the domain, then create the DNS records Vercel shows
   (an `A` record for the apex, a `CNAME` for `www`). Redeploy after changing `NEXT_PUBLIC_SITE_URL`.

## Security and SEO

- Headers in `next.config.ts`: Content-Security-Policy, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS, COOP. The CSP allows `'unsafe-inline'` scripts
  because nonces would force every page to render per request instead of being static; there are no
  third-party scripts other than Vercel Analytics.
- Metadata API (title template, OG/Twitter), generated OG image and icons, `sitemap.xml`,
  `robots.txt`, and JSON-LD (`Organization`, `MobileApplication`, `WebSite`) with no ratings or
  invented numbers.

## Content rules

No invented user counts, downloads, ratings, testimonials, partner logos or press quotes. Store
badges say "Coming soon" and link nowhere. Commission figures carry their source note. Health copy
makes no medical claims beyond verification and booking.

## Before launch: placeholders to replace

| What | Where |
| --- | --- |
| Production URL | `NEXT_PUBLIC_SITE_URL` |
| Resend key and a sender on a verified domain | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` |
| Privacy Policy and Terms (placeholder text, shown with a banner) | `src/content/legal.ts` |
| Links to the Dawn and Profit articles behind the commission figures | `src/content/services.ts` (`savingsExample.sourceNote`) |
| Store links once the apps are published (badges currently say "Coming soon") | `src/content/site.ts` (`hero.storeBadges`) |
| Social profiles (none shown until real ones exist) | `src/content/site.ts` (`site.socials`) |
| CRON Technologies' exact legal name, if different | `src/content/site.ts` (`site.company`) |
| A domain email instead of the personal Gmail, if preferred | `src/content/site.ts` (`site.contact`) |
| Real device screenshots, if wanted | `public/screens/` |
| Turn on analytics | `NEXT_PUBLIC_ENABLE_ANALYTICS=true` |
# metromatrix-website
