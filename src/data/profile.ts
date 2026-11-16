import { projects } from "./projects";

// first professional project — every "years of experience" figure derives from this
const CAREER_START = 2022;
const YEARS = new Date().getFullYear() - CAREER_START;

export const profile = {
  name: "Sahil Thakur",
  role: "Full-Stack Developer",
  location: "Bir Billing, Himachal Pradesh, India",
  status: "Open to full-time roles",
  email: "sahilthakur961999@gmail.com",
  bio: [
    "I build fast, scalable and modern digital experiences — from Magento storefronts and Laravel APIs to Node.js services and AI-powered Next.js interfaces.",
    "Currently building Glide in Bir, an all-in-one booking platform for paragliding experiences in Bir Billing, while taking on select freelance eCommerce and web app engagements.",
  ],
  // Hero "x-ray" reveal: the superhero layer shows by default and the
  // original photo melts through wherever the liquid lens goes.
  // Use the same framing for both images so the reveal lines up; `focus` is
  // the point (0–1, from top-left) kept in frame on narrow screens — the face.
  heroImages: {
    superhero: { src: "/hero/superhero.jpg", focus: [0.58, 0.32] as [number, number] },
    original: { src: "/hero/sahil.jpg", focus: [0.49, 0.3] as [number, number] },
  },
  // the same photo, cropped for the About page, the menu and small avatars
  portrait: "/about/sahil.jpg",
  avatar: "/about/sahil-avatar.jpg",
  roles: [
    "FULL-STACK DEVELOPER",
    "MAGENTO 2 SPECIALIST",
    "AI INTERFACE BUILDER",
    "FOUNDER — GLIDE IN BIR",
  ],
  coordinates: "32.04°N / 76.72°E",
  timezone: "Asia/Kolkata",
  stats: [
    { value: YEARS, suffix: "+", label: "Years shipping" },
    { value: 30, suffix: "+", label: "Projects delivered" },
    { value: 35, suffix: "+", label: "Technologies used" },
    { value: projects.length, suffix: "", label: "Case studies" },
  ],
  experienceYears: `${YEARS}+`,
  // Shown on the résumé. Fill in school / year when ready — empty fields are simply left out.
  education: [{ title: "Full-Stack Web Development", school: "Training & internship", year: "2022 — 2023" }],
  // what I want to go deeper into next
  focus: ["AI integrations", "Motion & 3D web", "Paragliding tech"],
  socials: [
    { label: "GitHub", href: "https://github.com/thakursaahil99" },
    { label: "LinkedIn", href: "https://linkedin.com/in/sahil-thakur" },
  ],
};

export const skillGroups = [
  {
    category: "FRONTEND",
    items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Bootstrap", "jQuery", "Alpine.js"],
  },
  {
    category: "BACKEND",
    items: ["Node.js", "Express.js", "NestJS", "Python", "FastAPI", "PHP", "Laravel", "REST APIs", "GraphQL", "WebSockets", "JWT Auth"],
  },
  {
    category: "DATABASE",
    items: ["PostgreSQL", "Prisma", "MongoDB", "Mongoose", "MySQL", "Redis", "Supabase", "Firebase"],
  },
  {
    category: "COMMERCE",
    items: ["Magento 2", "Razorpay", "Payment Gateways", "Multi-vendor"],
  },
  {
    category: "MOTION & MOBILE",
    items: ["Framer Motion", "GSAP", "Three.js / R3F", "WebGL", "Flutter", "React Native / Expo"],
  },
  {
    category: "TOOLS & AI",
    items: ["Git", "GitHub", "Docker", "Vercel", "Postman", "Figma", "LLM & RAG integrations"],
  },
];

