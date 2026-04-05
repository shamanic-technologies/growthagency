import { NextResponse } from "next/server";
import { getStripe, getCohortInfo } from "@/lib/stripe";

export async function POST() {
  const priceId = process.env.STRIPE_PR_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Payment not configured" },
      { status: 503 },
    );
  }

  try {
    const cohort = await getCohortInfo();

    if (cohort.spotsRemaining <= 0) {
      return NextResponse.json(
        { error: "No spots remaining for this cohort. Book a call to discuss the next one." },
        { status: 409 },
      );
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growthagency.dev";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { cohort_month: cohort.monthKey },
      success_url: `${siteUrl}?reserved=true`,
      cancel_url: siteUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[growthagency] Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
