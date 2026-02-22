import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const VALID_PRICE_IDS = new Set([
  "price_1T3YYOGnB9wsOF5vKfXQjvsg", // Organic Press
  "price_1T3YYPGnB9wsOF5vbWQLuyE8", // Expert Quoting
  "price_1T3YZ3GnB9wsOF5vsODFmQwZ", // Speaking Events
  "price_1T3YZ7GnB9wsOF5vqNqpSbav", // Podcast Guest
  "price_1T3YZAGnB9wsOF5vtpbQgE13", // CREDU Leads
  "price_1T3YYSGnB9wsOF5vicY71dQl", // Search Tracker
  "price_1T3YYTGnB9wsOF5vN4yIBiFW", // Search Tracker + CREDU
]);

interface LineItem {
  priceId: string;
  quantity: number;
}

export function calculateTrialEnd(): number {
  const now = new Date();
  const nowUnix = Math.floor(now.getTime() / 1000);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  let target = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));
  let trialEnd = Math.floor(target.getTime() / 1000);

  // Stripe requires trial_end to be at least 48h in the future
  const MIN_TRIAL_SECONDS = 48 * 60 * 60;
  if (trialEnd - nowUnix < MIN_TRIAL_SECONDS) {
    target = new Date(Date.UTC(year, month + 2, 1, 0, 0, 0));
    trialEnd = Math.floor(target.getTime() / 1000);
  }

  return trialEnd;
}

export async function POST(request: Request) {
  try {
    const { lineItems } = (await request.json()) as { lineItems: LineItem[] };

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: "No services selected" },
        { status: 400 },
      );
    }

    for (const item of lineItems) {
      if (!VALID_PRICE_IDS.has(item.priceId)) {
        return NextResponse.json(
          { error: "Invalid price ID" },
          { status: 400 },
        );
      }
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 10
      ) {
        return NextResponse.json(
          { error: "Invalid quantity" },
          { status: 400 },
        );
      }
    }

    const trialEnd = calculateTrialEnd();
    const billingDate = new Date(trialEnd * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      subscription_data: {
        trial_end: trialEnd,
      },
      custom_text: {
        submit: {
          message: `This is not a free trial. Your services and billing both start on ${billingDate}.`,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://growthagency.dev"}/electrafrost?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://growthagency.dev"}/electrafrost`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
