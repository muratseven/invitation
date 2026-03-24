"use client";

import React, { useCallback, useReducer, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { InvitationSettings, Countdown } from "../../page";
import { DEFAULT_SETTINGS, THEMES } from "../../page";
import type { WizardState, WizardAction } from "./types";
import { wizardSteps } from "./types";
import { GuestManager } from "./components/GuestManager";

const API_BASE =
  process.env.NEXT_PUBLIC_API ?? "http://localhost:8888/backend/api";

// Lazy load steps
const StepCift = dynamic(() => import("./steps/StepCift").then((m) => ({ default: m.StepCift })), { ssr: false });
const StepTarihMekan = dynamic(() => import("./steps/StepTarihMekan").then((m) => ({ default: m.StepTarihMekan })), { ssr: false });
const StepTema = dynamic(() => import("./steps/StepTema").then((m) => ({ default: m.StepTema })), { ssr: false });
const StepAile = dynamic(() => import("./steps/StepAile").then((m) => ({ default: m.StepAile })), { ssr: false });
const StepOnizleme = dynamic(() => import("./steps/StepOnizleme").then((m) => ({ default: m.StepOnizleme })), { ssr: false });

// ── Countdown ────────────────────────────────────────────────────────────────
function calculateCountdown(dateRaw: string): Countdown {
  if (!dateRaw) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  try {
    const diff = new Date(dateRaw).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      finished: false,
    };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }
}

