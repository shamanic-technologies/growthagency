"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";

interface ReserveSpotButtonProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function ReserveSpotButton({ className, disabled, children }: ReserveSpotButtonProps) {
  const [loading, setLoading] = useState(false);
  const posthog = usePostHog();

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    posthog?.capture("cta_reserve_spot_clicked");

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        posthog?.capture("checkout_error", { error: data.error, status: res.status });
        alert(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (data.url) {
        posthog?.capture("checkout_redirect");
        window.location.href = data.url;
      }
    } catch {
      posthog?.capture("checkout_error", { error: "network_error" });
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={className}
    >
      {loading ? "Redirecting..." : children ?? "Reserve My Spot"}
    </button>
  );
}
