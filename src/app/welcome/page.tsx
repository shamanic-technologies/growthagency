import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getClientConfig } from "@/lib/clients";
import { WelcomeCheckout } from "@/components/welcome-checkout";

export const metadata: Metadata = {
  title: "Welcome — GrowthAgency.dev",
  description: "Select your services and get started.",
  robots: { index: false, follow: false },
};

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const uid = typeof params.uid === "string" ? params.uid : undefined;

  if (!uid) return notFound();

  const config = getClientConfig(uid);
  if (!config) return notFound();

  return (
    <Suspense>
      <WelcomeCheckout config={config} />
    </Suspense>
  );
}
