// app/page.tsx

"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import React, { useEffect, useState } from "react";
import { parseMapInput } from "./lib/mapUtils"; // relative path’i dosya yapına göre düzelt

type FontFamily =
  | "great-vibes"
  | "cormorant"
  | "pacifico"
  | "sofia"
  | "cookie"
  | "dancing-script"
  | "parisienne"
  | "playfair";

type InvitationSettings = {
  brideName: string;
  groomName: string;
  title: string;
  heroSubtitle: string;
  dateRaw: string;
  eventDate: Date | null;
  time: string;
  locationText: string;
  mapsUrl: string;
  locationImageUrl: string;
  inviteText: string;
  donationText: string;
  showDonationSection: boolean;
  donationOrganization: "tema" | "cydd" | "kiz-cocuklari" | "losev" | "custom";
  donationImageUrl: string;
  showFamilySection: boolean;
  // Arkaplan overlay rengi (video üstü)
  backgroundColor: string;
  backgroundOverlayOpacity: number;

  // Eski alanlar (istersen sonra kaldırırsın)
  primaryTextColor: string;
  buttonBackground: string;
  buttonTextColor: string;

  fontFamily: FontFamily;
  family1Mother: string;
  family1Father: string;
  family1Surname: string;
  family2Mother: string;
  family2Father: string;
  family2Surname: string;
  donationBackground: string;
  locationBackground: string;
  footerBackground: string;

  // Yeni renk alanları (ekran görüntüsüne göre)
  backgroundBaseColor: string; // Arka Plan Rengi (#111111)
  headingColor: string; // Başlık Rengi
  personNameColor: string; // Kişi İsimleri Rengi
  familyRowColor: string; // Aile Satırı Rengi
  parentRowColor: string; // Ebeveyn Satırı Rengi
  photoBorderColor: string; // Fotoğraf Kenarlık Rengi
  lowerMessageColor: string; // Alt Mesaj Rengi
  lowerCoupleNameColor: string; // Alt Çift İsmi Rengi
  sectionCardBackground: string; // section kart arka planı
  sectionCardBorderColor: string; // section kart border
  heroSubtitleColor: string;
  heroNamesColor: string;
  ampersandColor: string;
  dividerColor: string;
};

type Guest = {
  id: string;
  name: string; // Davetli bilgisi (ad-soyad + isteğe bağlı not)
  slug: string;
  email?: string;
  phone?: string;
  source: "csv" | "manual";
  lastCopiedAt?: number;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

const HERO_SUBTITLE_OPTIONS = [
  "Biz evleniyoruz",
  "Hayatımızın en özel günü",
  "Bu mutlu günümüzde yanımızda olun",
  "Bir ömür boyu mutluluğa evet",
  "Sevgiyle başlayan yolculuğumuzda bize katılın",
];

// HEX → rgba string
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
// UTF-8 güvenli base64 encode/decode helper'ları

function base64EncodeUnicode(str: string): string {
  // UTF-8 string'i Latin1'e çevirip btoa ile encode eder
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(Number("0x" + p1))
    )
  );
}

