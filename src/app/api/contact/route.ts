import { NextResponse } from "next/server";

const EMAIL_SENDING_URL = "https://email-sending.mcpfactory.org/send";
const NOTIFY_EMAIL = "kevin@growthagency.dev";

interface ContactBody {
  email: string;
  phone: string;
  serviceName: string;
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch(EMAIL_SENDING_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function POST(request: Request) {
  try {
    const { email, phone, serviceName } = (await request.json()) as ContactBody;

    if (!email || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const runId = crypto.randomUUID();

    // 1. Welcome email to the lead
    const welcomePromise = sendEmail({
      type: "transactional",
      appId: "growthagency-website",
      brandId: "growthagency",
      campaignId: "website-contact-form",
      runId,
      to: email,
      recipientFirstName: "",
      recipientLastName: "",
      recipientCompany: "",
      subject: `Welcome to GrowthAgency — ${serviceName}`,
      htmlBody: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
          <h2 style="color: #0f172a; font-size: 20px; margin-bottom: 16px;">Thanks for reaching out!</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 16px;">
            We received your interest in <strong>${serviceName}</strong>. A member of our team will be in touch shortly via WhatsApp at <strong>${phone}</strong>.
          </p>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">
            In the meantime, feel free to reply to this email with any questions about your project.
          </p>
          <p style="color: #0f172a; font-weight: 500;">
            — Kevin Lourd<br/>
            <span style="color: #64748b; font-weight: 400;">GrowthAgency.dev</span>
          </p>
        </div>
      `,
      textBody: `Thanks for reaching out! We received your interest in "${serviceName}". A member of our team will be in touch shortly via WhatsApp at ${phone}. Feel free to reply to this email with any questions. — Kevin Lourd, GrowthAgency.dev`,
      replyTo: NOTIFY_EMAIL,
      tag: "website-welcome",
    });

    // 2. Notification email to Kevin
    const notifyPromise = sendEmail({
      type: "transactional",
      appId: "growthagency-website",
      brandId: "growthagency",
      campaignId: "website-contact-form",
      runId,
      to: NOTIFY_EMAIL,
      recipientFirstName: "Kevin",
      recipientLastName: "Lourd",
      recipientCompany: "GrowthAgency",
      subject: `New lead: ${serviceName} — ${email}`,
      htmlBody: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 16px 0;">
          <h3 style="color: #0f172a; margin-bottom: 12px;">New lead from growthagency.dev</h3>
          <table style="color: #334155; line-height: 1.8;">
            <tr><td style="padding-right: 16px; color: #94a3b8;">Service</td><td><strong>${serviceName}</strong></td></tr>
            <tr><td style="padding-right: 16px; color: #94a3b8;">Email</td><td>${email}</td></tr>
            <tr><td style="padding-right: 16px; color: #94a3b8;">Phone</td><td>${phone}</td></tr>
          </table>
        </div>
      `,
      textBody: `New lead from growthagency.dev\nService: ${serviceName}\nEmail: ${email}\nPhone: ${phone}`,
      tag: "website-lead-notify",
    });

    await Promise.allSettled([welcomePromise, notifyPromise]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
