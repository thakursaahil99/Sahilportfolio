import type { Metadata } from "next";
import { breadcrumbSchema, pageMeta, workListSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { projects } from "@/data/projects";
import WorkIndex from "@/components/work/WorkIndex";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = pageMeta({
  title: `Work — ${projects.length} Projects: Web Apps, eCommerce, AI & Website Design`,
  description:
    "Every project by Sahil Thakur with screenshots and a brief: booking platforms, multi-vendor marketplaces, Magento 2 stores, AI tools, 3D motion sites and personal brands.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <main className="relative">
      <JsonLd data={[workListSchema(), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])]} />
      <WorkIndex />
      <ContactCTA index="02" />
    </main>
  );
}
