import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/transition/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  // set NEXT_PUBLIC_SITE_URL to the deployed domain so OG images resolve
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Sahil Thakur — Full-Stack Developer",
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
        {/* SmoothScroll must mount before Preloader so the loader can pause Lenis */}
        <SmoothScroll />
        <Preloader />
        <ScrollProgress />
        <Cursor />
        <div className="grain" aria-hidden="true" />
        <PageTransition>
          <Navbar />
          {children}
          <Footer />
        </PageTransition>
      </body>
    </html>
  );
}
