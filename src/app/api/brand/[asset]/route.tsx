import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const ASSETS: Record<
  string,
  { width: number; height: number; bg: string; textColor: string; agencyColor: string; devColor: string }
> = {
  "logo-on-dark": {
    width: 600,
    height: 100,
    bg: "#0f172a",
    textColor: "#ffffff",
    agencyColor: "#34d399",
    devColor: "#94a3b8",
  },
  "logo-on-light": {
    width: 600,
    height: 100,
    bg: "#ffffff",
    textColor: "#0f172a",
    agencyColor: "#10b981",
    devColor: "#64748b",
  },
  favicon: {
    width: 200,
    height: 200,
    bg: "transparent",
    textColor: "#ffffff",
    agencyColor: "#10b981",
    devColor: "",
  },
  banner: {
    width: 1200,
    height: 630,
    bg: "#ffffff",
    textColor: "#0f172a",
    agencyColor: "#10b981",
    devColor: "#64748b",
  },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ asset: string }> }
) {
  const { asset } = await params;
  const config = ASSETS[asset];
  if (!config) {
    return new Response("Not found", { status: 404 });
  }

  if (asset === "favicon") {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "40px",
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "120px",
              fontWeight: 700,
              color: "white",
              fontFamily: "system-ui",
            }}
          >
            G
          </div>
        </div>
      ),
      { width: config.width, height: config.height }
    );
  }

  if (asset === "banner") {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #ffffff 0%, #ecfdf5 50%, #ffffff 100%)",
            fontFamily: "system-ui",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              G
            </div>
            <span style={{ fontSize: "36px", fontWeight: 700, color: "#0f172a" }}>
              Growth
              <span style={{ color: "#10b981" }}>Agency</span>
              <span style={{ color: "#64748b" }}>.dev</span>
            </span>
          </div>
          <div style={{ fontSize: "52px", fontWeight: 700, color: "#0f172a", marginBottom: "20px" }}>
            Your Growth Team.
          </div>
          <div style={{ fontSize: "24px", color: "#94a3b8" }}>
            Guaranteed Results — Strategy + Execution
          </div>
        </div>
      ),
      { width: config.width, height: config.height }
    );
  }

  // Logo variants (on-dark / on-light)
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: config.bg,
          fontFamily: "system-ui",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "#10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "38px",
            fontWeight: 700,
          }}
        >
          G
        </div>
        <span style={{ fontSize: "42px", fontWeight: 700, color: config.textColor }}>
          Growth
          <span style={{ color: config.agencyColor }}>Agency</span>
          <span style={{ color: config.devColor }}>.dev</span>
        </span>
      </div>
    ),
    { width: config.width, height: config.height }
  );
}
