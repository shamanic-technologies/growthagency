import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmail } from "../email";

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal("fetch", mockFetch);

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("POSTMARK_API_KEY", "pm_test_key");
    vi.stubEnv("POSTMARK_TRANSACTIONAL_STREAM_ID", "my-transactional");
    mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve("") });
  });

  it("sends reservation_confirmed with correct headers and body", async () => {
    await sendEmail("reservation_confirmed", "user@example.com", {
      cohortMonth: "2026-05",
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
    expect(body.From).toBe("Kevin Lourd <kevin@growthagency.dev>");
    expect(body.To).toBe("user@example.com");
    expect(body.Subject).toContain("Your spot is reserved");
    expect(body.HtmlBody).toContain("2026-05");
    expect(body.MessageStream).toBe("my-transactional");
  });

  it("sends reservation_notification to Kevin", async () => {
    await sendEmail("reservation_notification", "kevin@growthagency.dev", {
      email: "client@example.com",
      cohortMonth: "2026-05",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.From).toBe("GrowthAgency.dev <hello@growthagency.dev>");
    expect(body.Subject).toContain("New reservation");
    expect(body.Subject).toContain("client@example.com");
    expect(body.HtmlBody).toContain("client@example.com");
  });

  it("falls back to 'outbound' when POSTMARK_TRANSACTIONAL_STREAM_ID is not set", async () => {
    delete process.env.POSTMARK_TRANSACTIONAL_STREAM_ID;

    await sendEmail("reservation_confirmed", "user@example.com", {
      cohortMonth: "2026-05",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.MessageStream).toBe("outbound");
  });

  it("interpolates variables in subject, htmlBody, and textBody", async () => {
    await sendEmail("contact_welcome", "lead@example.com", {
      serviceName: "PR Article",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.Subject).toContain("PR Article");
    expect(body.HtmlBody).toContain("<strong>PR Article</strong>");
    expect(body.TextBody).toContain('"PR Article"');
  });

  it("interpolates multiple variables", async () => {
    await sendEmail("contact_lead_ready", "kevin@growthagency.dev", {
      serviceName: "PR Article",
      email: "lead@example.com",
      phone: "+1234567890",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.Subject).toContain("lead@example.com");
    expect(body.HtmlBody).toContain("<strong>PR Article</strong>");
    expect(body.HtmlBody).toContain("lead@example.com");
    expect(body.HtmlBody).toContain("+1234567890");
  });

  it("skips send when POSTMARK_API_KEY is missing", async () => {
    vi.stubEnv("POSTMARK_API_KEY", "");

    await sendEmail("reservation_confirmed", "user@example.com", {
      cohortMonth: "2026-05",
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("logs error for unknown event type", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendEmail("unknown_event", "user@example.com", {});

    expect(mockFetch).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[growthagency] Unknown event type: unknown_event",
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

    await sendEmail("reservation_confirmed", "bad@", {
      cohortMonth: "2026-05",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "[growthagency] Postmark send failed:",
      422,
      "Invalid email",
    );
    consoleSpy.mockRestore();
  });

  it("logs error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendEmail("reservation_confirmed", "user@example.com", {
      cohortMonth: "2026-05",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "[growthagency] Postmark send error:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
