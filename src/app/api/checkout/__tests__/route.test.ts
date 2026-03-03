import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateTrialEnd, isOfferExpired, POST } from "../route";

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
  it("returns now + 14 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-02T12:00:00Z"));

    const result = calculateTrialEnd();
    const expected = Math.floor(
      new Date("2026-03-16T12:00:00Z").getTime() / 1000,
    );
    expect(result).toBe(expected);

    vi.useRealTimers();
  });

  it("returns now + 14 days for end of month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-20T10:00:00Z"));

    const result = calculateTrialEnd();
    const expected = Math.floor(
      new Date("2026-03-06T10:00:00Z").getTime() / 1000,
    );
    expect(result).toBe(expected);

    vi.useRealTimers();
  });

  it("handles year boundary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-25T10:00:00Z"));

    const result = calculateTrialEnd();
    const expected = Math.floor(
      new Date("2027-01-08T10:00:00Z").getTime() / 1000,
    );
    expect(result).toBe(expected);

    vi.useRealTimers();
  });
});

describe("isOfferExpired", () => {
  it("returns false on March 15, 2026", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T23:59:59Z"));
    expect(isOfferExpired()).toBe(false);
    vi.useRealTimers();
  });

  it("returns true on March 16, 2026", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-16T00:00:00Z"));
    expect(isOfferExpired()).toBe(true);
    vi.useRealTimers();
  });

  it("returns false on March 1, 2026", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01T10:00:00Z"));
    expect(isOfferExpired()).toBe(false);
    vi.useRealTimers();
  });

  it("returns true in April 2026", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T10:00:00Z"));
    expect(isOfferExpired()).toBe(true);
    vi.useRealTimers();
  });
});

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ url: "https://checkout.stripe.com/test" });
  });

  it("returns 403 when offer is expired", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-16T00:00:00Z"));

    const res = await POST(
      makeRequest({
        lineItems: [
          { priceId: "price_1T3YYOGnB9wsOF5vKfXQjvsg", quantity: 1 },
        ],
      }),
    );
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("expired");

    vi.useRealTimers();
  });

  it("returns 400 for empty lineItems", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));

    const res = await POST(makeRequest({ lineItems: [] }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("No services selected");

    vi.useRealTimers();
  });

  it("returns 400 for missing lineItems", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));

    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);

    vi.useRealTimers();
  });

  it("returns 400 for invalid priceId", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));

    const res = await POST(
      makeRequest({ lineItems: [{ priceId: "price_fake", quantity: 1 }] }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid price ID");

    vi.useRealTimers();
  });

  it("returns 400 for quantity 0", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));

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

    vi.useRealTimers();
  });

  it("returns 400 for quantity > 10", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));

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

    vi.useRealTimers();
  });

  it("returns 400 for non-integer quantity", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));

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

    vi.useRealTimers();
  });

  it("creates a Stripe session with correct params for valid input", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-02T12:00:00Z"));

    const trialEnd = Math.floor(
      new Date("2026-03-16T12:00:00Z").getTime() / 1000,
    );
    const billingDate = "March 16, 2026";

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
      allow_promotion_codes: true,
      line_items: [
        { price: "price_1T3YYOGnB9wsOF5vKfXQjvsg", quantity: 2 },
        { price: "price_1T3YYPGnB9wsOF5vbWQLuyE8", quantity: 1 },
      ],
      subscription_data: {
        trial_end: trialEnd,
      },
      custom_text: {
        submit: {
          message: `This is not a free trial. Your services and billing both start on ${billingDate}.`,
        },
      },
      success_url: "https://growthagency.dev/welcome?uid=test-uid&success=true",
      cancel_url: "https://growthagency.dev/welcome?uid=test-uid",
    });

    vi.useRealTimers();
  });
});
