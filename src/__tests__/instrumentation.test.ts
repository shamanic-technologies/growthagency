import { describe, it, expect, vi, beforeEach } from "vitest";
import { register } from "../instrumentation";

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal("fetch", mockFetch);

describe("instrumentation register()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("DISTRIBUTE_API_KEY", "distrib.app_test");
    vi.stubEnv("POSTMARK_API_KEY", "pm_test_key");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_stripe");
    mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve("") });
  });

  it("registers provider keys before deploying templates", async () => {
    await register();

    const calls = mockFetch.mock.calls;
    // 2 key registrations + 1 template deploy = 3 calls
    expect(calls.length).toBe(3);

    // First call: postmark key
    expect(calls[0][0]).toBe("https://api.distribute.you/v1/keys");
    expect(JSON.parse(calls[0][1].body)).toEqual({
      keySource: "org",
      provider: "postmark",
      apiKey: "pm_test_key",
    });

    // Second call: stripe key
    expect(calls[1][0]).toBe("https://api.distribute.you/v1/keys");
    expect(JSON.parse(calls[1][1].body)).toEqual({
      keySource: "org",
      provider: "stripe",
      apiKey: "sk_test_stripe",
    });

    // Third call: template deploy
    expect(calls[2][0]).toBe(
      "https://api.distribute.you/v1/emails/templates",
    );
    expect(calls[2][1].method).toBe("PUT");
  });

  it("skips provider keys when env vars are missing", async () => {
    vi.stubEnv("POSTMARK_API_KEY", "");
    vi.stubEnv("STRIPE_SECRET_KEY", "");

    await register();

    // Only template deploy call
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toBe(
      "https://api.distribute.you/v1/emails/templates",
    );
  });

  it("skips everything when DISTRIBUTE_API_KEY is missing", async () => {
    vi.stubEnv("DISTRIBUTE_API_KEY", "");

    await register();

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("continues template deploy even if key registration fails", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve("error") })
      .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve("error") })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve("") });

    await register();

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch.mock.calls[2][0]).toBe(
      "https://api.distribute.you/v1/emails/templates",
    );
  });

  it("does not run outside nodejs runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "edge");

    await register();

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("uses Bearer auth for all calls", async () => {
    await register();

    for (const call of mockFetch.mock.calls) {
      expect(call[1].headers).toEqual(
        expect.objectContaining({
          Authorization: "Bearer distrib.app_test",
        }),
      );
    }
  });
});
