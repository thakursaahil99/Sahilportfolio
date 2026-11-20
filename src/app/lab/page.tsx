import type { Metadata } from "next";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import LabExperiments, { LabHero } from "@/components/lab/LabExperiments";
import LabStack, { TECH_COUNT } from "@/components/lab/LabStack";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = pageMeta({
  title: "Lab — Web Animation & Motion Experiments",
  description:
    "Every effect this portfolio is built from, as interactive experiments — plus an index of every technology Sahil Thakur has shipped with and the projects that used it.",
  path: "/lab",
});

export default function LabPage() {
  return (
    <main className="relative">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Lab", path: "/lab" }])} />
      <LabHero techCount={TECH_COUNT} />
      <LabExperiments />
      <LabStack index="02" />
      <ContactCTA index="03" />
    </main>
  );
}
