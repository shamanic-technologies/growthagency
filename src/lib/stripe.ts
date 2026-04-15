import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeInstance;
}

const SPOTS_PER_COHORT = 2;
const PRODUCT_NAME = "PR Article \u2014 GrowthAgency";
const PRICE_AMOUNT_CENTS = 500000;

let cachedProductId: string | null = null;
let cachedPriceId: string | null = null;
let setupPromise: Promise<void> | null = null;

export function getProductId(): string | null {
  return cachedProductId ?? process.env.STRIPE_PR_PRODUCT_ID ?? null;
}

export async function getPriceId(): Promise<string | null> {
  if (!cachedPriceId && !process.env.STRIPE_PR_PRICE_ID && process.env.STRIPE_SECRET_KEY) {
    if (!setupPromise) {
      setupPromise = setupStripeProducts().catch((err) => {
        setupPromise = null;
        throw err;
      });
    }
    await setupPromise;
  }
  return cachedPriceId ?? process.env.STRIPE_PR_PRICE_ID ?? null;
}

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

export function daysUntilMonthKey(monthKey: string): number {
  const [year, month] = monthKey.split("-").map(Number);
  const target = new Date(year, month - 1, 1);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function monthKeyToDisplay(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export async function setupStripeProducts(): Promise<void> {
  const stripe = getStripe();

  const products = await stripe.products.search({
    query: 'metadata["app"]:"growthagency" AND metadata["type"]:"pr-article"',
  });

  let product: Stripe.Product;
  if (products.data.length > 0) {
    product = products.data[0];
    console.log(`[growthagency] Found existing Stripe product: ${product.id}`);
  } else {
    const nextKey = getNextMonthKey();
    product = await stripe.products.create({
      name: PRODUCT_NAME,
      metadata: {
        app: "growthagency",
        type: "pr-article",
        cohort_month: nextKey,
        spots_remaining: String(SPOTS_PER_COHORT),
      },
    });
    console.log(`[growthagency] Created Stripe product: ${product.id}`);
  }
  cachedProductId = product.id;

  const prices = await stripe.prices.list({ product: product.id, active: true });
  const existingPrice = prices.data.find(
    (p) => p.unit_amount === PRICE_AMOUNT_CENTS && p.type === "one_time" && p.currency === "usd",
  );

  if (existingPrice) {
    cachedPriceId = existingPrice.id;
    console.log(`[growthagency] Found existing Stripe price: ${existingPrice.id}`);
  } else {
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: PRICE_AMOUNT_CENTS,
      currency: "usd",
    });
    cachedPriceId = price.id;
    console.log(`[growthagency] Created Stripe price: ${price.id}`);
  }
}

export async function getCohortInfo(): Promise<CohortInfo> {
  const productId = getProductId();

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
        ...product.metadata,
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
  const productId = getProductId();
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
