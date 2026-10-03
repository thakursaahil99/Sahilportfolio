import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card shown when the portfolio link is shared (LinkedIn, WhatsApp, X…). */
export default function Image() {
  const [first, ...rest] = profile.name.toUpperCase().split(" ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 15%, #5a1410 0%, #07070a 55%)",
          color: "#f2efe9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "#8a8780" }}>
          <span>PORTFOLIO</span>
          <span style={{ color: "#ffb547" }}>{profile.location.split(",")[0].toUpperCase()}, INDIA</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 150, fontWeight: 900, lineHeight: 0.9, letterSpacing: -6 }}>{first}</span>
          <span style={{ fontSize: 150, fontWeight: 900, lineHeight: 0.9, letterSpacing: -6, color: "#ff4a2a" }}>{rest.join(" ")}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 36, fontWeight: 700 }}>{profile.role}</span>
          <span style={{ fontSize: 24, color: "#8a8780" }}>Next.js · React · TypeScript · Node.js · Magento 2</span>
        </div>
      </div>
    ),
    size
  );
}
