import type { Metadata } from "next";
import { Suspense } from "react";
import { ElectrafrostCheckout } from "@/components/electrafrost-checkout";

export const metadata: Metadata = {
  title: "Electra Frost — Service Selection",
  description:
    "Choose your thought leadership and growth services. Billing starts on the 1st of next month.",
  robots: { index: false, follow: false },
};

export default function ElectrafrostPage() {
  return (
    <Suspense>
      <ElectrafrostCheckout />
    </Suspense>
  );
}
