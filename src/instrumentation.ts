export async function register() {
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const { setupStripeProducts } = await import("@/lib/stripe");
      await setupStripeProducts();
    } catch (err) {
      console.error("[growthagency] Stripe setup failed during startup — will retry lazily on first use:", err);
    }
  }
}
