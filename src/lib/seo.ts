import type { Metadata } from "next";
import { experience, profile } from "@/data/profile";
import { projects, tagsOf, type Project } from "@/data/projects";
import { SITE_URL } from "./site";

/**
 * Search setup in one place: the keywords people type, per-page metadata with a
 * correct canonical URL, and schema.org structured data (Person, WebSite,
 * ProfilePage, case studies, breadcrumbs) so search engines know this site is
 * about Sahil Thakur.
 */

const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/** The roles the site should be found for. */
export const ROLES = ["Full-Stack Developer", "Software Engineer", "Web Developer", "Web Designer", "UI/UX Designer"];

/** Search terms — the name in every form, the roles, the stack and the place. */
export const KEYWORDS = [
  // name
  "Sahil Thakur",
  "Sahil",
  "Thakur",
  "Sahil Thakur portfolio",
  "Sahil Thakur developer",
  "Sahil Thakur full stack developer",
  "Sahil Thakur software engineer",
  "Sahil Thakur web developer",
  "Sahil Thakur web designer",
  "Sahil Thakur Bir",
  "Sahil Thakur Himachal Pradesh",
  "Sahil Thakur Glide in Bir",
  // roles
  "full stack developer",
  "full-stack developer India",
  "software engineer",
  "software engineer India",
  "web developer",
  "website developer",
  "web designer",
  "website designer",
  "UI UX designer",
  "freelance web developer",
  "freelance full stack developer India",
  "hire full stack developer",
  // stack
  "Next.js developer",
  "React developer",
  "Node.js developer",
  "TypeScript developer",
  "Magento 2 developer",
  "Laravel developer",
  "eCommerce developer",
  "AI integration developer",
  // place
  "web developer Himachal Pradesh",
  "full stack developer Himachal Pradesh",
  "web developer Bir Billing",
  "website design Himachal Pradesh",
  "web developer Dharamshala",
  "web developer Chandigarh",
];

const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${profile.name} — ${ROLES.slice(0, 3).join(", ")}` };

/**
 * Metadata for one page: title, description, canonical URL, and the Open Graph
 * / Twitter cards that use the same text. `title` goes through the layout's
 * "%s | Sahil Thakur" template unless `absoluteTitle` is set.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  keywords = [],
  absoluteTitle = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
  keywords?: string[];
  absoluteTitle?: boolean;
  type?: "website" | "article" | "profile";
}): Metadata {
  // titles that already name me skip the "| Sahil Thakur" suffix, so the name is never doubled
  const absolute = absoluteTitle || title.includes(profile.name);
  const shareTitle = absolute ? title : `${title} | ${profile.name}`;
  const images = image ? [{ url: image.url, width: 1440, height: 900, alt: image.alt }] : [OG_IMAGE];
  return {
    title: absolute ? { absolute: title } : title,
    description,
    keywords: [...new Set([...keywords, ...KEYWORDS])],
    alternates: { canonical: abs(path) },
    openGraph: {
      type,
      url: abs(path),
      siteName: `${profile.name} — Portfolio`,
      title: shareTitle,
      description,
      locale: "en_IN",
      images,
      ...(type === "profile" ? { firstName: "Sahil", lastName: "Thakur", username: "thakursaahil99" } : {}),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: images.map((i) => i.url) },
  };
}

/* ---------------- structured data ---------------- */

const PERSON_ID = `${SITE_URL}/#person`;
const SITE_ID = `${SITE_URL}/#website`;

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    givenName: "Sahil",
    familyName: "Thakur",
    alternateName: ["Sahil", "Sahil Thakur Developer", "thakursaahil99"],
    url: SITE_URL,
    image: abs(profile.portrait),
    email: `mailto:${profile.email}`,
    jobTitle: ROLES,
    description: profile.bio[0],
    address: { "@type": "PostalAddress", addressLocality: "Bir", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
    homeLocation: { "@type": "Place", name: profile.location },
    nationality: { "@type": "Country", name: "India" },
    sameAs: profile.socials.map((s) => s.href),
    knowsAbout: [
      "Full-stack web development",
      "Software engineering",
      "Web design",
      "UI/UX design",
      "eCommerce development",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "NestJS",
      "Laravel",
      "Magento 2",
      "PostgreSQL",
      "AI integrations",
      "Flutter",
    ],
    hasOccupation: ROLES.slice(0, 4).map((name) => ({
      "@type": "Occupation",
      name,
      occupationLocation: { "@type": "Country", name: "India" },
      skills: "Next.js, React, TypeScript, Node.js, Laravel, Magento 2, PostgreSQL",
    })),
    founder: { "@type": "Organization", name: "Glide in Bir", url: "https://glideinbir.vercel.app" },
    alumniOf: experience
      .filter((e) => e.kind === "role" && e.company !== "Glide in Bir" && e.company !== "Training & Internship")
      .map((e) => ({ "@type": "Organization", name: e.company })),
  };
}

/** Site-wide graph, rendered once in the root layout. */
export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personSchema(),
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE_URL,
        name: `${profile.name} — Portfolio`,
        alternateName: ["Sahil Thakur", "Sahil Thakur Portfolio"],
        description: `Portfolio of ${profile.name}, ${ROLES.slice(0, 4).join(", ").toLowerCase()} from Himachal Pradesh, India.`,
        inLanguage: "en-IN",
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
      },
    ],
  };
}

/** ProfilePage — tells Google the page is about one person (home and About). */
export function profilePageSchema(path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${abs(path)}#profile`,
    url: abs(path),
    name,
    isPartOf: { "@id": SITE_ID },
    mainEntity: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
    dateModified: new Date().toISOString().slice(0, 10),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

/** A case study: the project as a creative work by Sahil Thakur. */
export function projectSchema(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${abs(`/work/${p.slug}`)}#work`,
    name: p.title,
    headline: `${p.title} — ${p.tagline}`,
    description: p.summary,
    url: abs(`/work/${p.slug}`),
    image: p.cover ? abs(p.cover) : undefined,
    dateCreated: p.year,
    genre: p.category,
    keywords: tagsOf(p).join(", "),
    author: { "@id": PERSON_ID, name: profile.name },
    creator: { "@id": PERSON_ID, name: profile.name },
    isPartOf: { "@id": SITE_ID },
    ...(p.link ? { sameAs: p.link } : {}),
  };
}

/** The work index as an ordered list of case studies. */
export function workListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Projects by ${profile.name}`,
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/work/${p.slug}`), name: p.title })),
  };
}

/** `<script type="application/ld+json">` payload, with `<` escaped as the Next.js docs recommend. */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
