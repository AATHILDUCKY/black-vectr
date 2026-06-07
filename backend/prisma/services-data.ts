// Single source of truth for the "Solutions" services shown on the site.
// Used by the full seed (seed.ts) and the targeted reseed (reseed-services.ts).
// Offensive-security & assessment focused offering.

export interface ServiceSeed {
  title: string;
  slug: string;
  icon: string; // lucide icon key — must exist in frontend/components/icon.tsx MAP
  shortDescription: string;
  longDescription: string;
  features: string[];
  order: number;
}

export const SERVICES: ServiceSeed[] = [
  {
    title: "Penetration Testing",
    slug: "penetration-testing",
    icon: "Bug",
    shortDescription:
      "Goal-driven, manual penetration testing across web, mobile, API, network, and cloud — surfacing the exploitable paths automated scanners miss.",
    longDescription:
      "Our penetration tests go far beyond automated scanning. Certified offensive engineers manually attack your web and mobile applications, APIs, internal and external networks, and cloud environments to chain real weaknesses into demonstrable business impact. Every engagement is scoped to your objectives and delivered as a clear, prioritized report with proof-of-concept exploits, risk ratings, and concrete remediation guidance — backed by a free retest to confirm your fixes hold.",
    features: [
      "Web, API & mobile application testing",
      "Internal & external network penetration testing",
      "Cloud (AWS / Azure / GCP) configuration & exploitation",
      "Manual exploitation with proof-of-concept",
      "Risk-rated report & remediation guidance",
      "Free remediation retest",
    ],
    order: 1,
  },
  {
    title: "Vulnerability Assessment",
    slug: "vulnerability-assessment",
    icon: "ScanSearch",
    shortDescription:
      "Broad, systematic discovery and validation of weaknesses across infrastructure, applications, and cloud — with false positives weeded out.",
    longDescription:
      "A vulnerability assessment gives you a comprehensive, validated picture of your weaknesses at a point in time. We combine authenticated and unauthenticated scanning with hands-on manual validation to eliminate false positives, then rank every finding by real-world exploitability and asset criticality. You walk away with a clear baseline of your security posture and a prioritized roadmap of exactly what to fix first.",
    features: [
      "Authenticated & unauthenticated scanning",
      "Manual validation to remove false positives",
      "Network, host, application & cloud coverage",
      "Exploitability-based risk ranking",
      "Clear posture baseline & remediation roadmap",
    ],
    order: 2,
  },
  {
    title: "Security Awareness Training",
    slug: "security-awareness-training",
    icon: "GraduationCap",
    shortDescription:
      "Practical security awareness programs for enterprises and individuals — turning your people from the weakest link into a strong first line of defense.",
    longDescription:
      "Most breaches start with a person, not a payload. We build engaging, role-based awareness programs for both organizations and individuals — covering phishing, social engineering, passwords and MFA, safe browsing, and data handling. Enterprise programs add simulated phishing campaigns, measurable metrics, and compliance-ready reporting; individual training helps freelancers, executives, and families stay safe online.",
    features: [
      "Role-based training for staff & leadership",
      "Programs for enterprises and individuals",
      "Simulated phishing campaigns",
      "Phishing, social engineering & password hygiene",
      "Measurable metrics & compliance reporting",
      "Ongoing refreshers & onboarding modules",
    ],
    order: 3,
  },
];
