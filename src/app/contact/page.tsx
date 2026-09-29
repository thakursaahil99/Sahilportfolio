import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact — Sahil Thakur",
  description: "Start a project with Sahil Thakur — web apps, eCommerce, AI integrations and motion-rich websites.",
};

export default function Contact() {
  return (
    <main className="relative">
      <ContactPage />
    </main>
  );
}
