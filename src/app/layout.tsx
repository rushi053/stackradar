import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stackradar.rushiraj.me";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "StackRadar — X-ray Any Website's Tech Stack in Seconds",
  description:
    "Instantly detect frameworks, hosting, analytics, payments, and 150+ technologies used by any website. Free, fast, and open. Free, fast, and open-source..",
  keywords: [
    "tech stack detector",
    "website technology checker",
    "what technology does a website use",
    "wappalyzer alternative",
    "builtwith alternative",
  ],
  authors: [{ name: "Rushiraj Jadeja", url: "https://twitter.com/rushirajjj" }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "StackRadar — X-ray Any Website's Tech Stack in Seconds",
    description:
      "Instantly detect frameworks, hosting, analytics, payments, and 150+ technologies used by any website. Free, fast, and open. Free, fast, and open-source..",
    url: SITE_URL,
    siteName: "StackRadar",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "StackRadar — X-ray Any Website's Tech Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@rushirajjj",
    title: "StackRadar — X-ray Any Website's Tech Stack in Seconds",
    description:
      "Instantly detect frameworks, hosting, analytics, payments, and 150+ technologies used by any website. Free, fast, and open.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#0a0a0b",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "StackRadar",
  description:
    "Instantly detect frameworks, hosting, analytics, payments, and 150+ technologies used by any website. Free, fast, and open.",
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  author: {
    "@type": "Person",
    name: "Rushiraj Jadeja",
    url: "https://twitter.com/rushirajjj",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <Analytics />
        {/* Gradient orbs */}
        <div className="gradient-orb-1" />
        <div className="gradient-orb-2" />

        {children}
      </body>
    </html>
  );
}
