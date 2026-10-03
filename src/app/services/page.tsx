import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import Services from "@/components/Services";
import Process from "@/components/services/Process";
import Deliverables from "@/components/services/Deliverables";
import Faq from "@/components/services/Faq";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Services — Sahil Thakur",
  description:
    "Web apps, eCommerce, AI integrations and motion-rich websites — how Sahil Thakur works, from discovery to launch.",
};

export default function ServicesPage() {
  return (
    <main className="relative">
      <ServicesHero />
      <Services index="01" />
      <Process index="02" />
      <Deliverables index="03" />
      <Faq index="04" />
      <ContactCTA index="05" />
    </main>
  );
}
