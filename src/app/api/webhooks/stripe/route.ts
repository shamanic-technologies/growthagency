import { NextResponse } from "next/server";
import Stripe from "stripe";
import { calculateTrialEnd } from "@/app/api/checkout/route";
import { sendEmail } from "@/lib/email";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

async function sendCheckoutEmails(
  stripe: Stripe,
  customerId: string,
  customerEmail: string,
  portalUrl: string,
) {
  const trialEnd = calculateTrialEnd();
  const billingDate = new Date(trialEnd * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const alreadyWelcomed = customer.metadata?.welcome_email_sent === "true";

  const emails: Promise<void>[] = [
    sendEmail("checkout_receipt", customerEmail, { billingDate, portalUrl }),
  ];

  if (!alreadyWelcomed) {
    emails.push(sendEmail("checkout_welcome", customerEmail, { billingDate }));
    await stripe.customers.update(customerId, {
      metadata: { welcome_email_sent: "true" },
    });
  }

  await Promise.all(emails);
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
        const stripe = getStripe();
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: process.env.NEXT_PUBLIC_SITE_URL || "https://growthagency.dev",
        });

        await sendCheckoutEmails(stripe, customerId, customerEmail, portalSession.url);
      } catch (err) {
        console.error("[webhook] Error processing checkout.session.completed:", err);
      }
    } else {
      console.warn("[webhook] Missing customer email or ID in session", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
