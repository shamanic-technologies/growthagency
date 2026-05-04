import { describe, it, expect } from "vitest";
import {
  parseBannerState,
  shouldShowCohortBanner,
  dismissedState,
  todayISO,
} from "../cohort-banner-state";

describe("parseBannerState", () => {
  it("returns null for null input", () => {
    expect(parseBannerState(null)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseBannerState("")).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    expect(parseBannerState("{not json")).toBeNull();
  });

  it("returns null for non-object JSON", () => {
    expect(parseBannerState("\"hello\"")).toBeNull();
    expect(parseBannerState("123")).toBeNull();
    expect(parseBannerState("null")).toBeNull();
  });

  it("returns null when dismissedAt missing", () => {
    expect(parseBannerState(JSON.stringify({ visitDays: [] }))).toBeNull();
  });

  it("returns null when dismissedAt not ISO date", () => {
    expect(
      parseBannerState(
        JSON.stringify({ dismissedAt: "2026/05/04", visitDays: [] }),
      ),
    ).toBeNull();
    expect(
      parseBannerState(
        JSON.stringify({ dismissedAt: "May 4 2026", visitDays: [] }),
      ),
    ).toBeNull();
  });

  it("returns null when visitDays not an array", () => {
    expect(
      parseBannerState(
        JSON.stringify({ dismissedAt: "2026-05-04", visitDays: "nope" }),
      ),
    ).toBeNull();
  });

  it("returns null when a visit day entry is not ISO", () => {
    expect(
      parseBannerState(
        JSON.stringify({
          dismissedAt: "2026-05-04",
          visitDays: ["2026-05-05", "bad"],
        }),
      ),
    ).toBeNull();
  });

  it("parses a valid empty-visitDays state", () => {
    const out = parseBannerState(
      JSON.stringify({ dismissedAt: "2026-05-04", visitDays: [] }),
    );
    expect(out).toEqual({ dismissedAt: "2026-05-04", visitDays: [] });
  });

  it("parses a valid populated state", () => {
    const out = parseBannerState(
      JSON.stringify({
        dismissedAt: "2026-05-04",
        visitDays: ["2026-05-05", "2026-05-06"],
      }),
    );
    expect(out).toEqual({
      dismissedAt: "2026-05-04",
      visitDays: ["2026-05-05", "2026-05-06"],
    });
  });
});

describe("shouldShowCohortBanner", () => {
  it("AC1: first visit, no state → show", () => {
    const r = shouldShowCohortBanner(null, "2026-05-04");
    expect(r.show).toBe(true);
    expect(r.nextState).toBeNull();
  });

  it("AC2: same-day dismiss + reload → hide, no double-counting", () => {
    const state = dismissedState("2026-05-04");
    const r = shouldShowCohortBanner(state, "2026-05-04");
    expect(r.show).toBe(false);
    expect(r.nextState).toEqual(state);
  });

  it("AC3: dismiss D, revisit D+1 → hide, 1 unique post-dismiss day", () => {
    const r = shouldShowCohortBanner(
      dismissedState("2026-05-04"),
      "2026-05-05",
    );
    expect(r.show).toBe(false);
    expect(r.nextState).toEqual({
      dismissedAt: "2026-05-04",
      visitDays: ["2026-05-05"],
    });
  });

  it("AC4: dismiss D, visits D+1 then D+2 → hide, 2 unique days", () => {
    const r = shouldShowCohortBanner(
      { dismissedAt: "2026-05-04", visitDays: ["2026-05-05"] },
      "2026-05-06",
    );
    expect(r.show).toBe(false);
    expect(r.nextState).toEqual({
      dismissedAt: "2026-05-04",
      visitDays: ["2026-05-05", "2026-05-06"],
    });
  });

  it("AC5: dismiss D, third unique post-dismiss day → show, reset", () => {
    const r = shouldShowCohortBanner(
      {
        dismissedAt: "2026-05-04",
        visitDays: ["2026-05-05", "2026-05-06"],
      },
      "2026-05-07",
    );
    expect(r.show).toBe(true);
    expect(r.nextState).toBeNull();
  });

  it("AC6: dismiss after reshow → counter resets, new cycle", () => {
    const reshow = shouldShowCohortBanner(
      {
        dismissedAt: "2026-05-04",
        visitDays: ["2026-05-05", "2026-05-06"],
      },
      "2026-05-07",
    );
    expect(reshow.show).toBe(true);
    expect(reshow.nextState).toBeNull();

    const dismissed = dismissedState("2026-05-07");
    const dayAfter = shouldShowCohortBanner(dismissed, "2026-05-08");
    expect(dayAfter.show).toBe(false);
    expect(dayAfter.nextState).toEqual({
      dismissedAt: "2026-05-07",
      visitDays: ["2026-05-08"],
    });
  });

  it("AC7: corrupted JSON parses to null → show", () => {
    const parsed = parseBannerState("{garbage");
    const r = shouldShowCohortBanner(parsed, "2026-05-04");
    expect(r.show).toBe(true);
    expect(r.nextState).toBeNull();
  });

  it("AC8: dismissedAt in the future (clock skew) → show, reset", () => {
    const r = shouldShowCohortBanner(
      { dismissedAt: "2026-05-10", visitDays: [] },
      "2026-05-04",
    );
    expect(r.show).toBe(true);
    expect(r.nextState).toBeNull();
  });

  it("multi-visit same day: no dup added", () => {
    const r = shouldShowCohortBanner(
      { dismissedAt: "2026-05-04", visitDays: ["2026-05-05"] },
      "2026-05-05",
    );
    expect(r.show).toBe(false);
    expect(r.nextState).toEqual({
      dismissedAt: "2026-05-04",
      visitDays: ["2026-05-05"],
    });
  });

  it("ignores stored visit days at or before dismissedAt", () => {
    const r = shouldShowCohortBanner(
      {
        dismissedAt: "2026-05-04",
        visitDays: ["2026-05-04", "2026-05-03"],
      },
      "2026-05-05",
    );
    expect(r.show).toBe(false);
    expect(r.nextState).toEqual({
      dismissedAt: "2026-05-04",
      visitDays: ["2026-05-05"],
    });
  });

  it("threshold respected even when stored already has 2 unique days and we revisit one of them", () => {
    const r = shouldShowCohortBanner(
      {
        dismissedAt: "2026-05-04",
        visitDays: ["2026-05-05", "2026-05-06"],
      },
      "2026-05-06",
    );
    expect(r.show).toBe(false);
    expect(r.nextState).toEqual({
      dismissedAt: "2026-05-04",
      visitDays: ["2026-05-05", "2026-05-06"],
    });
  });
});

describe("todayISO", () => {
  it("formats as YYYY-MM-DD in client local timezone", () => {
    const d = new Date(2026, 4, 4, 9, 30);
    expect(todayISO(d)).toBe("2026-05-04");
  });

  it("zero-pads single-digit months and days", () => {
    const d = new Date(2026, 0, 5, 9, 30);
    expect(todayISO(d)).toBe("2026-01-05");
  });
});
