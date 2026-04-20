"use client";

import React from "react";
import type { ThemeId } from "../../../editor/page";

/**
 * THEME_ART — ThemePreviewArt (app/page.tsx) kullanılan aynı tema tanımları
 * Export edilmediği için burada klonlandı
 */
const THEME_ART: Record<
  ThemeId,
  {
    bg: string;
    glow: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    deco: "dots" | "lines" | "grid" | "film" | "petals" | "border" | "leaves" | "rays";
  }
> = {
  "Romantik Şeker": {
    bg: "linear-gradient(145deg, #1a0810 0%, #2e1020 50%, #1a0810 100%)",
    glow: "radial-gradient(ellipse at 50% 58%, rgba(255,100,160,0.40) 0%, transparent 65%)",
    textColor: "#ffd6e8",
    accentColor: "rgba(255,120,170,0.55)",
    fontFamily: "'Pacifico', cursive",
    deco: "dots",
  },
  "Klasik Zarafet": {
    bg: "linear-gradient(160deg, #0a0800 0%, #18130a 50%, #0a0800 100%)",
    glow: "radial-gradient(ellipse at 50% 40%, rgba(212,160,23,0.38) 0%, transparent 65%)",
    textColor: "#fff0c0",
    accentColor: "rgba(212,160,23,0.55)",
    fontFamily: "'Italianno', cursive",
    deco: "lines",
  },
  "Aşk Yazısı": {
    bg: "linear-gradient(140deg, #0e0518 0%, #1e0c30 50%, #0e0518 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(192,100,255,0.35) 0%, transparent 65%)",
    textColor: "#f0e0ff",
    accentColor: "rgba(192,100,255,0.50)",
    fontFamily: "'Great Vibes', cursive",
    deco: "dots",
  },
  "Dergi Şıklığı": {
    bg: "linear-gradient(160deg, #080810 0%, #10101e 50%, #080810 100%)",
    glow: "radial-gradient(ellipse at 50% 40%, rgba(120,120,200,0.22) 0%, transparent 58%)",
    textColor: "#c8c8e8",
    accentColor: "rgba(120,120,200,0.38)",
    fontFamily: "'Cormorant Garamond', serif",
    deco: "grid",
  },
  "Film Noir": {
    bg: "linear-gradient(180deg, #060606 0%, #101010 100%)",
    glow: "radial-gradient(ellipse at 50% 50%, rgba(220,220,220,0.10) 0%, transparent 58%)",
    textColor: "#d0d0d0",
    accentColor: "rgba(200,200,200,0.28)",
    fontFamily: "'Lugrasimo', cursive",
    deco: "film",
  },
  "Pastel Rüya": {
    bg: "linear-gradient(140deg, #0e0b1c 0%, #1c1530 50%, #0e0b1c 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(240,150,200,0.32) 0%, transparent 65%)",
    textColor: "#f8d8ec",
    accentColor: "rgba(240,150,200,0.50)",
    fontFamily: "'Charm', cursive",
    deco: "petals",
  },
  "Sade Şıklık": {
    bg: "linear-gradient(160deg, #060610 0%, #0e0e20 50%, #060610 100%)",
    glow: "radial-gradient(ellipse at 50% 40%, rgba(80,120,255,0.22) 0%, transparent 60%)",
    textColor: "#d0d8ff",
    accentColor: "rgba(80,120,255,0.40)",
    fontFamily: "'Sofia', cursive",
    deco: "border",
  },
  "Sonbahar Sıcaklığı": {
    bg: "linear-gradient(145deg, #160a02 0%, #2c1408 50%, #160a02 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(232,148,58,0.38) 0%, transparent 65%)",
    textColor: "#ffe0b0",
    accentColor: "rgba(232,148,58,0.55)",
    fontFamily: "'Cookie', cursive",
    deco: "leaves",
  },
  "Altın Saat": {
    bg: "linear-gradient(145deg, #140e00 0%, #281a02 50%, #140e00 100%)",
    glow: "radial-gradient(ellipse at 50% 50%, rgba(245,200,66,0.35) 0%, transparent 62%)",
    textColor: "#fff0b0",
    accentColor: "rgba(245,200,66,0.55)",
    fontFamily: "'Dancing Script', cursive",
    deco: "rays",
  },
  "Zamansız Klasik": {
    bg: "linear-gradient(160deg, #080608 0%, #12100e 50%, #080608 100%)",
    glow: "radial-gradient(ellipse at 50% 45%, rgba(200,169,110,0.24) 0%, transparent 60%)",
    textColor: "#f0e8d4",
    accentColor: "rgba(200,169,110,0.42)",
    fontFamily: "'Playfair Display', serif",
    deco: "border",
  },
};