// ── Reducer ──────────────────────────────────────────────────────────────────
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "UPDATE_SETTINGS": {
      const updated = { ...state.settings, ...action.patch };
      const countdown = "dateRaw" in action.patch
        ? calculateCountdown(updated.dateRaw || "")
        : state.countdown;
      return { ...state, settings: updated, countdown };
    }
    case "APPLY_THEME": {
      const theme = THEMES.find((t) => t.id === action.themeId);
      if (!theme) return state;
      return { ...state, settings: { ...state.settings, ...theme.settings } };
    }
    case "SET_COUNTDOWN":
      return { ...state, countdown: action.countdown };
    default:
      return state;
  }
}

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── WizardModal ───────────────────────────────────────────────────────────────
export function WizardModal({ isOpen, onClose }: WizardModalProps) {
  const [state, dispatch] = useReducer(wizardReducer, {
    step: 1,
    settings: DEFAULT_SETTINGS,
    countdown: calculateCountdown(DEFAULT_SETTINGS.dateRaw || ""),
  });

  // Ekran durumu: "wizard" | "free-success" | "token-success"
  const [screen, setScreen] = useState<"wizard" | "free-success" | "token-success">("wizard");

  // Token akışı
  const [tokenInput, setTokenInput] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [activeToken, setActiveToken] = useState("");
  const [maxGuests, setMaxGuests] = useState(50);
  const [eventSlug, setEventSlug] = useState("");

  // Real-time countdown
  React.useEffect(() => {
    if (!isOpen) return;
    const iv = setInterval(() => {
      dispatch({ type: "SET_COUNTDOWN", countdown: calculateCountdown(state.settings.dateRaw || "") });
    }, 1000);
    return () => clearInterval(iv);
  }, [isOpen, state.settings.dateRaw]);

  const goToStep = useCallback((step: 1 | 2 | 3 | 4 | 5) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const updateSettings = useCallback((patch: Partial<InvitationSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", patch });
  }, []);

  const applyTheme = useCallback((themeId: string) => {
    dispatch({ type: "APPLY_THEME", themeId });
  }, []);

  const nextStep = useCallback(() => {
    if (state.step < 5)
      dispatch({ type: "SET_STEP", step: (state.step + 1) as 1 | 2 | 3 | 4 | 5 });
  }, [state.step]);

  // localStorage'a kaydet (preview + yeniden kullanım için)
  const saveLocal = useCallback((settings: InvitationSettings) => {
    try {
      localStorage.setItem("invitationSettings", JSON.stringify(settings));
    } catch { /* ignore */ }
  }, []);

  const openPreview = useCallback(() => {
    saveLocal(state.settings);
    window.open("/preview", "_blank");
  }, [state.settings, saveLocal]);

  // Adım 5 → "Tamamla" — ücretsiz akış: sadece localStorage
  const handleFreeComplete = useCallback(() => {
    saveLocal(state.settings);
    setScreen("free-success");
  }, [state.settings, saveLocal]);

  // Token doğrula → save_event.php → davetli yönetimi aç
  const handleUseToken = useCallback(async () => {
    const t = tokenInput.trim().toUpperCase();
    if (!t) return;
    setTokenLoading(true);
    setTokenError(null);

    try {
      // 1. Token doğrula
      const vRes = await fetch(`${API_BASE}/verify_token.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      });
      const vData = await vRes.json();
      if (!vData.valid) {
        setTokenError(vData.message ?? "Geçersiz token.");
        return;
      }

      // 2. Tüm davetiye verilerini DB'ye kaydet
      const eRes = await fetch(`${API_BASE}/save_event.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t, settings: state.settings }),
      });
      const eData = await eRes.json();
      if (!eData.success) {
        setTokenError(eData.error ?? "Etkinlik kaydedilemedi.");
        return;
      }

      // 3. Token'ı localStorage'a yaz (sonraki ziyarette hatırlansın)
      try {
        localStorage.setItem("invitationToken", t);
        localStorage.setItem("invitationSettings", JSON.stringify(state.settings));
      } catch { /* ignore */ }

      setActiveToken(t);
      setMaxGuests(vData.maxGuests ?? 50);
      setEventSlug(eData.eventSlug ?? "");
      setScreen("token-success");
    } catch {
      setTokenError("Sunucuya bağlanılamadı. MAMP çalışıyor mu?");
    } finally {
      setTokenLoading(false);
    }
  }, [tokenInput, state.settings]);

  const currentStepComponent = useMemo(() => {
    switch (state.step) {
      case 1: return <StepCift settings={state.settings} onUpdate={updateSettings} />;
      case 2: return <StepTarihMekan settings={state.settings} countdown={state.countdown} onUpdate={updateSettings} />;
      case 3: return <StepTema settings={state.settings} onUpdate={updateSettings} onApplyTheme={applyTheme} />;
      case 4: return <StepAile settings={state.settings} onUpdate={updateSettings} />;
      case 5: return <StepOnizleme settings={state.settings} countdown={state.countdown} onOpenPreview={openPreview} />;
      default: return null;
    }
  }, [state.step, state.settings, state.countdown, updateSettings, applyTheme, openPreview]);

  if (!isOpen) return null;

  // ── Ücretsiz success ekranı ──────────────────────────────────────────────
  if (screen === "free-success") {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-lg shadow-md flex-shrink-0">
                  ✓
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Davetiye hazır!</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Önizleyebilirsiniz. Davetlilere özel link için token gerekli.</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl flex-shrink-0">×</button>
            </div>

            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">

              {/* Önizle */}
              <button
                onClick={openPreview}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
              >
                👁️ Davetiyeyi Yeni Sekmede Önizle <span className="text-xs">↗</span>
              </button>

              {/* Bilgi kutusu */}
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                <p className="text-xs font-semibold text-amber-800 mb-1">💡 Davetlilere özel link nedir?</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Her davetliniz için ismiyle kişiselleştirilmiş davetiye linki oluşturabilirsiniz.
                  Bu özellik <strong>token</strong> gerektirir. Token almak için bizimle iletişime geçin.
                </p>
              </div>

              {/* Ayırıcı */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">Token&apos;ım var</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Token girişi */}
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Token'ınızı girin — davetiye bilgileriniz kaydedilir ve davetli ekleme özelliği açılır.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleUseToken()}
                    placeholder="INV-50-XXXXXXXX"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-mono text-slate-900 placeholder-slate-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
                  />
                  <button
                    onClick={handleUseToken}
                    disabled={tokenLoading || !tokenInput.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-40 hover:shadow-md transition-all"
                  >
                    {tokenLoading
                      ? <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      : "Kullan"
                    }
                  </button>
                </div>
                {tokenError && (
                  <p className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-xs text-rose-700">
                    {tokenError}
                  </p>
                )}
              </div>

              {/* /token sayfasına yönlendirme */}
              <p className="text-center text-xs text-slate-400">
                Önceki davetiyenize erişmek için{" "}
                <button
                  onClick={() => { onClose(); window.open("/token", "_blank"); }}
                  className="text-violet-500 underline hover:text-violet-700"
                >
                  Token Giriş sayfasını
                </button>{" "}
                kullanabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Token success ekranı (davetli yönetimi) ──────────────────────────────
  if (screen === "token-success") {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white text-lg shadow-md">
                  ✓
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Davetiye kaydedildi!</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Davetlilerinizi ekleyip kişisel linkleri paylaşın.</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>

            {/* Token şeridi */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[0.65rem] uppercase tracking-widest text-slate-400 flex-shrink-0">Token</span>
                <span className="font-mono text-sm font-semibold text-slate-900 truncate">{activeToken}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={openPreview}
                  className="px-3 py-1 rounded-full border border-violet-200 text-xs text-violet-600 hover:bg-violet-50 transition-colors"
                >
                  Önizle ↗
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(activeToken).catch(() => {})}
                  className="px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Kopyala
                </button>
              </div>
            </div>

            {/* Guest Manager */}
            <div className="flex-1 overflow-auto px-6 py-5">
              <GuestManager
                token={activeToken}
                maxGuests={maxGuests}
                eventSlug={eventSlug}
                onPreview={openPreview}
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Wizard ekranı ────────────────────────────────────────────────────────
  const progress = (state.step / 5) * 100;
  const currentStepData = wizardSteps[state.step - 1];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">

          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              {wizardSteps.map((s, idx) => (
                <React.Fragment key={s.step}>
                  <button
                    onClick={() => goToStep(s.step)}
                    className={`flex items-center gap-1.5 text-xs transition-all ${
                      idx + 1 === state.step ? "text-violet-700 font-semibold"
                        : idx + 1 < state.step ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                      idx + 1 === state.step ? "bg-violet-600 text-white"
                        : idx + 1 < state.step ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {idx + 1 < state.step ? "✓" : idx + 1}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {idx < wizardSteps.length - 1 && (
                    <span className={`flex-1 h-px max-w-[2rem] ${idx + 1 < state.step ? "bg-emerald-300" : "bg-slate-100"}`} />
                  )}
                </React.Fragment>
              ))}
              <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>

            <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h2 className="text-base font-semibold text-slate-900">{currentStepData.label}</h2>
              <p className="text-xs text-slate-400">{currentStepData.description}</p>
            </div>
          </div>

          {/* İçerik */}
          <div className="flex-1 overflow-auto px-8 py-6">
            {currentStepComponent}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-400">Adım {state.step} / 5</p>
            {state.step === 5 ? (
              <button
                onClick={handleFreeComplete}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Tamamla →
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
              >
                İleri →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
