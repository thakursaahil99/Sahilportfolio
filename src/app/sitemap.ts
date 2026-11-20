import type { MetadataRoute } from "next";
import { NAV } from "@/data/nav";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

const PRIORITY: Record<string, number> = { "/": 1, "/about": 0.9, "/work": 0.9, "/resume": 0.8, "/services": 0.8, "/contact": 0.7, "/lab": 0.5 };

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [...NAV.map((n) => n.href), "/resume"];
  return [
    ...pages.map((path) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: PRIORITY[path] ?? 0.6,
      // the portrait on the pages about me, so it can show up in image search for the name
      images: path === "/" || path === "/about" ? [`${SITE_URL}${profile.portrait}`] : undefined,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: p.featured ? 0.7 : 0.6,
      images: [p.cover, ...(p.gallery ?? []).map((g) => g.src)].filter((src): src is string => Boolean(src)).map((src) => `${SITE_URL}${src}`),
    })),
  ];
}
