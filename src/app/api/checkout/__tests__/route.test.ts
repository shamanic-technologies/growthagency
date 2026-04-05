import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";

const { mockSessionCreate, mockProductRetrieve, mockProductUpdate } = vi.hoisted(() => ({
  mockSessionCreate: vi.fn(),
  mockProductRetrieve: vi.fn(),
  mockProductUpdate: vi.fn(),
}));

vi.mock("stripe", () => {
  const StripeMock = function () {
    return {
      checkout: { sessions: { create: mockSessionCreate } },
      products: { retrieve: mockProductRetrieve, update: mockProductUpdate },
    };
  };
  return { default: StripeMock };
});

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00Z"));
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");
    vi.stubEnv("STRIPE_PR_PRICE_ID", "price_test_5000");
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "prod_test");
    mockSessionCreate.mockResolvedValue({ url: "https://checkout.stripe.com/test" });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("returns 503 when STRIPE_PR_PRICE_ID is not set", async () => {
    vi.stubEnv("STRIPE_PR_PRICE_ID", "");
    const res = await POST();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toContain("not configured");
  });

  it("returns 409 when no spots remaining", async () => {
    mockProductRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-05", spots_remaining: "0" },
    });

    const res = await POST();
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toContain("No spots remaining");
  });

  it("creates a one-time checkout session when spots available", async () => {
    mockProductRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-05", spots_remaining: "2" },
    });

    const res = await POST();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe("https://checkout.stripe.com/test");

    expect(mockSessionCreate).toHaveBeenCalledWith({
      mode: "payment",
      line_items: [{ price: "price_test_5000", quantity: 1 }],
      metadata: { cohort_month: "2026-05" },
      success_url: "https://growthagency.dev?reserved=true",
      cancel_url: "https://growthagency.dev",
    });
  });

  it("uses custom site URL from env", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.growthagency.dev");
    mockProductRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-05", spots_remaining: "1" },
    });

    await POST();

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: "https://staging.growthagency.dev?reserved=true",
        cancel_url: "https://staging.growthagency.dev",
      }),
    );
  });
});
