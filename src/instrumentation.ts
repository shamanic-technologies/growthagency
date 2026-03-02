import { distributeFetch } from "@/lib/distribute";

const PROVIDER_KEYS = [
  { provider: "postmark", envVar: "POSTMARK_API_KEY" },
  { provider: "stripe", envVar: "STRIPE_SECRET_KEY" },
] as const;

async function registerProviderKeys() {
  for (const { provider, envVar } of PROVIDER_KEYS) {
    const apiKey = process.env[envVar];
    if (!apiKey) {
      console.warn(`[instrumentation] Missing ${envVar}, skipping ${provider} key registration`);
      continue;
    }

    try {
      const res = await distributeFetch("/v1/keys", {
        method: "POST",
        body: { keySource: "org", provider, apiKey },
      });

      if (!res) return;

      if (!res.ok) {
        const body = await res.text();
        console.error(`[instrumentation] ${provider} key registration failed:`, res.status, body);
      } else {
        console.log(`[instrumentation] ${provider} key registered`);
      }
    } catch (err) {
      console.error(`[instrumentation] ${provider} key registration error:`, err);
    }
  }
}

async function deployEmailTemplates() {
  try {
    const res = await distributeFetch("/v1/emails/templates", {
      method: "PUT",
      body: {
        templates: [
          {
            name: "checkout_success",
            subject: "Welcome to GrowthAgency.dev — You're all set!",
            from: "GrowthAgency.dev <hello@growthagency.dev>",
            messageStream: "outbound",
            htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:32px;">
          <span style="font-size:18px;color:#94a3b8;">Growth<span style="color:#10b981;font-weight:600;">Agency</span>.dev</span>
        </td></tr>
        <!-- Card -->
        <tr><td style="background-color:#ffffff;border-radius:16px;padding:40px 32px;text-align:center;">
          <p style="font-size:40px;margin:0 0 16px;">🎉</p>
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#0f172a;">You're all set!</h1>
          <p style="margin:0 0 8px;font-size:16px;color:#475569;line-height:1.6;">
            Your subscription is confirmed and your services start on <strong style="color:#0f172a;">{{billingDate}}</strong>.
          </p>
          <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.6;">
            We'll be in touch very soon to get things moving. In the meantime, you can manage your subscription anytime from your portal.
          </p>
          <!-- CTA -->
          <a href="{{portalUrl}}" style="display:inline-block;background-color:#0f172a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:50px;">
            Manage Your Subscription
          </a>
        </td></tr>
        <!-- Footer -->
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
            textBody: `You're all set!

Your subscription is confirmed and your services start on {{billingDate}}.

We'll be in touch very soon to get things moving.

Manage your subscription: {{portalUrl}}

— GrowthAgency.dev`,
          },
          {
            name: "contact_welcome",
            subject: "Welcome to GrowthAgency — {{serviceName}}",
            from: "Kevin Lourd <kevin@growthagency.dev>",
            messageStream: "outbound",
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
          {
            name: "contact_email_captured",
            subject: "New email captured: {{serviceName}} — {{email}}",
            from: "GrowthAgency.dev <hello@growthagency.dev>",
            messageStream: "outbound",
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
          {
            name: "contact_lead_ready",
            subject: "New lead ready: {{serviceName}} — {{email}} / {{phone}}",
            from: "GrowthAgency.dev <hello@growthagency.dev>",
            messageStream: "outbound",
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
        ],
      },
    });

    if (!res) return;

    if (!res.ok) {
      const body = await res.text();
      console.error("[instrumentation] Template deploy failed:", res.status, body);
    } else {
      console.log("[instrumentation] Email templates deployed successfully");
    }
  } catch (err) {
    console.error("[instrumentation] Template deploy error:", err);
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await registerProviderKeys();
    await deployEmailTemplates();
  }
}
