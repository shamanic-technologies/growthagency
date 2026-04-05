import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://growthagency.dev";
const SITE_NAME = "GrowthAgency.dev";
const SITE_DESCRIPTION =
  "Your PR agency. No retainer. $5,000 per article in a DR50+ publication, delivered or 100% refunded. Guaranteed results by Kevin Lourd.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GrowthAgency.dev — Your PR Agency. No Retainer. Guaranteed Results.",
    template: "%s | GrowthAgency.dev",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "PR agency",
    "press coverage",
    "guaranteed PR",
    "no retainer PR",
    "AI search visibility",
    "organic press",
    "DR50 backlinks",
    "SEO backlinks",
    "press agency",
    "journalist outreach",
    "money-back guarantee",
    "GrowthAgency.dev",
  ],
  authors: [{ name: "Kevin Lourd", url: "https://www.linkedin.com/in/kevin-lourd-3394b025/" }],
  creator: "Kevin Lourd",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "GrowthAgency.dev — Your PR Agency. No Retainer. Guaranteed Results.",
    description:
      "$5,000 per article in a DR50+ publication. Delivered or 100% refunded. No retainer, no commitment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthAgency.dev — Your PR Agency. No Retainer. Guaranteed Results.",
    description:
      "$5,000 per article in a DR50+ publication. Delivered or 100% refunded. No retainer, no commitment.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "GrowthAgency",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  image: `${SITE_URL}/favicon.svg`,
  description: SITE_DESCRIPTION,
  email: "kevin@growthagency.dev",
  priceRange: "$$$",
  areaServed: "Worldwide",
  serviceType: [
    "Public Relations",
    "Press Coverage",
    "AI Search Optimization",
    "SEO Backlinks",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "PR Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Guaranteed Press Article",
          description:
            "One article in a DR50+ publication with permanent do-follow backlink. $5,000 per article, delivered or 100% refunded.",
        },
        price: "5000",
        priceCurrency: "USD",
      },
    ],
  },
  sameAs: [
    "https://www.linkedin.com/in/kevin-lourd-3394b025/",
  ],
  founder: {
    "@type": "Person",
    "@id": `${SITE_URL}/#founder`,
    name: "Kevin Lourd",
    url: "https://www.linkedin.com/in/kevin-lourd-3394b025/",
    jobTitle: "Founder & PR Strategist",
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
  },
  knowsAbout: [
    "Public relations",
    "Press coverage",
    "Journalist outreach",
    "AI search visibility",
    "Search engine optimization",
    "Growth strategy",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does GrowthAgency.dev do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GrowthAgency.dev is a premium PR agency that guarantees press coverage. $5,000 per article in a DR50+ publication, delivered or 100% refunded. No retainer, no commitment.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a money-back guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. If we don't deliver a published article in a DR50+ publication, you get a full 100% refund. No questions asked.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "$5,000 per article. No retainer, no monthly commitment. You pay per article, and each engagement comes with a 100% money-back guarantee.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Kevin Lourd?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kevin Lourd is the founder and dedicated PR strategist at GrowthAgency.dev. He personally designs your PR strategy and oversees every campaign.",
      },
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
