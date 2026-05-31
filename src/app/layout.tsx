import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteBackground from "@/components/background/SiteBackground";

const display = Space_Grotesk({
  variable: "--font-display-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans-src",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kiosk-agency.vercel.app"),
  title: {
    default: "KIOSK — Build Digital Systems That Generate Real Business Growth",
    template: "%s — KIOSK Agency",
  },
  description:
    "KIOSK is a growth-focused digital agency building connected systems — strategy, content, websites, CRM, automation, SEO, and performance marketing — that attract, engage, convert, and scale.",
  keywords: [
    "digital agency",
    "growth marketing",
    "web development",
    "CRM automation",
    "SEO",
    "lead generation",
  ],
  openGraph: {
    title: "KIOSK — Build Digital Systems That Generate Real Business Growth",
    description:
      "Connected digital ecosystems that attract, engage, convert, and scale.",
    type: "website",
    siteName: "KIOSK Agency",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "KIOSK — Build Digital Systems That Generate Real Business Growth",
    description:
      "Connected digital ecosystems that attract, engage, convert, and scale.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-ink text-paper">
        <SiteBackground />
        {/* Soft fade from the hero down into pure black for the rest of the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[88vh] z-[1]"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 0, #000 900px)",
          }}
        />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
