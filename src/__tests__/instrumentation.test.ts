import { describe, it, expect, vi, afterEach } from "vitest";
import { register } from "../instrumentation";

const mockSetupStripeProducts = vi.hoisted(() => vi.fn());

vi.mock("@/lib/stripe", () => ({
  setupStripeProducts: mockSetupStripeProducts,
}));

describe("instrumentation register()", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("calls setupStripeProducts when STRIPE_SECRET_KEY is set", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");
    mockSetupStripeProducts.mockResolvedValue(undefined);

    await register();

    expect(mockSetupStripeProducts).toHaveBeenCalledOnce();
  });

  it("does not crash when setupStripeProducts throws (e.g. Stripe unreachable)", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");
    mockSetupStripeProducts.mockRejectedValue(new Error("StripeConnectionError"));

    await expect(register()).resolves.toBeUndefined();
    expect(mockSetupStripeProducts).toHaveBeenCalledOnce();
  });

  it("does not call setupStripeProducts when STRIPE_SECRET_KEY is missing", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");

    await register();

    expect(mockSetupStripeProducts).not.toHaveBeenCalled();
  });
});
