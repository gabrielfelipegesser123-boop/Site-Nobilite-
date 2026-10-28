import { ImageResponse } from "next/og";

export const alt = "Nobilite Joias | Joalheria em Timbó, SC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "radial-gradient(circle at 80% 30%, #3a2f18 0%, #0a0b0f 60%)", color: "#f4e6bd" }}>
        <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#d6b36e" }}>Joalheria · Timbó, SC</div>
        <div style={{ fontSize: 150, marginTop: 24, fontStyle: "italic", fontFamily: "serif" }}>Nobilite</div>
        <div style={{ fontSize: 40, color: "#a3a8b5" }}>Joias que guardam o brilho dos seus melhores momentos.</div>
      </div>
    ),
    size,
  );
}
