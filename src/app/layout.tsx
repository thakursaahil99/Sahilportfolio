import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/transition/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { profile } from "@/data/profile";
import { SITE_URL } from "@/lib/site";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  // set NEXT_PUBLIC_SITE_URL to a custom domain if one is added; see lib/site.ts
  metadataBase: new URL(SITE_URL),
  title: "Sahil Thakur — Full-Stack Developer",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Sahil Thakur",
    title: "Sahil Thakur — Full-Stack Developer",
    description: "Full-stack developer building platforms, storefronts and AI-powered interfaces with Next.js, Node.js and more.",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  authors: [{ name: "Sahil Thakur", url: SITE_URL }],
  keywords: ["Sahil Thakur", "Full-Stack Developer", "Next.js", "React", "TypeScript", "Node.js", "Magento 2", "Portfolio"],
  description:
    "Portfolio of Sahil Thakur, a full-stack developer building fast, scalable digital experiences — from Magento storefronts to AI-powered Next.js interfaces.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${unbounded.variable} antialiased`}>
      <body className="min-h-full bg-background text-ink">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        {/* structured data so search engines understand who this site is about */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              jobTitle: profile.role,
              url: SITE_URL,
              email: `mailto:${profile.email}`,
              address: { "@type": "PostalAddress", addressLocality: "Bir", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
              sameAs: profile.socials.map((s) => s.href),
              knowsAbout: ["Full-stack web development", "Next.js", "React", "TypeScript", "Node.js", "Magento 2", "AI integrations"],
            }),
          }}
        />
        {/* SmoothScroll must mount before Preloader so the loader can pause Lenis */}
        <SmoothScroll />
        <Preloader />
        <ScrollProgress />
        <Cursor />
        <div className="grain" aria-hidden="true" />
        <PageTransition>
          <Navbar />
          <div id="content" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <Footer />
        </PageTransition>
        {/* page views → Vercel dashboard (enable Analytics on the project once) */}
        <Analytics />
      </body>
    </html>
  );
}
