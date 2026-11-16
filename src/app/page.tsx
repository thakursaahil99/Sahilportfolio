import Hero from "@/components/Hero";
import HomeWall from "@/components/home/HomeWall";
import HomeAbout from "@/components/home/HomeAbout";
import HomeServices from "@/components/home/HomeServices";
import HomeStack from "@/components/home/HomeStack";
import HomeWork from "@/components/home/HomeWork";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <main className="relative">
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
