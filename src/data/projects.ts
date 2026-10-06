export type Accent = "cyan" | "red" | "blue" | "orange" | "green" | "violet";

export interface GalleryShot {
  src: string;
  caption: string;
  /** live URL for this particular build, when it differs from the project link */
  url?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** one line, shown on cards and the work index */
  tagline: string;
  category: "Web App" | "Platform" | "eCommerce" | "Corporate" | "Personal Brand";
  /** 2–3 sentence summary for cards */
  summary: string;
  /** paragraphs for the case-study overview */
  overview: string[];
  /** what was built — shown as a numbered list on the case study */
  features: string[];
  /** grouped tech stack for the case study */
  stack: { label: string; items: string[] }[];
  /** flat tech list for cards (derived from stack when omitted) */
  tags?: string[];
  /** front-page screenshot (1440×900); omit to show generative artwork */
  cover?: string;
  gallery?: GalleryShot[];
  accent: Accent;
  year: string;
  role: string;
  link?: string;
  repo?: string;
  /** the result in one or two sentences; falls back to a factual "shipped" line when omitted */
  outcome?: string;
  /** headline numbers for the result, e.g. { value: "40%", label: "faster page loads" } — only real figures */
  metrics?: { value: string; label: string }[];
  featured?: boolean;
}

const GH = "https://github.com/thakursaahil99";

