"use client";

import { useState } from "react";
import { JoinCohortButton } from "./join-cohort-button";

interface CohortBannerProps {
  month: string;
  spotsRemaining: number;
  daysLeft: number;
  soldOut: boolean;
}

export function CohortBanner({ month, spotsRemaining, daysLeft, soldOut }: CohortBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 text-center text-sm relative">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="font-medium">
          {soldOut ? (
            <>{month} Cohort — Sold Out</>
          ) : (
            <>
              {month} Cohort — {spotsRemaining} {spotsRemaining === 1 ? "spot" : "spots"} left
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
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