function base64DecodeUnicode(str: string): string {
  // btoa ile encode edilmiş Latin1 string'i tekrar UTF-8'e çevirir
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
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
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settings, setSettings] = useState<InvitationSettings>({
    brideName: "Sine",
    groomName: "Murat",
    title: "Nişanımıza davetlisiniz!",
    heroSubtitle: "Biz evleniyoruz",
    dateRaw: "",
    eventDate: null,
    time: "18:30 - 22:00",
    locationText:
      "Saraç İshak, Tavşantaşı Sk. No:5, 34130 Fatih/İstanbul, Türkiye",
    mapsUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.672441411698!2d32.85890307731811!3d39.92634597152287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34e5118453e7b%3A0x1a24327dbe143027!2sVedat%20Dalokay%20Nikah%20Salonu!5e0!3m2!1str!2str!4v1770197797747!5m2!1str!2str",
    locationImageUrl: "/vedat-dalokay-nikah-salonu.png",
    inviteText: "Bu özel günümüze davetlisiniz!",
    donationText: "Sizin adınıza TEMA Vakfı'na bir fidan bağışında bulunduk",
    showDonationSection: false,
    donationOrganization: "tema",
    donationImageUrl: "/fidan_ga_wm.jpg",
    showFamilySection: false,
    // Video üstü overlay
    backgroundColor: "#000000",
    backgroundOverlayOpacity: 0.6,

    // Eski alanlar (şimdilik aynı kalsın)
    primaryTextColor: "#ffffff",
    buttonBackground: "#d9e2c0",
    buttonTextColor: "#1f2620",

    fontFamily: "pacifico",
    family1Mother: "",
    family1Father: "",
    family1Surname: "",
    family2Mother: "",
    family2Father: "",
    family2Surname: "",

    // Yeni renk alanları - ekran görüntüsüne göre default
    backgroundBaseColor: "#111111", // Arka Plan Rengi
    headingColor: "#ffffff", // Başlık Rengi
    personNameColor: "#ffffff", // Kişi isimleri
    familyRowColor: "#ffffff", // Aile satırı
    parentRowColor: "#ffffff", // Ebeveyn satırı
    photoBorderColor: "#ffffff", // Fotoğraf kenarlık
    lowerMessageColor: "#ffffff", // Alt mesaj
    lowerCoupleNameColor: "#ffffff", // Alt çift ismi
    sectionCardBackground: "rgba(0,0,0,0.58)",
    sectionCardBorderColor: "rgba(255,255,255,0.18)",
    heroSubtitleColor: "#ffffff",
    heroNamesColor: "#ffffff",
    ampersandColor: "#ffffff",
    dividerColor: "rgba(255,255,255,0.5)",
    donationBackground: "rgba(0,0,0,0.58)",
    locationBackground: "rgba(0,0,0,0.58)",
    footerBackground: "rgba(0,0,0,0.58)",
  });

  const emptyCountdown: Countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  };
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!settingsLoaded) return; // LOCALSTORAGE YÜKLENMEDEN KAYDETME

    setSaveStatus("saving");
    const toStore: any = { ...settings };
    delete toStore.eventDate;

    window.localStorage.setItem("invitationSettings", JSON.stringify(toStore));

    const timeout = setTimeout(() => setSaveStatus("saved"), 300);
    const reset = setTimeout(() => setSaveStatus("idle"), 2000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(reset);
    };
  }, [settings, settingsLoaded]);

  const steps = [
    { id: 1, label: "Çift Bilgileri" },
    { id: 2, label: "Tarih & Konum" },
    { id: 3, label: "Tema & Renk" },
    { id: 4, label: "Aile & Bağış" },
    { id: 5, label: "Davetliler & Linkler" },
  ];

  const [countdown, setCountdown] = useState<Countdown>(emptyCountdown);
  const tableRef = React.useRef<HTMLDivElement | null>(null);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  const [origin, setOrigin] = useState<string>("");
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true);
  const [familyTab, setFamilyTab] = useState<"family1" | "family2">("family1");
  const [dateDay, setDateDay] = useState<string>("");
  const [dateMonth, setDateMonth] = useState<string>("");
  const [dateYear, setDateYear] = useState<string>("");

  const handleCopyGuestLink = async (guest: Guest) => {
    if (!origin) return;

    const payload = buildGuestPayload(guest, settings);

    const encoded = encodeURIComponent(
      base64EncodeUnicode(JSON.stringify(payload))
    );

    const slug =
      guest.slug && guest.slug.length > 0
        ? guest.slug
        : slugifyName(guest.name || "davetli");

    const href =
      origin.length > 0
        ? `${origin}/invite/${slug}?d=${encoded}`
        : `/invite/${slug}?d=${encoded}`;

    try {
      await navigator.clipboard.writeText(href);
      const now = Date.now();

      setGuests((prev) =>
        prev.map((g) =>
          g.id === guest.id ? { ...g, slug, lastCopiedAt: now } : g
        )
      );
    } catch (e) {
      console.error("clipboard error", e);
    }
  };

  const handleAddManualGuest = () => {
    const newGuest: Guest = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: "",
      slug: "",
      source: "manual",
    };
    setGuests((prev) => [...prev, newGuest]);

    // Bir sonraki frame'de en alta scroll et
    requestAnimationFrame(() => {
      const el = tableRef.current;
      if (el) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: "smooth",
        });
      }
    });
  };

  function base64EncodeUnicode(str: string): string {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(Number("0x" + p1))
      )
    );
  }

  function buildGuestPayload(guest: Guest, settings: InvitationSettings) {
    return {
      bride: settings.brideName,
      groom: settings.groomName,
      date: settings.dateRaw || "",
      time: settings.time,
      location: settings.locationText,
      mapsUrl: settings.mapsUrl,
      guestName: guest.name,

      // Tasarım & tema
      sectionCardBackground:
        settings.locationBackground || settings.sectionCardBackground,
      sectionCardBorderColor: settings.sectionCardBorderColor,
      footerBackground: settings.footerBackground,
      backgroundColor: settings.backgroundColor,
      backgroundOverlayOpacity: settings.backgroundOverlayOpacity,

      fontFamily: settings.fontFamily,
      heroSubtitle: settings.heroSubtitle,
      heroSubtitleColor: settings.heroSubtitleColor,
      heroNamesColor: settings.heroNamesColor,
      ampersandColor: settings.ampersandColor,
      dividerColor: settings.dividerColor,

      // Bağış bölümü
      donationBackground: settings.donationBackground,
      showDonationSection: settings.showDonationSection,
      donationText: settings.donationText,
      donationImageUrl: settings.donationImageUrl,

      // Konum kartı & görsel
      locationBackground: settings.locationBackground,
      locationImageUrl: settings.locationImageUrl,

      // Aile bilgileri
      showFamilySection: settings.showFamilySection,
      family1Mother: settings.family1Mother,
      family1Father: settings.family1Father,
      family1Surname: settings.family1Surname,
      family2Mother: settings.family2Mother,
      family2Father: settings.family2Father,
      family2Surname: settings.family2Surname,
    };
  }

  const handleGuestFieldChange = (
    id: string,
    field: keyof Guest,
    value: string
  ) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        // name değişince slug’ı da güncelle
        if (field === "name") {
          const slug = slugifyName(value || g.name || "");
          return { ...g, name: value, slug };
        }
        return { ...g, [field]: value };
      })
    );
  };
  const handleRemoveGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  function base64DecodeUnicode(str: string): string {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  }

  const handleDownloadCsvExample = () => {
    const sample = [
      "name",
      "Murat Yıldırım",
      "Ayşe Demir",
    ].join("\n");

    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "davetli_ornek.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLocationImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setSettings((prev) => ({
          ...prev,
          locationImageUrl: result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // localStorage'dan oku
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedSettings = window.localStorage.getItem("invitationSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings) as Partial<InvitationSettings>;
        const dateRaw = parsed.dateRaw ?? "";
        const eventDate = dateRaw ? new Date(dateRaw + "T00:00:00") : null;
        setSettings((prev) => ({
          ...prev,
          ...parsed,
          backgroundOverlayOpacity:
            parsed.backgroundOverlayOpacity ?? prev.backgroundOverlayOpacity,
          dateRaw,
          eventDate,
        }));
      } catch {
        // ignore
      }
    }

    const savedGuests = window.localStorage.getItem("invitationGuests");
    if (savedGuests) {
      try {
        const parsedGuests = JSON.parse(savedGuests) as Guest[];
        setGuests(parsedGuests);
      } catch {
        // ignore
      }
    }

    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settings.dateRaw) {
      setDateDay("");
      setDateMonth("");
      setDateYear("");
      return;
    }
    const [y = "", m = "", d = ""] = settings.dateRaw.split("-");
    setDateYear(y);
    setDateMonth(m);
    setDateDay(d);
  }, [settings.dateRaw]);

  // davetlileri yaz
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("invitationGuests", JSON.stringify(guests));
  }, [guests]);

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

  // maps.app.goo.gl kısa linkini otomatik embed URL'sine çevir
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = settings.mapsUrl?.trim();
    if (!url) return;

    // Sadece kısa link ise dene
    if (!url.startsWith("https://maps.app.goo.gl/")) return;

    // Aynı URL'yi tekrar tekrar çözmeye çalışma
    let cancelled = false;

    (async () => {
      try {
        const encoded = encodeURIComponent(url);
        const res = await fetch(`/api/resolve-map?url=${encoded}`);
        if (!res.ok) {
          console.warn("resolve-map error", await res.json());
          return;
        }
        const data = await res.json();
        const finalUrl = data.finalUrl as string;

        if (!finalUrl || cancelled) return;

        // Artık gerçek Google Maps URL'siyle güncelle
        setSettings((prev) => ({
          ...prev,
          mapsUrl: finalUrl,
        }));
      } catch (e) {
        console.error("resolve-map fetch failed", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [settings.mapsUrl]);

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

        parsedGuests.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name,
          slug,
          email,
          phone,
          source: "csv",
        });
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

  const overlayColor = hexToRgba(
    settings.backgroundColor,
    settings.backgroundOverlayOpacity
  );
  const handleDatePartChange = (
    part: "day" | "month" | "year",
    value: string
  ) => {
    const nextDay = part === "day" ? value : dateDay;
    const nextMonth = part === "month" ? value : dateMonth;
    const nextYear = part === "year" ? value : dateYear;

    setDateDay(nextDay);
    setDateMonth(nextMonth);
    setDateYear(nextYear);

    if (nextYear && nextMonth && nextDay) {
      const raw = `${nextYear.padStart(4, "0")}-${nextMonth.padStart(
        2,
        "0"
      )}-${nextDay.padStart(2, "0")}`;
      handleChange("dateRaw", raw);
    } else {
      // Henüz tam tarih seçilmediyse, sadece eventDate'i null yap
      handleChange("dateRaw", "");
    }
  };

  return (
    <div
      className="relative min-h-screen text-slate-900"
      style={{ background: overlayColor }}
    >
      {!isEditorOpen && (
        <button
          onClick={() => setIsEditorOpen(true)}
          className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/30 text-[0.7rem] font-medium text-white shadow-lg hover:bg-white/20 hover:border-white/60 transition"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[0.6rem]">
            ☰
          </span>
          Düzenle
        </button>
      )}

      {/* Editör paneli */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 text-slate-50 border-l border-slate-800 z-40 transform transition-transform duration-300 ease-in-out ${
          isEditorOpen ? "translate-x-0" : "translate-x-full"
        } editor-font`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h1 className="text-sm font-semibold">Davetiye Editörü</h1>
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <span className="text-[0.65rem] text-slate-400">
                Kaydediliyor…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[0.65rem] text-emerald-300 border border-emerald-500/40">
                ● Kaydedildi
              </span>
            )}
            <button
              onClick={() => setIsEditorOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 text-[0.7rem]">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id as any)}
              className={[
                "px-2.5 py-1 rounded-full border transition",
                activeStep === step.id
                  ? "bg-slate-100 text-slate-900 border-slate-100"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800",
              ].join(" ")}
            >
              {step.id}. {step.label}
            </button>
          ))}
        </div>
        <div className="h-[calc(100%-80px)] overflow-y-auto px-4 pb-6 pt-3">
          {activeStep === 1 && (
            <>
              <SectionTitle label="Davetiye Başlığı" />
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <input
                    value={settings.heroSubtitle}
                    onChange={(e) =>
                      handleChange("heroSubtitle", e.target.value)
                    }
                    className="flex-1 px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const options = HERO_SUBTITLE_OPTIONS.filter(
                        (o) => o !== settings.heroSubtitle
                      );
                      const pool =
                        options.length > 0 ? options : HERO_SUBTITLE_OPTIONS;
                      const next =
                        pool[Math.floor(Math.random() * pool.length)];
                      setSettings((prev) => ({
                        ...prev,
                        heroSubtitle: next,
                      }));
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-xs"
                    title="Rastgele başlık"
                  >
                    🎲
                  </button>
                </div>
              </div>

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
            </>
          )}

          {activeStep === 2 && (
            <>
              <SectionTitle label="Tarih & Konum" />
              <div className="mb-3">
                <label className="block mb-1 text-xs font-medium text-slate-300">
                  Tarih
                </label>

                <div className="flex gap-2">
                  {/* Gün */}
                  <select
                    value={dateDay}
                    onChange={(e) =>
                      handleDatePartChange("day", e.target.value)
                    }
                    className="flex-1 px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                  >
                    <option value="">Gün</option>
                    {Array.from({ length: 31 }, (_, i) => {
                      const d = String(i + 1).padStart(2, "0");
                      return (
                        <option key={d} value={d}>
                          {i + 1}
                        </option>
                      );
                    })}
                  </select>

                  {/* Ay */}
                  <select
                    value={dateMonth}
                    onChange={(e) =>
                      handleDatePartChange("month", e.target.value)
                    }
                    className="flex-1 px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                  >
                    <option value="">Ay</option>
                    {[
                      "01|Ocak",
                      "02|Şubat",
                      "03|Mart",
                      "04|Nisan",
                      "05|Mayıs",
                      "06|Haziran",
                      "07|Temmuz",
                      "08|Ağustos",
                      "09|Eylül",
                      "10|Ekim",
                      "11|Kasım",
                      "12|Aralık",
                    ].map((m) => {
                      const [val, label] = m.split("|");
                      return (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      );
                    })}
                  </select>

                  {/* Yıl */}
                  <select
                    value={dateYear}
                    onChange={(e) =>
                      handleDatePartChange("year", e.target.value)
                    }
                    className="flex-1 px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                  >
                    <option value="">Yıl</option>
                    {Array.from({ length: 6 }, (_, i) => {
                      const y = 2024 + i;
                      return (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <p className="mt-1 text-[0.7rem] text-slate-400">
                  {datePreviewText ?? "Gün / ay / yıl seçin"}
                </p>
              </div>

              <TextField
                label="Saat"
                value={settings.time}
                onChange={(v) => handleChange("time", v)}
              />
              <SectionTitle label="Etkinlik Mekanı Görseli" />
              <div className="mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center px-3 py-1.5 rounded-md bg-sky-600 text-white text-[0.7rem] font-medium hover:bg-sky-500 cursor-pointer">
                    Dosya Seç
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleLocationImageUpload(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {settings.locationImageUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          locationImageUrl: "",
                        }))
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600/80 text-white hover:bg-red-500 text-xs"
                      title="Görseli kaldır"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>

              <TextAreaField
                label="Adres"
                value={settings.locationText}
                onChange={(v) => handleChange("locationText", v)}
              />

              <TextField
                label="Harita Linki (Google Maps’ten
                  “Haritayı yerleştir” kodunu kullanın)"
                value={settings.mapsUrl}
                placeholder='<iframe src="https://www.google.com/maps/embed'
                onChange={(v) => handleChange("mapsUrl", v)}
              />
            </>
          )}

          {activeStep === 3 && (
            <>
              <SectionTitle label="Yazı Tipi" />
              <div className="mb-3 text-xs text-slate-300">
                <select
                  value={settings.fontFamily}
                  onChange={(e) =>
                    handleChange("fontFamily", e.target.value as FontFamily)
                  }
                  className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-xs"
                >
                  <option value="great-vibes">Great Vibes</option>
                  <option value="cormorant">Cormorant Garamond</option>
                  <option value="pacifico">Pacifico</option>
                  <option value="sofia">Sofia</option>
                  <option value="cookie">Cookie</option>
                  <option value="dancing-script">Dancing Script</option>
                  <option value="parisienne">Parisienne</option>
                  <option value="playfair">Playfair Display</option>
                </select>
                <p className="mt-1 text-[0.65rem] text-slate-400">
                  Başlık ve davet metninde kullanılacak yazı tipi.
                </p>
              </div>

              <SectionTitle label="Genel Arka Plan" />

              <div className="mb-3 text-xs text-slate-300">
                <p className="text-[0.7rem] text-slate-400 mb-2">
                  Arka plan rengini ve opaklığını buradan ayarlayabilirsiniz.
                </p>

                <ColorField
                  label="Arka Plan Rengi"
                  value={settings.backgroundColor}
                  onChange={(v) =>
                    setSettings((prev) => ({ ...prev, backgroundColor: v }))
                  }
                />

                <label className="block mt-2 mb-1 text-xs font-medium text-slate-300">
                  Opaklık (%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={Math.round(settings.backgroundOverlayOpacity * 100)}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      backgroundOverlayOpacity: Number(e.target.value) / 100,
                    }))
                  }
                  className="w-full"
                />
              </div>

              <SectionTitle label="Renkler" />
              <div className="mb-3 text-xs text-slate-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[0.7rem] text-slate-400 max-w-xs">
                    Bütün renkleri buradan değiştirebilirsiniz. Tasarım
                    bozulursa her zaman sıfırlayabilirsiniz.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        backgroundColor: "#000000",
                        backgroundOverlayOpacity: 0.6,
                        heroSubtitleColor: "#ffffff",
                        heroNamesColor: "#ffffff",
                        ampersandColor: "#ffffff",
                        dividerColor: "rgba(255,255,255,0.5)",
                        backgroundBaseColor: "#111111",
                        headingColor: "#ffffff",
                        personNameColor: "#ffffff",
                        familyRowColor: "#ffffff",
                        parentRowColor: "#ffffff",
                        photoBorderColor: "#ffffff",
                        lowerMessageColor: "#ffffff",
                        lowerCoupleNameColor: "#ffffff",
                        sectionCardBackground: "rgba(0,0,0,0.58)",
                        sectionCardBorderColor: "rgba(255,255,255,0.15)",
                        donationBackground: "rgba(0,0,0,0.58)",
                        locationBackground: "rgba(0,0,0,0.58)",
                        footerBackground: "rgba(0,0,0,0.58)",
                      }))
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-300 bg-slate-100 text-[0.75rem] font-medium text-slate-900 hover:bg-white hover:border-slate-400 transition"
                  >
                    ↺ Sıfırla
                  </button>
                </div>

                {/* 2 sütun 4 satır grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
                  <ColorField
                    label="Davetiye Metni"
                    value={settings.heroSubtitleColor}
                    onChange={(v) => handleChange("heroSubtitleColor", v)}
                  />

                  <ColorField
                    label="Gelin / Damat"
                    value={settings.heroNamesColor}
                    onChange={(v) => handleChange("heroNamesColor", v)}
                  />

                  <ColorField
                    label="Çizgiler"
                    value={settings.dividerColor}
                    onChange={(v) => handleChange("dividerColor", v)}
                  />
                  <ColorField
                    label="& İşareti"
                    value={settings.ampersandColor}
                    onChange={(v) => handleChange("ampersandColor", v)}
                  />
                  <ColorField
                    label="Aile Satırı"
                    value={settings.familyRowColor}
                    onChange={(v) => handleChange("familyRowColor", v)}
                  />
                  <ColorField
                    label="Ebeveyn Satırı Rengi"
                    value={settings.parentRowColor}
                    onChange={(v) => handleChange("parentRowColor", v)}
                  />

                  <ColorField
                    label="Alt Mesaj Rengi"
                    value={settings.lowerMessageColor}
                    onChange={(v) => handleChange("lowerMessageColor", v)}
                  />
                  <ColorField
                    label="Alt Çift İsmi Rengi"
                    value={settings.lowerCoupleNameColor}
                    onChange={(v) => handleChange("lowerCoupleNameColor", v)}
                  />
                  <ColorField
                    label="Bağış Bölümü Arka Planı"
                    value={settings.donationBackground}
                    onChange={(v) => handleChange("donationBackground", v)}
                  />
                  <ColorField
                    label="Konum Bölümü Arka Planı"
                    value={settings.locationBackground}
                    onChange={(v) => handleChange("locationBackground", v)}
                  />
                  <ColorField
                    label="Footer Arka Planı"
                    value={settings.footerBackground}
                    onChange={(v) => handleChange("footerBackground", v)}
                  />
                </div>
              </div>
            </>
          )}

          {activeStep === 4 && (
            <>
              <SectionTitle label="Aile Bilgileri" />

              <div className="mb-3 text-xs text-slate-300">
                <label className="inline-flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={settings.showFamilySection}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        showFamilySection: e.target.checked,
                      }))
                    }
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950/60"
                  />
                  <span className="text-[0.8rem]">
                    Aile bilgileri bölümünü davetiyede göster
                  </span>
                </label>
              </div>
              {/* Tab başlıkları */}
              {settings.showFamilySection && (
                <div className="inline-flex mb-3 rounded-full bg-slate-800/70 p-0.5 text-[0.7rem]">
                  <button
                    type="button"
                    onClick={() => setFamilyTab("family1")}
                    className={`px-3 py-1.5 rounded-full transition ${
                      familyTab === "family1"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Birinci Aile
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyTab("family2")}
                    className={`px-3 py-1.5 rounded-full transition ${
                      familyTab === "family2"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    İkinci Aile
                  </button>
                </div>
              )}

              {familyTab === "family1" && settings.showFamilySection && (
                <div className="mb-3">
                  <TextField
                    label="Birinci Aile - Anne Adı"
                    value={settings.family1Mother}
                    onChange={(v) => handleChange("family1Mother", v)}
                  />
                  <TextField
                    label="Birinci Aile - Baba Adı"
                    value={settings.family1Father}
                    onChange={(v) => handleChange("family1Father", v)}
                  />
                  <TextField
                    label="Birinci Aile - Soyadı"
                    value={settings.family1Surname}
                    onChange={(v) => handleChange("family1Surname", v)}
                  />
                </div>
              )}
              {familyTab === "family2" && settings.showFamilySection && (
                <div className="mb-3">
                  <TextField
                    label="İkinci Aile - Anne Adı"
                    value={settings.family2Mother}
                    onChange={(v) => handleChange("family2Mother", v)}
                  />
                  <TextField
                    label="İkinci Aile - Baba Adı"
                    value={settings.family2Father}
                    onChange={(v) => handleChange("family2Father", v)}
                  />
                  <TextField
                    label="İkinci Aile - Soyadı"
                    value={settings.family2Surname}
                    onChange={(v) => handleChange("family2Surname", v)}
                  />
                </div>
              )}
              <SectionTitle label="Bağış Bölümü" />

              <div className="mb-3 text-xs text-slate-300">
                <label className="inline-flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={settings.showDonationSection}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        showDonationSection: e.target.checked,
                      }))
                    }
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950/60"
                  />
                  <span className="text-[0.8rem]">
                    Bağış / vakıf bölümünü davetiyede göster
                  </span>
                </label>

                {settings.showDonationSection && (
                  <>
                    <div className="mb-3">
                      <label className="block mb-1 text-xs font-medium text-slate-300">
                        Vakıf Seçimi
                      </label>
                      <select
                        value={settings.donationOrganization}
                        onChange={(e) =>
                          handleChange(
                            "donationOrganization",
                            e.target
                              .value as InvitationSettings["donationOrganization"]
                          )
                        }
                        className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-xs"
                      >
                        <option value="tema">TEMA Vakfı</option>
                        <option value="cydd">
                          Çağdaş Yaşamı Destekleme Derneği
                        </option>
                        <option value="kiz-cocuklari">
                          Kız Çocuklarını Okutma Burs Fonu
                        </option>
                        <option value="losev">LÖSEV</option>
                        <option value="custom">Diğer / Özel</option>
                      </select>
                    </div>

                    <TextAreaField
                      label="Bağış / Not Metni"
                      value={settings.donationText}
                      onChange={(v) => handleChange("donationText", v)}
                      placeholder="Örn: Sizin adınıza TEMA Vakfı'na bir fidan bağışında bulunduk."
                      helperText="Bu metin davetiyede bağış bölümünde görünecek."
                    />

                    <div className="mt-2">
                      <label className="block mb-1 text-xs font-medium text-slate-300">
                        Bağış Sertifikası / Görsel
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center px-3 py-1.5 rounded-md bg-sky-600 text-white text-[0.7rem] font-medium hover:bg-sky-500 cursor-pointer">
                          Dosya Seç
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const result = ev.target?.result;
                                  if (typeof result === "string") {
                                    setSettings((prev) => ({
                                      ...prev,
                                      donationImageUrl: result,
                                    }));
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {settings.donationImageUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setSettings((prev) => ({
                                ...prev,
                                donationImageUrl: "",
                              }))
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600/80 text-white hover:bg-red-500 text-xs"
                            title="Görseli kaldır"
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {activeStep === 5 && (
            <>
              <SectionTitle label="Davetli Listesi & Linkler" />
              <div className="mb-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {/* Örnek CSV indir + Dosya Yükle butonları */}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddManualGuest}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-[0.7rem] font-medium hover:bg-emerald-500"
                      >
                        +1 Davetli Ekle
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          for (let i = 0; i < 10; i++) {
                            handleAddManualGuest();
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-700 text-white text-[0.7rem] font-medium hover:bg-emerald-600"
                      >
                        +10 Davetli Ekle
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          for (let i = 0; i < 50; i++) {
                            handleAddManualGuest();
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-700 text-white text-[0.7rem] font-medium hover:bg-emerald-600"
                      >
                        +50 Davetli Ekle
                      </button>
                    </div>
                  </div>
                </div>

                {csvError && (
                  <p className="mt-1 text-[0.7rem] text-red-400">{csvError}</p>
                )}

                {guests.length > 0 ? (
                  <div className="mt-2 border border-slate-700/80 rounded-xl overflow-hidden">
                    <div ref={tableRef} className="max-h-64 overflow-y-auto">
                      <table className="w-full text-[0.75rem] text-slate-100">
                        <thead className="bg-slate-900/80 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">
                              Davetli bilgisi
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                              Link
                            </th>
                            <th className="px-3 py-2 text-center font-medium">
                              Kopyala
                            </th>
                            <th className="px-3 py-2 text-center font-medium">
                              Sil
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {guests.map((guest) => {
                            const tempSlug =
                              guest.slug && guest.slug.length > 0
                                ? guest.slug
                                : slugifyName(guest.name || "davetli");

                            const tempPayload = buildGuestPayload(
                              guest,
                              settings
                            );
                            const tempEncoded = encodeURIComponent(
                              base64EncodeUnicode(JSON.stringify(tempPayload))
                            );
                            const tempHref =
                              origin.length > 0
                                ? `${origin}/invite/${tempSlug}?d=${tempEncoded}`
                                : `/invite/${tempSlug}?d=${tempEncoded}`;

                            const isCopied = !!guest.lastCopiedAt;

                            return (
                              <tr
                                key={guest.id}
                                className={
                                  "border-t border-slate-800/80 " +
                                  (isCopied
                                    ? "bg-emerald-500/10"
                                    : "bg-slate-900/40")
                                }
                              >
                                <td className="px-3 py-1.5 align-middle">
                                  <input
                                    value={guest.name}
                                    onChange={(e) =>
                                      handleGuestFieldChange(
                                        guest.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ayşe Ve Alp KAYA Ailesi"
                                    className="w-full px-2 py-1 rounded-md bg-slate-950/60 border border-slate-700 text-[0.7rem] focus:outline-none focus:ring-1 focus:ring-sky-500/60"
                                  />
                                </td>
                                <td className="px-3 py-1.5 align-middle max-w-[120px]">
                                  <a
                                    href={tempHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-amber-200 hover:text-amber-100 hover:underline break-all"
                                  >
                                    {origin.length > 0
                                      ? `${origin}/invite/${tempSlug}`
                                      : `/invite/${tempSlug}`}
                                  </a>
                                </td>

                                <td className="px-3 py-1.5 text-center align-middle">
                                  <button
                                    type="button"
                                    onClick={() => handleCopyGuestLink(guest)}
                                    className={
                                      "inline-flex items-center justify-center w-7 h-7 rounded-full border text-[0.7rem] " +
                                      (isCopied
                                        ? "bg-emerald-500/80 border-emerald-300 text-slate-900 hover:bg-emerald-400"
                                        : "bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700")
                                    }
                                    title={
                                      isCopied
                                        ? "Kopyalandı"
                                        : "Linki panoya kopyala"
                                    }
                                  >
                                    {isCopied ? "✓" : "⧉"}
                                  </button>
                                </td>
                                <td className="px-3 py-1.5 text-center align-middle">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGuest(guest.id)}
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-600/80 text-white text-[0.7rem] hover:bg-red-500"
                                    title="Satırı sil"
                                  >
                                    🗑
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="px-3 py-2 border-t border-slate-800/80 text-[0.7rem] text-slate-300 flex items-center justify-between">
                      <span>
                        Toplam{" "}
                        <span className="text-slate-50 font-medium">
                          {guests.length}
                        </span>{" "}
                        davetli.
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-[0.75rem] text-slate-400">
                    Henüz davetli eklenmedi. CSV yükleyebilir veya yukarıdan “+
                    Davetli Ekle” butonuyla yeni satırlar oluşturabilirsiniz.
                  </p>
                )}
                <SectionTitle label="Excel ile Davetli Listesi Hazırla" />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadCsvExample}
                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-sky-600 text-white text-[0.7rem] font-medium hover:bg-sky-500"
                  >
                    Örnek Excel Dosyası İndir
                  </button>

                  <label className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-700 text-white text-[0.7rem] font-medium hover:bg-slate-600 cursor-pointer">
                    Hazırlanan Dosyayı Yükle
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleCsvUpload(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-[calc(100%-44px)] overflow-y-auto px-4 pb-6 pt-3">
          {/* Üst başlık + random zar */}

          <SpeedInsights />
        </div>
      </div>

      {/* Orta kısım: Davetiye + Davetli Linkleri */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <InvitationPreview
          settings={settings}
          countdown={countdown}
          overlayColor={overlayColor}
        />
      </div>
    </div>
  );
}

/* ---- Küçük bileşenler ---- */

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="mt-6 mb-3">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-600/80">
          <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-slate-200 uppercase">
            {label}
          </span>
        </div>
        <div className="h-px flex-1 bg-slate-700/80" />
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
}: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-300">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
      />
      {helperText && (
        <p className="mt-1 text-[0.65rem] text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
}: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-300">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs resize-y placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
      />
      {helperText && (
        <p className="mt-1 text-[0.65rem] text-slate-400">{helperText}</p>
      )}
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

/* ---- Davetiye önizleme ---- */

function InvitationPreview({
  settings,
  countdown,
  overlayColor,
}: {
  settings: InvitationSettings;
  countdown: Countdown;
  overlayColor: string;
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
    heroSubtitle,
    primaryTextColor, // istersen sonra kaldır
    family1Mother,
    family1Father,
    family1Surname,
    family2Mother,
    family2Father,
    family2Surname,
    locationImageUrl,
    buttonBackground,
    buttonTextColor,
    backgroundBaseColor,
    headingColor,
    personNameColor,
    familyRowColor,
    parentRowColor,
    photoBorderColor,
    lowerMessageColor,
    lowerCoupleNameColor,
    heroSubtitleColor,
    heroNamesColor,
    ampersandColor,
    dividerColor,
    sectionCardBackground,
    sectionCardBorderColor,
    donationBackground,
    locationBackground,
    footerBackground,
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

  const weddingDateForHero = dateText;
  const countdownFinished = countdown.finished;

  const { embedSrc: embedUrl, buttonHref } = parseMapInput(mapsUrl);

  const hasFamily1 = family1Mother || family1Father;
  const hasFamily2 = family2Mother || family2Father;
  const fontClassMap: Record<FontFamily, string> = {
    "great-vibes": "font-great-vibes",
    cormorant: "font-cormorant",
    pacifico: "font-pacifico",
    sofia: "font-sofia",
    cookie: "font-cookie",
    "dancing-script": "font-dancing-script",
    parisienne: "font-parisienne",
    playfair: "font-playfair",
  };

  const currentFontClass = fontClassMap[settings.fontFamily] ?? "";

  return (
    <div className={`page-overlay invitation-root ${currentFontClass}`}>
      {/* Arka plan video */}
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/bg.webm" type="video/webm" />
        Tarayıcınız video desteklemiyor.
      </video>

      {/* Hero */}
      <header className="hero" id="top">
        <div className="hero-inner" style={{ backgroundColor: "transparent" }}>
          <p className="hero-subtitle" style={{ color: heroSubtitleColor }}>
            {heroSubtitle}
          </p>

          <h1 className="hero-title" style={{ color: heroNamesColor }}>
            <span className="hero-line">{brideName}</span>
            <span
              className="hero-ampersand"
              style={{ color: ampersandColor || heroNamesColor }}
            >
              &amp;
            </span>
            <span className="hero-line">{groomName}</span>
          </h1>
          <div className="fancy-divider">
            <span
              className="fancy-divider-line"
              style={{ backgroundColor: dividerColor }}
            />
            <span
              className="fancy-divider-icon"
              style={{ color: dividerColor }}
            >
              ✦
            </span>
            <span
              className="fancy-divider-line"
              style={{ backgroundColor: dividerColor }}
            />
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
        {/* Bağış / Vakıf Bölümü */}
        {settings.showDonationSection && (
          <section className="section">
            <div
              className="section-inner"
              style={{
                maxWidth: 640,
                margin: "0 auto",
                textAlign: "center",
                background: donationBackground,
                borderRadius: 18,
                border: `1px solid ${sectionCardBorderColor}`,
                padding: "2rem 2rem",
              }}
            >
              <p className="invite-label">Bağış</p>
              <p
                className="invite-text donation-text"
                style={{ marginBottom: "0.75rem" }}
              >
                {donationText}
              </p>

              <button
                type="button"
                className="donation-toggle"
                onClick={() => setOpenDonation((prev) => !prev)}
                style={{
                  background: "none",
                  color: primaryTextColor,
                }}
              >
                Sertifikayı Göster
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
                  src={settings.donationImageUrl || "/fidan_ga_wm.jpg"}
                  alt="Bağış sertifikası"
                  className="donation-image"
                />
              </div>
            </div>
          </section>
        )}

        {/* Ailelerimiz - ayrı UI bölümü */}
        {(hasFamily1 || hasFamily2) && settings.showFamilySection && (
          <section className="section">
            <div className="section-inner" style={{ textAlign: "center" }}>
              <h2>Ailelerimiz</h2>
              <p className="section-subtitle">
                Bu mutlu günümüzde bizimle olan ailelerimiz
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  justifyContent: "center",
                }}
              >
                {hasFamily1 && (
                  <div
                    style={{
                      minWidth: "220px",
                      padding: "1.2rem 1rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Great Vibes, cursive",
                        fontSize: "1.5rem",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {family1Surname} Ailesi
                    </p>
                    <p
                      className="invite-text"
                      style={{ marginBottom: "0.15rem", color: familyRowColor }}
                    >
                      {family1Mother}
                    </p>
                    <p
                      className="invite-text"
                      style={{ color: parentRowColor }}
                    >
                      {family1Father}
                    </p>
                  </div>
                )}

                {hasFamily2 && (
                  <div
                    style={{
                      minWidth: "220px",
                      padding: "1.2rem 1rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Great Vibes, cursive",
                        fontSize: "1.5rem",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {family2Surname} Ailesi
                    </p>
                    <p
                      className="invite-text"
                      style={{ marginBottom: "0.15rem" }}
                    >
                      {family2Mother}
                    </p>
                    <p className="invite-text">{family2Father}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Geri Sayım */}
        <section className="section" id="countdown">
          <div className="section-inner">
            <h2>Geri Sayım</h2>
            <p className="section-subtitle">Hayatımızın en özel günü için</p>

            <div className="countdown-grid">
              <div className="countdown-item">
                <span
                  id="days"
                  className="count-number"
                  style={{
                    fontFamily:
                      'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  {countdown.days}
                </span>
                <span
                  className="count-label"
                  style={{
                    fontFamily:
                      'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  Gün
                </span>
              </div>
              <div className="countdown-item">
                <span
                  id="hours"
                  className="count-number"
                  style={{
                    fontFamily:
                      'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  {countdown.hours.toString().padStart(2, "0")}
                </span>
                <span
                  className="count-label"
                  style={{
                    fontFamily:
                      'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  Saat
                </span>
              </div>
              <div className="countdown-item">
                <span
                  id="minutes"
                  className="count-number"
                  style={{
                    fontFamily:
                      'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  {countdown.minutes.toString().padStart(2, "0")}
                </span>
                <span
                  className="count-label"
                  style={{
                    fontFamily:
                      'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  Dakika
                </span>
              </div>
              <div className="countdown-item">
                <span
                  id="seconds"
                  className="count-number"
                  style={{
                    fontFamily:
                      'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  {countdown.seconds.toString().padStart(2, "0")}
                </span>
                <span
                  className="count-label"
                  style={{
                    fontFamily:
                      'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  Saniye
                </span>
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
          <div
            className="section-inner location-card"
            style={{
              background: locationBackground,
              borderRadius: 18,
              border: `1px solid ${sectionCardBorderColor}`,
            }}
          >
            <div className="location-header">
              <h3 className="location-title">Konum</h3>
            </div>

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
              <div
                className="location-image-wrapper"
                style={{ borderColor: photoBorderColor }}
              >
                <img
                  src={locationImageUrl || "/vedat-dalokay-nikah-salonu.png"}
                  alt="Etkinlik mekanı"
                  className="location-image"
                />
                <div className="location-image-overlay"></div>
              </div>

              {embedUrl !== "about:blank" && (
                <div className="location-map-wrapper">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="220"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mekan Haritası"
                    className="location-map"
                  ></iframe>
                </div>
              )}
            </div>

            <div className="location-actions">
              <a
                href={buttonHref || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="location-button"
                style={{
                  fontFamily:
                    'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                Haritada Aç
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="footer"
          style={{
            background: footerBackground,
            borderTop: `1px solid ${sectionCardBorderColor}`,
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
          }}
        >
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

          <p className="footer-names" style={{ color: lowerCoupleNameColor }}>
            {brideName} &amp; {groomName}
          </p>
          <p className="footer-date" style={{ color: lowerMessageColor }}>
            {weddingDateForHero}
          </p>
          <p
            className="footer-date footer-credit"
            style={{ color: lowerMessageColor }}
          >
            Sevgiyle hazırlandı
          </p>
        </footer>
      </main>
    </div>
  );
}

/* ---- Guest linkleri ---- */

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

  const baseUrl = origin || "";

  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-2xl border text-xs text-slate-50"
      style={{
        background: "rgba(0,0,0,0.4)",
        borderColor: "rgba(255,255,255,0.18)",
      }}
    >
      <div className="px-4 pt-3 pb-2 border-b border-white/10">
        <p className="text-[0.75rem] tracking-[0.16em] uppercase text-slate-200">
          Davetli Linkleri
        </p>
      </div>

      <div className="max-h-40 overflow-y-auto divide-y divide-white/10 px-4 py-2">
        {guests.map((guest) => {
          // Linkte gönderilecek minimal payload
          const payload = {
            bride: settings.brideName,
            groom: settings.groomName,
            date: settings.dateRaw || "",
            time: settings.time,
            location: settings.locationText,
            mapsUrl: settings.mapsUrl,
            guestName: guest.name,
            sectionCardBackground:
              settings.locationBackground || settings.sectionCardBackground,
            sectionCardBorderColor: settings.sectionCardBorderColor,
            footerBackground: settings.footerBackground,
            backgroundColor: settings.backgroundColor,
            backgroundOverlayOpacity: settings.backgroundOverlayOpacity,
            fontFamily: settings.fontFamily,
            heroSubtitle: settings.heroSubtitle,
            heroSubtitleColor: settings.heroSubtitleColor,
            heroNamesColor: settings.heroNamesColor,
            ampersandColor: settings.ampersandColor,
            dividerColor: settings.dividerColor,
            donationBackground: settings.donationBackground,
            showDonationSection: settings.showDonationSection,
            donationText: settings.donationText,
            donationImageUrl: settings.donationImageUrl,
            locationBackground: settings.locationBackground,
            locationImageUrl: settings.locationImageUrl,
          };

          // JSON -> base64 (UTF‑8 safe) -> URL encode
          const encoded = encodeURIComponent(
            base64EncodeUnicode(JSON.stringify(payload))
          );

          const href =
            baseUrl.length > 0
              ? `${baseUrl}/invite/${guest.slug}?d=${encoded}`
              : `/invite/${guest.slug}?d=${encoded}`;

          const displayText =
            (baseUrl.length > 0 ? `${baseUrl}` : "") + `/invite/${guest.slug}`;

          return (
            <div
              key={guest.slug}
              className="flex items-center justify-between gap-3 py-1.5"
            >
              <div className="flex flex-col">
                <span className="text-slate-50 font-medium">{guest.name}</span>
              </div>
              <a
                href={href}
                className="text-[0.7rem] text-amber-200 hover:text-amber-100 hover:underline break-all"
                target="_blank"
                rel="noreferrer"
              >
                {displayText}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
