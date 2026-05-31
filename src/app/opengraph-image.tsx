import { ImageResponse } from "next/og";

export const alt =
  "KIOSK — Build digital systems that generate real business growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(60% 70% at 50% 42%, #1c1d22 0%, #0a0a0c 70%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700 }}>
          KIOSK
          <span style={{ color: "#d7ff3e" }}>.</span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#a1a1aa",
              marginBottom: 28,
            }}
          >
            <div style={{ width: 40, height: 2, background: "#d7ff3e", display: "flex" }} />
            Growth-focused digital agency
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            Build digital systems that generate{" "}
            <span style={{ color: "#d7ff3e", display: "flex" }}>
              real business growth
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#a1a1aa",
            borderTop: "1px solid #26262b",
            paddingTop: 28,
          }}
        >
          <span>Strategy · Content · Web · CRM · Automation · SEO · Marketing</span>
          <span style={{ color: "#f4f4f5" }}>www.kioskoman.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
