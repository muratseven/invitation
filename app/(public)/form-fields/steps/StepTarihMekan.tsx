"use client";

import React, { useCallback, useMemo } from "react";
import type { InvitationSettings, Countdown } from "../../../page";
import { SCHEDULE_PRESETS } from "../../../page";

interface StepTarihMekanProps {
  settings: InvitationSettings;
  countdown: Countdown;
  onUpdate: (patch: Partial<InvitationSettings>) => void;
}

/**
 * StepTarihMekan — Adım 2: Tarih, Saat, Mekan
 * - Gün/Ay/Yıl seçimi (dropdown)
 * - Saat girişi
 * - Mekan adresi (textarea)
 * - Countdown gösterimi (real-time)
 * - Program seçimi (toggle + preset butonlar + edit/delete)
 */
export function StepTarihMekan({
  settings,
  countdown,
  onUpdate,
}: StepTarihMekanProps) {
  // Date parsing
  const { day, month, year } = useMemo(() => {
    if (!settings.dateRaw) {
      const now = new Date();
      now.setMonth(now.getMonth() + 6);
      return {
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      };
    }
    const [y, m, d] = settings.dateRaw.split("-").map(Number);
    return { day: d, month: m, year: y };
  }, [settings.dateRaw]);

  // Detect which preset is currently selected
  const currentPreset = useMemo(() => {
    if (!settings.scheduleItems) return "";
    for (const [key, items] of Object.entries(SCHEDULE_PRESETS)) {
      if (
        items.length === settings.scheduleItems.length &&
        items.every(
          (item, idx) =>
            item.time === settings.scheduleItems![idx].time &&
            item.title === settings.scheduleItems![idx].title
        )
      ) {
        return key;
      }
    }
    return "";
  }, [settings.scheduleItems]);

  const handleDay = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const d = parseInt(e.target.value);
      const newDate = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      onUpdate({ dateRaw: newDate });
    },
    [year, month, onUpdate]
  );

  const handleMonth = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const m = parseInt(e.target.value);
      const newDate = `${year}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onUpdate({ dateRaw: newDate });
    },
    [year, day, onUpdate]
  );

  const handleYear = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const y = parseInt(e.target.value);
      const newDate = `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onUpdate({ dateRaw: newDate });
    },
    [month, day, onUpdate]
  );

  const handleTime = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ time: e.target.value });
    },
    [onUpdate]
  );

  const handleLocation = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate({ locationText: e.target.value });
    },
    [onUpdate]
  );

  const handleScheduleToggle = useCallback(() => {
    onUpdate({ showScheduleSection: !settings.showScheduleSection });
  }, [settings.showScheduleSection, onUpdate]);

  const handleApplyPreset = useCallback(
    (presetKey: string) => {
      const preset =
        SCHEDULE_PRESETS[presetKey as keyof typeof SCHEDULE_PRESETS];
      if (preset) {
        onUpdate({
          scheduleItems: preset,
          showScheduleSection: true,
        });
      }
    },
    [onUpdate]
  );

  const handleDeleteScheduleItem = useCallback(
    (index: number) => {
      const updated = settings.scheduleItems?.filter((_, i) => i !== index) || [];
      onUpdate({ scheduleItems: updated });
    },
    [settings.scheduleItems, onUpdate]
  );

  const handleEditScheduleItem = useCallback(
    (index: number, field: "time" | "title" | "description", value: string) => {
      const updated = [...(settings.scheduleItems || [])];
      if (field === "time") updated[index].time = value;
      if (field === "title") updated[index].title = value;
      if (field === "description") updated[index].description = value;
      onUpdate({ scheduleItems: updated });
    },
    [settings.scheduleItems, onUpdate]
  );

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i
  );

  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Tarih
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">Gün</label>
            <select
              value={day}
              onChange={handleDay}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {String(d).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Ay</label>
            <select
              value={month}
              onChange={handleMonth}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              {months.map((m, idx) => (
                <option key={idx} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Yıl</label>
            <select
              value={year}
              onChange={handleYear}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Countdown Display - Moved up */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <p className="text-xs font-semibold text-slate-700 mb-3">
          ⏳ Geri Sayım Önizlemesi ({settings.dateRaw})
        </p>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-white rounded p-3 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">
              {countdown.days}
            </p>
            <p className="text-xs text-slate-600 mt-1">Gün</p>
          </div>
          <div className="bg-white rounded p-3 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">
              {countdown.hours}
            </p>
            <p className="text-xs text-slate-600 mt-1">Saat</p>
          </div>
          <div className="bg-white rounded p-3 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">
              {countdown.minutes}
            </p>
            <p className="text-xs text-slate-600 mt-1">Dakika</p>
          </div>
          <div className="bg-white rounded p-3 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">
              {countdown.seconds}
            </p>
            <p className="text-xs text-slate-600 mt-1">Saniye</p>
          </div>
        </div>
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Saat
        </label>
        <input
          type="text"
          value={settings.time}
          onChange={handleTime}
          placeholder="Örn. 18:30 - 22:00"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Mekan Adresi
        </label>
        <textarea
          value={settings.locationText}
          onChange={handleLocation}
          placeholder="Mekanın adresini yazınız..."
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-900"
        />
      </div>

      {/* Schedule Section */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="schedule-toggle"
            checked={settings.showScheduleSection || false}
            onChange={handleScheduleToggle}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="schedule-toggle"
            className="text-sm font-semibold text-slate-700 cursor-pointer"
          >
            Etkinlik Akışı Ekle
          </label>
        </div>

        {settings.showScheduleSection && (
          <div className="bg-slate-50 p-4 rounded-lg space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-3">
                Hazır şablonlar:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SCHEDULE_PRESETS).map(([key]) => (
                  <button
                    key={key}
                    onClick={() => handleApplyPreset(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPreset === key
                        ? "bg-blue-600 text-white ring-2 ring-blue-300"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {key === "classic" ? "Klasik" : "Uzun Kokteyl"}
                  </button>
                ))}
              </div>
            </div>

            {settings.scheduleItems && settings.scheduleItems.length > 0 && (
              <div className="bg-white p-4 rounded border border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-3">
                  📋 Etkinlik Akışı (Düzenlenebilir):
                </p>
                <div className="space-y-3">
                  {settings.scheduleItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-start bg-slate-50 p-3 rounded border border-slate-200"
                    >
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) =>
                            handleEditScheduleItem(idx, "time", e.target.value)
                          }
                          placeholder="Saat"
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded text-slate-900"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handleEditScheduleItem(idx, "title", e.target.value)
                          }
                          placeholder="Başlık"
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded text-slate-900"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleEditScheduleItem(
                              idx,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Açıklama (opsiyonel)"
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded text-slate-900"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteScheduleItem(idx)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
