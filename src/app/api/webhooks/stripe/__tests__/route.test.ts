import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";

const { mockConstructEvent, mockProductRetrieve, mockProductUpdate } = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockProductRetrieve: vi.fn(),
  mockProductUpdate: vi.fn(),
}));

vi.mock("stripe", () => {
  const StripeMock = function () {
    return {
      webhooks: { constructEvent: mockConstructEvent },
      products: { retrieve: mockProductRetrieve, update: mockProductUpdate },
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
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "prod_test");
    vi.stubEnv("POSTMARK_API_KEY", "pm_test_key");
    mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve("") });
    mockProductRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-05", spots_remaining: "2" },
    });
    mockProductUpdate.mockResolvedValue({});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
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
  });

  it("returns 200 for unhandled event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: { object: {} },
    });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(mockProductRetrieve).not.toHaveBeenCalled();
  });

  it("decrements cohort spots on checkout.session.completed", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          customer_details: { email: "client@example.com" },
          metadata: { cohort_month: "2026-05" },
        },
      },
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);

    expect(mockProductRetrieve).toHaveBeenCalledWith("prod_test");
    expect(mockProductUpdate).toHaveBeenCalledWith("prod_test", {
      metadata: { cohort_month: "2026-05", spots_remaining: "1" },
    });
  });

  it("sends confirmation and notification emails", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          customer_details: { email: "client@example.com" },
          metadata: { cohort_month: "2026-05" },
        },
      },
    });

    await POST(makeRequest("{}"));

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const calls = mockFetch.mock.calls.map(
      ([, opts]: [string, { body: string }]) => JSON.parse(opts.body),
    );

    const confirmation = calls.find((b: Record<string, string>) =>
      b.Subject.includes("Your spot is reserved"),
    );
    const notification = calls.find((b: Record<string, string>) =>
      b.Subject.includes("New reservation"),
    );

    expect(confirmation).toBeDefined();
    expect(confirmation.To).toBe("client@example.com");

    expect(notification).toBeDefined();
    expect(notification.To).toBe("kevin@growthagency.dev");
  });

  it("handles missing customer email gracefully", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          customer_details: {},
          metadata: { cohort_month: "2026-05" },
        },
      },
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    // Still decrements spots
    expect(mockProductUpdate).toHaveBeenCalled();
    // But doesn't send emails
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 200 even when email send fails", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          customer_details: { email: "test@example.com" },
          metadata: { cohort_month: "2026-05" },
        },
      },
    });

    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal error"),
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    consoleSpy.mockRestore();
  });

  it("skips email when POSTMARK_API_KEY is missing", async () => {
    vi.stubEnv("POSTMARK_API_KEY", "");

    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          customer_details: { email: "test@example.com" },
          metadata: { cohort_month: "2026-05" },
        },
      },
    });

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
