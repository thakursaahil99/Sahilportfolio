import type { Metadata } from "next";
import LabExperiments, { LabHero } from "@/components/lab/LabExperiments";
import LabStack, { TECH_COUNT } from "@/components/lab/LabStack";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Lab — Sahil Thakur",
  description:
    "Every effect this portfolio is built from, as interactive experiments — plus an index of every technology Sahil Thakur has shipped with and the projects that used it.",
};

export default function LabPage() {
  return (
    <main className="relative">
      <LabHero techCount={TECH_COUNT} />
      <LabExperiments />
      <LabStack index="02" />
      <ContactCTA index="03" />
    </main>
  );
}
