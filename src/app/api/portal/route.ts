import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: Request) {
  try {
    const { customerId } = (await request.json()) as { customerId: string };

    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 },
      );
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXT_PUBLIC_SITE_URL || "https://growthagency.dev",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Portal session error:", err);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
