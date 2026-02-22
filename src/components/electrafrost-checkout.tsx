"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Service {
  id: string;
  name: string;
  description: string;
  priceId: string;
  pricePerUnit: number;
  priceSuffix: string;
  category: "core" | "addon";
  defaultQty: number;
  maxQty: number;
  exclusiveGroup?: string;
}

const SERVICES: Service[] = [
  {
    id: "organic-press",
    name: "Organic Press Outreach",
    description:
      "Continuous journalist pitching. Each unit guarantees 1 free press opportunity per month.",
    priceId: "price_1T3YYOGnB9wsOF5vKfXQjvsg",
    pricePerUnit: 600,
    priceSuffix: "/unit/mo",
    category: "core",
    defaultQty: 1,
    maxQty: 10,
  },
  {
    id: "expert-quoting",
    name: "Expert Quoting (HARO + Featured)",
    description:
      "Daily monitoring of journalist requests. AI-generated expert quotes submitted on your behalf.",
    priceId: "price_1T3YYPGnB9wsOF5vbWQLuyE8",
    pricePerUnit: 600,
    priceSuffix: "/mo",
    category: "core",
    defaultQty: 1,
    maxQty: 1,
  },
  {
    id: "speaking-engagements",
    name: "Speaking Engagement Opportunities",
    description:
      "Conference and event speaking invitations. Each unit guarantees 1 opportunity per month.",
    priceId: "price_1T3YZ3GnB9wsOF5vsODFmQwZ",
    pricePerUnit: 600,
    priceSuffix: "/unit/mo",
    category: "core",
    defaultQty: 1,
    maxQty: 10,
  },
  {
    id: "podcast-guest",
    name: "Podcast Guest Opportunities",
    description:
      "Get booked as a guest on relevant podcasts. Each unit guarantees 1 booking per month.",
    priceId: "price_1T3YZ7GnB9wsOF5vqNqpSbav",
    pricePerUnit: 600,
    priceSuffix: "/unit/mo",
    category: "addon",
    defaultQty: 0,
    maxQty: 10,
  },
  {
    id: "credu-leads",
    name: "CREDU Academy Lead Generation",
    description:
      "30 qualified leads per pack. Cold outreach to accounting professionals worldwide.",
    priceId: "price_1T3YZAGnB9wsOF5vtpbQgE13",
    pricePerUnit: 600,
    priceSuffix: "/pack of 30/mo",
    category: "addon",
    defaultQty: 0,
    maxQty: 10,
  },
  {
    id: "search-tracker",
    name: "Search Visibility Tracker",
    description:
      "Monthly report on your Google and AI search visibility for thought leadership keywords.",
    priceId: "price_1T3YYSGnB9wsOF5vicY71dQl",
    pricePerUnit: 200,
    priceSuffix: "/mo",
    category: "addon",
    defaultQty: 0,
    maxQty: 1,
    exclusiveGroup: "search-tracker",
  },
  {
    id: "search-tracker-credu",
    name: "Search Visibility + CREDU Academy",
    description:
      "Search visibility tracking for both your personal brand and CREDU Academy.",
    priceId: "price_1T3YYTGnB9wsOF5vN4yIBiFW",
    pricePerUnit: 300,
    priceSuffix: "/mo",
    category: "addon",
    defaultQty: 0,
    maxQty: 1,
    exclusiveGroup: "search-tracker",
  },
];

