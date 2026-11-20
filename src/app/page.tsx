import type { Metadata } from "next";
import { pageMeta, profilePageSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { projects } from "@/data/projects";
import Hero from "@/components/Hero";
import HomeWall from "@/components/home/HomeWall";
import HomeAbout from "@/components/home/HomeAbout";
import HomeServices from "@/components/home/HomeServices";
import HomeStack from "@/components/home/HomeStack";
import HomeWork from "@/components/home/HomeWork";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = pageMeta({
  title: "Sahil Thakur — Full-Stack Developer, Software Engineer & Web Designer in India",
  absoluteTitle: true,
  description:
    `Portfolio of Sahil Thakur — full-stack developer, software engineer and web designer from Bir, Himachal Pradesh. ${projects.length} shipped projects: websites, web apps, eCommerce stores (Magento 2), AI tools and 3D motion sites.`,
  path: "/",
  type: "profile",
});

export default function Home() {
  return (
    <main className="relative">
      <JsonLd data={profilePageSchema("/", "Sahil Thakur — Portfolio")} />
      <Hero />
      <HomeWall />
      <HomeAbout />
      <HomeServices />
      <HomeStack />
      <HomeWork />
      <ContactCTA index="04" />
    </main>
  );
}
