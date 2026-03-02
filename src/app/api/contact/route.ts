import { NextResponse } from "next/server";
import { distributeFetch } from "@/lib/distribute";

const NOTIFY_EMAIL = "kevin@growthagency.dev";

interface ContactBody {
  step: "welcome" | "notify";
  email: string;
  phone?: string;
  serviceName: string;
}

export async function POST(request: Request) {
  try {
    const { step, email, phone, serviceName } =
      (await request.json()) as ContactBody;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    if (step === "welcome") {
      const welcomePromise = distributeFetch("/v1/emails/send", {
        method: "POST",
        body: {
          eventType: "contact_welcome",
          recipientEmail: email,
          metadata: { serviceName },
        },
      });

      const notifyPromise = distributeFetch("/v1/emails/send", {
        method: "POST",
        body: {
          eventType: "contact_email_captured",
          recipientEmail: NOTIFY_EMAIL,
          metadata: { serviceName, email },
        },
      });

      await Promise.allSettled([welcomePromise, notifyPromise]);
      return NextResponse.json({ success: true });
    }

    if (step === "notify") {
      if (!phone) {
        return NextResponse.json({ error: "Missing phone" }, { status: 400 });
      }

      await distributeFetch("/v1/emails/send", {
        method: "POST",
        body: {
          eventType: "contact_lead_ready",
          recipientEmail: NOTIFY_EMAIL,
          metadata: { serviceName, email, phone },
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
