import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

const { mockConstructEvent, mockPortalCreate, mockCustomerRetrieve, mockCustomerUpdate } = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockPortalCreate: vi.fn(),
  mockCustomerRetrieve: vi.fn(),
  mockCustomerUpdate: vi.fn(),
}));

vi.mock("stripe", () => {
  const StripeMock = function () {
    return {
      webhooks: { constructEvent: mockConstructEvent },
      billingPortal: { sessions: { create: mockPortalCreate } },
      customers: { retrieve: mockCustomerRetrieve, update: mockCustomerUpdate },
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
    mockCustomerRetrieve.mockResolvedValue({ metadata: {} });
    mockCustomerUpdate.mockResolvedValue({});
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

  it("sends welcome + receipt emails on first checkout", async () => {
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

    expect(mockCustomerRetrieve).toHaveBeenCalledWith("cus_abc");
    expect(mockCustomerUpdate).toHaveBeenCalledWith("cus_abc", {
      metadata: { welcome_email_sent: "true" },
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);

    const calls = mockFetch.mock.calls.map(
      ([, opts]: [string, { body: string }]) => JSON.parse(opts.body),
    );
    const receipt = calls.find((b: Record<string, string>) => b.Subject === "Your subscription is confirmed");
    const welcome = calls.find((b: Record<string, string>) => b.Subject === "Welcome to GrowthAgency.dev — let's grow together");

    expect(receipt).toBeDefined();
    expect(receipt.To).toBe("electra@example.com");
    expect(receipt.From).toBe("GrowthAgency.dev <hello@growthagency.dev>");
    expect(receipt.HtmlBody).toContain("March 8, 2026");
    expect(receipt.HtmlBody).toContain("https://billing.stripe.com/portal/sess_test");

    expect(welcome).toBeDefined();
    expect(welcome.To).toBe("electra@example.com");
    expect(welcome.From).toBe("Kevin Lourd <kevin@growthagency.dev>");

    vi.useRealTimers();
  });

  it("skips welcome email for returning customer", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-22T12:00:00Z"));

    mockCustomerRetrieve.mockResolvedValue({
      metadata: { welcome_email_sent: "true" },
    });

    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_returning",
          customer: "cus_returning",
          customer_details: { email: "returning@example.com" },
        },
      },
    });

    mockPortalCreate.mockResolvedValue({
      url: "https://billing.stripe.com/portal/sess_returning",
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.Subject).toBe("Your subscription is confirmed");
    expect(mockCustomerUpdate).not.toHaveBeenCalled();

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

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
    consoleSpy.mockRestore();
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
