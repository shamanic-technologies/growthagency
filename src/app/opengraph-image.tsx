import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GrowthAgency.dev — Your Growth Team";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #ecfdf5 50%, #ffffff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
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
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "#0f172a",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          Your Growth Team.
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#64748b",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Sales outreach, PR, AI search ranking, SEO — guaranteed results or your money back.
        </div>
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "48px",
          }}
        >
          {[
            { value: "1:1", label: "Dedicated Strategist" },
            { value: "100%", label: "Money-Back Guarantee" },
            { value: "24h", label: "To First Campaign" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "32px", fontWeight: 700, color: "#10b981" }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
