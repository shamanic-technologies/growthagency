import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, decrementCohortSpots } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[growthagency] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[growthagency] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const cohortMonth = session.metadata?.cohort_month;

    if (cohortMonth) {
      try {
        await decrementCohortSpots();
        console.log(`[growthagency] Decremented cohort spots for ${cohortMonth}`);
      } catch (err) {
        console.error("[growthagency] Failed to decrement cohort spots:", err);
      }
    }

    if (customerEmail) {
      try {
        await sendEmail("reservation_confirmed", customerEmail, {
          cohortMonth: cohortMonth ?? "upcoming",
        });
        await sendEmail("reservation_notification", "kevin@growthagency.dev", {
          email: customerEmail,
          cohortMonth: cohortMonth ?? "upcoming",
        });
      } catch (err) {
        console.error("[growthagency] Error sending reservation emails:", err);
      }
    } else {
      console.warn("[growthagency] Missing customer email in session", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
