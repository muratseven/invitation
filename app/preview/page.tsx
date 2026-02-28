"use client";

import React, { useEffect, useState } from "react";
import type { InvitationSettings, Countdown } from "../page";
import { InvitationPreview, DEFAULT_SETTINGS } from "../page";
// preview/page.tsx
function hexToRgba(hex: string, alpha: number): string {
  let clean = hex.replace("#", "").trim();

  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const bigint = parseInt(clean || "000000", 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function computeCountdown(eventDate: Date | null): Countdown {
  if (!eventDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: false };
  }

  const now = new Date().getTime();
  const diff = eventDate.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, finished: false };
}

export default function PreviewPage() {
  const [settings, setSettings] = useState<InvitationSettings | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("invitationSettings");

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<InvitationSettings>;
        const dateRaw = parsed.dateRaw ?? "";
        const eventDate = dateRaw ? new Date(dateRaw + "T00:00:00") : null;

        const merged: InvitationSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          dateRaw,
          eventDate,
        };

        setSettings(merged);
        setCountdown(computeCountdown(merged.eventDate));
      } catch {
        // ignore
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!settings?.eventDate) return;
    setCountdown(computeCountdown(settings.eventDate));

    const id = setInterval(() => {
      setCountdown(computeCountdown(settings.eventDate));
    }, 1000);

    return () => clearInterval(id);
  }, [settings?.eventDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center text-xs">
        Yükleniyor…
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center text-xs">
        Davetiye ayarları bulunamadı. Lütfen önce editörde davetiyenizi
        hazırlayın.
      </div>
    );
  }

  const overlayColor = hexToRgba(
    settings.backgroundColor,
    settings.backgroundOverlayOpacity ?? 0.6
  );

  return (
    <div
      className="relative min-h-screen text-slate-50"
      style={{ background: overlayColor }}
    >
      <div className="absolute top-4 inset-x-0 flex justify-center z-30">
        <div className="rounded-full bg-black/70 px-4 py-1.5 text-[0.7rem] text-slate-100 border border-slate-500/60">
          Bu sadece önizleme. Kendi davetiyenizi paylaşmak için ödeme adımını
          tamamlamanız gerekir.
        </div>
      </div>

      <div className="opacity-75 pointer-events-none pt-24 md:pt-12 pb-8">
        <InvitationPreview
          settings={settings}
          countdown={countdown}
          overlayColor={overlayColor}
        />
      </div>
    </div>
  );
}
