import type { Metadata } from "next";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = pageMeta({
  title: "Contact — Hire Sahil Thakur, Full-Stack Developer",
  description:
    "Get in touch with Sahil Thakur for a full-time role or a project — websites, web apps, eCommerce stores and AI features. Based in Himachal Pradesh, India, working remotely (IST).",
  path: "/contact",
});

export default function Contact() {
  return (
    <main className="relative">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <ContactPage />
    </main>
  );
}
