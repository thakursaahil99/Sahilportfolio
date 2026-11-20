import type { Metadata } from "next";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ServicesHero from "@/components/services/ServicesHero";
import Services from "@/components/Services";
import Process from "@/components/services/Process";
import Deliverables from "@/components/services/Deliverables";
import Engagements from "@/components/services/Engagements";
import Faq from "@/components/services/Faq";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = pageMeta({
  title: "Services — Website Design, Web Apps, eCommerce & AI Development",
  description:
    "Hire Sahil Thakur, full-stack developer and web designer: websites, web apps and platforms, Magento 2 and multi-vendor eCommerce, AI integrations and motion / 3D sites — from discovery to launch.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main className="relative">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <ServicesHero />
      <Services index="01" />
      <Process index="02" />
      <Deliverables index="03" />
      <Engagements index="04" />
      <Faq index="05" />
      <ContactCTA index="06" />
    </main>
  );
}