export const projects: Project[] = [
  {
    slug: "glide-in-bir",
    title: "Glide in Bir",
    tagline: "Paragliding booking platform for Bir Billing",
    category: "Platform",
    summary:
      "An all-in-one booking platform for Bir Billing — tandem flights, certification courses, hotels, camping and travel with real-time availability, Razorpay payments and an AI voice assistant.",
    overview: [
      "Bir Billing is India's paragliding capital, but booking a flight, a course and a place to stay meant juggling WhatsApp chats with a dozen operators. Glide in Bir puts the whole trip in one place.",
      "Travellers pick a flight or course, see live slot availability, pay online and get a QR ticket by email. \"Ask Sahu Bhai\" — a voice-capable AI assistant — answers questions and recommends the right package.",
    ],
    features: [
      "Tandem flight, course, hotel, camping, trekking and travel booking in one flow",
      "Real-time slot availability backed by PostgreSQL through Prisma",
      "Razorpay checkout with QR-code tickets delivered by email (Resend)",
      "\"Ask Sahu Bhai\" AI assistant with voice calls via Vapi",
      "3D scenes with React Three Fiber, Vercel Analytics & Speed Insights",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js / R3F"] },
      { label: "Backend", items: ["Next.js API routes", "Prisma", "PostgreSQL", "Zod", "bcrypt"] },
      { label: "Services", items: ["Razorpay", "Resend", "Vapi Voice AI", "Vercel"] },
    ],
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Razorpay", "AI"],
    cover: "/projects/glide-in-bir.jpg",
    gallery: [
      { src: "/projects/glide-in-bir/sections-1.jpg", caption: "Popular tandem flights" },
      { src: "/projects/glide-in-bir/sections-2.jpg", caption: "Certification courses" },
      { src: "/projects/glide-in-bir/sections-3.jpg", caption: "Stays near the launch site" },
    ],
    accent: "orange",
    year: "2026",
    role: "Founder & Full-Stack Developer",
    link: "https://glideinbir.vercel.app",
    repo: `${GH}/glideinbir`,
    featured: true,
  },
  {
    slug: "glideinbir-vos",
    title: "Glideinbir VOS",
    tagline: "Operating system for vehicle service workshops",
    category: "Platform",
    summary:
      "A vehicle operating system for service workshops — bookings, job cards, spare parts, payments and invoices for cars, bikes, scooters and EVs, with customers kept in the loop at every step.",
    overview: [
      "Vehicle workshops juggle bookings, repair progress, spare parts and billing across paper, phone calls and spreadsheets. The goal: one platform where every workshop, vehicle and customer lives together.",
      "I built it as a multi-tenant React app on a versioned REST API. Each workshop registers as its own agency and goes live only after a Super Admin approves it, and role-based access decides what super admins, agency admins, staff and customers can see and do.",
    ],
    features: [
      "Bookings, job cards, spare parts, payments and invoices in one workshop platform",
      "Multi-tenant agencies with Super Admin approval before going live",
      "Role-based access for super admins, agency admins, staff and customers",
      "Customer accounts to book services and follow job-card progress until pickup",
      "Agency onboarding with business, GSTIN and address details",
    ],
    stack: [
      { label: "Frontend", items: ["React", "Vite", "Tailwind CSS"] },
      { label: "Platform", items: ["REST API (v1)", "Token auth", "Role-based access"] },
      { label: "Hosting", items: ["Vercel"] },
    ],
    cover: "/projects/glideinbir-vos/cover-0.jpg",
    gallery: [
      { src: "/projects/glideinbir-vos/register.jpg", caption: "Customer sign-up", url: "https://glideinbir-vos.vercel.app" },
      { src: "/projects/glideinbir-vos/agency.jpg", caption: "Agency onboarding — approved by a Super Admin", url: "https://glideinbir-vos.vercel.app" },
    ],
    accent: "violet",
    year: "2026",
    role: "Full-Stack Developer",
    link: "https://glideinbir-vos.vercel.app",
    featured: true,
  },
  {
    slug: "glido",
    title: "Glido",
    tagline: "Food, grocery & cab super-app",
    category: "Platform",
    summary:
      "A local-commerce super-app — browse, cart, checkout, pay and track food orders live — with a NestJS API, real-time Socket.IO tracking, an admin panel and Flutter apps for riders and partners.",
    overview: [
      "Glido is a Blinkit + Swiggy + Uber style super-app scoped down to one vertical that works end to end: Glido Food. Grocery and Cab share the same account, brand and architecture, ready to be built next.",
      "Everything is real — PostgreSQL with DB-level enums and constraints, OTP auth with JWT refresh tokens, server-side pricing and a validated order state machine, live tracking over WebSockets and a full admin panel.",
    ],
    features: [
      "Customer web app: restaurant browse & search, menus, cart, checkout, order history",
      "Live order tracking over Socket.IO with a validated status state machine",
      "OTP login with JWT access / refresh tokens",
      "Admin panel — live stats, restaurant approval, menu CMS, coupons, banners, users",
      "Razorpay payments with a zero-config mock fallback; Swagger API docs",
      "Flutter apps for delivery riders and restaurant partners in the same monorepo",
    ],
    stack: [
      { label: "Web", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Leaflet", "Recharts"] },
      { label: "API", items: ["NestJS", "Node.js", "Express", "Socket.IO", "Passport JWT", "Swagger"] },
      { label: "Data & Infra", items: ["PostgreSQL", "Prisma", "Docker Compose", "npm workspaces"] },
      { label: "Mobile", items: ["Flutter", "Dart"] },
    ],
    tags: ["Next.js", "NestJS", "Node.js", "Socket.IO", "PostgreSQL", "Flutter"],
    cover: "/projects/glido/cover-0.jpg",
    gallery: [
      { src: "/projects/glido/cover-1.jpg", caption: "Popular restaurants near you" },
      { src: "/projects/glido/cover-2.jpg", caption: "App download & partner onboarding" },
    ],
    accent: "green",
    year: "2026",
    role: "Full-Stack Developer",
    link: "https://web-sahilt.vercel.app",
    repo: `${GH}/Glido`,
    featured: true,
  },
  {
    slug: "sahucodex",
    title: "SahuCodeX",
    tagline: "AI-powered competitive programming platform",
    category: "Web App",
    summary:
      "Code. Compete. Learn. An online judge with a sandboxed code runner, ICPC-style contests, a developer community and a local AI assistant with RAG search — all on open-source infrastructure.",
    overview: [
      "SahuCodeX is a LeetCode-style platform built from scratch: 30 original problems in a Monaco workspace, graded by SahuJudge — a sandboxed runner that executes every submission in an isolated, network-less container.",
      "On top sit timed contests with live standings, per-problem discussions with moderation, and SahuCodeX AI: hints, code reviews and a streaming chat running on a local Ollama model with Qdrant-powered retrieval.",
    ],
    features: [
      "SahuJudge — isolated sandbox execution with deterministic verdicts and live WebSocket updates",
      "Monaco editor workspace for Python, C++ and JavaScript with autosaved drafts",
      "ICPC-style contests with live standings computed from judge verdicts",
      "SahuCodeX AI — hints, reviews and chat on a local Ollama model, plus RAG on Qdrant",
      "Profiles with streaks, achievements and a 365-day activity calendar",
      "Prometheus metrics, Grafana dashboards, 900+ automated tests",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js 16", "TypeScript", "Tailwind CSS", "Radix UI", "TanStack Query", "Zustand", "Monaco"] },
      { label: "Backend", items: ["Python", "FastAPI", "SQLAlchemy", "Celery", "Redis", "PostgreSQL"] },
      { label: "AI & Ops", items: ["Ollama", "Qdrant (RAG)", "Docker", "Caddy", "Prometheus", "Grafana"] },
    ],
    tags: ["Next.js", "FastAPI", "Python", "Redis", "Docker", "AI / RAG"],
    cover: "/projects/sahucodex/cover-0.jpg",
    gallery: [{ src: "/projects/sahucodex/cover-1.jpg", caption: "Sandboxed judge, contests & AI" }],
    accent: "violet",
    year: "2026",
    role: "Full-Stack & AI Developer",
    link: "https://sahucodex.vercel.app",
    repo: `${GH}/sahucodex`,
    featured: true,
  },
  {
    slug: "pahadibhai",
    title: "Pahadibhai",
    tagline: "Multi-vendor delivery super-app for the hills",
    category: "eCommerce",
    summary:
      "A multi-vendor super-app for the mountains — food, grocery, pharmacy, eCommerce, parcel delivery and cab booking in one platform, with live location search and Google Maps store discovery.",
    overview: [
      "Pahadibhai brings city-style delivery to hill towns: one app for food, groceries, medicines, parcels and cabs from many local vendors.",
      "The web app shares its codebase with the mobile apps, with location-based store discovery, social sign-in and a vendor network behind it.",
    ],
    features: [
      "Food, grocery, pharmacy, eCommerce, parcel and cab booking modules",
      "Location search and Google Maps store discovery",
      "Google, Facebook and Apple social sign-in; Firebase push notifications",
      "Multi-language UI with light and dark themes",
    ],
    stack: [
      { label: "App", items: ["Flutter", "Dart"] },
      { label: "Backend", items: ["Laravel", "PHP", "MySQL"] },
      { label: "Services", items: ["Firebase", "Google Maps API", "Social Auth"] },
    ],
    cover: "/projects/pahadibhai.jpg",
    gallery: [{ src: "/projects/pahadibhai/apps.jpg", caption: "Checkout, store network & mobile apps", url: "https://pahadibhai.in" }],
    accent: "green",
    year: "2025",
    role: "Full-Stack Developer",
    link: "https://pahadibhai.in",
    featured: true,
  },
  {
    slug: "redbean-hospitality",
    title: "Redbean Hospitality",
    tagline: "Pan-India contract kitchen & cafe company",
    category: "Corporate",
    summary:
      "The web presence for Redbean Hospitality, a pan-India contract kitchen & cafe management company since 2005 — the live corporate site plus four Next.js and React redesigns, including a 3D one.",
    overview: [
      "Redbean runs kitchens and cafes for hospitals, campuses, corporates and factories across India. The brief: make a food-service company feel as premium and trustworthy as the kitchens it runs.",
      "Alongside the live site, I built and shipped a series of redesigns — each exploring a different direction, from an editorial serif look to a React Three Fiber 3D experience — to take the brand forward.",
    ],
    features: [
      "Live corporate site with service verticals for Healthcare, Education, Corporate and Industry",
      "Four Next.js / React redesigns with Framer Motion and Motion animation",
      "3D React Three Fiber concept with interactive scenes",
      "Lead capture with React Hook Form + Zod validation, WhatsApp & chat entry points",
    ],
    stack: [
      { label: "Live site", items: ["HTML5", "CSS3", "Bootstrap", "jQuery", "Swiper", "AOS"] },
      { label: "Redesigns", items: ["Next.js", "React", "TypeScript", "Framer Motion", "Embla Carousel"] },
      { label: "3D & Forms", items: ["Three.js", "React Three Fiber", "React Router", "React Hook Form", "Zod"] },
    ],
    tags: ["Next.js", "React", "Three.js", "Framer Motion", "Bootstrap"],
    cover: "/projects/redbean-hospitality.jpg",
    gallery: [
      { src: "/projects/redbean-hospitality/live-1.jpg", caption: "Live site — about the company", url: "https://redbeanhospitality.com" },
      { src: "/projects/redbean-hospitality/live-2.jpg", caption: "Live site — services", url: "https://redbeanhospitality.com" },
      { src: "/projects/redbean-hospitality/official-0.jpg", caption: "Redesign — official", url: "https://redbeanofficial.vercel.app" },
      { src: "/projects/redbean-hospitality/official-1.jpg", caption: "Redesign — founder story", url: "https://redbeanofficial.vercel.app" },
      { src: "/projects/redbean-hospitality/3d-0.jpg", caption: "3D concept — React Three Fiber", url: "https://foodhospitality.vercel.app" },
      { src: "/projects/redbean-hospitality/3d-1.jpg", caption: "3D concept — stats", url: "https://foodhospitality.vercel.app" },
      { src: "/projects/redbean-hospitality/full-0.jpg", caption: "Redesign — editorial", url: "https://redbeanfull.vercel.app" },
      { src: "/projects/redbean-hospitality/next-0.jpg", caption: "Redesign — collage", url: "https://redbeanhospitality.vercel.app" },
      { src: "/projects/redbean-hospitality/basic-0.jpg", caption: "Static HTML build", url: "https://redbeanbasic.vercel.app" },
    ],
    accent: "red",
    year: "2025",
    role: "Web Developer",
    link: "https://redbeanhospitality.com",
    repo: `${GH}/redbeanofficial`,
    featured: true,
  },
  {
    slug: "bobby-singh",
    title: "Bobby Singh",
    tagline: "Personal brand for a kitchen & cafe business coach",
    category: "Personal Brand",
    summary:
      "A cinematic personal-brand site for Bobby Singh — founder of Redbean Hospitality and Shark Tank India contestant — with GSAP scroll storytelling, Lenis smooth scrolling and a consultation funnel.",
    overview: [
      "Bobby Singh has spent 20 years building institutional kitchens across India and now coaches food entrepreneurs. The site had to feel like a keynote: bold, confident and built to convert visitors into consultation calls.",
      "Two builds shipped: an editorial GSAP + Lenis version with scroll-driven storytelling, and a punchier Framer Motion version leading with Shark Tank India credibility.",
    ],
    features: [
      "Scroll-driven storytelling with GSAP and Lenis smooth scroll",
      "Consultation funnel with a \"Talk to Bobby's team\" lead form",
      "Services, CGR program, achievements and industry sections",
      "Vercel Analytics & Speed Insights for performance tracking",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { label: "Motion", items: ["GSAP", "Lenis", "Motion", "Framer Motion"] },
      { label: "Platform", items: ["Vercel", "Vercel Analytics"] },
    ],
    tags: ["Next.js", "GSAP", "Lenis", "Framer Motion"],
    cover: "/projects/bobby-singh/cover-0.jpg",
    gallery: [
      { src: "/projects/bobby-singh/cover-1.jpg", caption: "Four ways operators work with him", url: "https://bobbysinghofficial.vercel.app" },
      { src: "/projects/bobby-singh/cover-2.jpg", caption: "Consulting methodology", url: "https://bobbysinghofficial.vercel.app" },
      { src: "/projects/bobby-singh/v2-0.jpg", caption: "Version 2 — hero", url: "https://bobbysingh.vercel.app" },
      { src: "/projects/bobby-singh/v2-1.jpg", caption: "Version 2 — meet Mr. Bobby Singh", url: "https://bobbysingh.vercel.app" },
    ],
    accent: "red",
    year: "2026",
    role: "Frontend Developer",
    link: "https://bobbysinghofficial.vercel.app",
    repo: `${GH}/Bobbysinghofficial`,
  },
  {
    slug: "dell-store",
    title: "Dell Store",
    tagline: "Full-stack Magento 2 storefront",
    category: "eCommerce",
    summary:
      "A full-stack Magento 2 storefront with a custom catalog and checkout — optimized for performance, GraphQL-driven data fetching and a Tailwind-based design system.",
    overview: [
      "A client eCommerce build on Magento 2: a custom catalog and checkout experience tuned for speed.",
      "GraphQL powers data fetching on the storefront, and a Tailwind-based design system keeps the UI consistent across every page.",
    ],
    features: [
      "Custom catalog and product listing experience",
      "Custom checkout flow",
      "GraphQL-driven storefront data fetching",
      "Tailwind CSS design system",
    ],
    stack: [
      { label: "Commerce", items: ["Magento 2", "PHP", "MySQL"] },
      { label: "Frontend", items: ["Tailwind CSS", "GraphQL"] },
    ],
    cover: "/projects/dell-store/cover-0.jpg",
    gallery: [
      { src: "/projects/dell-store/featured.jpg", caption: "Category grid & featured products", url: "https://www.dellstore.com" },
      { src: "/projects/dell-store/xps.jpg", caption: "XPS product showcase", url: "https://www.dellstore.com" },
      { src: "/projects/dell-store/support.jpg", caption: "Support hub & account", url: "https://www.dellstore.com" },
    ],
    accent: "blue",
    year: "2025",
    role: "Full-Stack Developer",
    link: "https://www.dellstore.com",
  },
  {
    slug: "plantshed",
    title: "PlantShed",
    tagline: "Storefront rebuild for a plant eCommerce brand",
    category: "eCommerce",
    summary:
      "A ground-up frontend rebuild for a plant eCommerce storefront — faster page loads, cleaner catalog browsing and Alpine.js-driven interactivity on top of Magento 2.",
    overview: [
      "A frontend rebuild for a plant retailer's Magento 2 store, focused on performance and conversion.",
      "Alpine.js adds lightweight interactivity without a heavy framework, keeping pages fast.",
    ],
    features: [
      "Rebuilt storefront frontend on Magento 2",
      "Faster page loads and cleaner catalog browsing",
      "Alpine.js interactivity with Tailwind CSS styling",
    ],
    stack: [
      { label: "Commerce", items: ["Magento 2"] },
      { label: "Frontend", items: ["Tailwind CSS", "Alpine.js"] },
    ],
    cover: "/projects/plantshed/cover-0.jpg",
    gallery: [
      { src: "/projects/plantshed/picks.jpg", caption: "Picks of the season", url: "https://www.plantshed.com" },
      { src: "/projects/plantshed/collections.jpg", caption: "Collections & subscriptions", url: "https://www.plantshed.com" },
      { src: "/projects/plantshed/services.jpg", caption: "Services — florals, plants & design", url: "https://www.plantshed.com" },
      { src: "/projects/plantshed/cafes.jpg", caption: "PlantShed cafés", url: "https://www.plantshed.com" },
    ],
    accent: "cyan",
    year: "2024",
    role: "Frontend Developer",
    link: "https://www.plantshed.com",
  },
];

export const tagsOf = (p: Project) => p.tags ?? p.stack.flatMap((s) => s.items).slice(0, 6);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};

export const ACCENTS: Record<Accent, [string, string]> = {
  cyan: ["#5ef2ff", "#1688ff"],
  orange: ["#ffb547", "#ff2d20"],
  blue: ["#4f7cff", "#9b5bff"],
  red: ["#ff2d20", "#ffb547"],
  green: ["#3ddc84", "#0f9d58"],
  violet: ["#7c5cff", "#3aa0ff"],
};
