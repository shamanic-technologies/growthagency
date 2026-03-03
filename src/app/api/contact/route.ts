import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

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
      await Promise.allSettled([
        sendEmail("contact_welcome", email, { serviceName }),
        sendEmail("contact_email_captured", NOTIFY_EMAIL, { serviceName, email }),
      ]);
      return NextResponse.json({ success: true });
    }

    if (step === "notify") {
      if (!phone) {
        return NextResponse.json({ error: "Missing phone" }, { status: 400 });
      }

      await sendEmail("contact_lead_ready", NOTIFY_EMAIL, { serviceName, email, phone });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
