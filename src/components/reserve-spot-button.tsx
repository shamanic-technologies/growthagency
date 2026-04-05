"use client";

import { useState } from "react";

interface ReserveSpotButtonProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function ReserveSpotButton({ className, disabled, children }: ReserveSpotButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
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
