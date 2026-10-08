import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { architect, socialImage } from "@/data/portfolio";

export const dynamic = "force-static";

export async function GET() {
  const portrait = architect.portrait;
  const photo = portrait
    ? await readFile(join(process.cwd(), "public", portrait.src))
    : null;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f4f1eb", color: "#30352d" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: photo ? 740 : 1200, padding: "64px 60px" }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: "5px", color: "#747b6b" }}>PORTFÓLIO / ARQUITETURA</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 82, fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.1 }}>{architect.name}</div>
            <div style={{ display: "flex", fontSize: 30, marginTop: 20 }}>{architect.role}</div>
            <div style={{ display: "flex", fontSize: 24, color: "#747b6b", marginTop: 16 }}>{architect.location}</div>
          </div>
          <div style={{ display: "flex", fontSize: 25, borderTop: "1px solid #cdd0c5", paddingTop: 26 }}>Espaço, luz e vida cotidiana.</div>
        </div>
        {photo && portrait && (
          <img
            src={`data:image/png;base64,${photo.toString("base64")}`}
            alt={portrait.alt}
            width={460}
            height={630}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        )}
      </div>
    ),
    { width: socialImage.width, height: socialImage.height },
  );
}
