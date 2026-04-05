import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeInstance;
}

const SPOTS_PER_COHORT = 2;

export interface CohortInfo {
  month: string;
  monthKey: string;
  spotsRemaining: number;
  totalSpots: number;
}

export function getNextMonthKey(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

export function monthKeyToDisplay(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export async function getCohortInfo(): Promise<CohortInfo> {
  const productId = process.env.STRIPE_PR_PRODUCT_ID;

  if (!productId) {
    const nextKey = getNextMonthKey();
    return {
      month: monthKeyToDisplay(nextKey),
      monthKey: nextKey,
      spotsRemaining: SPOTS_PER_COHORT,
      totalSpots: SPOTS_PER_COHORT,
    };
  }

  const stripe = getStripe();
  const product = await stripe.products.retrieve(productId);
  const storedMonth = product.metadata.cohort_month;
  const storedSpots = parseInt(product.metadata.spots_remaining ?? String(SPOTS_PER_COHORT));
  const nextMonthKey = getNextMonthKey();

  if (!storedMonth || storedMonth < nextMonthKey) {
    await stripe.products.update(productId, {
      metadata: {
        cohort_month: nextMonthKey,
        spots_remaining: String(SPOTS_PER_COHORT),
      },
    });
    return {
      month: monthKeyToDisplay(nextMonthKey),
      monthKey: nextMonthKey,
      spotsRemaining: SPOTS_PER_COHORT,
      totalSpots: SPOTS_PER_COHORT,
    };
  }

  return {
    month: monthKeyToDisplay(storedMonth),
    monthKey: storedMonth,
    spotsRemaining: Math.max(0, storedSpots),
    totalSpots: SPOTS_PER_COHORT,
  };
}

export async function decrementCohortSpots(): Promise<void> {
  const productId = process.env.STRIPE_PR_PRODUCT_ID;
  if (!productId) return;

  const stripe = getStripe();
  const product = await stripe.products.retrieve(productId);
  const currentSpots = parseInt(product.metadata.spots_remaining ?? "0");

  await stripe.products.update(productId, {
    metadata: {
      ...product.metadata,
      spots_remaining: String(Math.max(0, currentSpots - 1)),
    },
  });
}
