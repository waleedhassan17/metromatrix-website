/**
 * PLACEHOLDER legal copy. Replace with text reviewed by a lawyer before launch.
 */
export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  title: string;
  description: string;
  updated: string;
  placeholderNotice: string;
  sections: LegalSection[];
}

const notice =
  "This page is not legal advice and must be replaced with a reviewed policy before MetroMatrix launches.";

export const privacy: LegalDoc = {
  title: "Privacy Policy",
  description: "How MetroMatrix handles personal data. Placeholder until launch.",
  updated: "Draft",
  placeholderNotice: notice,
  sections: [
    {
      heading: "What this site collects",
      body: [
        "When you submit the early-access form we receive your name, email, optional phone number, role, city and message. We use them only to reply to your request.",
        "If analytics are enabled, we use privacy-friendly, cookie-free page analytics to understand which pages are useful. No advertising trackers are used.",
      ],
    },
    {
      heading: "Health information",
      body: [
        "Health records in the MetroMatrix app are private to the patient. This website does not collect health information; please do not include medical details in the contact form.",
      ],
    },
    {
      heading: "Sharing",
      body: [
        "We do not sell personal data. Form submissions are delivered by our email provider to the MetroMatrix team and are not shared with vendors or doctors.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "You can ask us to delete your early-access request at any time by emailing us from the address you used.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Questions about privacy can be sent to the email address in the site footer.",
      ],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of Use",
  description: "Terms for using the MetroMatrix website. Placeholder until launch.",
  updated: "Draft",
  placeholderNotice: notice,
  sections: [
    {
      heading: "About this site",
      body: [
        "This website describes the MetroMatrix app, a product of CRON Technologies, and lets you request early access. Features and cities shown as planned may change before or after launch.",
      ],
    },
    {
      heading: "Fees",
      body: [
        "MetroMatrix is free during launch. If that changes, partners will be told in advance, and MetroMatrix will not take a commission on orders.",
      ],
    },
    {
      heading: "Providers",
      body: [
        "Restaurants, home kitchens, doctors, clinics and brands on MetroMatrix are independent providers. MetroMatrix verifies providers before they go live but does not itself provide food, medical care or products.",
      ],
    },
    {
      heading: "Health",
      body: [
        "MetroMatrix helps you find and book verified doctors. It does not give medical advice. In an emergency, call your local emergency number.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "We may update these terms. The date at the top shows when they last changed.",
      ],
    },
  ],
};
