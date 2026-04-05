export async function register() {
  if (process.env.STRIPE_SECRET_KEY) {
    const { setupStripeProducts } = await import("@/lib/stripe");
    await setupStripeProducts();
  }
}
