"use client";

import { useEffect, useState, useRef } from "react";
import type { InvitationSettings, Countdown } from "../editor/page";
import { InvitationPreview, DEFAULT_SETTINGS } from "../editor/page";

function hexToRgba(hex: string, alpha: number): string {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
  const bigint = parseInt(clean || "000000", 16);
  return `rgba(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, ${alpha})`;
}

function computeCountdown(eventDate: Date | null): Countdown {
  if (!eventDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: false };
  const diff = eventDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    finished: false,
  };
}

export default function PreviewPage() {
  const [settings, setSettings] = useState<InvitationSettings | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: false });
  const [loading, setLoading] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Scroll'da toolbar'ı gizle/göster
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setToolbarVisible(y < 80 || y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // localStorage'dan settings yükle
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("invitationSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<InvitationSettings>;
        const dateRaw = parsed.dateRaw ?? "";
        const eventDate = dateRaw ? new Date(dateRaw + "T00:00:00") : null;
        const merged: InvitationSettings = { ...DEFAULT_SETTINGS, ...parsed, dateRaw, eventDate };
        setSettings(merged);
        setCountdown(computeCountdown(merged.eventDate));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  // Geri sayım ticker
  useEffect(() => {
    if (!settings?.eventDate) return;
    setCountdown(computeCountdown(settings.eventDate));
    const id = setInterval(() => setCountdown(computeCountdown(settings.eventDate)), 1000);
    return () => clearInterval(id);
  }, [settings?.eventDate]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <span className="text-xs text-white/50 tracking-widest uppercase">Yükleniyor</span>
        </div>
      </div>
    );
  }

  // ── No settings ──────────────────────────────────────────────────────────────
  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-4xl">💌</p>
          <p className="text-white font-medium">Davetiye bulunamadı</p>
          <p className="text-white/50 text-sm">Önce editörde davetiyenizi hazırlayın.</p>
          <a
            href="/editor"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm text-white transition-colors"
          >
            ← Editöre dön
          </a>
        </div>
      </div>
    );
  }

  const overlayColor = hexToRgba(settings.backgroundColor, settings.backgroundOverlayOpacity ?? 0.6);

  return (
    <div style={{ background: overlayColor }}>
      {/* ── Floating toolbar ─────────────────────────────────────────────────── */}
      <div
        className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none transition-all duration-300"
        style={{ opacity: toolbarVisible ? 1 : 0, transform: toolbarVisible ? "translateY(0)" : "translateY(-12px)" }}
      >
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 px-2 py-1.5 shadow-2xl shadow-black/40">
          {/* Logo/brand */}
          <span className="px-2 text-xs font-semibold text-white/80 tracking-wide hidden sm:block">
            Önizleme
          </span>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          {/* Editöre dön */}
          <a
            href="/editor"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            <span className="hidden sm:inline">Editöre dön</span>
          </a>

          {/* Anasayfa */}
          <a
            href="/landing"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">Anasayfa</span>
          </a>

          <div className="h-4 w-px bg-white/20" />

          {/* Önizleme badge */}
          <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-xs font-semibold text-amber-300">
            Önizleme
          </span>
        </div>
      </div>

      {/* ── Davetiye içeriği ─────────────────────────────────────────────────── */}
      <InvitationPreview
        settings={settings}
        countdown={countdown}
        overlayColor={overlayColor}
      />
    </div>
  );
}
