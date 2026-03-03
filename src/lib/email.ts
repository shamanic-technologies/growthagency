const POSTMARK_API_URL = "https://api.postmarkapp.com/email";

type EventType =
  | "checkout_welcome"
  | "checkout_receipt"
  | "contact_welcome"
  | "contact_email_captured"
  | "contact_lead_ready";

interface TemplateDefinition {
  from: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}

function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    template,
  );
}

const TEMPLATES: Record<EventType, TemplateDefinition> = {
  checkout_welcome: {
    from: "Kevin Lourd <kevin@growthagency.dev>",
    subject: "Welcome to GrowthAgency — let's grow together",
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td align="center" style="padding-bottom:32px;">
          <span style="font-size:18px;color:#94a3b8;">Growth<span style="color:#10b981;font-weight:600;">Agency</span>.dev</span>
        </td></tr>
        <tr><td style="background-color:#ffffff;border-radius:16px;padding:40px 32px;">
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0f172a;">Welcome aboard!</h1>
          <p style="margin:0 0 16px;font-size:16px;color:#475569;line-height:1.7;">
            I'm a builder, not a marketing guru. I built GrowthAgency for people like us — founders and builders who'd rather ship product than spend hours on growth strategies.
          </p>
          <p style="margin:0 0 16px;font-size:16px;color:#475569;line-height:1.7;">
            Here's why it works: instead of relying on one person's expertise, we tap into <strong style="color:#0f172a;">the collective intelligence of hundreds of proven strategies</strong> across press, SEO, expert quoting, podcasts, and more. Every strategy is backed by <strong style="color:#0f172a;">transparent performance data</strong> — real conversion rates, real costs, real ROI — so you always know exactly what you're getting.
          </p>
          <p style="margin:0 0 16px;font-size:16px;color:#475569;line-height:1.7;">
            The result? Faster onboarding, faster results, and pricing that doesn't require an enterprise budget. We move fast, we stay flexible, and we let the data speak for itself.
          </p>
          <p style="margin:0 0 0;font-size:16px;color:#475569;line-height:1.7;">
            I'll personally make sure you get the most out of this. Reply to this email anytime — I read every single one.
          </p>
          <p style="margin:24px 0 0;color:#0f172a;font-weight:500;font-size:15px;">
            — Kevin Lourd<br/>
            <span style="color:#64748b;font-weight:400;">Founder, GrowthAgency.dev</span>
          </p>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
            This email was sent by GrowthAgency.dev
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    textBody: `Welcome aboard!

I'm a builder, not a marketing guru. I built GrowthAgency for people like us — founders and builders who'd rather ship product than spend hours on growth strategies.

Here's why it works: instead of relying on one person's expertise, we tap into the collective intelligence of hundreds of proven strategies across press, SEO, expert quoting, podcasts, and more. Every strategy is backed by transparent performance data — real conversion rates, real costs, real ROI — so you always know exactly what you're getting.

The result? Faster onboarding, faster results, and pricing that doesn't require an enterprise budget. We move fast, we stay flexible, and we let the data speak for itself.

I'll personally make sure you get the most out of this. Reply to this email anytime — I read every single one.

— Kevin Lourd
Founder, GrowthAgency.dev`,
  },

  checkout_receipt: {
    from: "GrowthAgency.dev <hello@growthagency.dev>",
    subject: "Your subscription is confirmed",
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td align="center" style="padding-bottom:32px;">
          <span style="font-size:18px;color:#94a3b8;">Growth<span style="color:#10b981;font-weight:600;">Agency</span>.dev</span>
        </td></tr>
        <tr><td style="background-color:#ffffff;border-radius:16px;padding:40px 32px;text-align:center;">
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0f172a;">Subscription Confirmed</h1>
          <p style="margin:0 0 8px;font-size:16px;color:#475569;line-height:1.6;">
            Your services and billing start on <strong style="color:#0f172a;">{{billingDate}}</strong>.
          </p>
          <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.6;">
            You can upgrade, downgrade, or cancel your subscription at any time from your billing portal.
          </p>
          <a href="{{portalUrl}}" style="display:inline-block;background-color:#0f172a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:50px;">
            Manage Your Subscription
          </a>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
            This email was sent by GrowthAgency.dev<br>
            You're receiving this because you subscribed to our services.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    textBody: `Subscription Confirmed

Your services and billing start on {{billingDate}}.

You can upgrade, downgrade, or cancel your subscription at any time from your billing portal.

Manage your subscription: {{portalUrl}}

— GrowthAgency.dev`,
  },

  contact_welcome: {
    from: "Kevin Lourd <kevin@growthagency.dev>",
    subject: "Welcome to GrowthAgency — {{serviceName}}",
    htmlBody: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 0;">
  <h2 style="color:#0f172a;font-size:20px;margin-bottom:16px;">Thanks for reaching out!</h2>
  <p style="color:#64748b;line-height:1.6;margin-bottom:16px;">
    We received your interest in <strong>{{serviceName}}</strong>. A member of our team will be in touch shortly.
  </p>
  <p style="color:#64748b;line-height:1.6;margin-bottom:24px;">
    In the meantime, feel free to reply to this email with any questions about your project.
  </p>
  <p style="color:#0f172a;font-weight:500;">
    — Kevin Lourd<br/>
    <span style="color:#64748b;font-weight:400;">GrowthAgency.dev</span>
  </p>
</div>`,
    textBody: `Thanks for reaching out! We received your interest in "{{serviceName}}". A member of our team will be in touch shortly. Feel free to reply to this email with any questions. — Kevin Lourd, GrowthAgency.dev`,
  },

  contact_email_captured: {
    from: "GrowthAgency.dev <hello@growthagency.dev>",
    subject: "New email captured: {{serviceName}} — {{email}}",
    htmlBody: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:16px 0;">
  <h3 style="color:#0f172a;margin-bottom:12px;">New email captured on growthagency.dev</h3>
  <table style="color:#334155;line-height:1.8;">
    <tr><td style="padding-right:16px;color:#94a3b8;">Service</td><td><strong>{{serviceName}}</strong></td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Email</td><td>{{email}}</td></tr>
  </table>
  <p style="color:#94a3b8;margin-top:12px;font-size:13px;">Waiting for phone number (step 2).</p>
</div>`,
    textBody: `New email captured on growthagency.dev\nService: {{serviceName}}\nEmail: {{email}}\nWaiting for phone number (step 2).`,
  },

  contact_lead_ready: {
    from: "GrowthAgency.dev <hello@growthagency.dev>",
    subject: "New lead ready: {{serviceName}} — {{email}} / {{phone}}",
    htmlBody: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:16px 0;">
  <h3 style="color:#0f172a;margin-bottom:12px;">New lead from growthagency.dev</h3>
  <table style="color:#334155;line-height:1.8;">
    <tr><td style="padding-right:16px;color:#94a3b8;">Service</td><td><strong>{{serviceName}}</strong></td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Email</td><td>{{email}}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Phone</td><td>{{phone}}</td></tr>
  </table>
  <p style="color:#94a3b8;margin-top:12px;font-size:13px;">WhatsApp link opened for the user. Follow up if they don't message.</p>
</div>`,
    textBody: `New lead from growthagency.dev\nService: {{serviceName}}\nEmail: {{email}}\nPhone: {{phone}}\nWhatsApp link opened for the user.`,
  },
};

export async function sendEmail(
  eventType: string,
  recipientEmail: string,
  metadata: Record<string, string>,
): Promise<void> {
  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    console.warn("[email] Missing POSTMARK_API_KEY, skipping send");
    return;
  }

  const template = TEMPLATES[eventType as EventType];
  if (!template) {
    console.error(`[email] Unknown event type: ${eventType}`);
    return;
  }

  try {
    const res = await fetch(POSTMARK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Postmark-Server-Token": apiKey,
      },
      body: JSON.stringify({
        From: template.from,
        To: recipientEmail,
        Subject: interpolate(template.subject, metadata),
        HtmlBody: interpolate(template.htmlBody, metadata),
        TextBody: interpolate(template.textBody, metadata),
        MessageStream: process.env.POSTMARK_TRANSACTIONAL_STREAM_ID ?? "outbound",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[email] Postmark send failed:", res.status, text);
    } else {
      console.log(`[email] Sent ${eventType} to ${recipientEmail}`);
    }
  } catch (err) {
    console.error("[email] Postmark send error:", err);
  }
}
