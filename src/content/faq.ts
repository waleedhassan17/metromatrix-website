import type { FaqItem } from "./types";

export const faqSection = {
  eyebrow: "FAQ",
  title: "Questions, answered plainly.",
  intro: "If your question is not here, ask us directly from the form below.",
};

export const faqs: FaqItem[] = [
  {
    id: "zero-commission",
    question: "What does zero commission actually mean?",
    answer:
      "MetroMatrix never takes a percentage of a sale. Vendors keep 100% of every order and customers pay the vendor's own menu or list price. During launch MetroMatrix is free for customers and partners alike.",
  },
  {
    id: "payments",
    question: "How do payments work?",
    answer:
      "Today customers pay the vendor directly: cash on delivery, or a bank or wallet transfer to the vendor's own account. In-app payments through JazzCash, Easypaisa and cards are next on the roadmap, and the money will still go straight to the vendor.",
  },
  {
    id: "doctor-verification",
    question: "How are doctors verified?",
    answer:
      "Before a doctor goes live we check their PMDC registration and qualifications. MetroMatrix lists and books verified doctors; it does not provide medical advice or treatment itself.",
  },
  {
    id: "other-apps",
    question: "Can I keep using other delivery or booking apps?",
    answer:
      "Yes. There is no exclusivity. Many partners run MetroMatrix alongside other apps and simply keep more of what they earn on MetroMatrix orders.",
  },
  {
    id: "delivery",
    question: "Who delivers the food?",
    answer:
      "The vendor's own riders. Restaurants and home kitchens set their delivery area and manage their riders through the rider view. MetroMatrix does not run a rider fleet.",
  },
  {
    id: "launch-timing",
    question: "When does MetroMatrix launch?",
    answer:
      "We are launching in Lahore. Join the early-access list and we will email you as soon as the app is available for your role. We do not publish launch dates we cannot keep.",
  },
  {
    id: "cities",
    question: "Which cities are next?",
    answer:
      "After Lahore: Karachi, Islamabad and Rawalpindi, Faisalabad, Multan and Peshawar. Then Gulf and other global cities. Tell us your city in the form and we will prioritise where demand is.",
  },
  {
    id: "privacy",
    question: "What happens to my data?",
    answer:
      "Health records are private to you. Contact details from this site are used only to reply to your request. We do not sell personal data. Full details are in the Privacy Policy.",
  },
];
