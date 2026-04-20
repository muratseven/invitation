// app/invite/[slug]/page.tsx

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  InvitationPreview,
  DEFAULT_SETTINGS,
  type InvitationSettings,
  type Countdown,
} from "../../editor/page";
import { EnvelopeHero } from "../../components/EnvelopeHero";

const API_BASE =
  process.env.NEXT_PUBLIC_API ?? "http://localhost:8888/backend/api";

type InviteDataResponse = {
  success: boolean;
  error?: string;
  data?: {
    brideName?: string;
    groomName?: string;
    dateRaw?: string;
    time?: string;
    locationText?: string;
    mapsUrl?: string;
    guestName?: string; // EKLE
    settings?: Partial<InvitationSettings>;
  };
};

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

  const now = Date.now();
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

export default function InvitePage() {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(true);

  // URL: /invite/{invite_token}
  const inviteToken = (() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  })();

  const [settings, setSettings] = useState<InvitationSettings | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteToken) {
      setError("Geçersiz davetiye linki.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/get_invite_data.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invite_token: inviteToken }),
        });

        const text = await res.text();
        console.log("get_invite_data raw response:", res.status, text);

        // HTTP hata koduysa, parse etmeye çalışma
        if (!res.ok) {
          if (!cancelled) {
            setError("Davetiye bulunamadı.");
          }
          return;
        }

        // Boş body geldiyse
        if (!text) {
          if (!cancelled) {
            setError("Davetiye bulunamadı.");
          }
          return;
        }

        let json: InviteDataResponse;
        try {
          json = JSON.parse(text);
        } catch (e) {
          console.error("get_invite_data JSON parse error", e, text);
          if (!cancelled) {
            setError("Davetiye bulunamadı.");
          }
          return;
        }

        if (!json.success || !json.data) {
          if (!cancelled) {
            setError(json.error || "Davetiye bulunamadı.");
          }
          return;
        }

        const base = DEFAULT_SETTINGS;
        const d = json.data;

        const dateRaw = d.dateRaw ?? base.dateRaw;
        const eventDate = dateRaw ? new Date(dateRaw + "T00:00:00") : null;

        const merged: InvitationSettings = {
          ...base,
          ...(d.settings || {}),
          brideName: d.brideName ?? base.brideName,
          groomName: d.groomName ?? base.groomName,
          dateRaw,
          eventDate,
          time: d.time ?? base.time,
          locationText: d.locationText ?? base.locationText,
          mapsUrl: d.mapsUrl ?? base.mapsUrl,
          guestName: d.guestName ?? (d.settings?.guestName as any) ?? undefined,
        };

        if (!cancelled) {
          setSettings(merged);
          setCountdown(computeCountdown(merged.eventDate));
        }
      } catch (e) {
        console.error("get_invite_data error", e);
        if (!cancelled) {
          setError("Davetiye yüklenirken bir hata oluştu.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inviteToken]);

  useEffect(() => {
    if (!settings?.eventDate) return;

    // ilk hesap
    setCountdown(computeCountdown(settings.eventDate));

    // her saniye güncelle
    const id = setInterval(() => {
      setCountdown(computeCountdown(settings.eventDate));
    }, 1000);

    return () => clearInterval(id);
  }, [settings?.eventDate]);

  if (error && !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-sm">
        Bu davetiye artık geçerli değil veya bulunamadı.
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-sm">
        Davetiye yükleniyor…
      </div>
    );
  }

  const overlayColor = hexToRgba(
    settings.backgroundColor,
    settings.backgroundOverlayOpacity
  );

  return (
    <div
      className="relative min-h-screen text-slate-900 bg-slate-950"
      style={{ background: overlayColor }}
    >
      {/* Intro overlay – ilk açılışta zarf sahnesi */}
      {showIntro && (
        <EnvelopeHero
          onOpen={() => {
            setShowIntro(false);
          }}
          brideName={settings.brideName}
          groomName={settings.groomName}
        />
      )}

      {/* intro açıkken davetiyeyi altta hazır tut ama tıklanamaz / görünmez yap */}
      <div
        className={showIntro ? "opacity-0 pointer-events-none" : "opacity-100"}
      >
        <header className="fixed top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur border-b border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between text-[0.7rem] text-slate-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">
                💌
              </span>
              <span className="tracking-[0.16em] uppercase text-[0.65rem] text-slate-200">
                Davetly.co
              </span>
            </div>
            <div className="text-[0.65rem] text-slate-300">
              {settings.brideName} &amp; {settings.groomName} için davetiye
            </div>
          </div>
        </header>

        <main className="pt-14 pb-10">
          <div className="max-w-5xl mx-auto px-4">
            <InvitationPreview
              settings={settings}
              countdown={countdown}
              overlayColor={overlayColor}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
