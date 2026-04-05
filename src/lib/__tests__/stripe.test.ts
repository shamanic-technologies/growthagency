import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNextMonthKey, monthKeyToDisplay, getCohortInfo, decrementCohortSpots } from "../stripe";

const { mockRetrieve, mockUpdate } = vi.hoisted(() => ({
  mockRetrieve: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock("stripe", () => {
  const StripeMock = function () {
    return {
      products: { retrieve: mockRetrieve, update: mockUpdate },
    };
  };
  return { default: StripeMock };
});

describe("getNextMonthKey", () => {
  it("returns next month in YYYY-MM format", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00Z"));
    expect(getNextMonthKey()).toBe("2026-05");
    vi.useRealTimers();
  });

  it("handles year boundary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-15T12:00:00Z"));
    expect(getNextMonthKey()).toBe("2027-01");
    vi.useRealTimers();
  });

  it("pads single-digit months", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-15T12:00:00Z"));
    expect(getNextMonthKey()).toBe("2026-09");
    vi.useRealTimers();
  });
});

describe("monthKeyToDisplay", () => {
  it("converts YYYY-MM to readable format", () => {
    expect(monthKeyToDisplay("2026-05")).toBe("May 2026");
    expect(monthKeyToDisplay("2026-12")).toBe("December 2026");
    expect(monthKeyToDisplay("2027-01")).toBe("January 2027");
  });
});

describe("getCohortInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("returns default cohort when STRIPE_PR_PRODUCT_ID is not set", async () => {
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "");

    const cohort = await getCohortInfo();
    expect(cohort.month).toBe("May 2026");
    expect(cohort.monthKey).toBe("2026-05");
    expect(cohort.spotsRemaining).toBe(2);
    expect(cohort.totalSpots).toBe(2);
    expect(mockRetrieve).not.toHaveBeenCalled();
  });

  it("returns stored cohort when current", async () => {
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "prod_test");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");

    mockRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-05", spots_remaining: "1" },
    });

    const cohort = await getCohortInfo();
    expect(cohort.month).toBe("May 2026");
    expect(cohort.spotsRemaining).toBe(1);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("auto-rolls stale cohort to next month", async () => {
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "prod_test");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");

    mockRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-04", spots_remaining: "0" },
    });
    mockUpdate.mockResolvedValue({});

    const cohort = await getCohortInfo();
    expect(cohort.month).toBe("May 2026");
    expect(cohort.monthKey).toBe("2026-05");
    expect(cohort.spotsRemaining).toBe(2);

    expect(mockUpdate).toHaveBeenCalledWith("prod_test", {
      metadata: { cohort_month: "2026-05", spots_remaining: "2" },
    });
  });

  it("auto-rolls when no cohort_month in metadata", async () => {
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "prod_test");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");

    mockRetrieve.mockResolvedValue({ metadata: {} });
    mockUpdate.mockResolvedValue({});

    const cohort = await getCohortInfo();
    expect(cohort.monthKey).toBe("2026-05");
    expect(cohort.spotsRemaining).toBe(2);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("clamps spots_remaining to 0 minimum", async () => {
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "prod_test");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");

    mockRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-05", spots_remaining: "-1" },
    });

    const cohort = await getCohortInfo();
    expect(cohort.spotsRemaining).toBe(0);
  });
});

describe("decrementCohortSpots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does nothing when STRIPE_PR_PRODUCT_ID is not set", async () => {
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "");
    await decrementCohortSpots();
    expect(mockRetrieve).not.toHaveBeenCalled();
  });

  it("decrements spots from 2 to 1", async () => {
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "prod_test");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");

    mockRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-05", spots_remaining: "2" },
    });
    mockUpdate.mockResolvedValue({});

    await decrementCohortSpots();

    expect(mockUpdate).toHaveBeenCalledWith("prod_test", {
      metadata: { cohort_month: "2026-05", spots_remaining: "1" },
    });
  });

  it("does not go below 0", async () => {
    vi.stubEnv("STRIPE_PR_PRODUCT_ID", "prod_test");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");

    mockRetrieve.mockResolvedValue({
      metadata: { cohort_month: "2026-05", spots_remaining: "0" },
    });
    mockUpdate.mockResolvedValue({});

    await decrementCohortSpots();

    expect(mockUpdate).toHaveBeenCalledWith("prod_test", {
      metadata: { cohort_month: "2026-05", spots_remaining: "0" },
    });
  });
});
