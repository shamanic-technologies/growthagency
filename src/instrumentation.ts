async function deployEmailTemplates() {
  const url = process.env.TRANSACTIONAL_EMAIL_SERVICE_URL;
  const apiKey = process.env.TRANSACTIONAL_EMAIL_SERVICE_API_KEY;

  if (!url || !apiKey) {
    console.warn("[instrumentation] Missing TRANSACTIONAL_EMAIL_SERVICE env vars, skipping template deploy");
    return;
  }

  try {
    const res = await fetch(`${url}/templates`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        appId: "growthagency",
        templates: [
          {
            name: "checkout_success",
            subject: "Welcome to GrowthAgency — You're all set!",
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
        ],
      }),
    });

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
    await deployEmailTemplates();
  }
}
