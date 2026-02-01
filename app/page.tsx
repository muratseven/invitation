// app/page.tsx

"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import React, { useEffect, useState } from "react";

type FontFamily = "great-vibes" | "cormorant";

type InvitationSettings = {
  brideName: string;
  groomName: string;
  title: string;
  dateRaw: string; // YYYY-MM-DD
  eventDate: Date | null;
  time: string;
  locationText: string;
  mapsUrl: string;
  inviteText: string;
  donationText: string;
  backgroundColor: string;
  primaryTextColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  fontFamily: FontFamily;
};

type Guest = {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  maxGuests?: number;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

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

function slugifyName(name: string): string {
  const trimmed = name.trim().toLowerCase();

  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };

  const normalized = trimmed
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");

  return normalized
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditorPage() {
  const [settings, setSettings] = useState<InvitationSettings>({
    brideName: "Sine",
    groomName: "Murat",
    title: "Nişanımıza davetlisiniz!",
    dateRaw: "",
    eventDate: null,
    time: "18:30 - 22:00",
    locationText:
      "Saraç İshak, Tavşantaşı Sk. No:5, 34130 Fatih/İstanbul, Türkiye",
    mapsUrl: "https://maps.google.com",
    backgroundColor: "#f7f3ef",
    primaryTextColor: "#000000",
    buttonBackground: "#000000",
    buttonTextColor: "#ffffff",
    inviteText: "Bu özel günümüze davetlisiniz!",
    donationText: "Sizin adınıza TEMA Vakfı'na bir fidan bağışında bulunduk",
    fontFamily: "cormorant",
  });

  const [countdown, setCountdown] = useState<Countdown>(
    computeCountdown(settings.eventDate)
  );

  const [guests, setGuests] = useState<Guest[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  const [origin, setOrigin] = useState<string>("");
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleChange = (field: keyof InvitationSettings, value: string) => {
    setSettings((prev) => {
      if (field === "dateRaw") {
        const eventDate = value ? new Date(value + "T00:00:00") : null;
        return { ...prev, dateRaw: value, eventDate };
      }
      return { ...prev, [field]: value as any };
    });
  };

  useEffect(() => {
    setCountdown(computeCountdown(settings.eventDate));

    const interval = setInterval(() => {
      setCountdown(computeCountdown(settings.eventDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.eventDate]);

  const handleCsvUpload = (file: File) => {
    setCsvError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== "string") {
        setCsvError("Dosya okunamadı.");
        return;
      }

      const lines = text.split(/\r?\n/).map((l) => l.trim());
      if (lines.length === 0) {
        setCsvError("Dosya boş görünüyor.");
        setGuests([]);
        return;
      }

      const parsedGuests: Guest[] = [];

      const headerLine = lines[0];
      const headerColumns = headerLine
        .split(/[,;]/)
        .map((h) => h.trim().toLowerCase());

      const hasHeader =
        headerColumns.includes("name") ||
        headerColumns.includes("ad") ||
        headerColumns.includes("isim");

      const startIndex = hasHeader ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        const columns = line.split(/[,;]/).map((c) => c.trim());

        let name = "";
        let email: string | undefined;
        let phone: string | undefined;
        let maxGuests: number | undefined;

        if (hasHeader) {
          headerColumns.forEach((col, idx) => {
            const value = columns[idx] ?? "";
            if (!value) return;

            if (col === "name" || col === "ad" || col === "isim") {
              name = value;
            } else if (col === "email") {
              email = value;
            } else if (col === "phone" || col === "telefon") {
              phone = value;
            } else if (col === "max_guests" || col === "kota") {
              const n = Number(value);
              if (!Number.isNaN(n)) {
                maxGuests = n;
              }
            }
          });
        } else {
          name = columns[0];
        }

        if (!name) continue;

        const slug = slugifyName(name);
        if (!slug) continue;

        parsedGuests.push({ name, slug, email, phone, maxGuests });
      }

      if (parsedGuests.length === 0) {
        setCsvError("Geçerli isim içeren satır bulunamadı.");
        setGuests([]);
        return;
      }

      setGuests(parsedGuests);
    };

    reader.onerror = () => {
      setCsvError("CSV dosyası okunurken bir hata oluştu.");
    };

    reader.readAsText(file, "utf-8");
  };

  const datePreviewText = settings.eventDate
    ? settings.eventDate.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : null;

  return (
    <div className="relative min-h-screen bg-[#f0e6dc] text-slate-900">
      {/* Düzenle butonu */}
      {!isEditorOpen && (
        <button
          onClick={() => setIsEditorOpen(true)}
          className="fixed bottom-4 right-4 z-30 px-4 py-2 rounded-full bg-black text-white text-xs font-medium shadow-lg hover:bg-black/90 transition"
        >
          Düzenle
        </button>
      )}

      {/* Sağdan kayan editor paneli */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 text-slate-50 border-l border-slate-800 z-40 transform transition-transform duration-300 ease-in-out ${
          isEditorOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h1 className="text-sm font-semibold">Davetiye Editörü</h1>
          <button
            onClick={() => setIsEditorOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-xs"
            aria-label="Editörü kapat"
          >
            ✕
          </button>
        </div>

        <div className="h-[calc(100%-44px)] overflow-y-auto px-4 pb-6 pt-3">
          <SectionTitle label="Çift Bilgileri" />

          <TextField
            label="Gelin Adı"
            value={settings.brideName}
            onChange={(v) => handleChange("brideName", v)}
          />

          <TextField
            label="Damat Adı"
            value={settings.groomName}
            onChange={(v) => handleChange("groomName", v)}
          />

          <SpeedInsights />

          <TextField
            label="Başlık"
            value={settings.title}
            onChange={(v) => handleChange("title", v)}
          />

          <SectionTitle label="Tarih & Konum" />

          <div className="mb-3">
            <label className="block mb-1 text-xs font-medium text-slate-300">
              Tarih
            </label>
            <input
              type="date"
              value={settings.dateRaw}
              onChange={(e) => handleChange("dateRaw", e.target.value)}
              className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
            <p className="mt-1 text-[0.7rem] text-slate-400">
              {datePreviewText ?? "Gün / ay / yıl seçin"}
            </p>
          </div>

          <TextField
            label="Saat (metin olarak)"
            value={settings.time}
            onChange={(v) => handleChange("time", v)}
          />

          <TextAreaField
            label="Konum Metni"
            value={settings.locationText}
            onChange={(v) => handleChange("locationText", v)}
          />

          <TextField
            label="Harita Linki (Google Maps URL)"
            value={settings.mapsUrl}
            onChange={(v) => handleChange("mapsUrl", v)}
          />

          <SectionTitle label="Metinler" />

          <TextAreaField
            label="Davet Metni"
            value={settings.inviteText}
            onChange={(v) => handleChange("inviteText", v)}
          />

          <TextAreaField
            label="Bağış / Not Metni"
            value={settings.donationText}
            onChange={(v) => handleChange("donationText", v)}
          />

          <SectionTitle label="Yazı Tipi" />

          <select
            value={settings.fontFamily}
            onChange={(e) =>
              handleChange("fontFamily", e.target.value as FontFamily)
            }
            className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-xs"
          >
            <option value="great-vibes">Great Vibes</option>
            <option value="cormorant">Cormorant Garamond</option>
          </select>

          <SectionTitle label="Renkler" />

          <ColorField
            label="Arkaplan Rengi"
            value={settings.backgroundColor}
            onChange={(v) => handleChange("backgroundColor", v)}
          />

          <ColorField
            label="Yazı Rengi"
            value={settings.primaryTextColor}
            onChange={(v) => handleChange("primaryTextColor", v)}
          />

          <ColorField
            label="Buton Arkaplan"
            value={settings.buttonBackground}
            onChange={(v) => handleChange("buttonBackground", v)}
          />

          <ColorField
            label="Buton Yazı Rengi"
            value={settings.buttonTextColor}
            onChange={(v) => handleChange("buttonTextColor", v)}
          />

          <SectionTitle label="CSV ile Davetli Yükle" />

          <div className="mb-3 text-xs">
            <p className="mb-1 text-slate-300">
              Önerilen format (virgül veya noktalı virgül ile ayrılmış):
            </p>
            <pre className="bg-slate-950/60 rounded-md p-2 text-[0.7rem] text-slate-200 mb-2">
              {`name;email;phone;max_guests
Murat Yıldırım;murat@yildirim.com;5551112233;2
Ayşe Demir;ayse@example.com;;1`}
            </pre>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleCsvUpload(file);
                }
              }}
              className="block w-full text-xs text-slate-200 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
            />
            {csvError && (
              <p className="mt-1 text-[0.7rem] text-red-400">{csvError}</p>
            )}
            {guests.length > 0 && (
              <p className="mt-1 text-[0.7rem] text-emerald-400">
                {guests.length} davetli yüklendi.
              </p>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Not: Şu an için bu editör sadece tarayıcıda çalışıyor. Sayfayı
            yenilediğinizde veriler sıfırlanır. Sonraki adımda bunları
            veritabanına kaydedebiliriz.
          </p>
        </div>
      </div>

      {/* Orta kısım: Davetiye + Davetli Linkleri */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <InvitationPreview settings={settings} countdown={countdown} />
        <div className="mt-6">
          <GuestLinks guests={guests} origin={origin} settings={settings} />
        </div>
      </div>
    </div>
  );
}

/* ---- Küçük bileşenler ---- */

function SectionTitle({ label }: { label: string }) {
  return (
    <h2 className="mt-4 mb-2 text-xs font-semibold text-slate-200 uppercase tracking-wide">
      {label}
    </h2>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TextField({ label, value, onChange }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-300">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-300">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-sky-500/60"
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-300">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 p-0 border-none bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>
    </div>
  );
}


function InvitationPreview({
  settings,
  countdown,
}: {
  settings: InvitationSettings;
  countdown: Countdown;
}) {
  const {
    brideName,
    groomName,
    title,
    time,
    locationText,
    mapsUrl,
    inviteText,
    donationText,
    eventDate,
  } = settings;

  const [openDonation, setOpenDonation] = useState(false);

  const dateText = eventDate
    ? eventDate.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : "Tarih seçilmedi";

  const weddingDateForHero = dateText; // hero date

  const countdownFinished = countdown.finished;

  return (
    <div className="">
      {/* Arka plan video */}
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/bg.webm" type="video/webm" />
        Tarayıcınız video desteklemiyor.
      </video>

      {/* Hero */}
      <header className="hero" id="top">
        <div className="hero-inner">
          <p className="hero-subtitle">Biz evleniyoruz</p>
          <h1 className="hero-title">
            <span className="hero-line">{brideName}</span>
            <span className="hero-ampersand">&amp;</span>
            <span className="hero-line">{groomName}</span>
          </h1>

          <div className="fancy-divider">
            <span className="fancy-divider-line" />
            <span className="fancy-divider-icon">✦</span>
            <span className="fancy-divider-line" />
          </div>

          <p className="hero-date">{weddingDateForHero}</p>

          <div className="location-time-row" style={{ marginTop: "0.4rem" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="location-time-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="location-time-text">{time}</span>
          </div>

          <div className="hero-scroll">
            <a
              href="#invite"
              className="hero-scroll-link"
              aria-label="Aşağı kaydır"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hero-scroll-icon"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Davet kartı */}
        <section className="section section-invite" id="invite">
          <div className="section-inner invite-card">
            <p className="invite-label">Değerli</p>
            {/* Buraya misafir adı yerine başlığı kullanıyoruz, ileride davetli bazlı personalize edebiliriz */}
            <p className="invite-name">{title}</p>

            <p className="invite-text">{inviteText}</p>

            <button
              type="button"
              className="donation-toggle"
              onClick={() => setOpenDonation((prev) => !prev)}
            >
              🌱 {donationText} 🌱
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: openDonation ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>

            <div
              className={
                "donation-collapse" + (openDonation ? " active" : "")
              }
            >
              <img
                src="/fidan_ga_wm.jpg"
                alt="TEMA Vakfı fidan bağışı sertifikası"
                className="donation-image"
              />
            </div>
          </div>
        </section>

        {/* Geri Sayım */}
        <section className="section" id="countdown">
          <div className="section-inner">
            <h2>Geri Sayım</h2>
            <p className="section-subtitle">Hayatımızın en özel günü için</p>

            <div className="countdown-grid">
              <div className="countdown-item">
                <span id="days" className="count-number">
                  {countdown.days}
                </span>
                <span className="count-label">Gün</span>
              </div>
              <div className="countdown-item">
                <span id="hours" className="count-number">
                  {countdown.hours.toString().padStart(2, "0")}
                </span>
                <span className="count-label">Saat</span>
              </div>
              <div className="countdown-item">
                <span id="minutes" className="count-number">
                  {countdown.minutes.toString().padStart(2, "0")}
                </span>
                <span className="count-label">Dakika</span>
              </div>
              <div className="countdown-item">
                <span id="seconds" className="count-number">
                  {countdown.seconds.toString().padStart(2, "0")}
                </span>
                <span className="count-label">Saniye</span>
              </div>
            </div>

            {countdownFinished && (
              <p className="countdown-note">
                Etkinlik zamanı geldi, artık bir ömür boyu birlikteyiz. 💛
              </p>
            )}
          </div>
        </section>

        {/* Konum */}
        <section className="section section-location" id="location">
          <div className="section-inner location-card">
            <div className="location-icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="location-main-icon"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            <h3 className="location-title">Konum</h3>

            <div className="location-info">
              <div className="location-name-row">
                <span className="location-name">{locationText}</span>
              </div>

              <div className="location-time-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-time-icon"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="location-time-text">{time}</span>
              </div>
            </div>

            <div className="location-media">
              <div className="location-image-wrapper">
                <img
                  src="/vedat-dalokay-nikah-salonu.png"
                  alt="Etkinlik mekanı"
                  className="location-image"
                />
                <div className="location-image-overlay"></div>
              </div>

              <div className="location-map-wrapper">
                <iframe
                  src={mapsUrl || "about:blank"}
                  width="100%"
                  height="220"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mekan Haritası"
                  className="location-map"
                ></iframe>
              </div>
            </div>

            <div className="location-actions">
              <a
                href={mapsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="location-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-button-icon"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Haritada Aç
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="footer-heart"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>

          <p className="footer-names">
            {brideName} &amp; {groomName}
          </p>
          <p className="footer-date">{weddingDateForHero}</p>
          <p className="footer-date footer-credit">Sevgiyle hazırlandı</p>
        </footer>
      </main>
    </div>
  );
}


function CountdownBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[64px] px-3 py-2 rounded-xl bg-black/10 text-center">
      <div className="text-sm font-semibold">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-[0.7rem] mt-0.5 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

function GuestLinks({
  guests,
  origin,
  settings,
}: {
  guests: Guest[];
  origin: string;
  settings: InvitationSettings;
}) {
  if (guests.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl bg-white/80 border border-slate-200 p-4 text-xs">
      <h3 className="text-sm font-semibold mb-2 text-slate-900">
        Davetli Linkleri
      </h3>

      <div className="max-h-40 overflow-y-auto divide-y divide-slate-200">
        {guests.map((guest) => {
          const params = new URLSearchParams({
            bride: settings.brideName,
            groom: settings.groomName,
            date: settings.dateRaw || "",
            time: settings.time,
            location: settings.locationText,
            mapsUrl: settings.mapsUrl,
            guestName: guest.name,
          });

          const base = origin || "";
          const href =
            base.length > 0
              ? `${base}/invite/${guest.slug}?${params.toString()}`
              : `/invite/${guest.slug}?${params.toString()}`;

          return (
            <div
              key={guest.slug}
              className="flex items-center justify-between gap-3 py-1.5"
            >
              <div className="flex flex-col">
                <span className="text-slate-900 font-medium">
                  {guest.name}
                </span>
              </div>
              <a
                href={href}
                className="text-sky-700 hover:underline text-[0.7rem] break-all"
                target="_blank"
                rel="noreferrer"
              >
                {href}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
