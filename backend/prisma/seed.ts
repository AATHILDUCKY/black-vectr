import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { SERVICES } from "./services-data";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@blackvectr.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Site Admin";

async function main() {
  console.log("🌱 Seeding database…");

  // ── Admin user ──────────────────────────────────────────────────────────
  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME, role: "admin" },
    create: { email: ADMIN_EMAIL, password, name: ADMIN_NAME, role: "admin" },
  });

  // ── Site settings ─────────────────────────────────────────────────────────
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {
      brandName: "BlackVectr",
      tagline: "Offensive security, penetration testing, and full-scope red team operations.",
      contactEmail: "hello@blackvectr.com",
      contactPhone: "+1 (415) 555-0142",
      address: "548 Market St, San Francisco, CA",
      socials: JSON.stringify({
        github: "https://github.com/blackvectr",
        x: "https://x.com/blackvectr",
        linkedin: "https://linkedin.com/company/blackvectr",
      }),
      heroHeadline: "We break in. So no one else can.",
      heroSubheadline:
        "BlackVectr is a dedicated offensive security team — penetration testing and full-scope red team operations. We emulate real-world adversaries against your applications, networks, cloud, and people, then prove every exploitable path and show you exactly how to close it.",
      heroCta: "Book an engagement",
      seoTitle: "BlackVectr — Offensive Security & Red Team Operations",
      seoDescription:
        "BlackVectr is an offensive security firm specializing in penetration testing, red team operations, and adversary emulation — proving exploitable risk across applications, networks, cloud, and people.",
    },
    create: {
      id: 1,
      brandName: "BlackVectr",
      tagline: "Offensive security, penetration testing, and full-scope red team operations.",
      contactEmail: "hello@blackvectr.com",
      contactPhone: "+1 (415) 555-0142",
      address: "548 Market St, San Francisco, CA",
      socials: JSON.stringify({
        github: "https://github.com/blackvectr",
        x: "https://x.com/blackvectr",
        linkedin: "https://linkedin.com/company/blackvectr",
      }),
      heroHeadline: "We break in. So no one else can.",
      heroSubheadline:
        "BlackVectr is a dedicated offensive security team — penetration testing and full-scope red team operations. We emulate real-world adversaries against your applications, networks, cloud, and people, then prove every exploitable path and show you exactly how to close it.",
      heroCta: "Book an engagement",
      seoTitle: "BlackVectr — Offensive Security & Red Team Operations",
      seoDescription:
        "BlackVectr is an offensive security firm specializing in penetration testing, red team operations, and adversary emulation — proving exploitable risk across applications, networks, cloud, and people.",
    },
  });

  // ── Solutions ───────────────────────────────────────────────────────────────
  const services = SERVICES;
  await prisma.service.deleteMany();
  for (const s of services) {
    await prisma.service.create({
      data: { ...s, features: JSON.stringify(s.features) },
    });
  }

  // ── Categories + Posts ──────────────────────────────────────────────────────
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  const catInsights = await prisma.category.create({
    data: { name: "Threat Research", slug: "threat-research" },
  });
  const catGuides = await prisma.category.create({
    data: { name: "Playbooks", slug: "playbooks" },
  });

  const posts = [
    {
      title: "Detection engineering: from log noise to high-fidelity alerts",
      slug: "detection-engineering-high-fidelity-alerts",
      excerpt:
        "Most SOCs drown in alerts. Here's how we map detections to MITRE ATT&CK and tune them to cut false positives without missing real threats.",
      body: "## Signal over noise\n\nA SIEM full of low-fidelity rules trains analysts to ignore it. We build detection content the way engineers build software — version-controlled, tested, and mapped to MITRE ATT&CK.\n\n- Start from adversary techniques, not vendor defaults\n- Tune to your environment's baseline\n- Measure precision and recall per detection\n\nThe outcome: fewer, better alerts and a faster mean time to respond.",
      categoryId: catInsights.id,
      tags: ["detection", "siem", "soc"],
    },
    {
      title: "A practical cloud hardening checklist for 2026",
      slug: "cloud-hardening-checklist-2026",
      excerpt:
        "Skip the fluff. A field-tested checklist covering identity, posture, and workload security across AWS, Azure, and GCP.",
      body: "## Start with identity\n\nMost cloud breaches trace back to over-privileged identities and misconfigurations, not zero-days. Fix those first.\n\n1. Enforce MFA and remove standing admin access\n2. Baseline posture with CSPM and remediate drift\n3. Protect workloads and containers at runtime\n4. Onboard cloud audit logs into your SIEM",
      categoryId: catGuides.id,
      tags: ["cloud", "hardening", "guide"],
    },
    {
      title: "Risk-based vulnerability management that actually reduces risk",
      slug: "risk-based-vulnerability-management",
      excerpt:
        "CVSS alone doesn't tell you what to fix. How to prioritize by real-world exploitability and shrink attack surface that matters.",
      body: "## Exploitability over severity\n\nA 'critical' CVE on an isolated host can matter less than a 'medium' on an internet-facing crown-jewel asset. We prioritize using exploit intelligence, asset context, and reachability.\n\n- Correlate scan output with threat intel and EPSS\n- Weight by asset criticality and exposure\n- Orchestrate remediation across owners\n- Report progress in business terms",
      categoryId: catGuides.id,
      tags: ["vulnerability", "risk", "guide"],
    },
  ];
  for (const p of posts) {
    await prisma.post.create({
      data: {
        ...p,
        tags: JSON.stringify(p.tags),
        status: "published",
        publishedAt: new Date(),
        seoTitle: p.title,
        seoDescription: p.excerpt,
      },
    });
  }

  // ── Portfolio ─────────────────────────────────────────────────────────────
  await prisma.portfolioItem.deleteMany();
  const portfolio = [
    {
      title: "Northbank — 24/7 SOC & SIEM modernization",
      slug: "northbank-soc-siem",
      client: "Northbank",
      category: "SIEM & SOC",
      summary:
        "Re-architected a noisy legacy SIEM, onboarded 40+ log sources, and stood up managed detection content with round-the-clock SOC coverage.",
      results: "Mean time to respond cut from 4 hours to 6 minutes; 71% fewer false positives.",
      featured: true,
      order: 1,
    },
    {
      title: "Vantage Cloud — multi-cloud posture & identity hardening",
      slug: "vantage-cloud-security",
      client: "Vantage Cloud",
      category: "Cloud Security",
      summary:
        "Deployed CSPM across AWS, Azure, and GCP, removed standing admin access, and added runtime workload detection.",
      results: "Closed 1,900+ critical misconfigurations; 92% reduction in over-privileged identities.",
      featured: true,
      order: 2,
    },
    {
      title: "Helix Health — risk-based vulnerability program",
      slug: "helix-health-vuln-management",
      client: "Helix Health",
      category: "Vulnerability Management",
      summary:
        "Built a risk-based prioritization and remediation orchestration program across 12,000 assets with executive reporting.",
      results: "Critical exposure backlog down 84% in two quarters; remediation SLA adherence at 96%.",
      featured: false,
      order: 3,
    },
    {
      title: "Orbital — secure landing zone & hardened Kubernetes",
      slug: "orbital-platform-engineering",
      client: "Orbital",
      category: "Platform Engineering",
      summary:
        "Designed secure-by-default landing zones and a hardened Kubernetes platform with golden paths for 30 delivery teams.",
      results: "Provisioning time cut from weeks to hours; CIS benchmark compliance at 98%.",
      featured: false,
      order: 4,
    },
  ];
  for (const item of portfolio) {
    await prisma.portfolioItem.create({
      data: { ...item, images: JSON.stringify([]) },
    });
  }

  // ── Testimonials ────────────────────────────────────────────────────────────
  await prisma.testimonial.deleteMany();
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CISO",
      company: "Northbank",
      quote:
        "BlackVectr turned our SIEM from a liability into our sharpest tool. Response times dropped from hours to minutes — and my analysts finally trust the alerts.",
      rating: 5,
      order: 1,
    },
    {
      name: "Marcus Reed",
      role: "VP Engineering",
      company: "Vantage Cloud",
      quote:
        "They found and closed cloud misconfigurations we didn't know existed, without slowing delivery. Security-by-default is now just how we ship.",
      rating: 5,
      order: 2,
    },
    {
      name: "Priya Nair",
      role: "Head of Risk",
      company: "Helix Health",
      quote:
        "Finally, a partner that reports risk in terms the board understands. Our remediation actually maps to real-world exploitability now.",
      rating: 5,
      order: 3,
    },
  ];
  for (const t of testimonials) await prisma.testimonial.create({ data: t });

  // ── Team ─────────────────────────────────────────────────────────────────────
  await prisma.teamMember.deleteMany();
  const team = [
    { name: "Alex Rivera", role: "Founder & Principal Consultant", bio: "15 years in offensive and defensive security; former incident response lead.", order: 1 },
    { name: "Jordan Lee", role: "Head of Detection Engineering", bio: "Builds high-fidelity detection content mapped to MITRE ATT&CK.", order: 2 },
    { name: "Sam Okafor", role: "Cloud Security Lead", bio: "AWS, Azure, and GCP posture, identity, and workload protection.", order: 3 },
    { name: "Taylor Brooks", role: "SOC Operations Manager", bio: "Runs 24/7 managed monitoring and incident response.", order: 4 },
  ];
  for (const m of team) {
    await prisma.teamMember.create({
      data: { ...m, socials: JSON.stringify({ linkedin: "https://linkedin.com" }) },
    });
  }

  // ── Open-source projects ──────────────────────────────────────────────────
  await prisma.project.deleteMany();
  const projects = [
    {
      title: "vectr-recon",
      slug: "vectr-recon",
      tagline: "Fast, modular attack-surface recon for red teams.",
      description:
        "## vectr-recon\n\nA fast, modular reconnaissance framework for offensive engagements. Chains subdomain enumeration, port scanning, and service fingerprinting into a single pipeline, then exports an attack-surface map ready for triage. Built to be scriptable and CI-friendly.\n\n- Pluggable modules for each recon stage\n- JSON / Markdown reporting\n- Rate-limited and scope-aware by default",
      language: "Go",
      topics: ["recon", "osint", "red-team", "cli"],
      repoUrl: "https://github.com/blackvectr/vectr-recon",
      stars: 1280,
      license: "Apache-2.0",
      status: "active",
      resources: [
        { label: "GitHub", url: "https://github.com/blackvectr/vectr-recon" },
        { label: "Documentation", url: "https://github.com/blackvectr/vectr-recon#readme" },
        { label: "Releases", url: "https://github.com/blackvectr/vectr-recon/releases" },
      ],
      featured: true,
      order: 1,
    },
    {
      title: "payload-forge",
      slug: "payload-forge",
      tagline: "Composable payload generation for authorized engagements.",
      description:
        "## payload-forge\n\nA library and CLI for generating and templating payloads during authorized penetration tests. Focuses on readability and safety — every payload is annotated, scoped, and reproducible so findings are easy to validate and remediate.\n\n> For use only within signed-off, in-scope engagements.",
      language: "Python",
      topics: ["pentest", "tooling", "library"],
      repoUrl: "https://github.com/blackvectr/payload-forge",
      stars: 642,
      license: "MIT",
      status: "active",
      resources: [
        { label: "GitHub", url: "https://github.com/blackvectr/payload-forge" },
        { label: "PyPI", url: "https://pypi.org/project/payload-forge" },
      ],
      featured: true,
      order: 2,
    },
    {
      title: "edr-lab",
      slug: "edr-lab",
      tagline: "A safe sandbox for studying detection & evasion techniques.",
      description:
        "## edr-lab\n\nA self-contained lab environment for blue and purple teams to study how common offensive techniques surface in telemetry. Ships with reproducible scenarios mapped to MITRE ATT&CK and a teardown script so nothing is left running.",
      language: "Rust",
      topics: ["purple-team", "detection", "mitre-attack", "lab"],
      repoUrl: "https://github.com/blackvectr/edr-lab",
      stars: 310,
      license: "MIT",
      status: "wip",
      resources: [
        { label: "GitHub", url: "https://github.com/blackvectr/edr-lab" },
        { label: "Scenario catalog", url: "https://github.com/blackvectr/edr-lab/wiki" },
      ],
      featured: false,
      order: 3,
    },
  ];
  for (const p of projects) {
    await prisma.project.create({
      data: {
        ...p,
        topics: JSON.stringify(p.topics),
        resources: JSON.stringify(p.resources),
      },
    });
  }

  // ── Trusted-by logos (homepage marquee) ──────────────────────────────────────
  await prisma.logo.deleteMany();
  const logos = [
    "Northbank",
    "Helix Health",
    "Orbital",
    "Vantage Cloud",
    "Meridian",
    "Ironclad",
    "Pendulum",
    "Aether Labs",
  ];
  await prisma.logo.createMany({
    data: logos.map((name, i) => ({ name, order: i + 1 })),
  });

  // ── Sample leads + subscribers ───────────────────────────────────────────────
  await prisma.lead.deleteMany();
  await prisma.lead.createMany({
    data: [
      { name: "Dana White", email: "dana@example.com", company: "Brightside", service: "Cloud Security", message: "We're moving to AWS and need a posture review before go-live.", status: "new" },
      { name: "Omar Haddad", email: "omar@example.com", company: "Peak Fintech", service: "Security Analytics and SIEMs", message: "Our SIEM is too noisy — looking for managed SOC and detection tuning.", status: "read" },
      { name: "Lena Fischer", email: "lena@example.com", service: "Vulnerability Management", message: "Need help operationalizing scanning and remediation across our estate.", status: "handled" },
    ],
  });

  await prisma.newsletterSubscriber.deleteMany();
  await prisma.newsletterSubscriber.createMany({
    data: [{ email: "reader1@example.com" }, { email: "reader2@example.com" }],
  });

  console.log("✅ Seed complete.");
  console.log("   ──────────────────────────────────────────");
  console.log(`   Admin login: ${ADMIN_EMAIL}`);
  console.log(`   Password:    ${ADMIN_PASSWORD}`);
  console.log("   ──────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
