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
import CommandMenu from "@/components/CommandMenu";
import { SITE_URL } from "@/lib/site";
import { KEYWORDS, siteSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

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
  title: {
    default: "Sahil Thakur — Full-Stack Developer, Software Engineer & Web Designer",
    template: "%s | Sahil Thakur",
  },
  description:
    "Sahil Thakur is a full-stack developer, software engineer and web designer from Himachal Pradesh, India — building websites, web apps, eCommerce stores and AI-powered interfaces with Next.js, React, Node.js, Laravel and Magento 2.",
  applicationName: "Sahil Thakur — Portfolio",
  authors: [{ name: "Sahil Thakur", url: SITE_URL }],
  creator: "Sahil Thakur",
  publisher: "Sahil Thakur",
  keywords: KEYWORDS,
  category: "technology",
  openGraph: {
    type: "website",
    siteName: "Sahil Thakur — Portfolio",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // paste the codes from Google Search Console / Bing Webmaster Tools into these Vercel env vars
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${geist.variable} ${geistMono.variable} ${unbounded.variable} antialiased`}>
      <body className="min-h-full bg-background text-ink">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        {/* structured data so search engines understand who this site is about */}
        <JsonLd data={siteSchema()} />
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
          <CommandMenu />
        </PageTransition>
        {/* page views → Vercel dashboard (enable Analytics on the project once) */}
        <Analytics />
      </body>
    </html>
  );
}
