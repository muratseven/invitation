"use client";

import React, { Suspense, useState, useMemo } from "react";
import type { InvitationSettings, Countdown } from "../../../editor/page";
import { InvitationPreview } from "../../../editor/page";

interface StepOnizlemeProps {
  settings: InvitationSettings;
  countdown: Countdown;
  onOpenPreview?: () => void;
}

const BACKGROUND_DESIGNS = [
  { id: "romantic", name: "Romantik", emoji: "💕", gradient: "from-rose-100 via-pink-50 to-rose-100" },
  { id: "modern",   name: "Modern",   emoji: "✨", gradient: "from-blue-100 via-cyan-50 to-blue-100" },
  { id: "elegant",  name: "Zarif",    emoji: "👑", gradient: "from-amber-50 via-yellow-50 to-amber-50" },
  { id: "nature",   name: "Doğa",     emoji: "🌿", gradient: "from-emerald-100 via-green-50 to-emerald-100" },
];

export function StepOnizleme({ settings, countdown, onOpenPreview }: StepOnizlemeProps) {
  const [selectedBg, setSelectedBg] = useState<string>("romantic");

  const selectedBackground = useMemo(
    () => BACKGROUND_DESIGNS.find((bg) => bg.id === selectedBg),
    [selectedBg]
  );

  return (
    <div className="space-y-5 flex flex-col h-full">

      {/* Bilgi + Yeni sekmede önizle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">👁️ Canlı Önizleme</span> — Girdiğiniz bilgilerle oluşturulan davetiye aşağıda görünmektedir.
        </p>
        <button
          onClick={onOpenPreview}
          className="inline-flex items-center gap-1.5 flex-shrink-0 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
        >
          Yeni sekmede aç ↗
        </button>
      </div>

      {/* Geri sayım */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
        {[
          { val: countdown.days, label: "Gün" },
          { val: countdown.hours, label: "Saat" },
          { val: countdown.minutes, label: "Dakika" },
          { val: countdown.seconds, label: "Saniye" },
        ].map(({ val, label }) => (
          <div key={label}>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{val}</p>
            <p className="text-[0.7rem] text-slate-500 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Arkaplan seçimi */}
      <div className="grid grid-cols-4 gap-2">
        {BACKGROUND_DESIGNS.map((bg) => (
          <button
            key={bg.id}
            onClick={() => setSelectedBg(bg.id)}
            className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all text-xs font-medium ${
              selectedBg === bg.id
                ? "border-violet-500 bg-violet-50 text-violet-700 scale-105 shadow-md"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="text-lg">{bg.emoji}</span>
            {bg.name}
          </button>
        ))}
      </div>

      {/* Önizleme kutusu */}
      <div className={`flex-1 min-h-[300px] border-2 border-slate-200 rounded-xl overflow-hidden bg-gradient-to-br ${selectedBackground?.gradient} flex flex-col`}>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Yükleniyor…
          </div>
        }>
          <div className="flex-1 overflow-auto">
            <InvitationPreview
              settings={settings}
              countdown={countdown}
              overlayColor={settings.backgroundColor}
            />
          </div>
        </Suspense>
      </div>

      {/* Not */}
      <p className="text-xs text-slate-400 text-center">
        Video arka planı tam ekranda görünür.{" "}
        <button onClick={onOpenPreview} className="text-violet-500 underline hover:text-violet-700">
          Yeni sekmede önizleyin ↗
        </button>
      </p>
    </div>
  );
}
