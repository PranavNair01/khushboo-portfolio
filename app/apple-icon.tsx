import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon for iPhones: the K—P monogram on ink.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#141414",
        color: "#f1eee8",
        fontSize: 84,
        fontFamily: "serif",
        letterSpacing: -2,
      }}
    >
      K—P
    </div>,
    size,
  );
}
