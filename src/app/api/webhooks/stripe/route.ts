import { NextResponse } from "next/server";
import Stripe from "stripe";
import { calculateTrialEnd } from "@/app/api/checkout/route";
import { distributeFetch } from "@/lib/distribute";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

async function sendCheckoutEmail(customerEmail: string, portalUrl: string) {
  const trialEnd = calculateTrialEnd();
  const billingDate = new Date(trialEnd * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const res = await distributeFetch("/v1/emails/send", {
    method: "POST",
    body: {
      eventType: "checkout_success",
      recipientEmail: customerEmail,
      metadata: {
        billingDate,
        portalUrl,
      },
    },
  });

  if (!res) return;

  if (!res.ok) {
    const body = await res.text();
    console.error("[webhook] Email send failed:", res.status, body);
  } else {
    console.log("[webhook] Checkout success email sent to", customerEmail);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const customerId = session.customer as string | null;

    if (customerEmail && customerId) {
      try {
        const portalSession = await getStripe().billingPortal.sessions.create({
          customer: customerId,
          return_url: process.env.NEXT_PUBLIC_SITE_URL || "https://growthagency.dev",
        });

        await sendCheckoutEmail(customerEmail, portalSession.url);
      } catch (err) {
        console.error("[webhook] Error processing checkout.session.completed:", err);
      }
    } else {
      console.warn("[webhook] Missing customer email or ID in session", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
