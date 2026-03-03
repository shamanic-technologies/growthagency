import { describe, it, expect, vi } from "vitest";
import { register } from "../instrumentation";

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal("fetch", mockFetch);

describe("instrumentation register()", () => {
  it("does not make any network calls", async () => {
    await register();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
