"use client";

import { useState, useEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { usePostHog } from "posthog-js/react";

// TODO: Replace with your real WhatsApp number (with country code, no +)
const WHATSAPP_NUMBER = "33680478702";

const COUNTRY_FLAGS: [string, string][] = [
  ["971", "\u{1F1E6}\u{1F1EA}"], ["972", "\u{1F1EE}\u{1F1F1}"], ["966", "\u{1F1F8}\u{1F1E6}"],
  ["852", "\u{1F1ED}\u{1F1F0}"], ["358", "\u{1F1EB}\u{1F1EE}"], ["353", "\u{1F1EE}\u{1F1EA}"],
  ["351", "\u{1F1F5}\u{1F1F9}"], ["212", "\u{1F1F2}\u{1F1E6}"], ["216", "\u{1F1F9}\u{1F1F3}"],
  ["213", "\u{1F1E9}\u{1F1FF}"], ["86", "\u{1F1E8}\u{1F1F3}"], ["82", "\u{1F1F0}\u{1F1F7}"],
  ["81", "\u{1F1EF}\u{1F1F5}"], ["91", "\u{1F1EE}\u{1F1F3}"], ["90", "\u{1F1F9}\u{1F1F7}"],
  ["65", "\u{1F1F8}\u{1F1EC}"], ["61", "\u{1F1E6}\u{1F1FA}"], ["55", "\u{1F1E7}\u{1F1F7}"],
  ["52", "\u{1F1F2}\u{1F1FD}"], ["49", "\u{1F1E9}\u{1F1EA}"], ["48", "\u{1F1F5}\u{1F1F1}"],
  ["47", "\u{1F1F3}\u{1F1F4}"], ["46", "\u{1F1F8}\u{1F1EA}"], ["45", "\u{1F1E9}\u{1F1F0}"],
  ["44", "\u{1F1EC}\u{1F1E7}"], ["43", "\u{1F1E6}\u{1F1F9}"], ["41", "\u{1F1E8}\u{1F1ED}"],
  ["39", "\u{1F1EE}\u{1F1F9}"], ["34", "\u{1F1EA}\u{1F1F8}"], ["33", "\u{1F1EB}\u{1F1F7}"],
  ["32", "\u{1F1E7}\u{1F1EA}"], ["31", "\u{1F1F3}\u{1F1F1}"], ["20", "\u{1F1EA}\u{1F1EC}"],
  ["7", "\u{1F1F7}\u{1F1FA}"], ["1", "\u{1F1FA}\u{1F1F8}"],
];

function detectFlag(digits: string): string | null {
  const clean = digits.replace(/\D/g, "");
  if (!clean) return null;
  for (const [code, flag] of COUNTRY_FLAGS) {
    if (clean.startsWith(code)) return flag;
  }
  return null;
}

interface PhoneModalProps {
  serviceName: string;
  onClose: () => void;
}

export function PhoneModal({ serviceName, onClose }: PhoneModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "welcome", email, serviceName }),
      });
    } catch {
      // Don't block the user if email fails
    }
    setSending(false);
    posthog?.capture("contact_email_submitted", { service_name: serviceName });
    setStep(2);
  };

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    const fullPhone = `+${phone.replace(/^\+/, "")}`;

    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "notify", email, phone: fullPhone, serviceName }),
      });
    } catch {
      // Don't block the user
    }
    setSending(false);
    posthog?.capture("contact_phone_submitted", { service_name: serviceName });

    const message = encodeURIComponent(
      `Hi! I'm interested in "${serviceName}". My number: ${fullPhone}`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank"
    );
    onClose();
  };

  if (!mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 1 && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Let&apos;s get you growing
              </h3>
              <p className="text-sm text-slate-500">
                Drop your email and we&apos;ll put together a custom growth plan for you.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={!email.trim() || sending}
                className="w-full mt-1 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? "One sec..." : "Get Started"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                One last thing
              </h3>
              <p className="text-sm text-slate-500">
                Add your number so your strategist can reach you directly — most clients get their first plan within 24 hours.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-3">
              <div className="flex">
                <span className="inline-flex items-center gap-1.5 min-w-[3.25rem] px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium select-none justify-center">
                  {detectFlag(phone) && (
                    <span
                      key={detectFlag(phone)}
                      className="text-base"
                      style={{ animation: "fadeIn 0.2s ease-in-out" }}
                    >
                      {detectFlag(phone)}
                    </span>
                  )}
                  +
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="33 6 12 34 56 78"
                  className="w-full px-4 py-3 rounded-r-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!phone.trim() || sending}
                className="w-full mt-1 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? "One sec..." : "Confirm"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
