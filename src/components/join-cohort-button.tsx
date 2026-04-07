"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePostHog } from "posthog-js/react";
import { PhoneModal } from "./phone-modal";

interface JoinCohortButtonProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function JoinCohortButton({ className, disabled, children }: JoinCohortButtonProps) {
  const [open, setOpen] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClick = () => {
    if (disabled) return;
    posthog?.capture("cta_join_cohort_clicked");
    setOpen(true);
  };

  const handleBookCall = () => {
    posthog?.capture("cta_book_call_clicked", { service_name: "Join Cohort" });
    setOpen(false);
    setShowPhoneModal(true);
  };

  const modal = open && mounted
    ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Join the Cohort
              </h3>
              <p className="text-sm text-slate-500">
                Choose how you&apos;d like to get started.
              </p>
            </div>

            <button
              onClick={handleBookCall}
              className="w-full px-6 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition cursor-pointer text-left flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <div>Book a 15-min Call</div>
                <div className="text-sm font-normal text-emerald-200">Talk to Kevin, no commitment</div>
              </div>
            </button>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button onClick={handleClick} disabled={disabled} className={className}>
        {children ?? "Join Cohort"}
      </button>
      {modal}
      {showPhoneModal && (
        <PhoneModal
          serviceName="Join Cohort"
          onClose={() => setShowPhoneModal(false)}
        />
      )}
    </>
  );
}
