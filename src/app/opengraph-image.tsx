import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "@/lib/seo";

export const alt = "The Pouma Academy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoPath = path.join(process.cwd(), "public", "finallogo.png");
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
          background: "linear-gradient(145deg, #f8f4fc 0%, #fff9f0 55%, #f3eef8 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
            height: 200,
            borderRadius: 36,
            background: "#ffffff",
            boxShadow: "0 12px 40px rgba(107, 78, 155, 0.18)",
            marginBottom: 36,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={160} height={160} style={{ borderRadius: 24 }} />
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: "#3d2d52",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#7c5fa8",
            fontStyle: "italic",
          }}
        >
          {siteConfig.tagline.el}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: "#8a7a9a",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {new URL(siteConfig.url).host}
        </div>
      </div>
    ),
    { ...size }
  );
}