// Core stack shown on the About page. `match` lists stack names (prefix match) used to
// count how many shipped projects in data/projects.ts used the skill.
export const skills = [
  { name: "Next.js / React", years: `${YEARS} YRS`, match: ["Next.js", "React"] },
  { name: "TypeScript", years: `${YEARS} YRS`, match: ["TypeScript"] },
  { name: "Node.js / NestJS", years: `${YEARS} YRS`, match: ["Node.js", "NestJS", "Express"] },
  { name: "Magento 2 / PHP", years: "4 YRS", match: ["Magento 2", "PHP", "Laravel"] },
  { name: "PostgreSQL / MySQL", years: "4 YRS", match: ["PostgreSQL", "MySQL"] },
  { name: "Motion & 3D", years: "", match: ["GSAP", "Framer Motion", "Three.js"] },
  { name: "AI integrations", years: "2 YRS", match: ["Ollama", "Qdrant", "Vapi", "PostgreSQL + pgvector"] },
];

/** One line in the journey. `kind` separates jobs from client projects on the résumé. */
export interface Job {
  company: string;
  role: string;
  date: string;
  kind: "role" | "client";
  description: string;
  tech: string[];
  /** case study in data/projects.ts — gives the entry its screenshot and link */
  slug?: string;
  /** shown on the timeline card when there is no case study to take features from */
  points?: string[];
}

// The whole journey, newest first. Shown on the About page timeline and the résumé.
export const experience: Job[] = [
  {
    company: "Glide in Bir",
    slug: "glide-in-bir",
    kind: "role",
    role: "Founder & Full-Stack Developer",
    date: "2026 — Present",
    description:
      "Building an all-in-one booking platform for paragliding experiences in Bir Billing — Razorpay payments, an AI booking assistant, and a PostgreSQL-backed reservation system.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Razorpay"],
  },
  {
    company: "Redbean Hospitality",
    slug: "redbean-hospitality",
    kind: "client",
    role: "Web Developer",
    date: "2025 — 2026",
    description:
      "Built the company's web presence — corporate site redesigns, the founder's personal-brand sites and an internal role-based HR portal covering tasks, leaves, salary and attendance for eleven departments.",
    tech: ["Next.js", "React", "Node.js", "Express", "MongoDB", "GSAP"],
  },
  {
    company: "Dell Store",
    slug: "dell-store",
    kind: "client",
    role: "Full-Stack Developer",
    date: "2025",
    description:
      "Delivered a full-stack Magento 2 storefront with a custom catalog and checkout flow for an eCommerce client.",
    tech: ["Magento 2", "PHP", "Tailwind CSS", "GraphQL"],
  },
  {
    company: "PlantShed",
    slug: "plantshed",
    kind: "client",
    role: "Frontend Developer",
    date: "2024",
    description:
      "Rebuilt the storefront frontend for a plant eCommerce brand, focused on performance and conversion.",
    tech: ["Magento 2", "Tailwind CSS", "Alpine.js"],
  },
  {
    company: "Technodeft",
    kind: "role",
    role: "Magento & Laravel Developer",
    date: "2023 — 2026",
    description:
      "Developed Magento 2 eCommerce solutions, custom modules, Laravel APIs, admin dashboards and backend systems, with a focus on performance optimisation and scalable applications.",
    tech: ["Magento 2", "Laravel", "PHP", "MySQL"],
    points: ["Magento 2 storefronts and custom modules", "Laravel APIs and admin dashboards", "Performance optimisation and backend systems"],
  },
  {
    company: "Training & Internship",
    kind: "role",
    role: "Web Development Intern / Trainee",
    date: "2022 — 2023",
    description:
      "Where it started: web development training and an internship covering frontend fundamentals, backend development and database concepts, building real-world web projects.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "WordPress"],
    points: ["Frontend fundamentals — HTML, CSS, JavaScript", "Backend development and database concepts", "First real-world web projects"],
  },
];

// Short lines for the résumé and the About fact sheet.
export const highlights = [
  "Founder of Glide in Bir — a paragliding booking platform with online payments and an AI voice assistant.",
  `${projects.length} projects shipped across platforms, eCommerce, AI tools and brand sites.`,
  "Magento 2 and Next.js storefronts built for speed and conversion.",
  "Motion and 3D sites with GSAP, Three.js, Lenis and Framer Motion.",
];
