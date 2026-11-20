import type { Metadata } from "next";
import { breadcrumbSchema, pageMeta, profilePageSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import AboutHero from "@/components/about/AboutHero";
import About from "@/components/About";
import BaseCamp from "@/components/about/BaseCamp";
import Arsenal from "@/components/Arsenal";
import Experience from "@/components/Experience";
import Principles from "@/components/about/Principles";
import Shipped from "@/components/about/Shipped";
import FactSheet from "@/components/about/FactSheet";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = pageMeta({
  title: "About Sahil Thakur — Full-Stack Developer & Designer from Himachal Pradesh",
  description:
    "Who Sahil Thakur is: a full-stack developer, software engineer and web designer from Bir Billing, India. The journey from 2022, the stack, every project by type and how to get in touch.",
  path: "/about",
  type: "profile",
});

export default function AboutPage() {
  return (
    <main className="relative">
      <JsonLd data={[profilePageSchema("/about", "About Sahil Thakur"), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])]} />
      <AboutHero />
      <About />
      <BaseCamp />
      <Arsenal />
      <Experience index="04" />
      <Shipped index="05" />
      <Principles index="06" />
      <FactSheet index="07" />
      <ContactCTA index="08" />
    </main>
  );
}
