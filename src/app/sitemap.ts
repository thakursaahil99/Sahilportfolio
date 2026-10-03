import type { MetadataRoute } from "next";
import { NAV } from "@/data/nav";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...NAV.map((n) => n.href), "/resume"];
  return [
    ...pages.map((path) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
