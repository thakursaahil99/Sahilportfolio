import type { Metadata } from "next";
import WorkIndex from "@/components/work/WorkIndex";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Work — Sahil Thakur",
  description: "Platforms, storefronts, AI tools and cinematic brand sites built by Sahil Thakur.",
};

export default function WorkPage() {
  return (
    <main className="relative">
      <WorkIndex />
      <ContactCTA index="02" />
    </main>
  );
}
