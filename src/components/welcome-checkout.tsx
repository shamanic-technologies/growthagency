"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0", "#f59e0b", "#8b5cf6", "#ec4899"];
    const particles: {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }[] = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * -1 - 20,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let animationId: number;
    let frame = 0;

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      frame++;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.vx *= 0.999;
        p.rotation += p.rotationSpeed;

        if (frame > 120) {
          p.opacity = Math.max(0, p.opacity - 0.008);
        }

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx!.restore();
      }

      if (particles.every((p) => p.opacity <= 0)) return;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}

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

export interface ClientConfig {
  uid: string;
  password: string;
  displayName: string;
  services: Service[];
}

function formatBillingStart(): string {
  const now = new Date();
  const target = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );
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

export function WelcomeCheckout({ config }: { config: ClientConfig }) {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  const AUTH_KEY = `welcome-auth-${config.uid}`;
  const STORAGE_KEY = `welcome-quantities-${config.uid}`;

  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_KEY) === "true";
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  function handleUnlock() {
    if (passwordInput.toLowerCase().trim() === config.password) {
      setAuthenticated(true);
      localStorage.setItem(AUTH_KEY, "true");
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return Object.fromEntries(config.services.map((s) => [s.id, s.defaultQty]));
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistQuantities = useCallback(
    (q: Record<string, number>) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(q));
      } catch {}
    },
    [STORAGE_KEY],
  );

  useEffect(() => {
    persistQuantities(quantities);
  }, [quantities, persistQuantities]);

  const billingStart = useMemo(() => formatBillingStart(), []);

  const total = useMemo(
    () =>
      config.services.reduce(
        (sum, s) => sum + (quantities[s.id] ?? 0) * s.pricePerUnit,
        0,
      ),
    [quantities, config.services],
  );

  const selectedCount = useMemo(
    () => config.services.filter((s) => (quantities[s.id] ?? 0) > 0).length,
    [quantities, config.services],
  );

  function setQty(id: string, qty: number) {
    const service = config.services.find((s) => s.id === id);
    if (!service) return;

    const clamped = Math.max(0, Math.min(qty, service.maxQty));

    setQuantities((prev) => {
      const next = { ...prev, [id]: clamped };

      if (service.exclusiveGroup && clamped > 0) {
        for (const s of config.services) {
          if (s.exclusiveGroup === service.exclusiveGroup && s.id !== id) {
            next[s.id] = 0;
          }
        }
      }

      return next;
    });
  }

  async function handleSubscribe() {
    const lineItems = config.services
      .filter((s) => (quantities[s.id] ?? 0) > 0)
      .map((s) => ({ priceId: s.priceId, quantity: quantities[s.id] }));

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
        body: JSON.stringify({ lineItems, uid: config.uid }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const coreServices = config.services.filter((s) => s.category === "core");
  const addonServices = config.services.filter((s) => s.category === "addon");

  if (!authenticated && !success) {
    return (
      <main className="min-h-screen gradient-hero flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="mb-6">
            <span className="text-4xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Welcome aboard
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            We&apos;re excited to get started. Enter your access code below to
            set up your services.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUnlock();
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Access code"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border bg-white text-center text-sm ${
                passwordError
                  ? "border-red-300 focus:ring-red-200"
                  : "border-slate-200 focus:ring-emerald-200"
              } focus:outline-none focus:ring-2 transition`}
            />
            {passwordError && (
              <p className="text-red-500 text-xs">Incorrect access code.</p>
            )}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-full hover:bg-slate-800 transition"
            >
              Continue
            </button>
          </form>
          <p className="text-slate-300 text-xs mt-8">
            Growth<span className="gradient-text font-semibold">Agency</span>.dev
          </p>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
        <Confetti />
        <div className="max-w-lg text-center relative z-10">
          <div className="mb-6">
            <span className="text-6xl inline-block animate-bounce">🎉</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            You&apos;re officially in!
          </h1>
          <p className="text-lg text-slate-600 mb-2 leading-relaxed">
            Your subscription is confirmed and your growth journey starts on{" "}
            <strong className="gradient-text">{billingStart}</strong>.
          </p>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Your dedicated strategist will reach out shortly to kick things off.
            In the meantime, you&apos;ll receive a confirmation email from
            Stripe with a link to manage your subscription anytime.
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 p-6 mb-8 glow">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold gradient-text">24h</p>
                <p className="text-xs text-slate-400 mt-1">Strategist intro</p>
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">1 week</p>
                <p className="text-xs text-slate-400 mt-1">Strategy ready</p>
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">2 weeks</p>
                <p className="text-xs text-slate-400 mt-1">First results</p>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-slate-800 transition"
          >
            <span>&larr;</span> Back to GrowthAgency.dev
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
          {config.displayName}
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
        {addonServices.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Add-ons
            </h2>
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
          </>
        )}

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
