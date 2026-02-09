import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://growthagency.dev";
const SITE_NAME = "GrowthAgency.dev";
const SITE_DESCRIPTION =
  "GrowthAgency.dev — Your growth team. Sales outreach, PR, AI search visibility, and SEO with guaranteed results. Dedicated strategist, fast execution, money-back guarantee.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GrowthAgency.dev — Your Growth Team, Guaranteed Results",
    template: "%s | GrowthAgency.dev",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "growth agency",
    "guaranteed growth",
    "sales outreach",
    "cold email agency",
    "PR agency",
    "press coverage",
    "AI search ranking",
    "SEO backlinks",
    "lead generation",
    "money-back guarantee",
    "dedicated strategist",
    "GrowthAgency.dev",
  ],
  authors: [{ name: "Kevin Lourd", url: "https://www.linkedin.com/in/kevin-lourd-3394b025/" }],
  creator: "Kevin Lourd",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.jpg", type: "image/jpeg" },
    ],
    apple: "/favicon.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "GrowthAgency.dev — Your Growth Team, Guaranteed Results",
    description:
      "Sales outreach, PR, AI search visibility, and SEO — with a dedicated strategist and guaranteed results. Money-back guarantee.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthAgency.dev — Your Growth Team, Guaranteed Results",
    description:
      "Sales outreach, PR, AI search visibility, and SEO — with a dedicated strategist and guaranteed results.",
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
  priceRange: "$$",
  areaServed: "Worldwide",
  serviceType: [
    "Sales Lead Generation",
    "Public Relations",
    "SEO",
    "AI Search Optimization",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Growth Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Sales Lead Generation",
          description:
            "Qualified prospects delivered to your inbox. Personalized outreach, smart follow-ups, and continuous optimization.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Press Coverage & PR",
          description:
            "Real articles in real publications. Organic press coverage for brand credibility, SEO, and AI search visibility.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Search Visibility",
          description:
            "Appear in ChatGPT, Perplexity, and AI-powered search results through organic press coverage and quality backlinks.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SEO & Backlinks",
          description:
            "High-authority backlinks from real press coverage. Each article is a permanent SEO asset that compounds over time.",
        },
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
    jobTitle: "Founder & Growth Strategist",
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
  },
  knowsAbout: [
    "Sales outreach",
    "Lead generation",
    "Public relations",
    "Press coverage",
    "Search engine optimization",
    "AI search visibility",
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
        text: "GrowthAgency.dev is a growth agency that handles sales outreach, PR and press coverage, AI search visibility, and SEO — with guaranteed results and a money-back guarantee.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a money-back guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer a full money-back guarantee if we don't deliver the promised results within the agreed timeframe.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can you start?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We can launch your first campaign within 24 hours. You only need to provide your brand URL and a brief description of your goals.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Kevin Lourd?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kevin Lourd is the founder and dedicated strategist at GrowthAgency.dev. He personally designs growth plans and oversees every campaign.",
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
