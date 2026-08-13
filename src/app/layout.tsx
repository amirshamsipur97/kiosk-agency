import type { Metadata, Viewport } from "next";
import { Anton, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

/* Display face for the new site — Anton, all-caps condensed. */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

/* Body/UI face for the new site. */
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

/* Kept for the legacy inner pages, which still style off --font-sans-src. */
const sans = Inter({
  variable: "--font-sans-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://www.kioskoman.com";

const TITLE = "Kiosk Agency — We Design. We Create. You Grow.";
const DESCRIPTION =
  "Kiosk Agency — full-service creative media, marketing and production, Muscat, Oman. 17 years across the GCC. From idea to installation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — KIOSK Agency",
  },
  description: DESCRIPTION,
  applicationName: "KIOSK Agency",
  authors: [{ name: "KIOSK Agency", url: SITE_URL }],
  creator: "KIOSK Agency",
  publisher: "KIOSK Agency",
  category: "marketing",
  keywords: [
    "creative agency Muscat",
    "marketing agency Oman",
    "exhibition stands Oman",
    "event production Muscat",
    "film production Oman",
    "signage and branding",
    "performance marketing GCC",
    "activations and retail",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "KIOSK Agency",
    locale: "en_US",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "KIOSK Agency",
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon`,
      email: "info@kioskoman.com",
      telephone: "+968 909 909 23",
      description: DESCRIPTION,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Al Ghubrah St.",
        addressLocality: "Muscat",
        addressCountry: "OM",
      },
      sameAs: ["https://www.instagram.com/kiosk.om/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "KIOSK Agency",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
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
      className={`${anton.variable} ${grotesk.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-ink text-paper">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
