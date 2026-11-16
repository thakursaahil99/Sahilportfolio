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
  category: "Web App" | "Platform" | "eCommerce" | "Corporate" | "Personal Brand" | "Motion Site";
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
    slug: "sahu-music",
    title: "Sahu Music",
    tagline: "Free music streaming — web, PWA, mobile and admin",
    category: "Platform",
    summary:
      "\"Har Gaana, Ek Jagah.\" A free-first music streaming ecosystem — website, installable PWA, Flutter apps and an admin console on one backend — that only plays full songs from sources authorised to stream them.",
    overview: [
      "Most free music apps either play 30-second clips or stream from sources they have no right to. Sahu Music set out to do it properly: every song plays in full, and only from a source that authorises complete streaming.",
      "One TypeScript provider layer pulls from YouTube's official player, Audius, live radio and the Internet Archive, runs a rights check and ranks the results. The website, the PWA, the Flutter apps and the admin console all sit on a single Vercel Function backed by Neon PostgreSQL.",
    ],
    features: [
      "Full-length playback only — a rights check filters out anything a source does not authorise",
      "Several music providers behind one search: YouTube official player, Audius, live radio, Internet Archive",
      "Installable PWA plus Flutter apps for Android and iOS with background audio",
      "Accounts, favourites, playlists and listening history; guest mode works with no sign-up",
      "Admin console served at /admin on the same deployment",
      "Runs entirely on free tiers — one Vercel Function and a Neon PostgreSQL database",
    ],
    stack: [
      { label: "Web & Admin", items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "PWA"] },
      { label: "Mobile", items: ["Flutter", "Riverpod", "just_audio", "audio_service"] },
      { label: "Backend", items: ["Vercel Functions", "Node.js", "Neon PostgreSQL", "Vitest"] },
    ],
    tags: ["Next.js", "TypeScript", "Flutter", "PostgreSQL", "PWA", "Vercel Functions"],
    cover: "/projects/sahu-music/cover.jpg",
    gallery: [{ src: "/projects/sahu-music/shot-1.jpg", caption: "Explore — categories, radio and playlists" }],
    accent: "orange",
    year: "2026",
    role: "Full-Stack & Mobile Developer",
    link: "https://sahu-music.vercel.app",
    repo: `${GH}/sahu-music`,
    featured: true,
  },
  {
    slug: "glideinbir-kart",
    title: "Glideinbir Kart",
    tagline: "Multi-vendor marketplace built for India",
    category: "eCommerce",
    summary:
      "A multi-vendor marketplace in the Amazon / Flipkart mould — customer storefront, seller dashboard, admin console, REST API and a React Native app, with GST-inclusive pricing, PIN-code delivery and Razorpay or Cash on Delivery.",
    overview: [
      "Indian marketplaces have their own rules: prices include GST, delivery depends on the PIN code, and half the orders are Cash on Delivery. Glideinbir Kart builds those in from the first table rather than bolting them on.",
      "It is a Turborepo monorepo: a Next.js app hosts the storefront, /seller and /admin; a NestJS API with Prisma, PostgreSQL, Redis and BullMQ serves everything under /api/v1; an Expo app covers mobile. Shared packages hold the Zod validators, the GST and pricing engine and a typed API client.",
    ],
    features: [
      "Storefront with categories, deals, search, wishlist, cart and checkout",
      "Seller dashboard and admin console inside the same Next.js app",
      "GST-inclusive pricing engine and PIN-code based delivery",
      "Razorpay (test mode) and Cash on Delivery payments",
      "NestJS REST API with Swagger docs, Redis caching and BullMQ background jobs",
      "Expo / React Native customer app sharing types, validators and the API client",
    ],
    stack: [
      { label: "Web", items: ["Next.js 16", "React", "TypeScript", "Tailwind CSS", "Radix UI", "TanStack Query"] },
      { label: "API", items: ["NestJS 11", "Prisma", "PostgreSQL", "Redis", "BullMQ", "Swagger"] },
      { label: "Mobile & Tooling", items: ["Expo", "React Native", "NativeWind", "Turborepo", "pnpm", "Zod"] },
    ],
    tags: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Redis", "React Native"],
    cover: "/projects/glideinbir-kart/cover.jpg",
    gallery: [
      { src: "/projects/glideinbir-kart/shot-1.jpg", caption: "Deals of the day" },
      { src: "/projects/glideinbir-kart/shot-2.jpg", caption: "Best sellers" },
      { src: "/projects/glideinbir-kart/shot-3.jpg", caption: "Sign in — email or phone OTP" },
    ],
    accent: "blue",
    year: "2026",
    role: "Full-Stack Developer",
    link: "https://glideinbir-kart.vercel.app",
    repo: `${GH}/glideinbirkart`,
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
    slug: "glideup",
    title: "GlideUp",
    tagline: "AI job search, mock interviews and application tracking",
    category: "Platform",
    summary:
      "Find jobs. Practice interviews. Get hired. An AI platform that matches a résumé to real jobs, shows the skill gaps, runs job-specific mock interviews and coding tests, and tracks every application through to the offer.",
    overview: [
      "Job hunting is spread across a dozen tabs: a job board, a résumé checker, an interview-prep site, a spreadsheet of applications. GlideUp turns that into one path — résumé in, matched jobs, skill gaps, practice, tracked applications.",
      "A Next.js front end talks to a FastAPI modular monolith through a BFF proxy. Postgres with pgvector powers the matching, Meilisearch the job search, and Celery workers handle the slow work behind an LLM gateway with a response cache, token budgets and admin-editable model routing.",
    ],
    features: [
      "Résumé parsing with a match score and skill-gap report for every job",
      "AI mock interviews tailored to the role, with feedback",
      "Coding and framework tests run in a sandbox",
      "Application tracker with notes, contacts and reminders",
      "LLM gateway with response caching, per-user rate limits and token budgets",
      "Admin console — feature flags, announcements, model routing and live system health",
    ],
    stack: [
      { label: "Web", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "TanStack Query", "Auth.js", "Recharts"] },
      { label: "API", items: ["Python", "FastAPI", "Pydantic", "SQLAlchemy", "Alembic", "Celery"] },
      { label: "Data & Ops", items: ["PostgreSQL + pgvector", "Redis", "Meilisearch", "MinIO", "Docker", "Prometheus", "Grafana"] },
    ],
    tags: ["Next.js", "FastAPI", "Python", "pgvector", "Celery", "AI"],
    cover: "/projects/glideup/cover.jpg",
    gallery: [
      { src: "/projects/glideup/shot-1.jpg", caption: "Features and the five-step path" },
      { src: "/projects/glideup/shot-2.jpg", caption: "How it works" },
    ],
    accent: "blue",
    year: "2026",
    role: "Full-Stack & AI Developer",
    link: "https://glideup-ashen.vercel.app",
    repo: `${GH}/Glideup`,
    featured: true,
  },
  {
    slug: "bir-paragliding",
    title: "Bir Paragliding",
    tagline: "Cinematic 3D site for a tandem-flight operator",
    category: "Motion Site",
    summary:
      "A cinematic, animation-heavy site for a Bir Billing paragliding operator — a 3D descent hero, flight packages with ten-section detail pages, a gallery full of interactions and a booking wizard that hands off to WhatsApp.",
    overview: [
      "A tandem flight is sold on feeling, not on a price table. The brief was a site that makes you feel the launch at 2,400 m before you ever message the pilot.",
      "The home page opens on a React Three Fiber descent with a live altimeter, then moves through ten scroll-driven sections built with GSAP, ScrollTrigger and SplitText on Lenis smooth scrolling. All prices, packages and FAQs live in one content file, so the owner can change them without touching a component.",
    ],
    features: [
      "3D descent hero with a live altitude readout (React Three Fiber)",
      "Flight and P1–P4 course packages, each with a ten-section detail page",
      "Gallery with a tunnel, a puzzle, filterable masonry, lightbox and a compare slider",
      "Booking wizard that hands the enquiry off to WhatsApp",
      "\"Flight Log\" blog, Experience Bir guide, FAQ and legal pages",
      "SEO: canonical URLs, sitemap and JSON-LD; images prepared at build time with sharp",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js 15", "React", "TypeScript", "Tailwind CSS 4"] },
      { label: "Motion & 3D", items: ["GSAP", "ScrollTrigger", "SplitText", "Lenis", "Motion", "Three.js / R3F"] },
      { label: "Platform", items: ["Vercel", "sharp"] },
    ],
    tags: ["Next.js", "GSAP", "Three.js", "Lenis", "TypeScript"],
    cover: "/projects/bir-paragliding/cover.jpg",
    gallery: [
      { src: "/projects/bir-paragliding/shot-1.jpg", caption: "Bir, by the numbers — instrument panel" },
      { src: "/projects/bir-paragliding/shot-2.jpg", caption: "Flights & courses — choose your airtime" },
      { src: "/projects/bir-paragliding/shot-3.jpg", caption: "Fly through the gallery" },
    ],
    accent: "orange",
    year: "2026",
    role: "Designer & Frontend Developer",
    link: "https://bir-paragliding.vercel.app",
    repo: `${GH}/bir-paragliding`,
    featured: true,
  },
  {
    slug: "quickcart",
    title: "QuickCart",
    tagline: "Magento 2 electronics store with custom modules",
    category: "eCommerce",
    summary:
      "Shop Smarter. Shop Faster. A multi-category electronics store on Magento Open Source 2.4.9 — custom modules on service contracts, a Luma-based theme, a REST API, an admin sales dashboard and 156 unit tests, with no core files changed.",
    overview: [
      "QuickCart shows what real-world Magento development looks like end to end: not a theme tweak, but modules, schema, data patches, APIs and admin tooling built the way Magento intends.",
      "Everything is done through service contracts, declarative schema and data patches, so the store upgrades cleanly. The public link is a static demo of the storefront — cart, login, search and checkout need the Magento backend and are switched off there.",
    ],
    features: [
      "Custom Luma child theme with a brand identity and Motion animations",
      "Product labels, recommendations (bought together, similar, recently viewed) and order tracking modules",
      "REST API module for products, categories, orders and customers, with a Postman collection",
      "Admin sales dashboard — KPIs, revenue and order charts, best sellers, CSV export",
      "Reviews, coupons, a free-delivery meter and checkout fields with Indian validation",
      "156 unit tests, PHPCS-clean code and a deployment guide",
    ],
    stack: [
      { label: "Commerce", items: ["Magento 2.4.9", "PHP", "MySQL"] },
      { label: "Frontend", items: ["Luma child theme", "LESS", "Motion"] },
      { label: "Quality", items: ["PHPUnit", "PHPCS", "Postman", "REST API"] },
    ],
    tags: ["Magento 2", "PHP", "MySQL", "REST API", "PHPUnit"],
    cover: "/projects/quickcart/cover.jpg",
    gallery: [
      { src: "/projects/quickcart/shot-1.jpg", caption: "Shop by category" },
      { src: "/projects/quickcart/shot-2.jpg", caption: "Trending products and offers" },
      { src: "/projects/quickcart/category.jpg", caption: "Category page with layered navigation" },
      { src: "/projects/quickcart/product.jpg", caption: "Product page — labels, swatches and delivery promises" },
      { src: "/projects/quickcart/tracking.jpg", caption: "Order tracking module" },
      { src: "/projects/quickcart/admin-dashboard.jpg", caption: "Admin sales dashboard (demo order data)" },
    ],
    accent: "blue",
    year: "2026",
    role: "Magento Developer",
    link: "https://quickcart-store-eta.vercel.app",
    repo: `${GH}/quick-cart`,
    featured: true,
  },
  {
    slug: "cliff-camps-barot",
    title: "Cliff Camps Barot",
    tagline: "Riverside camp site with its own booking engine",
    category: "Web App",
    summary:
      "Website and booking system for a riverside Swiss-tent camp in Barot, Himachal Pradesh — live availability, UPI and Razorpay payments, an admin panel and Airbnb calendar sync, running entirely on free tiers.",
    overview: [
      "The camp took bookings over WhatsApp and Airbnb, which meant double bookings and no direct revenue. It needed its own site that could take a booking and a payment — without a monthly hosting bill.",
      "A React front end sits on an Express API deployed as a serverless function, with Postgres on Supabase. A scheduled job pulls the Airbnb calendar so dates stay in sync, and a keep-alive workflow stops the free database from pausing.",
    ],
    features: [
      "Booking engine with a date picker, live pricing and tent availability",
      "UPI QR and Razorpay payments, with a guest page showing booking status",
      "Admin panel behind JWT login to manage tents, bookings and payments",
      "Airbnb calendar sync on a schedule to prevent double bookings",
      "Masonry gallery with filters and a swipeable, keyboard-friendly lightbox",
      "Runs on free tiers: serverless API and Supabase Postgres",
    ],
    stack: [
      { label: "Frontend", items: ["React", "Vite", "React Router", "Tailwind CSS 4", "Framer Motion"] },
      { label: "Backend", items: ["Node.js", "Express", "Serverless Functions", "JWT"] },
      { label: "Data & Services", items: ["Supabase Postgres", "Razorpay", "UPI", "Airbnb iCal"] },
    ],
    tags: ["React", "Node.js", "Express", "Supabase", "Razorpay"],
    cover: "/projects/cliff-camps-barot/cover.jpg",
    gallery: [
      { src: "/projects/cliff-camps-barot/shot-1.jpg", caption: "Winter at the camp" },
      { src: "/projects/cliff-camps-barot/shot-2.jpg", caption: "How booking works" },
    ],
    accent: "green",
    year: "2026",
    role: "Full-Stack Developer",
    link: "https://cliff-camps-barot.vercel.app",
    repo: `${GH}/cliff-camps-barot`,
  },
  {
    slug: "redbean-management-system",
    title: "Redbean HR Portal",
    tagline: "Role-based employee portal for a hospitality company",
    category: "Web App",
    summary:
      "An internal employee portal for Redbean Hospitality — HR adds employees, department heads assign work, and every employee sees their own tasks, leaves, salary and attendance, each role limited to what it should see.",
    overview: [
      "Tasks, leave requests, salary slips and attendance lived in separate sheets and chat threads across eleven departments. The company wanted one portal where each person signs in and sees exactly their part.",
      "It is a Next.js front end on an Express 5 REST API with MongoDB. Sessions are built carefully: a short-lived access token kept only in memory, and a refresh token in an httpOnly cookie, with a forced password change on first login.",
    ],
    features: [
      "Role-based access for MD, system admin, HR, executive assistant, heads and employees",
      "Task assignment by department heads, tracked across all eleven departments",
      "Leave requests and approvals, salary publishing and attendance with a sign-in work timer",
      "Sign in with employee code, mobile number or email",
      "In-memory access tokens with httpOnly refresh cookies",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js 16", "TypeScript", "Tailwind CSS", "shadcn/ui", "TanStack Query", "React Hook Form"] },
      { label: "Backend", items: ["Node.js", "Express 5", "MongoDB", "Mongoose", "JWT"] },
    ],
    tags: ["Next.js", "Node.js", "Express", "MongoDB", "JWT"],
    cover: "/projects/redbean-management-system/cover.jpg",
    accent: "red",
    year: "2026",
    role: "Full-Stack Developer",
    outcome: "Built in 2026 as an internal staff portal for Redbean Hospitality. It sits behind a login, so only the sign-in screen is shown here.",
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
  },
  {
    slug: "kitchen-king",
    title: "Kitchen King",
    tagline: "Nine-page brand site with a different hero on every page",
    category: "Personal Brand",
    summary:
      "A multi-page site for Kitchen King Bobby Singh and Red Bean Hospitality — nine pages, each with its own hero design and its own entrance animation for every section, plus a 48-photo gallery and a filterable video library.",
    overview: [
      "Bobby Singh's story was split across two separate sites. This build brings the founder, the company, the services and the media into one place, and gives every page a reason to be opened.",
      "No section repeats across pages and no two heroes share a design — a tilted 3D photo wall on the home page, a scroll-drawn timeline on About, sticky stacking cards on Services. Videos only load when played, so the pages stay light.",
    ],
    features: [
      "Nine pages: home, about, services, IFO, gallery, media, achievements, blog and contact",
      "A unique hero per page, including a tilted 3D wall of photos with pointer parallax",
      "A distinct entrance animation for every section — flips, wipes, blinds, drawn timelines",
      "48-photo bento gallery with a fullscreen lightbox",
      "Filterable video grid that loads each video only on play",
      "Contact form that hands the enquiry off to WhatsApp",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript"] },
      { label: "Motion", items: ["CSS animations", "Scroll-driven effects", "3D transforms"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["Next.js", "React", "TypeScript", "CSS Motion"],
    cover: "/projects/kitchen-king/cover.jpg",
    gallery: [
      { src: "/projects/kitchen-king/shot-1.jpg", caption: "Founder introduction and numbers" },
      { src: "/projects/kitchen-king/shot-2.jpg", caption: "Four ways operators work with him" },
    ],
    accent: "red",
    year: "2026",
    role: "Designer & Frontend Developer",
    link: "https://kitchenking-eta.vercel.app",
    repo: `${GH}/Kitchenking`,
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
    slug: "mybirbilling",
    title: "MyBirBilling",
    tagline: "Paragliding flights and pilot courses in Bir Billing",
    category: "Corporate",
    summary:
      "A booking-led site for a Bir Billing paragliding crew — tandem flights and certified P1–P4 courses with prices up front, pilot profiles, stays and a gallery, built to turn a visitor into a call or a WhatsApp chat.",
    overview: [
      "Visitors to Bir compare three or four operators on their phone before picking one. The site had to answer the two questions that decide it — what does it cost and can I trust the pilots — within the first scroll.",
      "Packages lead with the price and a Book button, pilots get their own profiles, and a sticky mobile bar keeps Book, Call and Chat one tap away on every page.",
    ],
    features: [
      "Tandem flight and P1–P4 course packages with filters and prices",
      "Pilot profiles, stays, services and a photo gallery",
      "Sticky mobile action bar — Book, Call and WhatsApp chat",
      "Full-bleed hero with a take-off altitude badge",
      "Smooth scrolling and scroll-triggered section animations",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { label: "Motion", items: ["Motion", "Lenis"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["Next.js", "TypeScript", "Motion", "Lenis"],
    cover: "/projects/mybirbilling/cover.jpg",
    gallery: [
      { src: "/projects/mybirbilling/shot-1.jpg", caption: "Courses — P1 to P4" },
      { src: "/projects/mybirbilling/shot-2.jpg", caption: "Tandem flights and why choose us" },
    ],
    accent: "orange",
    year: "2026",
    role: "Frontend Developer",
    link: "https://mybirbilling-ten.vercel.app",
    repo: `${GH}/mybirbilling`,
  },
  {
    slug: "the-rawat-collection",
    title: "The Rawat Collection",
    tagline: "Clothing storefront with a hanging-rail hero",
    category: "eCommerce",
    summary:
      "A fashion storefront for an everyday-clothing label — a hero where garments hang on a rail with their price tags, category browsing, colour swatches, a sale section, wishlist and cart.",
    overview: [
      "Clothing sites tend to look the same: a wide banner and a grid. The Rawat Collection borrows from the shop floor instead — clothes on a rail, tags swinging, categories laid out like a wall of hangers.",
      "It is a Next.js storefront using shadcn and Base UI components with Motion for the rail and marquee, kept deliberately monochrome so the product colours do the talking.",
    ],
    features: [
      "Hanging-rail hero with priced garments",
      "Shop by category, bestsellers and an end-of-season sale section",
      "Product rail with colour swatches and badges",
      "Search, wishlist and cart in the header",
      "Newsletter club sign-up",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { label: "UI & Motion", items: ["shadcn/ui", "Base UI", "Motion", "Lucide"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["Next.js", "TypeScript", "shadcn/ui", "Motion"],
    cover: "/projects/the-rawat-collection/cover.jpg",
    gallery: [
      { src: "/projects/the-rawat-collection/shot-1.jpg", caption: "Shop by category" },
      { src: "/projects/the-rawat-collection/shot-2.jpg", caption: "On the rail — trending now" },
    ],
    accent: "cyan",
    year: "2026",
    role: "Frontend Developer",
    link: "https://the-rawat-collection.vercel.app",
    repo: `${GH}/the-rawat-collection`,
  },
  {
    slug: "glideinbir-tech",
    title: "Glideinbir Tech",
    tagline: "Lead-generation site in English and Hindi",
    category: "Corporate",
    summary:
      "A conversion-focused studio site built to turn Google Ads traffic into enquiries — English and Hindi versions, a lead form that emails through Resend, and full SEO with hreflang, JSON-LD and conversion tracking.",
    overview: [
      "Paid traffic is expensive, so the page it lands on has one job: get the enquiry. This site is built around that — fast, clear, and measurable from the ad click to the thank-you page.",
      "Both languages live in the URL (/en and /hi) with hreflang tags. The lead form is a server action that emails through Resend, and the Google Ads conversion fires only on the thank-you page so the numbers stay honest.",
    ],
    features: [
      "English and Hindi versions with the locale in the URL and hreflang tags",
      "Lead form as a server action, delivered by email through Resend",
      "Per-page metadata, sitemap, robots, JSON-LD and Open Graph images",
      "GA4 and Google Ads conversion tracking, loaded only when configured",
      "Light and dark themes",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js 16", "React", "TypeScript", "Tailwind CSS 4"] },
      { label: "Services", items: ["Resend", "GA4", "Google Ads"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["Next.js", "TypeScript", "i18n", "SEO", "Resend"],
    cover: "/projects/glideinbir-tech/cover.jpg",
    gallery: [
      { src: "/projects/glideinbir-tech/shot-1.jpg", caption: "Services marquee and the short version" },
      { src: "/projects/glideinbir-tech/shot-2.jpg", caption: "What I can build for you" },
      { src: "/projects/glideinbir-tech/shot-3.jpg", caption: "Hindi version", url: "https://glideinbirtech.vercel.app/hi" },
    ],
    accent: "violet",
    year: "2026",
    role: "Designer & Full-Stack Developer",
    link: "https://glideinbirtech.vercel.app",
    repo: `${GH}/Glideinbirtech`,
  },
  {
    slug: "altix-digital",
    title: "Altix Digital",
    tagline: "Website for a web, app, SEO and growth agency",
    category: "Corporate",
    summary:
      "A full agency website — home, about, services, work, pricing, insights and contact — with a bright editorial look, animated dashboards in the hero, light and dark themes and a free website-audit entry point.",
    overview: [
      "An agency that sells both building and marketing has to show both at a glance. The hero does it with a single composition: a ranking chart, a search result and a performance score floating over the team at work.",
      "Seven pages share one design system built with Tailwind, with Motion for the entrances and Lenis for scrolling. Every section ends in a clear next step — start a project, view a case study, see pricing.",
    ],
    features: [
      "Seven pages: home, about, services, work, pricing, insights and contact",
      "Animated hero with floating ranking, search and performance cards",
      "Service list, case-study cards and a pricing page",
      "Light and dark themes",
      "Free website-audit call to action and a chat entry point",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { label: "Motion", items: ["Motion", "Lenis", "Lucide"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["Next.js", "TypeScript", "Motion", "Lenis"],
    cover: "/projects/altix-digital/cover.jpg",
    gallery: [
      { src: "/projects/altix-digital/shot-1.jpg", caption: "Who we are" },
      { src: "/projects/altix-digital/shot-2.jpg", caption: "Services" },
    ],
    accent: "green",
    year: "2026",
    role: "Designer & Frontend Developer",
    link: "https://altix-digital-agency.vercel.app",
    repo: `${GH}/altix-digital-agency`,
  },
  {
    slug: "liquid-carbon",
    title: "Liquid Carbon",
    tagline: "Corporate site for an industrial wastewater company",
    category: "Corporate",
    summary:
      "Turning Wastewater into Resource. A corporate site for Liquid Carbon Technologies UK — technology, ultrafiltration, sectors, case studies and industry insights, explaining a technical product in plain steps.",
    overview: [
      "Industrial wastewater treatment is hard to explain to the person who signs the budget. The site breaks the offer into three words — recover, recycle, reuse — and builds every page out from them.",
      "Built with Next.js, with Framer Motion for the reveals and Lenis for smooth scrolling, in a calm teal palette that keeps long technical copy easy to read.",
    ],
    features: [
      "Pages for technology, ultrafiltration, sectors, case studies and insights",
      "Recover → Recycle → Reuse explained as numbered steps",
      "Client testimonial and sector sections",
      "Scroll reveals and smooth scrolling",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { label: "Motion", items: ["Framer Motion", "Lenis"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["Next.js", "TypeScript", "Framer Motion", "Lenis"],
    cover: "/projects/liquid-carbon/cover.jpg",
    gallery: [
      { src: "/projects/liquid-carbon/shot-1.jpg", caption: "Recycle, reuse and single-layer technology" },
      { src: "/projects/liquid-carbon/shot-2.jpg", caption: "'Polluter pays' resilience" },
    ],
    accent: "cyan",
    year: "2026",
    role: "Frontend Developer",
    link: "https://liquid-carbon.vercel.app",
    repo: `${GH}/liquid-carbon`,
  },
  {
    slug: "color-pro-money",
    title: "ColorProMoney",
    tagline: "Real-time prediction game with provably fair rounds",
    category: "Web App",
    summary:
      "A three-minute colour and number prediction game played with virtual points only — a mobile-app style player screen, a server-synced countdown, provably fair results anyone can verify, and a full admin panel.",
    overview: [
      "The interesting part of a round-based game is not the screen, it is trust and timing: every player must see the same clock, and nobody — including the operator — should be able to change a result after the bets are in.",
      "Rounds run on the server and the countdown is synced to it. Each result comes from a cryptographically secure generator whose seed hash is published before betting opens and revealed afterwards, so any round can be checked. Points have no cash value — there are no deposits, payments or withdrawals.",
    ],
    features: [
      "180-second rounds across four games with a server-synced countdown",
      "Provably fair results — seed hash published before the round, revealed after",
      "Virtual points only: no real money, deposits or withdrawals",
      "Mobile sign-up, referral codes, betting history and a transaction ledger",
      "Admin panel — live rounds, bets, users, colour-wise analytics and pause / resume",
      "Dockerised, with Vitest tests",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { label: "Backend", items: ["Node.js", "Express", "WebSockets (ws)", "PostgreSQL"] },
      { label: "Ops", items: ["Docker", "Vitest"] },
    ],
    tags: ["Next.js", "Express", "WebSockets", "PostgreSQL", "Docker"],
    cover: "/projects/color-pro-money/cover.jpg",
    gallery: [{ src: "/projects/color-pro-money/shot-1.jpg", caption: "Results & fairness — every round can be verified" }],
    accent: "green",
    year: "2026",
    role: "Full-Stack Developer",
    link: "https://color-pro-money.vercel.app",
    repo: `${GH}/color-pro-money`,
  },
  {
    slug: "avengers-endgame",
    title: "Endgame Experience",
    tagline: "Fan-made animated retelling of Avengers: Endgame",
    category: "Motion Site",
    summary:
      "A fully animated fan experience that retells Avengers: Endgame chapter by chapter — a cinematic intro, the complete story, the time heist, every hero and the final battle. A motion study, not affiliated with Marvel.",
    overview: [
      "This is a personal motion project: how far can scroll-driven storytelling go with only a browser? The whole film is retold as one long, paced scroll — over thirty screens of it.",
      "A typed-out intro leads into the title card, then each chapter gets its own layout and transition. It is built with Next.js, Framer Motion and Lenis. Fan-made and non-commercial; all characters belong to their owners.",
    ],
    features: [
      "Cinematic typed intro with a skip control",
      "The complete story in chapters, from the aftermath to the final snap",
      "Time-heist timeline, hero roster and final-battle sections",
      "Scroll-driven transitions on smooth scrolling",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { label: "Motion", items: ["Framer Motion", "Lenis"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["Next.js", "Framer Motion", "Lenis", "TypeScript"],
    cover: "/projects/avengers-endgame/cover.jpg",
    gallery: [{ src: "/projects/avengers-endgame/shot-1.jpg", caption: "The story, chapter by chapter" }],
    accent: "red",
    year: "2026",
    role: "Designer & Frontend Developer",
    link: "https://avengers-endgame-kappa.vercel.app",
    repo: `${GH}/Avengers-Endgame`,
  },
  {
    slug: "street-fighter",
    title: "Street Fighter",
    tagline: "Interactive one-page cinematic built around video",
    category: "Motion Site",
    summary:
      "An interactive, game-styled one-pager — press start, round one, lifebars and all — where kinetic type is timed to the cuts of the footage. Built with GSAP and Lenis on a hand-tuned video pipeline.",
    overview: [
      "The idea was to make a web page behave like the opening of a fighting game: a title screen that waits for you to press start, then a sequence that plays out with sound, HUD and timing.",
      "It is vanilla JavaScript with GSAP and Lenis. The hard part was the media: an ffmpeg pipeline crops and re-encodes the clips for the web, and the type animations are keyed to the exact cuts so the words land with the picture.",
    ],
    features: [
      "Title screen that starts on a key press, with optional sound",
      "Round-one sequence with a player HUD and filling lifebars",
      "Drag, swipe or arrow-key comparison slider",
      "Kinetic typography synced to the video cuts",
      "Horizontal reel and a choose-your-opponent section",
      "ffmpeg media pipeline for web-ready video, posters and textures",
    ],
    stack: [
      { label: "Frontend", items: ["Vite", "JavaScript", "CSS"] },
      { label: "Motion", items: ["GSAP", "ScrollTrigger", "Lenis"] },
      { label: "Media", items: ["ffmpeg", "Python"] },
    ],
    tags: ["GSAP", "Lenis", "Vite", "JavaScript", "ffmpeg"],
    cover: "/projects/street-fighter/cover.jpg",
    gallery: [{ src: "/projects/street-fighter/shot-1.jpg", caption: "The logo forms in fire" }],
    accent: "red",
    year: "2026",
    role: "Designer & Frontend Developer",
    link: "https://streetfighter-theta.vercel.app",
  },
  {
    slug: "the-series",
    title: "Sahil — The Series",
    tagline: "A streaming-style portfolio with viewer profiles",
    category: "Personal Brand",
    summary:
      "My portfolio reimagined as a streaming service — opening titles, a \"Who's watching?\" screen and projects as originals. Each viewer profile reorders the pages, and the Developer profile opens a separate 3D cut.",
    overview: [
      "A recruiter, a developer and a creative director look for different things in a portfolio. Instead of one page for everyone, this one asks who is watching and re-cuts itself to suit.",
      "It is a React and Vite app with React Router, GSAP and Framer Motion, and React Three Fiber for the Developer cut. All nine projects come from a single data file, so both cuts stay in sync. Earlier versions of my portfolio are in the gallery below.",
    ],
    features: [
      "Opening titles and a \"Who's watching?\" profile picker",
      "Four viewer profiles, each with its own page order",
      "Series cut: originals, top picks, journey, moments and résumé",
      "Developer cut in 3D with React Three Fiber",
      "One data source feeding both cuts",
    ],
    stack: [
      { label: "Frontend", items: ["React", "Vite", "React Router", "Tailwind CSS 4"] },
      { label: "Motion & 3D", items: ["GSAP", "ScrollTrigger", "Framer Motion", "Three.js / R3F", "Lenis"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["React", "Vite", "GSAP", "Three.js", "Framer Motion"],
    cover: "/projects/the-series/cover.jpg",
    gallery: [
      { src: "/projects/the-series/shot-1.jpg", caption: "Trending originals and top picks" },
      { src: "/projects/the-series/shot-2.jpg", caption: "Earlier version — the robot cut", url: "https://portfolio-app-sahilt.vercel.app" },
      { src: "/projects/the-series/shot-3.jpg", caption: "Earlier version — the first portfolio", url: "https://my-portfolio-sahilt.vercel.app" },
    ],
    accent: "red",
    year: "2026",
    role: "Designer & Developer",
    link: "https://sahill-netflix-portfolio.vercel.app",
    repo: `${GH}/sahill-netflix-portfolio`,
  },
  {
    slug: "portfolio-studio",
    title: "Portfolio Studio",
    tagline: "Four personal sites for four very different careers",
    category: "Personal Brand",
    summary:
      "Personal portfolios designed and built for four professionals — a designer-developer, a web developer, an executive assistant and a data analyst — each with its own visual language rather than a shared template.",
    overview: [
      "A portfolio only works when it sounds like the person. So none of these four share a layout: an editorial serif site for a designer who codes, bold grotesque type for a web developer, a calm deep-blue site for an executive assistant and a 3D space scene for a data analyst.",
      "All four are Next.js builds on Vercel. Motion is matched to the person too — from quiet scroll reveals to a React Three Fiber intro — and each site is written around their real experience and work.",
    ],
    features: [
      "Vishwajeet Thakur — editorial serif site with a draggable ID card",
      "Karan Singh — oversized type, live clock and a project archive",
      "Nikhil Kumar — executive-support profile with scroll-lit copy",
      "Krrish Tapwal — 3D intro, skills meters and a résumé download",
      "Four distinct designs, no shared template",
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { label: "Motion & 3D", items: ["Motion", "Framer Motion", "Lenis", "Three.js / R3F"] },
      { label: "Platform", items: ["Vercel"] },
    ],
    tags: ["Next.js", "Motion", "Three.js", "Lenis"],
    cover: "/projects/portfolio-studio/cover.jpg",
    gallery: [
      { src: "/projects/portfolio-studio/shot-1.jpg", caption: "Karan Singh — web designer & developer", url: "https://karan-portfolio-sahilt.vercel.app" },
      { src: "/projects/portfolio-studio/shot-2.jpg", caption: "Nikhil Kumar — executive support", url: "https://nikhil-portfolio-sahilt.vercel.app" },
      { src: "/projects/portfolio-studio/shot-3.jpg", caption: "Krrish Tapwal — MIS & data analyst", url: "https://portfolio-krrish-iota.vercel.app" },
    ],
    accent: "violet",
    year: "2026",
    role: "Designer & Frontend Developer",
    link: "https://vishwajeet-portfolio-pink.vercel.app",
    repo: `${GH}/vishwajeet-portfolio`,
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
