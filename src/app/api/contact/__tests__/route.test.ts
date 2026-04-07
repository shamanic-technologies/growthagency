import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal("fetch", mockFetch);

function makeRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("POSTMARK_API_KEY", "pm_test_key");
    mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve("") });
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ step: "welcome", serviceName: "PR" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing email");
  });

  it("returns 400 for invalid step", async () => {
    const res = await POST(
      makeRequest({ step: "invalid", email: "test@example.com", serviceName: "PR" }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid step");
  });

  it("sends welcome + notification emails on step=welcome", async () => {
    const res = await POST(
      makeRequest({
        step: "welcome",
        email: "lead@example.com",
        serviceName: "Organic Press",
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Both calls go to Postmark
    for (const call of mockFetch.mock.calls) {
      expect(call[0]).toBe("https://api.postmarkapp.com/email");
      expect(call[1].headers["X-Postmark-Server-Token"]).toBe("pm_test_key");
    }

    const bodies = mockFetch.mock.calls.map(
      (c: [string, { body: string }]) => JSON.parse(c[1].body),
    );

    // Welcome email to the lead
    const welcome = bodies.find(
      (b: { To: string }) => b.To === "lead@example.com",
    );
    expect(welcome).toBeDefined();
    expect(welcome.From).toBe("Kevin Lourd <kevin@growthagency.dev>");
    expect(welcome.Subject).toBe("Welcome to GrowthAgency — Organic Press");
    expect(welcome.HtmlBody).toContain("<strong>Organic Press</strong>");

    // Notification to Kevin
    const notify = bodies.find(
      (b: { To: string }) => b.To === "kevin@growthagency.dev",
    );
    expect(notify).toBeDefined();
    expect(notify.Subject).toBe(
      "New email captured: Organic Press — lead@example.com",
    );
  });

  it("returns 400 when phone is missing on step=notify", async () => {
    const res = await POST(
      makeRequest({
        step: "notify",
        email: "lead@example.com",
        serviceName: "PR",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing phone");
  });

  it("sends lead notification on step=notify", async () => {
    const res = await POST(
      makeRequest({
        step: "notify",
        email: "lead@example.com",
        phone: "+33612345678",
        serviceName: "Organic Press",
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toBe("https://api.postmarkapp.com/email");

    const sent = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(sent.To).toBe("kevin@growthagency.dev");
    expect(sent.Subject).toBe(
      "New lead ready: Organic Press — lead@example.com / +33612345678",
    );
    expect(sent.HtmlBody).toContain("<strong>Organic Press</strong>");
    expect(sent.HtmlBody).toContain("lead@example.com");
    expect(sent.HtmlBody).toContain("+33612345678");
  });

  it("returns 200 even when POSTMARK_API_KEY is missing (graceful degradation)", async () => {
    vi.stubEnv("POSTMARK_API_KEY", "");

    const res = await POST(
      makeRequest({
        step: "welcome",
        email: "lead@example.com",
        serviceName: "PR",
      }),
    );

    expect(res.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 500 when request body is invalid JSON", async () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  // Assessment flow tests

  it("sends assessment welcome + notification on step=assessment_email", async () => {
    const res = await POST(
      makeRequest({
        step: "assessment_email",
        email: "lead@example.com",
        websiteUrl: "https://example.com",
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(2);

    const bodies = mockFetch.mock.calls.map(
      (c: [string, { body: string }]) => JSON.parse(c[1].body),
    );

    // Welcome email to the lead
    const welcome = bodies.find(
      (b: { To: string }) => b.To === "lead@example.com",
    );
    expect(welcome).toBeDefined();
    expect(welcome.Subject).toBe("Your free growth assessment is on its way");
    expect(welcome.HtmlBody).toContain("https://example.com");

    // Notification to Kevin
    const notify = bodies.find(
      (b: { To: string }) => b.To === "kevin@growthagency.dev",
    );
    expect(notify).toBeDefined();
    expect(notify.Subject).toContain("New assessment request");
    expect(notify.Subject).toContain("lead@example.com");
    expect(notify.Subject).toContain("https://example.com");
  });

  it("returns 400 when websiteUrl is missing on step=assessment_email", async () => {
    const res = await POST(
      makeRequest({
        step: "assessment_email",
        email: "lead@example.com",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing websiteUrl");
  });

  it("sends assessment lead notification on step=assessment_whatsapp", async () => {
    const res = await POST(
      makeRequest({
        step: "assessment_whatsapp",
        email: "lead@example.com",
        phone: "+33612345678",
        websiteUrl: "https://example.com",
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const sent = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(sent.To).toBe("kevin@growthagency.dev");
    expect(sent.Subject).toContain("Assessment lead + WhatsApp");
    expect(sent.Subject).toContain("lead@example.com");
    expect(sent.Subject).toContain("+33612345678");
    expect(sent.HtmlBody).toContain("https://example.com");
  });

  it("returns 400 when phone is missing on step=assessment_whatsapp", async () => {
    const res = await POST(
      makeRequest({
        step: "assessment_whatsapp",
        email: "lead@example.com",
        websiteUrl: "https://example.com",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing phone");
  });

  it("returns 400 when websiteUrl is missing on step=assessment_whatsapp", async () => {
    const res = await POST(
      makeRequest({
        step: "assessment_whatsapp",
        email: "lead@example.com",
        phone: "+33612345678",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing websiteUrl");
  });
});
