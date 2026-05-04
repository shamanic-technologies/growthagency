"use client";

import { useEffect, useState } from "react";
import { JoinCohortButton } from "./join-cohort-button";
import {
  dismissedState,
  parseBannerState,
  shouldShowCohortBanner,
  todayISO,
} from "@/lib/cohort-banner-state";

interface CohortBannerProps {
  month: string;
  spotsRemaining: number;
  daysLeft: number;
  soldOut: boolean;
}

const STORAGE_KEY = "cohort-banner-state";

export function CohortBanner({ month, spotsRemaining, daysLeft, soldOut }: CohortBannerProps) {
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const today = todayISO();
    const stored = parseBannerState(
      typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null,
    );
    const { show, nextState } = shouldShowCohortBanner(stored, today);

    if (nextState === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else if (
      !stored ||
      stored.dismissedAt !== nextState.dismissedAt ||
      stored.visitDays.length !== nextState.visitDays.length ||
      stored.visitDays.some((d, i) => d !== nextState.visitDays[i])
    ) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }

    setVisible(show);
    setHydrated(true);
  }, []);

  function handleDismiss() {
    const today = todayISO();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissedState(today)));
    setVisible(false);
  }

  if (!hydrated || !visible) return null;

  return (
    <div className="bg-slate-900 text-white py-2.5 pl-4 pr-10 sm:px-4 text-center text-xs sm:text-sm relative">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 sm:flex-wrap">
        <span className="font-medium leading-snug break-words">
          {soldOut ? (
            <>{month} Cohort — Sold Out</>
          ) : (
            <>
              Join us as a client in our {month} Cohort — {spotsRemaining} {spotsRemaining === 1 ? "spot" : "spots"} left
              {daysLeft > 0 && (
                <span className="text-slate-400 ml-1">
                  ({daysLeft} {daysLeft === 1 ? "day" : "days"} remaining)
                </span>
              )}
            </>
          )}
        </span>
        {!soldOut && (
          <JoinCohortButton
            className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-emerald-600 transition cursor-pointer"
          >
            Apply Now
          </JoinCohortButton>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 sm:right-3 top-2 sm:top-1/2 sm:-translate-y-1/2 p-1 text-slate-500 hover:text-white transition"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
