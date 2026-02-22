import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateTrialEnd, POST } from "../route";

// Mock Stripe
const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));
vi.mock("stripe", () => {
  const StripeMock = function () {
    return {
      checkout: { sessions: { create: mockCreate } },
    };
  };
  return { default: StripeMock };
});

function makeRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("calculateTrialEnd", () => {
  it("returns the 1st of next month for mid-month dates", () => {
    vi.useFakeTimers();
    // Feb 22, 2026 12:00 UTC
    vi.setSystemTime(new Date("2026-02-22T12:00:00Z"));

    const result = calculateTrialEnd();
    // March 1, 2026 00:00 UTC
    expect(result).toBe(Math.floor(new Date("2026-03-01T00:00:00Z").getTime() / 1000));

    vi.useRealTimers();
  });

  it("returns the 1st of next month for early-month dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-07T10:00:00Z"));

    const result = calculateTrialEnd();
    // April 1, 2026
    expect(result).toBe(Math.floor(new Date("2026-04-01T00:00:00Z").getTime() / 1000));

    vi.useRealTimers();
  });

  it("handles December -> January year rollover", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-15T10:00:00Z"));

    const result = calculateTrialEnd();
    // January 1, 2027
    expect(result).toBe(Math.floor(new Date("2027-01-01T00:00:00Z").getTime() / 1000));

    vi.useRealTimers();
  });

  it("pushes to month after next when 1st is < 48h away", () => {
    vi.useFakeTimers();
    // Feb 28, 2026 23:00 UTC — March 1 is only 1 hour away
    vi.setSystemTime(new Date("2026-02-28T23:00:00Z"));

    const result = calculateTrialEnd();
    // Should push to April 1, 2026 (not March 1)
    expect(result).toBe(Math.floor(new Date("2026-04-01T00:00:00Z").getTime() / 1000));

    vi.useRealTimers();
  });

  it("keeps next month when 1st is exactly 48h away", () => {
    vi.useFakeTimers();
    // Feb 27, 2026 00:00 UTC — March 1 is exactly 48h away (2 days in Feb non-leap year has 28 days)
    vi.setSystemTime(new Date("2026-02-27T00:00:00Z"));

    const result = calculateTrialEnd();
    // March 1 is exactly 48h away, so it should still be March 1
    expect(result).toBe(Math.floor(new Date("2026-03-01T00:00:00Z").getTime() / 1000));

    vi.useRealTimers();
  });
});

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ url: "https://checkout.stripe.com/test" });
  });

  it("returns 400 for empty lineItems", async () => {
    const res = await POST(makeRequest({ lineItems: [] }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("No services selected");
  });

  it("returns 400 for missing lineItems", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid priceId", async () => {
    const res = await POST(
      makeRequest({ lineItems: [{ priceId: "price_fake", quantity: 1 }] }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid price ID");
  });

  it("returns 400 for quantity 0", async () => {
    const res = await POST(
      makeRequest({
        lineItems: [
          { priceId: "price_1T3YYOGnB9wsOF5vKfXQjvsg", quantity: 0 },
        ],
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid quantity");
  });

  it("returns 400 for quantity > 10", async () => {
    const res = await POST(
      makeRequest({
        lineItems: [
          { priceId: "price_1T3YYOGnB9wsOF5vKfXQjvsg", quantity: 11 },
        ],
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid quantity");
  });

  it("returns 400 for non-integer quantity", async () => {
    const res = await POST(
      makeRequest({
        lineItems: [
          { priceId: "price_1T3YYOGnB9wsOF5vKfXQjvsg", quantity: 1.5 },
        ],
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid quantity");
  });

  it("creates a Stripe session with correct params for valid input", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-22T12:00:00Z"));

    const res = await POST(
      makeRequest({
        lineItems: [
          { priceId: "price_1T3YYOGnB9wsOF5vKfXQjvsg", quantity: 2 },
          { priceId: "price_1T3YYPGnB9wsOF5vbWQLuyE8", quantity: 1 },
        ],
        uid: "test-uid",
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe("https://checkout.stripe.com/test");

    expect(mockCreate).toHaveBeenCalledWith({
      mode: "subscription",
      line_items: [
        { price: "price_1T3YYOGnB9wsOF5vKfXQjvsg", quantity: 2 },
        { price: "price_1T3YYPGnB9wsOF5vbWQLuyE8", quantity: 1 },
      ],
      subscription_data: {
        trial_end: Math.floor(
          new Date("2026-03-01T00:00:00Z").getTime() / 1000,
        ),
      },
      custom_text: {
        submit: {
          message:
            "This is not a free trial. Your services and billing both start on March 1, 2026.",
        },
      },
      success_url: "https://growthagency.dev/welcome?uid=test-uid&success=true",
      cancel_url: "https://growthagency.dev/welcome?uid=test-uid",
    });

    vi.useRealTimers();
  });
});
