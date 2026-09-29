import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About teaser />
      <Services />
      <Projects />
      <ContactCTA index="04" />
    </main>
  );
}
