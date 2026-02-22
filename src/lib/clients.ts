import type { ClientConfig } from "@/components/welcome-checkout";

const CLIENTS: Record<string, ClientConfig> = {
  "53af59bc-dc04-45ed-a487-c83546935095": {
    uid: "53af59bc-dc04-45ed-a487-c83546935095",
    password: "expansion2026",
    displayName: "Electra Frost",
    services: [
      {
        id: "organic-press",
        name: "Organic Press",
        description:
          "Monthly earned media placements in tier-1 and industry publications.",
        priceId: "price_1T3YYOGnB9wsOF5vKfXQjvsg",
        pricePerUnit: 600,
        priceSuffix: "/unit/mo",
        category: "core",
        defaultQty: 1,
        maxQty: 10,
      },
      {
        id: "expert-quoting",
        name: "Expert Quoting",
        description:
          "Proactive placement of expert quotes in journalist stories.",
        priceId: "price_1T3YYPGnB9wsOF5vbWQLuyE8",
        pricePerUnit: 600,
        priceSuffix: "/mo",
        category: "core",
        defaultQty: 1,
        maxQty: 1,
      },
      {
        id: "speaking-events",
        name: "Speaking Events",
        description:
          "Sourcing and securing keynote and panel speaking opportunities.",
        priceId: "price_1T3YZ3GnB9wsOF5vsODFmQwZ",
        pricePerUnit: 600,
        priceSuffix: "/unit/mo",
        category: "core",
        defaultQty: 1,
        maxQty: 10,
      },
      {
        id: "podcast-guest",
        name: "Podcast Guest",
        description:
          "Booking guest appearances on relevant industry podcasts.",
        priceId: "price_1T3YZ7GnB9wsOF5vqNqpSbav",
        pricePerUnit: 600,
        priceSuffix: "/unit/mo",
        category: "addon",
        defaultQty: 0,
        maxQty: 10,
      },
      {
        id: "credu-leads",
        name: "CREDU Leads",
        description:
          "Credibility-driven lead generation through thought leadership content.",
        priceId: "price_1T3YZAGnB9wsOF5vtpbQgE13",
        pricePerUnit: 600,
        priceSuffix: "/pack/mo",
        category: "addon",
        defaultQty: 0,
        maxQty: 10,
      },
      {
        id: "search-tracker",
        name: "Search Tracker",
        description:
          "Monthly tracking of search visibility and brand mentions.",
        priceId: "price_1T3YYSGnB9wsOF5vicY71dQl",
        pricePerUnit: 200,
        priceSuffix: "/mo",
        category: "addon",
        defaultQty: 0,
        maxQty: 1,
        exclusiveGroup: "search-tracker",
      },
      {
        id: "search-tracker-credu",
        name: "Search Tracker + CREDU",
        description:
          "Combined search tracking and credibility-driven lead generation.",
        priceId: "price_1T3YYTGnB9wsOF5vN4yIBiFW",
        pricePerUnit: 300,
        priceSuffix: "/mo",
        category: "addon",
        defaultQty: 0,
        maxQty: 1,
        exclusiveGroup: "search-tracker",
      },
    ],
  },
};

export function getClientConfig(uid: string): ClientConfig | undefined {
  return CLIENTS[uid];
}
