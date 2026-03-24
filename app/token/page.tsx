"use client";

import { useState, useEffect, useCallback } from "react";
import { GuestManager } from "../(public)/form-fields/components/GuestManager";

const API_BASE =
  process.env.NEXT_PUBLIC_API ?? "http://localhost:8888/backend/api";

type Screen = "input" | "saving" | "ready";

interface TokenInfo {
  maxGuests: number;
  usedGuests: number;
  eventId: number | null;
}

export default function TokenPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [screen, setScreen] = useState<Screen>("input");
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [activeToken, setActiveToken] = useState<string>("");
  const [eventSlug, setEventSlug] = useState<string>("");

  // Auto-verify if token already saved in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("invitationToken");
    if (saved) {
      setTokenInput(saved);
      autoVerify(saved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoVerify = useCallback(async (t: string) => {
    setScreen("saving");
    try {
      const vRes = await fetch(`${API_BASE}/verify_token.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      });
      const vData = await vRes.json();
      if (!vData.valid) {
        // Token no longer valid — clear it and show input
        localStorage.removeItem("invitationToken");
        setScreen("input");
        return;
      }
      setActiveToken(t);
      setEventSlug("");
      setTokenInfo({ maxGuests: vData.maxGuests, usedGuests: vData.usedGuests, eventId: vData.eventId ?? null });
      setScreen("ready");
    } catch {
      setScreen("input");
    }
  }, []);

  const handleVerify = useCallback(async () => {
    const t = tokenInput.trim().toUpperCase();
    if (!t) return;
    setError(null);
    setScreen("saving");

    try {
      // 1. Verify token
      const vRes = await fetch(`${API_BASE}/verify_token.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      });
      const vData = await vRes.json();
      if (!vData.valid) {
        setError(vData.error ?? "Geçersiz token. Lütfen kontrol edin.");
        setScreen("input");
        return;
      }

      // 2. If draft settings in localStorage, save to DB (non-blocking)
      let slug = "";
      const rawSettings = localStorage.getItem("invitationSettings");
      if (rawSettings) {
        try {
          const settings = JSON.parse(rawSettings);
          const sRes = await fetch(`${API_BASE}/save_event.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: t, settings }),
          });
          const sData = await sRes.json();
          if (sData.success) slug = sData.eventSlug ?? "";
        } catch {
          // non-blocking
        }
      }

      // 3. Persist token
      localStorage.setItem("invitationToken", t);

      setActiveToken(t);
      setEventSlug(slug);
      setTokenInfo({ maxGuests: vData.maxGuests, usedGuests: vData.usedGuests, eventId: vData.eventId ?? null });
      setScreen("ready");
    } catch {
      setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
      setScreen("input");
    }
  }, [tokenInput]);

  const handleOpenPreview = useCallback(() => {
    window.open("/preview", "_blank");
  }, []);

  // ── Ready screen ────────────────────────────────────────────────────────────
  if (screen === "ready" && tokenInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-pink-50/30">
        {/* Navbar */}
        <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-base font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Dijital Davetiye
            </a>
            <a href="/" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              ← Anasayfa
            </a>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            {/* Token satırı */}
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-sm font-bold text-slate-900 tracking-widest">{activeToken}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Aktif
              </span>
            </div>

            <div className="border-t border-slate-100" />

            {/* Davetli yöneticisi */}
            <GuestManager
              token={activeToken}
              maxGuests={tokenInfo.maxGuests}
              eventSlug={eventSlug}
              onPreview={handleOpenPreview}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Input / Saving screen ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-pink-50/30 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-base font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            Dijital Davetiye
          </a>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white text-2xl mb-4 shadow-md shadow-violet-200">
                🔑
              </div>
              <h1 className="text-xl font-bold text-slate-900">Token ile Giriş</h1>
              <p className="mt-2 text-sm text-slate-500">
                Satın aldığınız tokeni girerek davetlilerinizi yönetin ve davetiyenizi kaydedin.
              </p>
            </div>


            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Token
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  placeholder="INV-50-XXXXXXXX"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-slate-900 placeholder-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
                  disabled={screen === "saving"}
                  autoFocus
                />
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={!tokenInput.trim() || screen === "saving"}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-40 hover:shadow-md transition-all"
              >
                {screen === "saving" ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Doğrulanıyor…
                  </span>
                ) : (
                  "Token ile Devam Et →"
                )}
              </button>
            </div>
          </div>

          {/* Back link */}
          <p className="text-center text-sm text-slate-500">
            Henüz token almadınız mı?{" "}
            <a href="/#pricing" className="text-violet-600 hover:text-violet-800 font-medium underline">
              Paketleri inceleyin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
