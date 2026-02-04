import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://growthagency.dev";
const SITE_NAME = "GrowthAgency.dev";
const SITE_DESCRIPTION =
  "GrowthAgency.dev — Free AI-powered growth agency. Sales outreach, PR, AI search ranking, SEO — all automated, all free. Powered by open-source AI tools.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GrowthAgency.dev — Free AI-Powered Growth",
    template: "%s | GrowthAgency.dev",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "growth agency",
    "AI growth",
    "free growth agency",
    "cold email",
    "PR automation",
    "AI search ranking",
    "SEO",
    "sales outreach",
    "BYOK",
    "open source",
    "MCP",
    "press coverage",
    "backlinks",
  ],
  authors: [{ name: "Kevin Lourd" }],
  creator: "Kevin Lourd",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "GrowthAgency.dev — Free AI-Powered Growth",
    description:
      "Free AI-powered growth agency. Sales, PR, AI ranking, SEO — all automated, all free.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GrowthAgency.dev — Free AI-Powered Growth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthAgency.dev — Free AI-Powered Growth",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  founder: {
    "@type": "Person",
    name: "Kevin Lourd",
    url: "https://www.linkedin.com/in/kevin-lourd-3394b025/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
