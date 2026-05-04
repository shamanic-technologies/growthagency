export type CohortBannerState = {
  dismissedAt: string;
  visitDays: string[];
};

export type EvaluationResult = {
  show: boolean;
  nextState: CohortBannerState | null;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const DISMISS_COOLDOWN_DAYS = 3;

export function todayISO(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseBannerState(raw: string | null): CohortBannerState | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  const { dismissedAt, visitDays } = obj;
  if (typeof dismissedAt !== "string" || !ISO_DATE.test(dismissedAt)) return null;
  if (!Array.isArray(visitDays)) return null;
  if (!visitDays.every((d) => typeof d === "string" && ISO_DATE.test(d))) return null;
  return { dismissedAt, visitDays: [...visitDays] };
}

export function shouldShowCohortBanner(
  state: CohortBannerState | null,
  today: string,
): EvaluationResult {
  if (!state) return { show: true, nextState: null };

  if (state.dismissedAt > today) {
    return { show: true, nextState: null };
  }

  if (today === state.dismissedAt) {
    return { show: false, nextState: state };
  }

  const uniqueDays = new Set(
    state.visitDays.filter((d) => d > state.dismissedAt),
  );
  uniqueDays.add(today);

  if (uniqueDays.size >= DISMISS_COOLDOWN_DAYS) {
    return { show: true, nextState: null };
  }

  const nextVisitDays = Array.from(uniqueDays).sort();
  const sameAsBefore =
    nextVisitDays.length === state.visitDays.length &&
    nextVisitDays.every((d, i) => d === state.visitDays[i]);

  return {
    show: false,
    nextState: sameAsBefore
      ? state
      : { dismissedAt: state.dismissedAt, visitDays: nextVisitDays },
  };
}

export function dismissedState(today: string): CohortBannerState {
  return { dismissedAt: today, visitDays: [] };
}