function formatBillingStart(): string {
  const now = new Date();
  const target = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );
  // If less than 2 days away, push to month after
  if (target.getTime() - now.getTime() < 48 * 3600 * 1000) {
    target.setUTCMonth(target.getUTCMonth() + 1);
  }
  return target.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ElectrafrostCheckout() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  const STORAGE_KEY = "electrafrost-quantities";

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return Object.fromEntries(SERVICES.map((s) => [s.id, s.defaultQty]));
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistQuantities = useCallback(
    (q: Record<string, number>) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(q));
      } catch {}
    },
    [],
  );

  useEffect(() => {
    persistQuantities(quantities);
  }, [quantities, persistQuantities]);

  const billingStart = useMemo(() => formatBillingStart(), []);

  const total = useMemo(
    () =>
      SERVICES.reduce(
        (sum, s) => sum + (quantities[s.id] ?? 0) * s.pricePerUnit,
        0,
      ),
    [quantities],
  );

  const selectedCount = useMemo(
    () => SERVICES.filter((s) => (quantities[s.id] ?? 0) > 0).length,
    [quantities],
  );

  function setQty(id: string, qty: number) {
    const service = SERVICES.find((s) => s.id === id);
    if (!service) return;

    const clamped = Math.max(0, Math.min(qty, service.maxQty));

    setQuantities((prev) => {
      const next = { ...prev, [id]: clamped };

      // Handle mutual exclusivity
      if (service.exclusiveGroup && clamped > 0) {
        for (const s of SERVICES) {
          if (
            s.exclusiveGroup === service.exclusiveGroup &&
            s.id !== id
          ) {
            next[s.id] = 0;
          }
        }
      }

      return next;
    });
  }

  async function handleSubscribe() {
    const lineItems = SERVICES.filter((s) => (quantities[s.id] ?? 0) > 0).map(
      (s) => ({ priceId: s.priceId, quantity: quantities[s.id] }),
    );

    if (lineItems.length === 0) {
      setError("Please select at least one service.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      // Keep loading=true — the browser will navigate to Stripe
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const coreServices = SERVICES.filter((s) => s.category === "core");
  const addonServices = SERVICES.filter((s) => s.category === "addon");

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            You&apos;re all set!
          </h1>
          <p className="text-slate-500 mb-2">
            Your subscription is confirmed. Billing starts{" "}
            <strong className="text-slate-900">{billingStart}</strong>.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            You&apos;ll receive a confirmation email from Stripe with a link to
            manage your subscription at any time.
          </p>
          <Link
            href="/"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            &larr; Back to GrowthAgency.dev
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-slate-600 transition mb-8 inline-block"
        >
          &larr; Back to site
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
          Electra Frost
        </h1>
        <p className="text-slate-500 mb-1">
          Select your services below. Adjust quantities as needed.
        </p>
        <p className="text-sm text-slate-400 mb-10">
          No charge today — billing starts{" "}
          <strong className="text-slate-600">{billingStart}</strong>. You can
          modify or cancel anytime from your Stripe portal.
        </p>

        {/* Core Services */}
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Core Services
        </h2>
        <div className="space-y-3 mb-10">
          {coreServices.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              qty={quantities[service.id] ?? 0}
              onQtyChange={(qty) => setQty(service.id, qty)}
            />
          ))}
        </div>

        {/* Add-ons */}
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Add-ons</h2>
        <p className="text-sm text-slate-400 mb-4">
          Optional services you can add now or later from your portal.
        </p>
        <div className="space-y-3 mb-10">
          {addonServices.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              qty={quantities[service.id] ?? 0}
              onQtyChange={(qty) => setQty(service.id, qty)}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Sticky bottom bar */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              ${total.toLocaleString()}
              <span className="text-base font-normal text-slate-400">/mo</span>
            </p>
            <p className="text-xs text-slate-400">
              {selectedCount} service{selectedCount !== 1 ? "s" : ""} selected
            </p>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={loading || selectedCount === 0}
            className="bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Redirecting...
              </span>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

function ServiceRow({
  service,
  qty,
  onQtyChange,
}: {
  service: Service;
  qty: number;
  onQtyChange: (qty: number) => void;
}) {
  const isActive = qty > 0;
  const isToggleOnly = service.maxQty === 1;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${
        isActive
          ? "bg-white border-emerald-200 shadow-sm"
          : "bg-slate-50 border-slate-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-semibold ${isActive ? "text-slate-900" : "text-slate-400"}`}
            >
              {service.name}
            </h3>
            {service.exclusiveGroup && (
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                pick one
              </span>
            )}
          </div>
          <p
            className={`text-sm leading-relaxed ${isActive ? "text-slate-500" : "text-slate-400"}`}
          >
            {service.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <p
            className={`text-sm font-medium whitespace-nowrap ${isActive ? "text-slate-900" : "text-slate-400"}`}
          >
            ${service.pricePerUnit}
            <span className="text-slate-400 font-normal">
              {service.priceSuffix}
            </span>
          </p>

          {isToggleOnly ? (
            <button
              onClick={() => onQtyChange(isActive ? 0 : 1)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isActive ? "bg-emerald-500" : "bg-slate-200"
              }`}
              aria-label={`Toggle ${service.name}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onQtyChange(qty - 1)}
                disabled={qty === 0}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="M5 12h14"
                  />
                </svg>
              </button>
              <span
                className={`w-8 text-center text-sm font-semibold ${isActive ? "text-slate-900" : "text-slate-400"}`}
              >
                {qty}
              </span>
              <button
                onClick={() => onQtyChange(qty + 1)}
                disabled={qty >= service.maxQty}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="M12 5v14m-7-7h14"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
