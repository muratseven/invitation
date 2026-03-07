// app/page.tsx

"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import React, { useEffect, useState } from "react";
import { parseMapInput } from "./lib/mapUtils"; // relative path’i dosya yapına göre düzelt
import Link from "next/link";
import dynamic from "next/dynamic";
const API_BASE =
  process.env.NEXT_PUBLIC_API ?? "http://localhost:8888/backend/api";

const MapPicker = dynamic(
  () => import("./components/MapPicker").then((m) => m.MapPicker),
  { ssr: false }
);

type LicenseInfo = {
  token: string | null;
  maxGuests: number;
  usedGuests: number;
  eventId: number | null;
  valid: boolean;
};

const DEFAULT_LICENSE: LicenseInfo = {
  token: null,
  maxGuests: 0,
  usedGuests: 0,
  eventId: null,
  valid: false,
};

type FontFamily =
  | "great-vibes"
  | "cormorant"
  | "pacifico"
  | "sofia"
  | "cookie"
  | "dancing-script"
  | "parisienne"
  | "lugrasimo"
  | "italianno"
  | "charm"
  | "playfair";

export type InvitationSettings = {
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

  backgroundColor: string;
  backgroundOverlayOpacity: number;

  primaryTextColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  guestName?: string;
  fontFamily: FontFamily;

  // ↓↓↓ YENİ EKLE
  heroTitleSize: string;
  heroSubtitleSize: string;
  // ↑↑↑

  family1Mother: string;
  family1Father: string;
  family1Surname: string;
  family2Mother: string;
  family2Father: string;
  family2Surname: string;

  donationBackground: string;
  locationBackground: string;
  footerBackground: string;

  backgroundBaseColor: string;
  headingColor: string;
  personNameColor: string;
  familyRowColor: string;
  parentRowColor: string;
  photoBorderColor: string;
  lowerMessageColor: string;
  lowerCoupleNameColor: string;
  sectionCardBackground: string;
  sectionCardBorderColor: string;
  heroSubtitleColor: string;
  heroNamesColor: string;
  ampersandColor: string;
  dividerColor: string;
  mapLat?: number | null;
  mapLng?: number | null;
  showScheduleSection?: boolean;
  scheduleItems?: { time: string; title: string; description: string }[];
};

export const DEFAULT_SETTINGS: InvitationSettings = {
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
  guestName: undefined,
  backgroundColor: "#000000",
  backgroundOverlayOpacity: 0.6,

  primaryTextColor: "#ffffff",
  buttonBackground: "#d9e2c0",
  buttonTextColor: "#1f2620",

  fontFamily: "pacifico",

  // yeni alanlar – istersen pacifico temasındaki değerlerle eşleştirdim
  heroTitleSize: "clamp(1.4rem, 2.4vw, 3.2rem)",
  heroSubtitleSize: "0.8rem",

  family1Mother: "",
  family1Father: "",
  family1Surname: "",
  family2Mother: "",
  family2Father: "",
  family2Surname: "",

  backgroundBaseColor: "#111111",
  headingColor: "#ffffff",
  personNameColor: "#ffffff",
  familyRowColor: "#ffffff",
  parentRowColor: "#ffffff",
  photoBorderColor: "#ffffff",
  lowerMessageColor: "#ffffff",
  lowerCoupleNameColor: "#ffffff",
  sectionCardBackground: "rgba(0,0,0,0.58)",
  sectionCardBorderColor: "rgba(255,255,255,0.18)",
  heroSubtitleColor: "#ffffff",
  heroNamesColor: "#ffffff",
  ampersandColor: "#ffffff",
  dividerColor: "rgba(255,255,255,0.5)",
  donationBackground: "rgba(0,0,0,0.58)",
  locationBackground: "rgba(0,0,0,0.58)",
  footerBackground: "rgba(0,0,0,0.58)",
  mapLat: null,
  mapLng: null,
  showScheduleSection: false,
  scheduleItems: [],
};

type GuestStatus = "draft" | "saving" | "saved" | "error";

type Guest = {
  id: string;
  backendId?: number;
  name: string;
  slug: string;
  inviteUrl?: string; // oluşan gerçek link
  status?: GuestStatus; // satır durumu
  error?: string; // satıra özel hata
  email?: string;
  phone?: string;
  source: "csv" | "manual";
  lastCopiedAt?: number;
  lastSharedAt?: number;
};

