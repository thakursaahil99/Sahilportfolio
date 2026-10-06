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
    original: { src: "/hero/original.jpg", focus: [0.52, 0.34] as [number, number] },
  },
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
  education: [{ title: "Full-Stack Web Development", school: "", year: "" }],
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
    items: ["Node.js", "Express.js", "PHP", "Laravel", "REST APIs", "GraphQL", "JWT Auth"],
  },
  {
    category: "DATABASE",
    items: ["MongoDB", "Mongoose", "MySQL", "PostgreSQL", "Firebase"],
  },
  {
    category: "COMMERCE",
    items: ["Magento 2", "Razorpay", "Payment Gateways", "Multi-vendor"],
  },
  {
    category: "MOTION & MOBILE",
    items: ["Framer Motion", "GSAP", "WebGL", "Flutter"],
  },
  {
    category: "TOOLS & AI",
    items: ["Git", "GitHub", "Vercel", "Postman", "Figma", "AI Integrations"],
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
  { name: "AI integrations", years: "2 YRS", match: ["Ollama", "Qdrant", "Vapi"] },
];

// Newest first. Shown on the About page timeline and the résumé.
// TODO: add the 2022–2023 role(s) at the end, same shape as the entries below.
export const experience = [
  {
    company: "Glide in Bir",
    slug: "glide-in-bir",
    role: "Founder & Full-Stack Developer",
    date: "2026 — Present",
    description:
      "Building an all-in-one booking platform for paragliding experiences in Bir Billing — Razorpay payments, an AI booking assistant, and a PostgreSQL-backed reservation system.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Razorpay"],
  },
  {
    company: "Dell Store",
    slug: "dell-store",
    role: "Full-Stack Developer",
    date: "2025",
    description:
      "Delivered a full-stack Magento 2 storefront with a custom catalog and checkout flow for an eCommerce client.",
    tech: ["Magento 2", "PHP", "Tailwind CSS", "GraphQL"],
  },
  {
    company: "PlantShed",
    slug: "plantshed",
    role: "Frontend Developer",
    date: "2024",
    description:
      "Rebuilt the storefront frontend for a plant eCommerce brand, focused on performance and conversion.",
    tech: ["Magento 2", "Tailwind CSS", "Alpine.js"],
  },
];
