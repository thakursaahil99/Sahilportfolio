import type { Metadata } from "next";
import LabExperiments, { LabHero } from "@/components/lab/LabExperiments";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Lab — Sahil Thakur",
  description: "Interactive motion experiments by Sahil Thakur — canvas, scroll-driven type, drag physics and more.",
};

export default function LabPage() {
  return (
    <main className="relative">
      <LabHero />
      <LabExperiments />
      <ContactCTA index="02" />
    </main>
  );
}
