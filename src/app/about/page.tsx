import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import About from "@/components/About";
import BaseCamp from "@/components/about/BaseCamp";
import Arsenal from "@/components/Arsenal";
import Experience from "@/components/Experience";
import Principles from "@/components/about/Principles";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "About — Sahil Thakur",
  description:
    "Sahil Thakur is a full-stack developer from Bir Billing, India — building platforms, storefronts and AI-powered interfaces with Next.js, Node.js and more.",
};

export default function AboutPage() {
  return (
    <main className="relative">
      <AboutHero />
      <About />
      <BaseCamp />
      <Arsenal />
      <Experience index="04" />
      <Principles />
      <ContactCTA index="06" />
    </main>
  );
}
