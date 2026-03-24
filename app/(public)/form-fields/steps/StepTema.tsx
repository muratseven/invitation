"use client";

import React, { useCallback, useMemo } from "react";
import type { InvitationSettings } from "../../../page";
import { THEMES } from "../../../page";
import { ThemePreviewMini } from "../components/ThemePreviewMini";

interface StepTemaProps {
  settings: InvitationSettings;
  onUpdate: (patch: Partial<InvitationSettings>) => void;
  onApplyTheme: (themeId: string) => void;
}

// Tema kilit durumları (premium themeler)
const PREMIUM_THEMES = new Set([
  "Altın Saat",
  "Zamansız Klasik",
  "Aşk Yazısı",
  "Dergi Şıklığı",
]);

/**
 * StepTema — Adım 3: Tema Seçimi
 * - 10 tema kartı tek grid'de
 * - Premium temalar listenin sonunda (👑 ikonu ile)
 * - Seçilen tema otomatik olarak ayarları uygula
 */
export function StepTema({
  settings,
  onUpdate,
  onApplyTheme,
}: StepTemaProps) {
  const selectedThemeId = useMemo(() => {
    // Mevcut theme'i bulmaya çalış
    const current = THEMES.find((t) =>
      Object.entries(t.settings).every(
        ([key, val]) =>
          (settings as Record<string, unknown>)[key] === val
      )
    );
    return current?.id || "Romantik Şeker";
  }, [settings]);

  const handleThemeSelect = useCallback(
    (themeId: string) => {
      onApplyTheme(themeId);
      onUpdate({ title: `${settings.brideName} & ${settings.groomName}'in Davetiyesi` });
    },
    [settings.brideName, settings.groomName, onApplyTheme, onUpdate]
  );

  // Separate regular and premium themes but keep them in one grid
  const regularThemes = THEMES.filter((t) => !PREMIUM_THEMES.has(t.id));
  const premiumThemesList = THEMES.filter((t) => PREMIUM_THEMES.has(t.id));
  const allThemesOrdered = [...regularThemes, ...premiumThemesList];

  return (
    <div className="space-y-8">
      {/* All Themes in Single Grid */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-4">
          Tasarım Temalarını Seçin
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {allThemesOrdered.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            const isPremium = PREMIUM_THEMES.has(theme.id);

            return (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-300 shadow-lg"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Theme Preview */}
                <ThemePreviewMini
                  themeId={theme.id}
                  brideName={settings.brideName}
                  groomName={settings.groomName}
                  className="h-28"
                />

                {/* Premium Lock */}
                {isPremium && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-all">
                    <div className="bg-white/95 rounded-full p-2 text-lg">
                      👑
                    </div>
                  </div>
                )}

                {/* Theme Name */}
                <div className="p-3 bg-white">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {theme.id}
                  </h4>
                  {isPremium && (
                    <p className="text-xs text-amber-600 font-medium mt-1">
                      Premium
                    </p>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 İpucu:</span> Tüm temalar davetiyenizin
          rengini, yazı stilini ve tasarım öğelerini belirler.
        </p>
      </div>
    </div>
  );
}
