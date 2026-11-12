import type { City, RoadmapColumn } from "./types";

export const roadmapSection = {
  eyebrow: "Roadmap & cities",
  title: "Live today. Growing city by city.",
  intro:
    "What is in the app today, what is in development, and where MetroMatrix goes after Lahore. Each item carries its real status; we do not publish dates we cannot keep.",
};

export const roadmap: RoadmapColumn[] = [
  {
    status: "live",
    label: "Live",
    description: "In the app today.",
    items: [
      { title: "Food Court" },
      { title: "Digital Health" },
      { title: "Smart Shopping" },
      { title: "Single account across services" },
      { title: "Notifications" },
    ],
  },
  {
    status: "next",
    label: "Next",
    description: "In active development.",
    items: [
      {
        title: "In-app payments",
        detail: "JazzCash, Easypaisa and cards. The money still goes to the vendor.",
      },
      { title: "Brand dashboard" },
      { title: "Admin dashboard" },
    ],
  },
  {
    status: "later",
    label: "Later",
    description: "Planned after the core services mature.",
    items: [
      { title: "Home services", detail: "Plumbers, electricians, cleaners, tutors." },
      { title: "Pharmacy & groceries" },
      { title: "E-prescriptions & lab tests" },
    ],
  },
  {
    status: "future",
    label: "Future",
    description: "On the horizon.",
    items: [
      { title: "Events" },
      { title: "Parking" },
      { title: "Civic alerts" },
      { title: "Multi-city" },
    ],
  },
];

export const cityRollout = {
  title: "City rollout",
  intro: "Lahore first. Then Pakistan's major cities. Then the Gulf and global cities.",
  stages: [
    { id: "launching", label: "Launching now" },
    { id: "pakistan", label: "Next in Pakistan" },
    { id: "global", label: "Then" },
  ] as const,
  cities: [
    { name: "Lahore", stage: "launching" },
    { name: "Karachi", stage: "pakistan" },
    { name: "Islamabad / Rawalpindi", stage: "pakistan" },
    { name: "Faisalabad", stage: "pakistan" },
    { name: "Multan", stage: "pakistan" },
    { name: "Peshawar", stage: "pakistan" },
    { name: "Gulf cities", stage: "global" },
    { name: "Global cities", stage: "global" },
  ] satisfies City[],
};
