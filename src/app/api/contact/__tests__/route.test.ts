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
    vi.stubEnv("DISTRIBUTE_API_KEY", "distrib.app_test");
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
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

    // Welcome email to the lead
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.distribute.you/v1/emails/send",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer distrib.app_test",
        },
        body: JSON.stringify({
          eventType: "contact_welcome",
          recipientEmail: "lead@example.com",
          metadata: { serviceName: "Organic Press" },
        }),
      }),
    );

    // Notification to Kevin
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.distribute.you/v1/emails/send",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          eventType: "contact_email_captured",
          recipientEmail: "kevin@growthagency.dev",
          metadata: { serviceName: "Organic Press", email: "lead@example.com" },
        }),
      }),
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
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.distribute.you/v1/emails/send",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          eventType: "contact_lead_ready",
          recipientEmail: "kevin@growthagency.dev",
          metadata: {
            serviceName: "Organic Press",
            email: "lead@example.com",
            phone: "+33612345678",
          },
        }),
      }),
    );
  });

  it("returns 200 even when API key is missing (graceful degradation)", async () => {
    vi.stubEnv("DISTRIBUTE_API_KEY", "");

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
});