export type Countdown = {
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
type ThemeId = FontFamily;

type Theme = {
  id: ThemeId;
  label: string;
  mood: string;
  previewImage: string;
  heroTitleSize: string;
  heroSubtitleSize: string;
  requiresLicense?: boolean;
  settings: Pick<
    InvitationSettings,
    | "fontFamily"
    | "backgroundColor"
    | "backgroundOverlayOpacity"
    | "heroSubtitleColor"
    | "heroNamesColor"
    | "ampersandColor"
    | "dividerColor"
    | "backgroundBaseColor"
    | "headingColor"
    | "personNameColor"
    | "familyRowColor"
    | "parentRowColor"
    | "photoBorderColor"
    | "lowerMessageColor"
    | "lowerCoupleNameColor"
    | "sectionCardBackground"
    | "sectionCardBorderColor"
    | "donationBackground"
    | "locationBackground"
    | "footerBackground"
  >;
};

export const THEMES: Theme[] = [
  {
    id: "pacifico",
    label: "Soft Romance",
    mood: "Sıcak ve modern, romantik ama sade çiftler için.",
    previewImage: "/themes/soft-romance.jpg",
    heroTitleSize: "clamp(1.4rem, 2.4vw, 3.2rem)",
    heroSubtitleSize: "0.8rem",
    settings: {
      fontFamily: "pacifico",
      backgroundColor: "#050608",
      backgroundOverlayOpacity: 0.6,
      heroSubtitleColor: "#ffffff",
      heroNamesColor: "#ffffff",
      ampersandColor: "#ffffff",
      dividerColor: "rgba(255,255,255,0.55)",
      backgroundBaseColor: "#111111",
      headingColor: "#ffffff",
      personNameColor: "#ffffff",
      familyRowColor: "#ffffff",
      parentRowColor: "#ffffff",
      photoBorderColor: "#ffffff",
      lowerMessageColor: "#ffffff",
      lowerCoupleNameColor: "#ffffff",
      sectionCardBackground: "rgba(0,0,0,0.62)",
      sectionCardBorderColor: "rgba(255,255,255,0.20)",
      donationBackground: "rgba(0,0,0,0.62)",
      locationBackground: "rgba(0,0,0,0.62)",
      footerBackground: "rgba(0,0,0,0.62)",
    },
    requiresLicense: false,
  },
  {
    id: "italianno",
    label: "Classic Elegance",
    mood: "Zarif ve klasik düğünler için ince çizgiler ve akıcı fontlar.",
    previewImage: "/themes/classic-elegance.jpg",
    heroTitleSize: "clamp(3.4rem, 6vw, 5rem)",
    heroSubtitleSize: "1.3rem",
    settings: {
      fontFamily: "italianno",
      backgroundColor: "#030203",
      backgroundOverlayOpacity: 0.55,
      heroSubtitleColor: "#f5f5f5",
      heroNamesColor: "#ffffff",
      ampersandColor: "#f5d9b0",
      dividerColor: "rgba(245,217,176,0.85)",
      backgroundBaseColor: "#101010",
      headingColor: "#f5f5f5",
      personNameColor: "#f5f5f5",
      familyRowColor: "#f5f5f5",
      parentRowColor: "#f5f5f5",
      photoBorderColor: "#f5d9b0",
      lowerMessageColor: "#f5f5f5",
      lowerCoupleNameColor: "#f5f5f5",
      sectionCardBackground: "rgba(0,0,0,0.70)",
      sectionCardBorderColor: "rgba(245,217,176,0.35)",
      donationBackground: "rgba(0,0,0,0.70)",
      locationBackground: "rgba(0,0,0,0.70)",
      footerBackground: "rgba(0,0,0,0.70)",
    },
    requiresLicense: false,
  },
  {
    id: "great-vibes",
    label: "Romantic Script",
    mood: "El yazısı hissiyle romantik ve gösterişli davetler.",
    previewImage: "/themes/romantic-script.jpg",
    heroTitleSize: "clamp(3.2rem, 6vw, 5rem)",
    heroSubtitleSize: "1.1rem",
    settings: {
      fontFamily: "great-vibes",
      backgroundColor: "#05030a",
      backgroundOverlayOpacity: 0.58,
      heroSubtitleColor: "#fdf6e9",
      heroNamesColor: "#fdf6e9",
      ampersandColor: "#f5d0a0",
      dividerColor: "rgba(253,246,233,0.7)",
      backgroundBaseColor: "#151015",
      headingColor: "#fdf6e9",
      personNameColor: "#fdf6e9",
      familyRowColor: "#fdf6e9",
      parentRowColor: "#fdf6e9",
      photoBorderColor: "#f5d0a0",
      lowerMessageColor: "#fdf6e9",
      lowerCoupleNameColor: "#fdf6e9",
      sectionCardBackground: "rgba(5,3,10,0.76)",
      sectionCardBorderColor: "rgba(245,208,160,0.42)",
      donationBackground: "rgba(5,3,10,0.76)",
      locationBackground: "rgba(5,3,10,0.76)",
      footerBackground: "rgba(5,3,10,0.76)",
    },
    requiresLicense: false,
  },
  {
    id: "cormorant",
    label: "Editorial Chic",
    mood: "Dergi kapağı estetiğinde, sofistike ve modern.",
    previewImage: "/themes/editorial-chic.jpg",
    heroTitleSize: "clamp(3rem, 5vw, 4.6rem)",
    heroSubtitleSize: "0.95rem",
    settings: {
      fontFamily: "cormorant",
      backgroundColor: "#050608",
      backgroundOverlayOpacity: 0.62,
      heroSubtitleColor: "#e5e5e5",
      heroNamesColor: "#ffffff",
      ampersandColor: "#ffffff",
      dividerColor: "rgba(229,229,229,0.7)",
      backgroundBaseColor: "#090909",
      headingColor: "#ffffff",
      personNameColor: "#ffffff",
      familyRowColor: "#e5e5e5",
      parentRowColor: "#e5e5e5",
      photoBorderColor: "#e5e5e5",
      lowerMessageColor: "#e5e5e5",
      lowerCoupleNameColor: "#ffffff",
      sectionCardBackground: "rgba(0,0,0,0.78)",
      sectionCardBorderColor: "rgba(229,229,229,0.32)",
      donationBackground: "rgba(0,0,0,0.78)",
      locationBackground: "rgba(0,0,0,0.78)",
      footerBackground: "rgba(0,0,0,0.78)",
    },
    requiresLicense: false,
  },
  {
    id: "lugrasimo",
    label: "Vintage Noir",
    mood: "Siyah-beyaz fotoğraf hissiyle nostaljik ve şık.",
    previewImage: "/themes/vintage-noir.jpg",
    heroTitleSize: "clamp(3.1rem, 5.5vw, 4.7rem)",
    heroSubtitleSize: "1.0rem",
    settings: {
      fontFamily: "lugrasimo",
      backgroundColor: "#020304",
      backgroundOverlayOpacity: 0.65,
      heroSubtitleColor: "#f0f0f0",
      heroNamesColor: "#f0f0f0",
      ampersandColor: "#f0f0f0",
      dividerColor: "rgba(240,240,240,0.7)",
      backgroundBaseColor: "#111111",
      headingColor: "#f0f0f0",
      personNameColor: "#f0f0f0",
      familyRowColor: "#f0f0f0",
      parentRowColor: "#f0f0f0",
      photoBorderColor: "#f0f0f0",
      lowerMessageColor: "#f0f0f0",
      lowerCoupleNameColor: "#f0f0f0",
      sectionCardBackground: "rgba(0,0,0,0.80)",
      sectionCardBorderColor: "rgba(240,240,240,0.28)",
      donationBackground: "rgba(0,0,0,0.80)",
      locationBackground: "rgba(0,0,0,0.80)",
      footerBackground: "rgba(0,0,0,0.80)",
    },
    requiresLicense: false,
  },
  {
    id: "charm",
    label: "Pastel Dream",
    mood: "Pastel tonlarda yumuşak ve samimi bir atmosfer.",
    previewImage: "/themes/pastel-dream.jpg",
    heroTitleSize: "clamp(3rem, 5.4vw, 4.5rem)",
    heroSubtitleSize: "1.0rem",
    settings: {
      fontFamily: "charm",
      backgroundColor: "#1b1b26",
      backgroundOverlayOpacity: 0.62,
      heroSubtitleColor: "#ffe6f2",
      heroNamesColor: "#ffffff",
      ampersandColor: "#ffd1dc",
      dividerColor: "rgba(255,209,220,0.7)",
      backgroundBaseColor: "#151524",
      headingColor: "#ffe6f2",
      personNameColor: "#ffe6f2",
      familyRowColor: "#ffe6f2",
      parentRowColor: "#ffe6f2",
      photoBorderColor: "#ffd1dc",
      lowerMessageColor: "#ffe6f2",
      lowerCoupleNameColor: "#ffe6f2",
      sectionCardBackground: "rgba(10,10,25,0.80)",
      sectionCardBorderColor: "rgba(255,209,220,0.35)",
      donationBackground: "rgba(10,10,25,0.80)",
      locationBackground: "rgba(10,10,25,0.80)",
      footerBackground: "rgba(10,10,25,0.80)",
    },
    requiresLicense: false,
  },
  {
    id: "sofia",
    label: "Modern Minimal",
    mood: "Az renk, yüksek kontrast; modern ve net.",
    previewImage: "/themes/modern-minimal.jpg",
    heroTitleSize: "clamp(3.1rem, 5vw, 4.3rem)",
    heroSubtitleSize: "0.95rem",
    settings: {
      fontFamily: "sofia",
      backgroundColor: "#050506",
      backgroundOverlayOpacity: 0.58,
      heroSubtitleColor: "#f5f5f5",
      heroNamesColor: "#ffffff",
      ampersandColor: "#ffffff",
      dividerColor: "rgba(245,245,245,0.6)",
      backgroundBaseColor: "#111111",
      headingColor: "#ffffff",
      personNameColor: "#ffffff",
      familyRowColor: "#f5f5f5",
      parentRowColor: "#f5f5f5",
      photoBorderColor: "#f5f5f5",
      lowerMessageColor: "#f5f5f5",
      lowerCoupleNameColor: "#ffffff",
      sectionCardBackground: "rgba(0,0,0,0.76)",
      sectionCardBorderColor: "rgba(245,245,245,0.24)",
      donationBackground: "rgba(0,0,0,0.76)",
      locationBackground: "rgba(0,0,0,0.76)",
      footerBackground: "rgba(0,0,0,0.76)",
    },
    requiresLicense: true,
  },
  {
    id: "cookie",
    label: "Warm Autumn",
    mood: "Sonbahar tonlarında sıcak, ev hissi veren davetler.",
    previewImage: "/themes/warm-autumn.jpg",
    heroTitleSize: "clamp(3.2rem, 5.5vw, 4.6rem)",
    heroSubtitleSize: "1.0rem",
    settings: {
      fontFamily: "cookie",
      backgroundColor: "#201411",
      backgroundOverlayOpacity: 0.64,
      heroSubtitleColor: "#ffe5cf",
      heroNamesColor: "#fff1e2",
      ampersandColor: "#ffbe88",
      dividerColor: "rgba(255,190,136,0.75)",
      backgroundBaseColor: "#140d0b",
      headingColor: "#fff1e2",
      personNameColor: "#fff1e2",
      familyRowColor: "#ffe5cf",
      parentRowColor: "#ffe5cf",
      photoBorderColor: "#ffbe88",
      lowerMessageColor: "#ffe5cf",
      lowerCoupleNameColor: "#fff1e2",
      sectionCardBackground: "rgba(18,8,4,0.82)",
      sectionCardBorderColor: "rgba(255,190,136,0.38)",
      donationBackground: "rgba(18,8,4,0.82)",
      locationBackground: "rgba(18,8,4,0.82)",
      footerBackground: "rgba(18,8,4,0.82)",
    },
    requiresLicense: true,
  },
  {
    id: "dancing-script",
    label: "Golden Hour",
    mood: "Gün batımı tonlarında ışık ve gölge uyumu.",
    previewImage: "/themes/golden-hour.jpg",
    heroTitleSize: "clamp(3.3rem, 6vw, 4.9rem)",
    heroSubtitleSize: "1.1rem",
    settings: {
      fontFamily: "dancing-script",
      backgroundColor: "#1b130e",
      backgroundOverlayOpacity: 0.66,
      heroSubtitleColor: "#ffeacd",
      heroNamesColor: "#fff5e6",
      ampersandColor: "#ffd08a",
      dividerColor: "rgba(255,234,205,0.78)",
      backgroundBaseColor: "#120c08",
      headingColor: "#fff5e6",
      personNameColor: "#fff5e6",
      familyRowColor: "#ffeacd",
      parentRowColor: "#ffeacd",
      photoBorderColor: "#ffd08a",
      lowerMessageColor: "#ffeacd",
      lowerCoupleNameColor: "#fff5e6",
      sectionCardBackground: "rgba(19,9,4,0.84)",
      sectionCardBorderColor: "rgba(255,234,205,0.36)",
      donationBackground: "rgba(19,9,4,0.84)",
      locationBackground: "rgba(19,9,4,0.84)",
      footerBackground: "rgba(19,9,4,0.84)",
    },
    requiresLicense: true,
  },
  {
    id: "playfair",
    label: "Timeless Classic",
    mood: "Zamana meydan okuyan, derli toplu klasik tarz.",
    previewImage: "/themes/timeless-classic.jpg",
    heroTitleSize: "clamp(3rem, 5vw, 4.4rem)",
    heroSubtitleSize: "0.95rem",
    settings: {
      fontFamily: "playfair",
      backgroundColor: "#050609",
      backgroundOverlayOpacity: 0.6,
      heroSubtitleColor: "#eaeaea",
      heroNamesColor: "#ffffff",
      ampersandColor: "#ffffff",
      dividerColor: "rgba(234,234,234,0.7)",
      backgroundBaseColor: "#101010",
      headingColor: "#ffffff",
      personNameColor: "#ffffff",
      familyRowColor: "#eaeaea",
      parentRowColor: "#eaeaea",
      photoBorderColor: "#eaeaea",
      lowerMessageColor: "#eaeaea",
      lowerCoupleNameColor: "#ffffff",
      sectionCardBackground: "rgba(0,0,0,0.78)",
      sectionCardBorderColor: "rgba(234,234,234,0.26)",
      donationBackground: "rgba(0,0,0,0.78)",
      locationBackground: "rgba(0,0,0,0.78)",
      footerBackground: "rgba(0,0,0,0.78)",
    },
    requiresLicense: true,
  },
];

export default function EditorPage() {
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settings, setSettings] =
    useState<InvitationSettings>(DEFAULT_SETTINGS);
  const [isMac, setIsMac] = useState(false);
  const [license, setLicense] = useState<LicenseInfo>(DEFAULT_LICENSE);
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState<string>("");
  const [isEditingToken, setIsEditingToken] = useState(false);
  const emptyCountdown: Countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  };
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSavingEvent, setIsSavingEvent] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [openGuestMenuId, setOpenGuestMenuId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const handleShareWhatsApp = (guest: Guest, href: string) => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(
      `Davet linkiniz: ${href}`
    )}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    const now = Date.now();
    setGuests((prev) =>
      prev.map((g) => (g.id === guest.id ? { ...g, lastSharedAt: now } : g))
    );
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedLicense = window.localStorage.getItem("invitationLicense");
    if (savedLicense) {
      try {
        const parsed = JSON.parse(savedLicense) as LicenseInfo;
        setLicense(parsed);
        if (parsed.token) setTokenInput(parsed.token);
      } catch {
        // bozuksa ignore
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("invitationLicense", JSON.stringify(license));
  }, [license]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMac(/mac/i.test(navigator.platform));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();

      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable
      ) {
        return;
      }

      const isMacPlatform = navigator.platform.toLowerCase().includes("mac");
      const metaPressed = isMacPlatform ? e.metaKey : e.ctrlKey;

      // ⌘+B / Ctrl+B
      if (metaPressed && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsEditorOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  // app/page.tsx içinde, settingsLoaded && license.valid koşuluyla
  useEffect(() => {
    if (!settingsLoaded) return;
    if (!license.valid || !license.token) return;
    if (!isDirty) return; // kaydedilmemiş değişiklik yoksa çağırma

    const controller = new AbortController();

    const save = async () => {
      try {
        setIsSavingEvent(true);
        setSaveError(null);

        const res = await fetch(`${API_BASE}/save_event.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            token: license.token,
            settings,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.warn("save_event http error", res.status, text);
          setSaveError("Değişiklikler kaydedilemedi.");
          return;
        }

        const data = await res.json();

        if (!data.success) {
          console.warn("save_event error", data);
          setSaveError(data.error || "Değişiklikler kaydedilemedi.");
          return;
        }

        // başarılı
        setIsDirty(false);
        setLastSavedAt(new Date());
      } catch (e) {
        console.error("save_event error", e);
        setSaveError("Sunucuya ulaşılamadı.");
      } finally {
        setIsSavingEvent(false);
      }
    };

    const t = setTimeout(save, 2500); // 2.5s debounce
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [settings, settingsLoaded, license.valid, license.token, isDirty]);

  useEffect(() => {
    if (!license.valid || !license.token) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/list_guests.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: license.token }),
        });

        const text = await res.text();
        let data: any;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("list_guests JSON parse error", e, text);
          return;
        }

        if (!data.success) {
          console.error("list_guests error", data.error);
          return;
        }

        // Lisans bilgilerini backend'den gelen değerle de senkronize edebilirsin
        setLicense((prev) => ({
          ...prev,
          maxGuests: Number(data.maxGuests ?? prev.maxGuests),
          usedGuests: Number(data.usedGuests ?? prev.usedGuests),
        }));

        const rows = (data.guests ?? []) as {
          id: number;
          guest_name: string;
          guest_slug: string;
          link?: string;
        }[];

        const mapped: Guest[] = rows.map((row) => ({
          id: `db-${row.id}`,
          backendId: row.id,
          name: row.guest_name,
          slug: row.guest_slug,
          source: "manual",
          status: "saved",
          inviteUrl: row.link, // artık dolu
        }));

        setGuests(mapped);
      } catch (e) {
        console.error("list_guests fetch error", e);
      }
    })();
  }, [license.valid, license.token]);

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
    { id: 1, label: "Çift", icon: "👩‍❤️‍👨" },
    { id: 2, label: "Tarih", icon: "📅" },
    { id: 3, label: "Tema", icon: "🎨" },
    { id: 4, label: "Aile", icon: "🏡" },
    { id: 5, label: "Davet", icon: "📬" },
  ];

  const [countdown, setCountdown] = useState<Countdown>(emptyCountdown);
  const tableRef = React.useRef<HTMLDivElement | null>(null);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  const [origin, setOrigin] = useState<string>("");
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  type EditorMode = "user" | "admin";

  const [mode, setMode] = useState<EditorMode>("user");
  const [familyTab, setFamilyTab] = useState<"family1" | "family2">("family1");
  const [dateDay, setDateDay] = useState<string>("");
  const [dateMonth, setDateMonth] = useState<string>("");
  const [dateYear, setDateYear] = useState<string>("");
  const [hasPaid, setHasPaid] = useState<boolean>(false); // gerçekte bu backend'den gelir

  useEffect(() => {
    if (!isEditorOpen) return;
    if (typeof window === "undefined") return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [isEditorOpen]);
  const applyTheme = (themeId: ThemeId) => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (!theme) return;

    setSettings((prev) => ({
      ...prev,
      ...theme.settings,
      heroTitleSize: theme.heroTitleSize,
      heroSubtitleSize: theme.heroSubtitleSize,
    }));
  };

  const handleCopyGuestLink = async (guest: Guest) => {
    if (!guest.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(guest.inviteUrl);
      const now = Date.now();
      setGuests((prev) =>
        prev.map((g) => (g.id === guest.id ? { ...g, lastCopiedAt: now } : g))
      );
    } catch (e) {
      console.error("clipboard error", e);
    }
  };

  const handleAddManualGuest = async () => {
    if (!license.valid) {
      setLicenseError("Önce geçerli bir lisans token doğrulamalısınız.");
      return;
    }

    // Bu token için: backend'de kullanılan + henüz kaydedilmemiş draft satırlar
    const savedGuestsCount = license.usedGuests; // list_guests'ten rows.length ile güncellenecek
    const draftGuestsCount = guests.filter((g) => g.status !== "saved").length;
    const effectiveUsed = savedGuestsCount + draftGuestsCount;

    if (effectiveUsed >= license.maxGuests) {
      setLicenseError(
        `Lisans limitiniz dolu görünüyor. Maksimum ${license.maxGuests} davetli linki oluşturabilirsiniz.`
      );
      return;
    }

    const newGuest: Guest = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: "",
      slug: "",
      source: "manual",
      status: "draft",
    };

    setGuests((prev) => [...prev, newGuest]);

    requestAnimationFrame(() => {
      const el = tableRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    });
  };

  function buildGuestPayload(guest: Guest, settings: InvitationSettings) {
    return {
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

      showFamilySection: settings.showFamilySection,
      family1Mother: settings.family1Mother,
      family1Father: settings.family1Father,
      family1Surname: settings.family1Surname,
      family2Mother: settings.family2Mother,
      family2Father: settings.family2Father,
      family2Surname: settings.family2Surname,
      mapLat: settings.mapLat,
      mapLng: settings.mapLng,
    };
  }

  const handleSaveGuest = async (guest: Guest) => {
    if (!license.valid || !license.token) {
      setLicenseError("Önce geçerli bir lisans token doğrulamalısınız.");
      return;
    }

    const trimmedName = guest.name.trim();
    if (!trimmedName) {
      setGuests((prev) =>
        prev.map((g) =>
          g.id === guest.id
            ? { ...g, status: "error", error: "Davetli ismi boş olamaz." }
            : g
        )
      );
      return;
    }

    // satırı “saving” durumuna al
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guest.id ? { ...g, status: "saving", error: undefined } : g
      )
    );

    try {
      const res = await fetch(`${API_BASE}/add_guest.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: license.token,
          guest_name: trimmedName,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("add_guest http error", res.status, text);
        setGuests((prev) =>
          prev.map((g) =>
            g.id === guest.id
              ? {
                  ...g,
                  status: "error",
                  error: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin.",
                }
              : g
          )
        );
        return;
      }

      const data = await res.json();

      if (!data.success) {
        setGuests((prev) =>
          prev.map((g) =>
            g.id === guest.id
              ? {
                  ...g,
                  status: "error",
                  error: data.error || "Davetli kaydedilirken bir hata oluştu.",
                }
              : g
          )
        );
        return;
      }

      // Backend lisans değerini authoritative kabul et
      setLicense((prev) => ({
        ...prev,
        usedGuests: Number(data.usedGuests ?? prev.usedGuests),
        maxGuests: Number(data.maxGuests ?? prev.maxGuests),
      }));

      // satır “saved” + gerçek link ile güncellensin
      setGuests((prev) =>
        prev.map((g) =>
          g.id === guest.id
            ? {
                ...g,
                backendId: data.guestId,
                name: data.guestName ?? trimmedName,
                slug: data.slug ?? g.slug,
                inviteUrl: data.link, // add_guest.php’den gönder
                status: "saved",
                error: undefined,
              }
            : g
        )
      );
    } catch (e) {
      console.error("add_guest error", e);
      setGuests((prev) =>
        prev.map((g) =>
          g.id === guest.id
            ? {
                ...g,
                status: "error",
                error: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin.",
              }
            : g
        )
      );
    }
  };

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
  const handleRemoveGuest = async (guest: Guest) => {
    setGuests((prev) => prev.filter((g) => g.id !== guest.id));

    if (!guest.backendId || !license.valid || !license.token) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/delete_guest.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: license.token,
          guest_id: guest.backendId,
        }),
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("delete_guest JSON parse error", e, text);
        return;
      }

      if (!data.success) {
        console.error("delete_guest error", data.error);
        return;
      }

      setLicense((prev) => ({
        ...prev,
        usedGuests: Number(data.usedGuests ?? prev.usedGuests),
      }));
    } catch (e) {
      console.error("delete_guest fetch error", e);
    }
  };

  const handleDownloadCsvExample = () => {
    const sample = ["name", "Murat Yıldırım", "Ayşe Demir"].join("\n");

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

    // her değişiklikte dirty yap
    setIsDirty(true);
    setSaveError(null);
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
    setLicenseError(null);

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
        return;
      }

      const headerLine = lines[0];
      const headerColumns = headerLine
        .split(/[,;]/)
        .map((h) => h.trim().toLowerCase());

      const hasHeader =
        headerColumns.includes("name") ||
        headerColumns.includes("ad") ||
        headerColumns.includes("isim");

      const startIndex = hasHeader ? 1 : 0;

      const parsedGuests: Guest[] = [];

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        const columns = line.split(/[,;]/).map((c) => c.trim());

        let name = "";
        let email: string | undefined;
        let phone: string | undefined;

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
        return;
      }

      // LİMİT BURADA HESAPLANIYOR
      const savedGuestsCount = license.usedGuests;
      const draftGuestsCount = guests.filter(
        (g) => g.status !== "saved"
      ).length;
      const effectiveUsed = savedGuestsCount + draftGuestsCount;
      const allowedCount = license.maxGuests - effectiveUsed;

      if (allowedCount <= 0) {
        setCsvError(
          `Lisansınız en fazla ${license.maxGuests} davetliye izin veriyor. Yeni CSV'den davetli eklenemedi.`
        );
        return;
      }

      const limitedGuests = parsedGuests.slice(0, allowedCount);

      if (limitedGuests.length < parsedGuests.length) {
        setCsvError(
          `Lisansınız gereği ilk ${limitedGuests.length} davetli eklendi, kalanlar lisans limitini aşıyor.`
        );
      }

      // Mevcut davetlilerin üstüne ekliyoruz
      setGuests((prev) => [...prev, ...limitedGuests]);
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
  const handleVerifyToken = async () => {
    setLicenseError(null);

    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setLicenseError("Lütfen token girin.");
      return;
    }

    console.log("API_BASE:", API_BASE); // BURASI ÖNEMLİ

    try {
      const res = await fetch(`${API_BASE}/verify_token.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: trimmed }),
      });

      console.log("HTTP status:", res.status);

      const data = await res.json();
      console.log("Response JSON:", data);

      if (!data.valid) {
        setLicense({
          token: null,
          maxGuests: 0,
          usedGuests: 0,
          eventId: null,
          valid: false,
        });
        setLicenseError(data.message || "Token geçersiz.");
        return;
      }

      setLicense({
        token: trimmed,
        maxGuests: Number(data.maxGuests || 0),
        usedGuests: Number(data.usedGuests || 0),
        eventId: data.eventId ? Number(data.eventId) : null,
        valid: true,
      });
    } catch (e) {
      console.error("verify_token error:", e);
      setLicenseError("Sunucuya ulaşılamadı. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div
      className="relative min-h-screen text-slate-900 bg-gradient-to-b from-slate-900 via-slate-950 to-[#1a1012]"
      style={{ background: overlayColor }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[0.75rem]">
          {/* Sol: logo + açıklama */}
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-300/60">
              💌
            </span>
            <div className="flex flex-col">
              <span className="text-[0.7rem] tracking-[0.18em] uppercase text-slate-700">
                Dijital Davetiye Stüdyosu
              </span>
              <span className="text-[0.7rem] text-slate-500">
                Davetiyeni düzenle ve canlı önizle
              </span>
            </div>
          </div>

          {/* Sağ: menü – mobile’da alt satıra iner, daha sıkı görünür */}
          <nav className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
            <Link
              href="/landing#how-it-works"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-800 bg-white border border-slate-200 hover:bg-emerald-500 hover:text-slate-900 hover:border-emerald-300 transition-colors"
            >
              Anasayfa
            </Link>
            <Link
              href="/landing#pricing"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-800 bg-white border border-slate-200 hover:bg-amber-400 hover:text-slate-900 hover:border-amber-300 transition-colors"
            >
              Fiyatlandırma
            </Link>
          </nav>
        </div>
      </div>

      {!isEditorOpen && (
        <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2">
          <button
            onClick={() => {
              setMode("user");
              setIsEditorOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/30 text-[0.7rem] font-medium text-white shadow-lg hover:bg-white/20 hover:border-white/60 transition"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[0.6rem]">
              ✏️
            </span>
            <span className="flex items-center gap-2">
              <span>Düzenle</span>
              <span
                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/10 px-2 py-0.5 text-[0.6rem] text-slate-50/90"
                aria-hidden="true"
              >
                <span>{isMac ? "⌘" : "Ctrl"}</span>
                <span className="tracking-[0.16em] uppercase">B</span>
              </span>
            </span>
          </button>

          {/* İstersen alttaki açıklamayı tamamen kaldırabilirsin; sade görünüm için gerek yok */}
          {/* <p className="text-[0.65rem] text-slate-400">
            {isMac ? "⌘" : "Ctrl"} + B
          </p> */}

          <button
            onClick={() => {
              setMode("admin");
              setIsEditorOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/80 backdrop-blur border border-red-300/80 text-[0.7rem] font-medium text-white shadow-lg hover:bg-red-500"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-400/60 text-[0.6rem]">
              ⚙
            </span>
            Admin düzenle
          </button>
        </div>
      )}

      {/* Editör paneli */}
      {isEditorOpen && (
        <div
          className={[
            "mt-[88px] w-full bg-white/95 text-slate-900 border-t border-slate-200 z-40 editor-font",
            "md:mt-0 md:fixed md:top-[60px] md:right-0 md:h-[calc(100%-60px)] md:max-w-md md:border-l md:border-t-0 md:rounded-l-3xl md:shadow-xl md:shadow-slate-300/60",
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                Davetiye Editörü
              </h1>
            </div>

            <div className="flex flex-col items-end gap-1">
              {/* Status satırı */}
              {saveError ? (
                <span className="text-[0.65rem] text-red-600">{saveError}</span>
              ) : isSavingEvent ? (
                <span className="text-[0.65rem] text-slate-500">
                  Kaydediliyor…
                </span>
              ) : isDirty ? (
                <span className="text-[0.65rem] text-slate-400">
                  Değişiklikler kaydedilecek
                </span>
              ) : lastSavedAt ? (
                <span className="text-[0.65rem] text-slate-400">
                  Kaydedildi •{" "}
                  {lastSavedAt.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ) : null}

              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 border border-slate-200"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lisans barı – sadece user modunda göster */}
          {mode === "user" && (
            <div
              className={
                "px-4 py-2 border-b border-slate-200 " +
                (license.valid ? "bg-emerald-50" : "bg-amber-50")
              }
            >
              {license.valid && !isEditingToken && (
                // DOĞRULANMIŞ LISANS – sadece bilgi
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.7rem] font-medium text-emerald-800">
                      Lisans doğrulandı
                    </span>
                    <span className="text-[0.7rem] text-emerald-700">
                      Plan:{" "}
                      {license.maxGuests === 0
                        ? "Sadece davetiye"
                        : `${license.maxGuests}, davetli linki`}
                      : {license.usedGuests}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTokenInput(license.token ?? "");
                      setIsEditingToken(true);
                    }}
                    className="px-3 py-1.5 rounded-full border border-emerald-300 bg-white text-[0.7rem] text-emerald-800 hover:bg-emerald-50"
                  >
                    Değiştir
                  </button>
                </div>
              )}

              {(!license.valid || isEditingToken) && (
                <>
                  <label className="block text-[0.7rem] font-medium text-slate-800 mb-1">
                    Lisans Token
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="INV-50-ABC123"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        await handleVerifyToken();
                        // doğrulama başarılıysa handleVerifyToken içinde license.valid true olacak
                        // burada başarıyı anlamak için licenseError yoksa edit moddan çıkabiliriz:
                        if (!licenseError) {
                          setIsEditingToken(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-[0.75rem] font-semibold text-slate-900 hover:bg-amber-400"
                    >
                      Doğrula
                    </button>
                  </div>
                </>
              )}

              {licenseError && (
                <p className="mt-1 text-[0.7rem] text-red-600">
                  {licenseError}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 text-[0.7rem] bg-slate-50">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id as any)}
                className={[
                  "px-2.5 py-1 rounded-full border text-xs font-medium transition-colors",
                  activeStep === step.id
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100",
                ].join(" ")}
              >
                {step.id}. {step.label}
                <span> {step.icon}</span>
              </button>
            ))}
          </div>
          <div className="px-4 pb-6 pt-3 bg-white md:h-[calc(100%-80px)] md:overflow-y-auto">
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
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
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
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
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
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
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
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
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

                <SectionTitle label="Etkinlik Akışı" />

                <div className="mb-3 text-xs text-slate-700">
                  <label className="inline-flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={settings.showScheduleSection ?? false}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          showScheduleSection: e.target.checked,
                        }))
                      }
                      className="h-3.5 w-3.5 rounded border-slate-300"
                    />
                    <span className="text-[0.8rem]">
                      Etkinlik akışını davetiyede göster
                    </span>
                  </label>

                  {(settings.showScheduleSection ?? false) && (
                    <div className="space-y-2">
                      <p className="text-[0.7rem] text-slate-500">
                        Hazırlık, nikah, kokteyl gibi adımları sırayla ekleyin.
                        Tasarım otomatik hizalanır.
                      </p>

                      <div className="space-y-2">
                        {(settings.scheduleItems ?? []).map((item, index) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 flex flex-col gap-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                value={item.time}
                                onChange={(e) => {
                                  const next = [
                                    ...(settings.scheduleItems ?? []),
                                  ];
                                  next[index] = {
                                    ...next[index],
                                    time: e.target.value,
                                  };
                                  setSettings((prev) => ({
                                    ...prev,
                                    scheduleItems: next,
                                  }));
                                }}
                                placeholder="18:00"
                                className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[0.75rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
                              />
                              <input
                                value={item.title}
                                onChange={(e) => {
                                  const next = [
                                    ...(settings.scheduleItems ?? []),
                                  ];
                                  next[index] = {
                                    ...next[index],
                                    title: e.target.value,
                                  };
                                  setSettings((prev) => ({
                                    ...prev,
                                    scheduleItems: next,
                                  }));
                                }}
                                placeholder="Nikah Töreni"
                                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[0.75rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (
                                    settings.scheduleItems ?? []
                                  ).filter((_, i) => i !== index);
                                  setSettings((prev) => ({
                                    ...prev,
                                    scheduleItems: next,
                                  }));
                                }}
                                className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[0.7rem] hover:bg-red-400"
                                title="Adımı sil"
                              >
                                🗑
                              </button>
                            </div>
                            <textarea
                              value={item.description}
                              onChange={(e) => {
                                const next = [
                                  ...(settings.scheduleItems ?? []),
                                ];
                                next[index] = {
                                  ...next[index],
                                  description: e.target.value,
                                };
                                setSettings((prev) => ({
                                  ...prev,
                                  scheduleItems: next,
                                }));
                              }}
                              rows={2}
                              placeholder="Kısa bir açıklama ekleyebilirsiniz (isteğe bağlı)."
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[0.75rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 resize-none"
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const next = [
                            ...(settings.scheduleItems ?? []),
                            { time: "", title: "", description: "" },
                          ];
                          setSettings((prev) => ({
                            ...prev,
                            scheduleItems: next,
                          }));
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[0.7rem] font-medium hover:bg-slate-800"
                      >
                        + Akış Ekle
                      </button>
                    </div>
                  )}
                </div>
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

                <MapPicker
                  mapLat={settings.mapLat ?? null}
                  mapLng={settings.mapLng ?? null}
                  onChange={(lat, lng) => {
                    setSettings((prev) => ({
                      ...prev,
                      mapLat: lat,
                      mapLng: lng,
                    }));
                  }}
                  onAddressChange={(label) => {
                    setSettings((prev) => ({
                      ...prev,
                      locationText: label || prev.locationText,
                    }));
                  }}
                />
              </>
            )}
            {activeStep === 3 && mode === "user" && (
              <>
                <SectionTitle label="Tema Seçimi" />
                <p className="mb-2 text-[0.7rem] text-slate-400">
                  Hazır temalardan birini seçin. Font ve renkler tema ile
                  birlikte otomatik ayarlanır.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {THEMES.map((theme) => {
                    const isActive = settings.fontFamily === theme.id;
                    const locked = theme.requiresLicense && !license.valid;

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          if (locked) {
                            setLicenseError(
                              "Bu temayı kullanmak için lisans token’ınızı doğrulamanız gerekir."
                            );
                            return;
                          }
                          applyTheme(theme.id);
                        }}
                        disabled={locked}
                        className={[
                          "flex flex-col items-stretch rounded-xl border overflow-hidden text-left text-[0.7rem] transition shadow-sm relative",
                          isActive
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                          locked ? "opacity-60 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        <div className="h-28 w-full overflow-hidden bg-slate-800 relative">
                          <img
                            src={theme.previewImage}
                            alt={theme.label}
                            className="w-full h-full object-cover"
                          />
                          {locked && (
                            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                              <span className="px-2 py-1 rounded-full bg-white/90 text-[0.65rem] text-slate-800 font-medium">
                                Lisans ile açılır
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-2">
                          <p className="font-medium text-slate-900">
                            {theme.label}
                          </p>
                          <p className="text-[0.65rem] text-slate-500">
                            {theme.mood}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {activeStep === 3 && mode === "admin" && (
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
                    <option value="charm">Charm</option>
                    <option value="lugrasimo">Lugrasimo</option>
                    <option value="italianno">Italianno</option>
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
                {!license.valid ? (
                  // 1) Lisans tamamen yok → token iste
                  <p className="mb-3 text-[0.75rem] text-slate-500">
                    Davetli listesi ve tekil linkler için lütfen önce lisans
                    token’ınızı doğrulayın.
                  </p>
                ) : license.maxGuests === 0 ? (
                  // 2) Lisans var ama plan sadece davetiye → link özelliği kapalı
                  <p className="mb-3 text-[0.75rem] text-slate-500">
                    Mevcut paketiniz sadece genel davetiye içeriyor. Tekil davet
                    linkleri bu planda bulunmuyor.
                  </p>
                ) : (
                  // 3) Lisans var ve link hakkı var → detaylı davetli UI'si
                  <div className="mb-3 text-xs">
                    <div className="mb-3 text-xs space-y-3">
                      {/* ÖZET METİN: guests.length kullanıyoruz */}
                      <p className="text-[0.7rem] text-slate-500">
                        Lisansınız: en fazla {license.maxGuests} davetli linki
                        oluşturabilirsiniz. Şu ana kadar {license.usedGuests}{" "}
                        davetli kaydedildi.
                      </p>

                      {/* Davetli ekleme butonları */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleAddManualGuest}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[0.7rem] font-medium hover:bg-slate-800"
                        >
                          +1 Davetli Ekle
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!license.valid) {
                              setLicenseError(
                                "Önce geçerli bir lisans token doğrulamalısınız."
                              );
                              return;
                            }
                            const now = Date.now();
                            const batch = Array.from({ length: 10 }).map(
                              (_, i) => ({
                                id: `${now}-${i}-${Math.random()
                                  .toString(36)
                                  .slice(2)}`,
                                name: "",
                                slug: "",
                                source: "manual" as const,
                                status: "draft" as GuestStatus,
                              })
                            );
                            setGuests((prev) => [...prev, ...batch]);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-[0.7rem] font-medium hover:bg-slate-200 border border-slate-200"
                        >
                          +10 Davetli Ekle
                        </button>
                      </div>

                      {/* Davetli tablosu – daha “yumuşak” scroll ve kart görünümü */}
                      <div
                        ref={tableRef}
                        className="mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 scroll-smooth px-1 py-1"
                      >
                        {guests.length === 0 ? (
                          <div className="px-3 py-4 text-[0.7rem] text-slate-500">
                            Henüz davetli eklenmedi. Yukarıdan “+1 Davetli Ekle”
                            ile başlayın veya Excel dosyası yükleyin.
                          </div>
                        ) : (
                          <div className="py-1">
                            {guests.map((guest, index) => {
                              const status = guest.status ?? "draft";
                              const isSaving = status === "saving";
                              const isSaved = status === "saved";
                              const href =
                                isSaved && license.token
                                  ? `${origin}/invite/${
                                      guest.slug
                                    }?token=${encodeURIComponent(
                                      license.token
                                    )}`
                                  : "#";

                              const isShared = !!guest.lastSharedAt;
                              const isLastRow = index === guests.length - 1;
                              return (
                                <div
                                  key={guest.id}
                                  className={[
                                    "px-3 py-2.5 flex flex-col gap-1.5 rounded-2xl mx-2 mb-2 transition",
                                    isShared
                                      ? "bg-emerald-50 border border-emerald-200 shadow-sm"
                                      : "bg-white border border-slate-200 shadow-sm hover:bg-slate-50",
                                  ].join(" ")}
                                >
                                  {/* Üst satır: isim + aksiyonlar */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <input
                                        value={guest.name}
                                        onChange={(e) =>
                                          handleGuestFieldChange(
                                            guest.id,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Davetli adı"
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[0.75rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
                                      />
                                    </div>

                                    <div className="flex items-center gap-1 relative flex-shrink-0">
                                      {/* Kaydet butonu */}
                                      {!isSaved && (
                                        <button
                                          type="button"
                                          onClick={() => handleSaveGuest(guest)}
                                          disabled={
                                            isSaving || !guest.name.trim()
                                          }
                                          className={[
                                            "inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[0.7rem] font-medium whitespace-nowrap",
                                            isSaving || !guest.name.trim()
                                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                              : "bg-slate-900 text-white hover:bg-slate-800",
                                          ].join(" ")}
                                        >
                                          {isSaving
                                            ? "Kaydediliyor..."
                                            : "Kaydet"}
                                        </button>
                                      )}

                                      {/* Link ikonu */}
                                      {isSaved && (
                                        <a
                                          href={href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          aria-label="Davet linkini yeni sekmede aç"
                                          className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line
                                              x1="10"
                                              y1="14"
                                              x2="21"
                                              y2="3"
                                            />
                                          </svg>
                                        </a>
                                      )}

                                      {/* More butonu */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setOpenGuestMenuId((prev) =>
                                            prev === guest.id ? null : guest.id
                                          )
                                        }
                                        className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-300 bg-white text-[0.75rem] text-slate-700 hover:bg-slate-50"
                                        title="Daha fazla"
                                      >
                                        ⋯
                                      </button>

                                      {/* Dropdown menü */}
                                      {openGuestMenuId === guest.id && (
                                        <div
                                          className={[
                                            "absolute z-40 w-48 rounded-2xl border border-slate-200 bg-white shadow-xl py-1 max-h-60 overflow-y-auto",
                                            isLastRow
                                              ? "right-0 bottom-9"
                                              : "right-0 top-9",
                                          ].join(" ")}
                                          style={{
                                            transform: "translateY(4px)",
                                          }}
                                        >
                                          {/* içerik aynı kalıyor */}
                                          {isSaved && (
                                            <>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  handleShareWhatsApp(
                                                    guest,
                                                    href
                                                  );
                                                  setOpenGuestMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[0.7rem] text-slate-800 hover:bg-slate-50"
                                              >
                                                <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-[#25D366] text-white text-[0.6rem]">
                                                  W
                                                </span>
                                                WhatsApp ile paylaş
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => {
                                                  handleCopyGuestLink(guest);
                                                  setOpenGuestMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[0.7rem] text-slate-800 hover:bg-slate-50"
                                              >
                                                <span className="inline-flex w-4 h-4 items-center justify-center rounded-full border border-slate-300 text-[0.6rem]">
                                                  ⧉
                                                </span>
                                                Linki kopyala
                                              </button>
                                            </>
                                          )}

                                          <button
                                            type="button"
                                            onClick={() => {
                                              handleRemoveGuest(guest);
                                              setOpenGuestMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[0.7rem] text-red-600 hover:bg-red-50"
                                          >
                                            <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-red-500 text-white text-[0.6rem]">
                                              🗑
                                            </span>
                                            Davetliyi sil
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Hata mesajı */}
                                  {status === "error" && guest.error && (
                                    <div className="mt-1 text-[0.7rem] text-red-600">
                                      {guest.error}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* CSV BLOĞU – davetli tablosunun altında */}
                      <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                        <p className="text-[0.7rem] font-medium text-slate-700 mb-1">
                          Çok sayıda davetli eklemek için Excel / CSV
                          yükleyebilirsiniz.
                        </p>
                        <p className="text-[0.65rem] text-slate-500 mb-2">
                          Örnek dosyayı indirip kendi listenizle doldurun,
                          ardından buradan yükleyin.
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleDownloadCsvExample}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-slate-800 text-[0.7rem] font-medium hover:bg-slate-50 border border-slate-200"
                          >
                            Örnek Excel İndir
                          </button>
                          <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[0.7rem] font-medium hover:bg-slate-800 cursor-pointer">
                            Dosya Yükle
                            <input
                              type="file"
                              accept=".csv,.txt"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleCsvUpload(file);
                                  e.target.value = "";
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {csvError && (
                          <p className="mt-2 text-[0.7rem] text-red-600">
                            {csvError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="h-[calc(100%-44px)] overflow-y-auto px-4 pb-6 pt-3">
            {/* Üst başlık + random zar */}

            <SpeedInsights />
          </div>
        </div>
      )}
      {/* Orta kısım: Davetiye + Davetli Linkleri */}
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-8 md:pt-12 md:pb-12">
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
        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
          <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-slate-600 uppercase">
            {label}
          </span>
        </div>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}
// Mevcut token'a göre maxGuests / usedGuests değerlerini backend'den tazeler
async function refreshLicenseFromServer(
  currentLicense: LicenseInfo,
  setLicense: React.Dispatch<React.SetStateAction<LicenseInfo>>,
  setLicenseError: React.Dispatch<React.SetStateAction<string | null>>
) {
  if (!currentLicense.valid || !currentLicense.token) {
    return;
  }

  try {
    // verify_token ya da ayrı bir endpoint kullanabilirsin.
    const res = await fetch(`${API_BASE}/verify_token.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: currentLicense.token }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("refreshLicenseFromServer http error", res.status, text);
      setLicenseError("Lisans bilgisi güncellenemedi.");
      return;
    }

    const data = await res.json();
    if (!data.valid) {
      setLicenseError(data.message || "Lisans geçersiz görünüyor.");
      setLicense({
        token: null,
        maxGuests: 0,
        usedGuests: 0,
        eventId: null,
        valid: false,
      });
      return;
    }

    // DB’deki en güncel maxGuests / usedGuests değerini state'e yaz
    setLicense((prev) => ({
      ...prev,
      maxGuests: Number(data.maxGuests || prev.maxGuests),
      usedGuests: Number(data.usedGuests || prev.usedGuests),
      eventId: data.eventId ? Number(data.eventId) : prev.eventId,
      valid: true,
      token: prev.token, // token değişmesin
    }));
  } catch (e) {
    console.error("refreshLicenseFromServer error", e);
    setLicenseError("Lisans bilgisi güncellenirken bir hata oluştu.");
  }
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
      <label className="block mb-1 text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
      />
      {helperText && (
        <p className="mt-1 text-[0.65rem] text-slate-500">{helperText}</p>
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
      <label className="block mb-1 text-xs font-medium text-slate-700">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs resize-y placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
      />
      {helperText && (
        <p className="mt-1 text-[0.65rem] text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 p-0 border border-slate-200 rounded-md bg-white"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
        />
      </div>
    </div>
  );
}

/* ---- Davetiye önizleme ---- */

export function InvitationPreview({
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
    heroTitleSize,
    heroSubtitleSize,
    showScheduleSection,
    scheduleItems,
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

  // const { embedSrc: embedUrl, buttonHref } = parseMapInput(mapsUrl);

  let embedUrl = "about:blank";
  let buttonHref = "";

  if (settings.mapLat != null && settings.mapLng != null) {
    const { mapLat, mapLng } = settings;
    const delta = 0.0001; // daha da yakın zoom
    embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
      mapLng - delta
    }%2C${mapLat - delta}%2C${mapLng + delta}%2C${
      mapLat + delta
    }&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

    // BUTON: enlem/boylam yerine adres metniyle açılsın
    const encodedAddress = encodeURIComponent(locationText || "");
    buttonHref = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  } else {
    const parsed = parseMapInput(mapsUrl);
    embedUrl = parsed.embedSrc;

    // mapsUrl varsa onu doğrudan kullan, yoksa adresle arama yap
    if (parsed.buttonHref) {
      buttonHref = parsed.buttonHref;
    } else {
      const encodedAddress = encodeURIComponent(locationText || "");
      buttonHref = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }
  }

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
    lugrasimo: "font-lugrasimo",
    italianno: "font-italianno",
    charm: "font-charm",
    playfair: "font-playfair",
  };

  const fontKey: FontFamily = settings.fontFamily ?? "pacifico";
  const currentFontClass = fontClassMap[fontKey] ?? "";

  return (
    <div className={`page-overlay invitation-root ${currentFontClass}`}>
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/bg.webm" type="video/webm" />
        Tarayıcınız video desteklemiyor.
      </video>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.15))",
          zIndex: -1,
        }}
      />

      {/* Hero */}
      <header
        className="hero"
        id="top"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="hero-inner" style={{ backgroundColor: "transparent" }}>
          <p
            className="hero-subtitle"
            style={{ color: heroSubtitleColor, fontSize: heroSubtitleSize }}
          >
            {heroSubtitle}
          </p>

          <h1
            className="hero-title"
            style={{
              color: heroNamesColor,
              fontSize: heroTitleSize,
            }}
          >
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
            <button
              type="button"
              className="hero-scroll-link"
              aria-label="Aşağı kaydır"
              onClick={() => {
                const el = document.getElementById("countdown");
                if (!el) return;
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{ background: "none", border: "none", padding: 0 }}
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
            </button>
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
        {showScheduleSection &&
          Array.isArray(scheduleItems) &&
          scheduleItems.length > 0 && (
            <section className="section">
              <div
                className="section-inner"
                style={{ maxWidth: 640, margin: "0 auto" }}
              >
                <h2>Etkinlik Akışı</h2>
                <p className="section-subtitle">
                  Günün akışını aşağıda bulabilirsiniz.
                </p>

                <div
                  style={{
                    marginTop: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {scheduleItems.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(80px, 100px) 1fr",
                        columnGap: "1rem",
                        rowGap: "0.25rem",
                        padding: "0.85rem 1rem",
                        borderRadius: 14,
                        border: `1px solid ${sectionCardBorderColor}`,
                        background: sectionCardBackground,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily:
                            'var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: headingColor,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.time || "--:--"}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: headingColor,
                            marginBottom: item.description ? "0.15rem" : 0,
                          }}
                        >
                          {item.title || "Etkinlik"}
                        </p>
                        {item.description && (
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: lowerMessageColor,
                              lineHeight: 1.4,
                            }}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
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
              {locationImageUrl && (
                <div
                  className="location-image-wrapper"
                  style={{ borderColor: photoBorderColor }}
                >
                  <img
                    src={locationImageUrl}
                    alt="Etkinlik mekanı"
                    className="location-image"
                  />
                  <div className="location-image-overlay"></div>
                </div>
              )}

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
            background: settings.footerBackground,
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            padding: "2.5rem 0 2.5rem",
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
