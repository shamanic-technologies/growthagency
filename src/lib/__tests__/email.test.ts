import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmail } from "../email";

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal("fetch", mockFetch);

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("POSTMARK_API_KEY", "pm_test_key");
    mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve("") });
  });

  it("calls Postmark API with correct headers and body", async () => {
    await sendEmail("checkout_success", "user@example.com", {
      billingDate: "March 8, 2026",
      portalUrl: "https://billing.stripe.com/session/123",
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.postmarkapp.com/email");
    expect(opts.method).toBe("POST");
    expect(opts.headers).toEqual({
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Postmark-Server-Token": "pm_test_key",
    });

    const body = JSON.parse(opts.body);
    expect(body.From).toBe("GrowthAgency.dev <hello@growthagency.dev>");
    expect(body.To).toBe("user@example.com");
    expect(body.MessageStream).toBe("outbound");
  });

  it("interpolates variables in subject, htmlBody, and textBody", async () => {
    await sendEmail("contact_welcome", "lead@example.com", {
      serviceName: "Organic Press",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.Subject).toBe("Welcome to GrowthAgency — Organic Press");
    expect(body.HtmlBody).toContain("<strong>Organic Press</strong>");
    expect(body.TextBody).toContain('"Organic Press"');
  });

  it("interpolates multiple variables", async () => {
    await sendEmail("contact_lead_ready", "kevin@growthagency.dev", {
      serviceName: "SEO",
      email: "lead@example.com",
      phone: "+1234567890",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.Subject).toBe(
      "New lead ready: SEO — lead@example.com / +1234567890",
    );
    expect(body.HtmlBody).toContain("<strong>SEO</strong>");
    expect(body.HtmlBody).toContain("lead@example.com");
    expect(body.HtmlBody).toContain("+1234567890");
  });

  it("skips send when POSTMARK_API_KEY is missing", async () => {
    vi.stubEnv("POSTMARK_API_KEY", "");

    await sendEmail("checkout_success", "user@example.com", {
      billingDate: "March 8, 2026",
      portalUrl: "https://example.com",
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("logs error for unknown event type", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendEmail("unknown_event", "user@example.com", {});

    expect(mockFetch).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[email] Unknown event type: unknown_event",
    );
    consoleSpy.mockRestore();
  });

  it("logs error when Postmark returns non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      text: () => Promise.resolve("Invalid email"),
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendEmail("checkout_success", "bad@", {
      billingDate: "March 8, 2026",
      portalUrl: "https://example.com",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "[email] Postmark send failed:",
      422,
      "Invalid email",
    );
    consoleSpy.mockRestore();
  });

  it("logs error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendEmail("checkout_success", "user@example.com", {
      billingDate: "March 8, 2026",
      portalUrl: "https://example.com",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "[email] Postmark send error:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
