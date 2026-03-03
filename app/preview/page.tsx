"use client";

import React, { useEffect, useState } from "react";
import type { InvitationSettings, Countdown } from "../page";
import { InvitationPreview, DEFAULT_SETTINGS } from "../page";
import Link from "next/link";

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
      className="relative min-h-screen text-slate-50 page-overlay"
      style={{ background: overlayColor }}
    >
      {/* Üst menü */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between text-[0.75rem]">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-300/60">
              💌
            </span>
            <div className="flex flex-col">
              <span className="text-[0.7rem] tracking-[0.18em] uppercase text-slate-100">
                Dijital Davetiye Stüdyosu
              </span>
              <span className="text-[0.7rem] text-slate-300">
                Önizleme ekranı
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/landing#how-it-works"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-900 bg-white border border-slate-200 hover:bg-emerald-500 hover:text-slate-900 hover:border-emerald-300 transition-colors"
            >
              Anasayfa
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-900 bg-amber-300 border border-amber-200 hover:bg-amber-400 hover:border-amber-300 transition-colors"
            >
              Editöre dön
            </Link>
          </nav>
        </div>
      </header>

      {/* Uyarı balonu */}
      <div className="absolute top-16 inset-x-0 flex justify-center z-30">
        <div className="rounded-full bg-black/70 px-4 py-1.5 text-[0.7rem] text-slate-100 border border-slate-500/60">
          Bu sadece önizleme. Kendi davetiye ayarlarınızı davetlilerle
          paylaşmadan önce kontrol etmeniz için hazırlanmıştır.
        </div>
      </div>

      <div className="relative opacity-75 pointer-events-none pt-24 md:pt-12 pb-8">
        <InvitationPreview
          settings={settings}
          countdown={countdown}
          overlayColor={overlayColor}
        />
      </div>
    </div>
  );
}
