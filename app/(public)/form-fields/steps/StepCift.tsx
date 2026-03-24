"use client";

import React, { useCallback } from "react";
import type { InvitationSettings } from "../../../page";
import { HERO_SUBTITLE_OPTIONS } from "../../../page";

const HERO_SUBTITLE_CHIPS = HERO_SUBTITLE_OPTIONS.slice(0, 8);

interface StepCiftProps {
  settings: InvitationSettings;
  onUpdate: (patch: Partial<InvitationSettings>) => void;
}

/**
 * StepCift — Adım 1: Gelin ve Damat Bilgileri
 * - Gelin adı
 * - Damat adı
 * - Hero subtitle (preset seçim + "Rastgele Öner" butonu)
 */
export function StepCift({ settings, onUpdate }: StepCiftProps) {
  const handleBrideName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ brideName: e.target.value });
    },
    [onUpdate]
  );

  const handleGroomName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ groomName: e.target.value });
    },
    [onUpdate]
  );

  const handleSubtitle = useCallback(
    (subtitle: string) => {
      onUpdate({ heroSubtitle: subtitle });
    },
    [onUpdate]
  );

  const handleRandomSubtitle = useCallback(() => {
    const random =
      HERO_SUBTITLE_OPTIONS[
        Math.floor(Math.random() * HERO_SUBTITLE_OPTIONS.length)
      ];
    onUpdate({ heroSubtitle: random });
  }, [onUpdate]);

  return (
    <div className="space-y-8">
      {/* Names Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Gelin Adı
          </label>
          <input
            type="text"
            value={settings.brideName}
            onChange={handleBrideName}
            placeholder="Örn. Ayşe"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Damat Adı
          </label>
          <input
            type="text"
            value={settings.groomName}
            onChange={handleGroomName}
            placeholder="Örn. Mehmet"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 bg-white"
          />
        </div>
      </div>

      {/* Subtitle Section */}
      <div>
        <div className="flex items-center gap-1 mb-3">
          <label className="block text-sm font-semibold text-slate-700">
            Davetiye Başlığı
          </label>
          <button
            onClick={handleRandomSubtitle}
            className="text-4xl px-2 py-1 hover:scale-110 transition-transform -mt-1"
            title="Rastgele öner"
          >
            🎲
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {HERO_SUBTITLE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSubtitle(chip)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                settings.heroSubtitle === chip
                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 İpucu:</span> Davetiye başlığınızı seçin. Rastgele öner butonuyla farklı başlıklar deneyin.
        </p>
      </div>
    </div>
  );
}