function DecoLayer({
  type,
  accentColor,
}: {
  type: string;
  accentColor: string;
}) {
  if (type === "dots") {
    const dots = Array.from({ length: 18 });
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.45 }}
      >
        {dots.map((_, i) => (
          <circle
            key={i}
            cx={`${8 + (i % 6) * 17}%`}
            cy={`${12 + Math.floor(i / 6) * 35}%`}
            r="1.5"
            fill={accentColor}
          />
        ))}
      </svg>
    );
  }
  if (type === "lines") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.4 }}
      >
        {[20, 50, 80].map((y, i) => (
          <line
            key={i}
            x1="10%"
            y1={`${y}%`}
            x2="90%"
            y2={`${y}%`}
            stroke={accentColor}
            strokeWidth="0.8"
          />
        ))}
        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke={accentColor} strokeWidth="0.5" strokeDasharray="3 5" />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.25 }}
      >
        {[20, 40, 60, 80].map((v, i) => (
          <React.Fragment key={i}>
            <line x1={`${v}%`} y1="0" x2={`${v}%`} y2="100%" stroke={accentColor} strokeWidth="0.5" />
            <line x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke={accentColor} strokeWidth="0.5" />
          </React.Fragment>
        ))}
      </svg>
    );
  }
  if (type === "film") {
    const holes = Array.from({ length: 6 });
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.35 }}
      >
        {holes.map((_, i) => (
          <React.Fragment key={i}>
            <rect x={`${8 + i * 15}%`} y="8%" width="7%" height="12%" rx="2" fill="none" stroke={accentColor} strokeWidth="0.8" />
            <rect x={`${8 + i * 15}%`} y="78%" width="7%" height="12%" rx="2" fill="none" stroke={accentColor} strokeWidth="0.8" />
          </React.Fragment>
        ))}
      </svg>
    );
  }
  if (type === "petals") {
    const petals = Array.from({ length: 12 });
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.28 }}
      >
        {petals.map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const cx = 50 + 35 * Math.cos(angle);
          const cy = 50 + 35 * Math.sin(angle);
          return (
            <ellipse
              key={i}
              cx={`${cx}%`}
              cy={`${cy}%`}
              rx="8%"
              ry="12%"
              fill="none"
              stroke={accentColor}
              strokeWidth="0.6"
              transform={`rotate(${(angle * 180) / Math.PI} ${cx}% ${cy}%)`}
            />
          );
        })}
      </svg>
    );
  }
  if (type === "leaves") {
    const leaves = Array.from({ length: 14 });
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.32 }}
      >
        {leaves.map((_, i) => {
          const x = 8 + (i % 7) * 13;
          const y = 15 + Math.floor(i / 7) * 50;
          return (
            <path
              key={i}
              d={`M ${x},${y} Q ${x + 2},${y - 3} ${x + 3},${y - 5} Q ${x + 1},${y - 4} ${x},${y}`}
              stroke={accentColor}
              fill="none"
              strokeWidth="0.6"
            />
          );
        })}
      </svg>
    );
  }
  if (type === "rays") {
    const rays = Array.from({ length: 8 });
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.22 }}
      >
        {rays.map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 50;
          const y1 = 50;
          const x2 = 50 + 45 * Math.cos(angle);
          const y2 = 50 + 45 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={accentColor}
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    );
  }
  if (type === "border") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.35 }}
      >
        <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke={accentColor} strokeWidth="0.8" />
        <rect x="8%" y="8%" width="84%" height="84%" fill="none" stroke={accentColor} strokeWidth="0.4" />
      </svg>
    );
  }
  return null;
}

interface ThemePreviewMiniProps {
  themeId: ThemeId;
  brideName?: string;
  groomName?: string;
  className?: string;
}

/**
 * ThemePreviewMini — Tema preview kartları için minimal tema gösterimi
 * Kullanım: Wizard'ın tema seçim adımında (step 3) tema kartlarında gösterilir
 */
export function ThemePreviewMini({
  themeId,
  brideName,
  groomName,
  className = "h-28",
}: ThemePreviewMiniProps) {
  const art = THEME_ART[themeId];
  if (!art) {
    return <div className={`w-full ${className} bg-slate-800`} />;
  }

  const b = (brideName ?? "").trim();
  const g = (groomName ?? "").trim();
  const initials =
    b && g
      ? `${b[0].toUpperCase()} & ${g[0].toUpperCase()}`
      : b
      ? b[0].toUpperCase()
      : g
      ? g[0].toUpperCase()
      : "S & M";

  return (
    <div
      className={`w-full ${className} relative overflow-hidden`}
      style={{ background: art.bg }}
      aria-hidden="true"
    >
      {/* Glow layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: art.glow }}
      />

      {/* Decoration layer */}
      <DecoLayer type={art.deco} accentColor={art.accentColor} />

      {/* Initials */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        <span
          style={{
            fontFamily: art.fontFamily,
            color: art.textColor,
            fontSize: "1.2rem",
            lineHeight: 1,
            textShadow: `0 2px 12px ${art.accentColor}`,
            letterSpacing: "0.04em",
            userSelect: "none",
          }}
        >
          {initials}
        </span>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
          zIndex: 3,
        }}
      />
    </div>
  );
}
