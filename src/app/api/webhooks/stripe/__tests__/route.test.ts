import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

const { mockConstructEvent, mockPortalCreate } = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockPortalCreate: vi.fn(),
}));

vi.mock("stripe", () => {
  const StripeMock = function () {
    return {
      webhooks: { constructEvent: mockConstructEvent },
      billingPortal: { sessions: { create: mockPortalCreate } },
    };
  };
  return { default: StripeMock };
});

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal("fetch", mockFetch);

function makeRequest(body: string, signature = "sig_test") {
  return new Request("http://localhost:3000/api/webhooks/stripe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature,
    },
    body,
  });
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    vi.stubEnv("POSTMARK_API_KEY", "pm_test_key");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://growthagency.dev");
    mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve("") });
  });

  it("returns 400 when signature is missing", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing signature");
  });

  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid signature");
  });

  it("returns 200 for unhandled event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: { object: {} },
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("sends email on checkout.session.completed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-22T12:00:00Z"));

    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          customer: "cus_abc",
          customer_details: { email: "electra@example.com" },
        },
      },
    });

    mockPortalCreate.mockResolvedValue({
      url: "https://billing.stripe.com/portal/sess_test",
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);

    expect(mockPortalCreate).toHaveBeenCalledWith({
      customer: "cus_abc",
      return_url: "https://growthagency.dev",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.postmarkapp.com/email",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Postmark-Server-Token": "pm_test_key",
        },
      }),
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.From).toBe("GrowthAgency.dev <hello@growthagency.dev>");
    expect(body.To).toBe("electra@example.com");
    expect(body.Subject).toBe("Welcome to GrowthAgency.dev — You're all set!");
    expect(body.HtmlBody).toContain("March 8, 2026");
    expect(body.HtmlBody).toContain("https://billing.stripe.com/portal/sess_test");
    expect(body.TextBody).toContain("March 8, 2026");
    expect(body.MessageStream).toBe("outbound");

    vi.useRealTimers();
  });

  it("returns 200 even when email send fails", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_456",
          customer: "cus_def",
          customer_details: { email: "test@example.com" },
        },
      },
    });

    mockPortalCreate.mockResolvedValue({
      url: "https://billing.stripe.com/portal/sess_test2",
    });

    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal error"),
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("handles missing customer email gracefully", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_789",
          customer: "cus_ghi",
          customer_details: {},
        },
      },
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(mockPortalCreate).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("skips email when POSTMARK_API_KEY is missing", async () => {
    vi.stubEnv("POSTMARK_API_KEY", "");

    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_nokey",
          customer: "cus_nokey",
          customer_details: { email: "nokey@example.com" },
        },
      },
    });

    mockPortalCreate.mockResolvedValue({
      url: "https://billing.stripe.com/portal/sess_nokey",
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
