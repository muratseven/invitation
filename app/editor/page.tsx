// app/page.tsx

"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import React, { useEffect, useRef, useState } from "react";
import { parseMapInput } from "./lib/mapUtils"; // relative path’i dosya yapına göre düzelt
import Link from "next/link";
import dynamic from "next/dynamic";
import { EnvelopeHero } from "./components/EnvelopeHero";
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
export const SCHEDULE_PRESETS = {
  classic: [
    { time: "18:00", title: "Karşılama", description: "" },
    { time: "19:00", title: "Nikah Töreni", description: "" },
    { time: "19:30", title: "Pasta Kesimi", description: "" },
    { time: "20:00", title: "Yemek", description: "" },
    { time: "21:30", title: "İlk Dans", description: "" },
    { time: "22:00", title: "Eğlence", description: "" },
  ],
  longCocktail: [
    { time: "17:30", title: "Konukların Karşılanması", description: "" },
    { time: "18:00", title: "Kokteyl & Fotoğraf Çekimi", description: "" },
    { time: "19:30", title: "Nikah Töreni", description: "" },
    { time: "20:00", title: "Yemek", description: "" },
    { time: "21:00", title: "Aile ile Fotoğraflar", description: "" },
    { time: "21:30", title: "İlk Dans", description: "" },
    { time: "22:00", title: "DJ & Eğlence", description: "" },
  ],
};
const DONATION_MESSAGES: Record<
  InvitationSettings["donationOrganization"],
  string
> = {
  tema: "Sizin adınıza TEMA Vakfı'na bir fidan bağışında bulunduk.",
  cydd: "Sizin adınıza Çağdaş Yaşamı Destekleme Derneği'ne eğitim bursu desteğinde bulunduk.",
  "kiz-cocuklari":
    "Sizin adınıza kız çocuklarının eğitimine destek sağlayan bir bursa katkıda bulunduk.",
  losev:
    "Sizin adınıza LÖSEV'e bağışta bulunarak lösemili çocukların tedavisine destek olduk.",
  custom:
    "Bu özel günümüzde, sizin adınıza seçtiğimiz bir kuruluşa bağışta bulunduk.",
};

// 6 ay sonrası default tarih
function getDefault6MonthsDate(): string {
  const now = new Date();
  now.setMonth(now.getMonth() + 6);
  return now.toISOString().split("T")[0];
}

export const DEFAULT_SETTINGS: InvitationSettings = {
  brideName: "Sine",
  groomName: "Murat",
  title: "Nişanımıza davetlisiniz!",
  heroSubtitle: "Biz evleniyoruz",
  dateRaw: getDefault6MonthsDate(),
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
  heroTitleSize: "clamp(3.4rem, 6vw, 5rem)",
  heroSubtitleSize: "1.3rem",

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
  showScheduleSection: true,
  scheduleItems: [
    { time: "18:00", title: "Karşılama", description: "" },
    { time: "18:30", title: "Kokteyl & Fotoğraf Çekimi", description: "" },
    { time: "19:30", title: "Nikah Töreni", description: "" },
    { time: "20:00", title: "Yemek Servisi", description: "" },
    { time: "21:00", title: "Pasta Kesimi", description: "" },
    { time: "21:30", title: "İlk Dans & Eğlence", description: "" },
  ],
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

export const HERO_SUBTITLE_OPTIONS = [
  "Biz evleniyoruz",
  "Hayatımızın en özel günü",
  "Bu mutlu günümüzde yanımızda olun",
  "Bir ömür boyu mutluluğa evet",
  "Sevgiyle başlayan yolculuğumuzda bize katılın",
  "İki kalp, tek hikâye",
  "Aşkımızı sizinle kutlamak istiyoruz",
  "Yeni bir başlangıcın eşiğindeyiz",
  "Sizi bu özel güne davet ediyoruz",
  "Birlikte yazmaya başladığımız hikâye",
  "Nişanımıza hoş geldiniz",
  "Düğünümüzde bize eşlik edin",
  "Bir ömür, bir söz, bir gün",
  "Aşkımızın kutlamasına davetlisiniz",
  "En güzel günü seninle paylaşmak istiyoruz",
  "Hayatımızın ilk büyük adımı",
  "Sizi aramızda görmekten mutluluk duyarız",
  "Sevginin en güzel hali başlıyor",
  "Mutluluğumuzu sizinle paylaşmak istiyoruz",
  "Kalbimizin sesine uyarak buluştuk",
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

export type ThemeId =
  | "Romantik Şeker"
  | "Klasik Zarafet"
  | "Aşk Yazısı"
  | "Dergi Şıklığı"
  | "Film Noir"
  | "Pastel Rüya"
  | "Sade Şıklık"
  | "Sonbahar Sıcaklığı"
  | "Altın Saat"
  | "Zamansız Klasik";

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
    id: "Romantik Şeker",
    label: "Romantik Şeker",
    mood: "Sıcak pembe tonlar, modern ve şeker gibi tatlı bir romantizm.",
    previewImage: "/themes/soft-romance.jpg",
    heroTitleSize: "clamp(3.2rem, 6vw, 4.8rem)",
    heroSubtitleSize: "1.2rem",
    settings: {
      fontFamily: "pacifico",
      backgroundColor: "#0d0508",
      backgroundOverlayOpacity: 0.62,
      heroSubtitleColor: "#ffd6e8",
      heroNamesColor: "#fff0f7",
      ampersandColor: "#ffadd2",
      dividerColor: "rgba(255,173,210,0.60)",
      backgroundBaseColor: "#12060a",
      headingColor: "#fff0f7",
      personNameColor: "#ffd6e8",
      familyRowColor: "#ffd6e8",
      parentRowColor: "#ffd6e8",
      photoBorderColor: "#ffadd2",
      lowerMessageColor: "#ffd6e8",
      lowerCoupleNameColor: "#fff0f7",
      sectionCardBackground: "rgba(20,5,12,0.72)",
      sectionCardBorderColor: "rgba(255,150,200,0.22)",
      donationBackground: "rgba(20,5,12,0.72)",
      locationBackground: "rgba(20,5,12,0.72)",
      footerBackground: "rgba(20,5,12,0.72)",
    },
    requiresLicense: false,
  },
  {
    id: "Klasik Zarafet",
    label: "Klasik Zarafet",
    mood: "Altın ve siyah; asırlık zarafet, akıcı el yazısı, kalıcı şıklık.",
    previewImage: "/themes/classic-elegance.jpg",
    heroTitleSize: "clamp(3.8rem, 7vw, 5.8rem)",
    heroSubtitleSize: "1.25rem",
    settings: {
      fontFamily: "italianno",
      backgroundColor: "#050400",
      backgroundOverlayOpacity: 0.55,
      heroSubtitleColor: "#f0e6c8",
      heroNamesColor: "#fff8e8",
      ampersandColor: "#d4a017",
      dividerColor: "rgba(212,160,23,0.75)",
      backgroundBaseColor: "#0c0a02",
      headingColor: "#fff8e8",
      personNameColor: "#f0e6c8",
      familyRowColor: "#f0e6c8",
      parentRowColor: "#f0e6c8",
      photoBorderColor: "#d4a017",
      lowerMessageColor: "#f0e6c8",
      lowerCoupleNameColor: "#fff8e8",
      sectionCardBackground: "rgba(5,4,0,0.78)",
      sectionCardBorderColor: "rgba(212,160,23,0.32)",
      donationBackground: "rgba(5,4,0,0.78)",
      locationBackground: "rgba(5,4,0,0.78)",
      footerBackground: "rgba(5,4,0,0.78)",
    },
    requiresLicense: false,
  },
  {
    id: "Aşk Yazısı",
    label: "Aşk Yazısı",
    mood: "El yazısının romantizmi; derin mor tonlarda büyülü bir davetiye.",
    previewImage: "/themes/romantic-script.jpg",
    heroTitleSize: "clamp(3.6rem, 7vw, 5.5rem)",
    heroSubtitleSize: "1.2rem",
    settings: {
      fontFamily: "great-vibes",
      backgroundColor: "#07030f",
      backgroundOverlayOpacity: 0.60,
      heroSubtitleColor: "#e8d8ff",
      heroNamesColor: "#f5ecff",
      ampersandColor: "#c084fc",
      dividerColor: "rgba(192,132,252,0.60)",
      backgroundBaseColor: "#0f0818",
      headingColor: "#f5ecff",
      personNameColor: "#e8d8ff",
      familyRowColor: "#e8d8ff",
      parentRowColor: "#e8d8ff",
      photoBorderColor: "#c084fc",
      lowerMessageColor: "#e8d8ff",
      lowerCoupleNameColor: "#f5ecff",
      sectionCardBackground: "rgba(7,3,15,0.80)",
      sectionCardBorderColor: "rgba(192,132,252,0.30)",
      donationBackground: "rgba(7,3,15,0.80)",
      locationBackground: "rgba(7,3,15,0.80)",
      footerBackground: "rgba(7,3,15,0.80)",
    },
    requiresLicense: false,
  },
  {
    id: "Dergi Şıklığı",
    label: "Dergi Şıklığı",
    mood: "Dergi kapağı estetiği; soğuk gri tonlar, güçlü kontrast, sofistike duruş.",
    previewImage: "/themes/editorial-chic.jpg",
    heroTitleSize: "clamp(3.0rem, 5.5vw, 4.6rem)",
    heroSubtitleSize: "1.0rem",
    settings: {
      fontFamily: "cormorant",
      backgroundColor: "#060608",
      backgroundOverlayOpacity: 0.65,
      heroSubtitleColor: "#c8c8d4",
      heroNamesColor: "#f0f0f8",
      ampersandColor: "#8888aa",
      dividerColor: "rgba(200,200,212,0.50)",
      backgroundBaseColor: "#08080c",
      headingColor: "#f0f0f8",
      personNameColor: "#c8c8d4",
      familyRowColor: "#c8c8d4",
      parentRowColor: "#c8c8d4",
      photoBorderColor: "#8888aa",
      lowerMessageColor: "#c8c8d4",
      lowerCoupleNameColor: "#f0f0f8",
      sectionCardBackground: "rgba(0,0,4,0.82)",
      sectionCardBorderColor: "rgba(140,140,170,0.24)",
      donationBackground: "rgba(0,0,4,0.82)",
      locationBackground: "rgba(0,0,4,0.82)",
      footerBackground: "rgba(0,0,4,0.82)",
    },
    requiresLicense: false,
  },
  {
    id: "Film Noir",
    label: "Film Noir",
    mood: "Siyah-beyaz fotoğraf ruhu; nostaljik, dramatik ve zamansız.",
    previewImage: "/themes/vintage-noir.jpg",
    heroTitleSize: "clamp(3.2rem, 6vw, 4.8rem)",
    heroSubtitleSize: "1.1rem",
    settings: {
      fontFamily: "lugrasimo",
      backgroundColor: "#020202",
      backgroundOverlayOpacity: 0.68,
      heroSubtitleColor: "#d8d8d8",
      heroNamesColor: "#f5f5f5",
      ampersandColor: "#a0a0a0",
      dividerColor: "rgba(200,200,200,0.55)",
      backgroundBaseColor: "#0a0a0a",
      headingColor: "#f5f5f5",
      personNameColor: "#d8d8d8",
      familyRowColor: "#d8d8d8",
      parentRowColor: "#d8d8d8",
      photoBorderColor: "#a0a0a0",
      lowerMessageColor: "#d8d8d8",
      lowerCoupleNameColor: "#f5f5f5",
      sectionCardBackground: "rgba(0,0,0,0.84)",
      sectionCardBorderColor: "rgba(200,200,200,0.22)",
      donationBackground: "rgba(0,0,0,0.84)",
      locationBackground: "rgba(0,0,0,0.84)",
      footerBackground: "rgba(0,0,0,0.84)",
    },
    requiresLicense: false,
  },
  {
    id: "Pastel Rüya",
    label: "Pastel Rüya",
    mood: "Lavanta ve şeftali tonları; yumuşak, samimi ve masal gibi.",
    previewImage: "/themes/pastel-dream.jpg",
    heroTitleSize: "clamp(3.0rem, 5.8vw, 4.5rem)",
    heroSubtitleSize: "1.15rem",
    settings: {
      fontFamily: "charm",
      backgroundColor: "#100d1c",
      backgroundOverlayOpacity: 0.64,
      heroSubtitleColor: "#f8d7ea",
      heroNamesColor: "#fff0f8",
      ampersandColor: "#f0abcc",
      dividerColor: "rgba(240,171,204,0.60)",
      backgroundBaseColor: "#0e0b18",
      headingColor: "#fff0f8",
      personNameColor: "#f8d7ea",
      familyRowColor: "#f8d7ea",
      parentRowColor: "#f8d7ea",
      photoBorderColor: "#f0abcc",
      lowerMessageColor: "#f8d7ea",
      lowerCoupleNameColor: "#fff0f8",
      sectionCardBackground: "rgba(8,5,18,0.82)",
      sectionCardBorderColor: "rgba(240,171,204,0.28)",
      donationBackground: "rgba(8,5,18,0.82)",
      locationBackground: "rgba(8,5,18,0.82)",
      footerBackground: "rgba(8,5,18,0.82)",
    },
    requiresLicense: false,
  },
  {
    id: "Sade Şıklık",
    label: "Sade Şıklık",
    mood: "Az renk, maksimum etki; modern minimalist çiftler için.",
    previewImage: "/themes/modern-minimal.jpg",
    heroTitleSize: "clamp(2.8rem, 5vw, 4.2rem)",
    heroSubtitleSize: "0.95rem",
    settings: {
      fontFamily: "sofia",
      backgroundColor: "#040405",
      backgroundOverlayOpacity: 0.60,
      heroSubtitleColor: "#e0e0e8",
      heroNamesColor: "#f8f8fc",
      ampersandColor: "#6080ff",
      dividerColor: "rgba(96,128,255,0.45)",
      backgroundBaseColor: "#080810",
      headingColor: "#f8f8fc",
      personNameColor: "#e0e0e8",
      familyRowColor: "#e0e0e8",
      parentRowColor: "#e0e0e8",
      photoBorderColor: "#6080ff",
      lowerMessageColor: "#e0e0e8",
      lowerCoupleNameColor: "#f8f8fc",
      sectionCardBackground: "rgba(0,0,6,0.82)",
      sectionCardBorderColor: "rgba(96,128,255,0.22)",
      donationBackground: "rgba(0,0,6,0.82)",
      locationBackground: "rgba(0,0,6,0.82)",
      footerBackground: "rgba(0,0,6,0.82)",
    },
    requiresLicense: true,
  },
  {
    id: "Sonbahar Sıcaklığı",
    label: "Sonbahar Sıcaklığı",
    mood: "Amber ve terra cotta tonları; sıcak, samimi, orman hisli.",
    previewImage: "/themes/warm-autumn.jpg",
    heroTitleSize: "clamp(3.4rem, 6.5vw, 5.2rem)",
    heroSubtitleSize: "1.2rem",
    settings: {
      fontFamily: "cookie",
      backgroundColor: "#160d06",
      backgroundOverlayOpacity: 0.66,
      heroSubtitleColor: "#ffe0c0",
      heroNamesColor: "#fff4e6",
      ampersandColor: "#e8943a",
      dividerColor: "rgba(232,148,58,0.65)",
      backgroundBaseColor: "#100804",
      headingColor: "#fff4e6",
      personNameColor: "#ffe0c0",
      familyRowColor: "#ffe0c0",
      parentRowColor: "#ffe0c0",
      photoBorderColor: "#e8943a",
      lowerMessageColor: "#ffe0c0",
      lowerCoupleNameColor: "#fff4e6",
      sectionCardBackground: "rgba(14,6,2,0.85)",
      sectionCardBorderColor: "rgba(232,148,58,0.32)",
      donationBackground: "rgba(14,6,2,0.85)",
      locationBackground: "rgba(14,6,2,0.85)",
      footerBackground: "rgba(14,6,2,0.85)",
    },
    requiresLicense: true,
  },
  {
    id: "Altın Saat",
    label: "Altın Saat",
    mood: "Gün batımı altını; ışıltılı, sıcak ve unutulmaz bir akşam.",
    previewImage: "/themes/golden-hour.jpg",
    heroTitleSize: "clamp(3.5rem, 6.5vw, 5.4rem)",
    heroSubtitleSize: "1.2rem",
    settings: {
      fontFamily: "dancing-script",
      backgroundColor: "#120e04",
      backgroundOverlayOpacity: 0.68,
      heroSubtitleColor: "#ffe8b0",
      heroNamesColor: "#fff8e6",
      ampersandColor: "#f5c842",
      dividerColor: "rgba(245,200,66,0.65)",
      backgroundBaseColor: "#0e0a02",
      headingColor: "#fff8e6",
      personNameColor: "#ffe8b0",
      familyRowColor: "#ffe8b0",
      parentRowColor: "#ffe8b0",
      photoBorderColor: "#f5c842",
      lowerMessageColor: "#ffe8b0",
      lowerCoupleNameColor: "#fff8e6",
      sectionCardBackground: "rgba(12,8,0,0.86)",
      sectionCardBorderColor: "rgba(245,200,66,0.30)",
      donationBackground: "rgba(12,8,0,0.86)",
      locationBackground: "rgba(12,8,0,0.86)",
      footerBackground: "rgba(12,8,0,0.86)",
    },
    requiresLicense: true,
  },
  {
    id: "Zamansız Klasik",
    label: "Zamansız Klasik",
    mood: "Antika krem ve altın; zamanın üstünde duran, kalıcı zarafet.",
    previewImage: "/themes/timeless-classic.jpg",
    heroTitleSize: "clamp(2.8rem, 5vw, 4.4rem)",
    heroSubtitleSize: "1.05rem",
    settings: {
      fontFamily: "playfair",
      backgroundColor: "#060508",
      backgroundOverlayOpacity: 0.62,
      heroSubtitleColor: "#ece4d0",
      heroNamesColor: "#faf6ee",
      ampersandColor: "#c8a96e",
      dividerColor: "rgba(200,169,110,0.60)",
      backgroundBaseColor: "#0c0a0e",
      headingColor: "#faf6ee",
      personNameColor: "#ece4d0",
      familyRowColor: "#ece4d0",
      parentRowColor: "#ece4d0",
      photoBorderColor: "#c8a96e",
      lowerMessageColor: "#ece4d0",
      lowerCoupleNameColor: "#faf6ee",
      sectionCardBackground: "rgba(4,2,6,0.82)",
      sectionCardBorderColor: "rgba(200,169,110,0.28)",
      donationBackground: "rgba(4,2,6,0.82)",
      locationBackground: "rgba(4,2,6,0.82)",
      footerBackground: "rgba(4,2,6,0.82)",
    },
    requiresLicense: true,
  },
];

export default function EditorPage() {
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  // İlk localStorage yüklemesi tamamlandıktan sonra true — save'i yanlışlıkla tetiklemez
  const readyToSave = useRef(false);
  const licenseRef = useRef<LicenseInfo>(DEFAULT_LICENSE);
  const [settings, setSettings] =
    useState<InvitationSettings>(DEFAULT_SETTINGS);
  const [isMac, setIsMac] = useState(false);
  const [license, setLicense] = useState<LicenseInfo>(DEFAULT_LICENSE);
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState<string>("");
  const [isEditingToken, setIsEditingToken] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

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
  const handleShareWhatsApp = (guest: Guest, fallbackHref: string) => {
    const linkToShare =
      (guest.inviteUrl && guest.inviteUrl.trim()) || fallbackHref || "";

    if (!linkToShare) return;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(
      `Davet linkiniz: ${linkToShare}`
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
    licenseRef.current = license;
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
  useEffect(() => {
    // İlk yükleme tamamlanmadan save'i engelle
    if (!readyToSave.current) return;

    const controller = new AbortController();

    const save = async () => {
      try {
        setIsSavingEvent(true);
        setSaveError(null);

        const currentLicense = licenseRef.current;
        const res = await fetch(`${API_BASE}/save_event.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            token: currentLicense.token ?? null,
            eventId: currentLicense.eventId ?? null,
            settings,
          }),
        });

        const text = await res.text();
        console.log("[save_event]", { status: res.status, token: currentLicense.token, eventId: currentLicense.eventId, response: text });

        if (!res.ok) {
          setSaveError("Değişiklikler kaydedilemedi.");
          return;
        }

        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          setSaveError("Sunucudan geçersiz yanıt alındı.");
          return;
        }

        if (!data.success) {
          setSaveError(data.error || "Değişiklikler kaydedilemedi.");
          return;
        }

        setIsDirty(false);
        setLastSavedAt(new Date());
        setSaveError(null);

        if (typeof data.eventId === "number") {
          setLicense((prev) => ({ ...prev, eventId: data.eventId }));
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") return;
        setSaveError("Sunucuya ulaşılamadı.");
      } finally {
        setIsSavingEvent(false);
      }
    };

    setIsDirty(true);
    const t = setTimeout(save, 1500);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

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
    // USER modunda lisans zorunlu, ADMIN modunda serbest
    if (mode === "user" && !license.valid) {
      setLicenseError("Önce geçerli bir lisans token doğrulamalısınız.");
      return;
    }

    const savedGuestsCount = license.usedGuests;
    const draftGuestsCount = guests.filter((g) => g.status !== "saved").length;
    const effectiveUsed = savedGuestsCount + draftGuestsCount;

    if (mode === "user" && effectiveUsed >= license.maxGuests) {
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

  const handleSaveGuest = async (guest: Guest) => {
    if (mode === "user" && (!license.valid || !license.token)) {
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

    const tokenToUse = license.token;
    if (!tokenToUse) {
      if (mode === "admin") {
        setLicenseError(
          "Admin modundasınız, önce üstteki panelden token üretip kaydetmeniz gerekiyor."
        );
      }
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
          token: tokenToUse,
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
    // Kısa bir gecikme sonrası save'e izin ver — ilk render'ı atla
    setTimeout(() => { readyToSave.current = true; }, 300);
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

    console.log("API_BASE:", API_BASE);

    try {
      const res = await fetch(`${API_BASE}/verify_token.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      {showIntro && (
        <EnvelopeHero
          onOpen={() => setShowIntro(false)}
          brideName={settings.brideName}
          groomName={settings.groomName}
        />
      )}

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
        <div className="fixed bottom-6 right-5 z-30 flex flex-col items-end gap-2">
          <button
            onClick={() => { setMode("user"); setIsEditorOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-sm border border-white/10 text-[0.72rem] font-medium text-white shadow-xl shadow-black/30 hover:bg-slate-800 transition"
          >
            <span className="text-sm">✏️</span>
            <span>Düzenle</span>
            <span
              className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.58rem] text-slate-300"
              aria-hidden="true"
            >
              {isMac ? "⌘" : "Ctrl"} B
            </span>
          </button>

          <button
            onClick={() => { setMode("admin"); setIsEditorOpen(true); }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-red-600/85 backdrop-blur-sm border border-red-400/40 text-[0.68rem] font-medium text-white shadow-lg hover:bg-red-600 transition"
          >
            <span className="text-xs">⚙</span>
            Admin
          </button>
        </div>
      )}

      {/* Editör paneli */}
      {isEditorOpen && (
        <div
          className={[
            "mt-[88px] w-full bg-white text-slate-900 border-t border-slate-200 z-40 editor-font flex flex-col",
            "md:mt-0 md:fixed md:top-[60px] md:right-0 md:h-[calc(100%-60px)] md:max-w-[400px] md:border-l md:border-t-0 md:rounded-l-2xl md:shadow-2xl md:shadow-slate-900/20",
          ].join(" ")}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 rounded-tl-2xl">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-sm select-none">
                ✏️
              </span>
              <div>
                <h1 className="text-[0.8rem] font-semibold text-white tracking-tight leading-none">
                  Davetiye Stüdyosu
                </h1>
                <p className="text-[0.62rem] text-slate-400 mt-0.5 leading-none">
                  {mode === "admin" ? "Admin modu" : "Canlı önizleme ile düzenle"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Save status pill */}
              {saveError ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-[0.6rem] text-red-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  Hata
                </span>
              ) : isSavingEvent ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-[0.6rem] text-amber-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                  Kaydediliyor
                </span>
              ) : isDirty ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[0.6rem] text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" />
                  Kaydedilecek
                </span>
              ) : lastSavedAt ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-[0.6rem] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  Kaydedildi
                </span>
              ) : null}

              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs transition"
                aria-label="Editörü kapat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── Lisans barı ── sadece user modunda göster */}
          {mode === "user" && (
            <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-950/[0.03]">
              {license.valid && !isEditingToken ? (
                /* ── AKTİF LİSANS KARTI ── */
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-3.5 py-2.5 flex items-center gap-3 shadow-lg shadow-slate-900/20">
                  {/* İkon */}
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {/* Bilgi */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <p className="text-[0.68rem] font-semibold text-emerald-400 leading-none">Lisans Aktif</p>
                    </div>
                    <p className="text-[0.62rem] text-slate-400 font-mono truncate">
                      {license.token ? `${license.token.slice(0, 16)}…` : "—"}
                    </p>
                    {license.maxGuests > 0 && (
                      <div className="mt-1.5">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[0.58rem] text-slate-500">Davetli kullanımı</span>
                          <span className="text-[0.58rem] text-slate-400 font-medium">
                            {license.usedGuests} / {license.maxGuests}
                          </span>
                        </div>
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (license.usedGuests / license.maxGuests) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Değiştir butonu */}
                  <button
                    type="button"
                    onClick={() => { setTokenInput(license.token ?? ""); setIsEditingToken(true); }}
                    className="flex-shrink-0 px-2 py-1 rounded-lg bg-white/8 hover:bg-white/14 border border-white/10 text-[0.6rem] text-slate-400 hover:text-white transition"
                  >
                    Değiştir
                  </button>
                </div>
              ) : (
                /* ── TOKEN GİRİŞ FORMU ── */
                <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 px-3.5 py-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-amber-600">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.7rem] font-semibold text-slate-800 leading-none">Lisans Kodu Gir</p>
                      <p className="text-[0.6rem] text-slate-500 mt-0.5">Premium özellikleri ve davetli yönetimini açar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { handleVerifyToken().then(() => { if (!licenseError) setIsEditingToken(false); }); } }}
                      placeholder="INV-50-ABC123"
                      className="flex-1 px-3 py-2 rounded-xl border border-amber-200 bg-white text-[0.75rem] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition shadow-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={async () => { await handleVerifyToken(); if (!licenseError) setIsEditingToken(false); }}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 text-[0.72rem] font-semibold text-white hover:bg-slate-700 active:scale-95 transition shadow-sm"
                    >
                      Doğrula
                    </button>
                  </div>
                  {licenseError && (
                    <div className="mt-2 flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-100">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <p className="text-[0.66rem] text-red-600">{licenseError}</p>
                    </div>
                  )}
                </div>
              )}
              {license.valid && !isEditingToken && licenseError && (
                <p className="mt-1.5 text-[0.66rem] text-red-600">{licenseError}</p>
              )}
            </div>
          )}

          {mode === "admin" && (
            <div className="px-3 py-2.5 border-b border-slate-200">
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-3.5 py-3 shadow-lg shadow-slate-900/15">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-400/30 flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-red-400">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-semibold text-white leading-none">Lisans Token Üret</p>
                    <p className="text-[0.6rem] text-slate-400 mt-0.5">Yeni token oluştur ve panoya kopyala</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <label className="block text-[0.6rem] text-slate-500 mb-1">Max Davetli</label>
                    <input
                      type="number"
                      min={0}
                      value={license.maxGuests || 50}
                      onChange={(e) =>
                        setLicense((prev) => ({
                          ...prev,
                          maxGuests: Number(e.target.value || 0),
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/8 text-[0.72rem] text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition font-mono"
                      placeholder="50"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-[0.7rem] font-semibold hover:bg-slate-100 active:scale-95 transition shadow-sm"
                      onClick={async () => {
                        try {
                          const res = await fetch(`${API_BASE}/create_token.php`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              maxGuests: license.maxGuests || 50,
                              plan: "admin-generated",
                              validDays: 365,
                            }),
                          });

                          const data = await res.json();
                          if (!data.success) {
                            setLicenseError(data.error || "Token oluşturulamadı.");
                            return;
                          }

                          setLicense({
                            token: data.token,
                            maxGuests: Number(data.maxGuests || 0),
                            usedGuests: 0,
                            eventId: null,
                            valid: true,
                          });
                          setTokenInput(data.token);

                          try {
                            await navigator.clipboard.writeText(data.token);
                          } catch {
                            // sessiz geç
                          }
                        } catch (e) {
                          console.error("create_token error", e);
                          setLicenseError("Token oluşturulurken bir hata oluştu.");
                        }
                      }}
                    >
                      Üret
                    </button>
                  </div>
                </div>
                {license.token && (
                  <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/6 border border-white/10">
                    <span className="text-[0.58rem] text-slate-500 flex-shrink-0">Token</span>
                    <span className="flex-1 text-[0.65rem] text-emerald-400 font-mono truncate">{license.token}</span>
                    <button
                      type="button"
                      onClick={() => { try { navigator.clipboard.writeText(license.token!); } catch { } }}
                      className="flex-shrink-0 text-slate-500 hover:text-white transition"
                      title="Kopyala"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                )}
                {licenseError && (
                  <p className="mt-2 text-[0.65rem] text-red-400">{licenseError}</p>
                )}
              </div>
            </div>
          )}
          {/* ── Step navigation ── */}
          <div className="flex border-b border-slate-100 bg-white">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id as any)}
                className={[
                  "flex-1 flex flex-col items-center gap-0.5 py-2.5 text-center transition-colors relative",
                  activeStep === step.id
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600",
                ].join(" ")}
              >
                <span className="text-[1.05rem] leading-none select-none">{step.icon}</span>
                <span className="text-[0.58rem] font-medium leading-none">{step.label}</span>
                {activeStep === step.id && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-900 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <div className="px-4 pb-8 pt-4 bg-white flex-1 overflow-y-auto">
            {activeStep === 1 && (
              <>
                <SectionTitle label="Davetiye Başlığı" />
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      value={settings.heroSubtitle}
                      onChange={(e) =>
                        handleChange("heroSubtitle", e.target.value)
                      }
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-[0.8rem] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition shadow-sm"
                      placeholder="Davetiye başlık metnini girin"
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
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-700 text-white transition active:scale-95"
                      title="Rastgele öner"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {/* Hazır başlık seçenekleri */}
                  <div className="flex flex-wrap gap-1.5">
                    {HERO_SUBTITLE_OPTIONS.slice(0, 8).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange("heroSubtitle", opt)}
                        className={[
                          "px-2.5 py-1 rounded-full text-[0.62rem] border transition",
                          settings.heroSubtitle === opt
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    ))}
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

                <div className="mb-4">
                  {/* Toggle */}
                  <label className="flex items-center justify-between mb-3 cursor-pointer group">
                    <span className="text-[0.78rem] text-slate-700 group-hover:text-slate-900 transition">
                      Akışı davetiyede göster
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.showScheduleSection ?? false}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            showScheduleSection: e.target.checked,
                          }))
                        }
                        className="sr-only"
                      />
                      <div className={[
                        "w-10 h-5.5 rounded-full transition-colors",
                        (settings.showScheduleSection ?? false) ? "bg-slate-900" : "bg-slate-200",
                      ].join(" ")} style={{ height: "22px", width: "40px" }}>
                        <div className={[
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                          (settings.showScheduleSection ?? false) ? "translate-x-5" : "translate-x-0.5",
                        ].join(" ")} />
                      </div>
                    </div>
                  </label>

                  {(settings.showScheduleSection ?? false) && (
                    <div>
                      {/* Hızlı preset butonları */}
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setSettings((prev) => ({ ...prev, scheduleItems: SCHEDULE_PRESETS.classic }))}
                          className="flex-1 px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-[0.65rem] text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition text-center"
                        >
                          Klasik Düğün
                        </button>
                        <button
                          type="button"
                          onClick={() => setSettings((prev) => ({ ...prev, scheduleItems: SCHEDULE_PRESETS.longCocktail }))}
                          className="flex-1 px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-[0.65rem] text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition text-center"
                        >
                          Kokteyl & Düğün
                        </button>
                      </div>

                      {/* Akış listesi */}
                      <div className="space-y-2 mb-3">
                        {(settings.scheduleItems ?? []).map((item, index) => (
                          <div
                            key={index}
                            className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                          >
                            <div className="flex items-center gap-0 border-b border-slate-100">
                              {/* Sıra numarası */}
                              <div className="w-9 flex items-center justify-center py-2.5 flex-shrink-0">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[0.58rem] font-semibold flex items-center justify-center">
                                  {index + 1}
                                </span>
                              </div>
                              {/* Saat input */}
                              <input
                                value={item.time}
                                onChange={(e) => {
                                  const next = [...(settings.scheduleItems ?? [])];
                                  next[index] = { ...next[index], time: e.target.value };
                                  setSettings((prev) => ({ ...prev, scheduleItems: next }));
                                }}
                                placeholder="18:00"
                                className="w-16 py-2 bg-transparent text-[0.72rem] text-slate-500 placeholder:text-slate-300 focus:outline-none font-mono border-r border-slate-100"
                              />
                              {/* Başlık input */}
                              <input
                                value={item.title}
                                onChange={(e) => {
                                  const next = [...(settings.scheduleItems ?? [])];
                                  next[index] = { ...next[index], title: e.target.value };
                                  setSettings((prev) => ({ ...prev, scheduleItems: next }));
                                }}
                                placeholder="Etkinlik adı"
                                className="flex-1 px-2.5 py-2 bg-transparent text-[0.78rem] text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none"
                              />
                              {/* Sil butonu */}
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (settings.scheduleItems ?? []).filter((_, i) => i !== index);
                                  setSettings((prev) => ({ ...prev, scheduleItems: next }));
                                }}
                                className="w-9 flex items-center justify-center py-2.5 flex-shrink-0 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                title="Adımı sil"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                            {/* Açıklama */}
                            <textarea
                              value={item.description}
                              onChange={(e) => {
                                const next = [...(settings.scheduleItems ?? [])];
                                next[index] = { ...next[index], description: e.target.value };
                                setSettings((prev) => ({ ...prev, scheduleItems: next }));
                              }}
                              rows={2}
                              placeholder="Kısa açıklama (isteğe bağlı)"
                              className="w-full px-3 pt-2 pb-2.5 bg-slate-50 text-[0.72rem] text-slate-600 placeholder:text-slate-300 focus:outline-none resize-none"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Ekle butonu */}
                      <button
                        type="button"
                        onClick={() => {
                          const next = [
                            ...(settings.scheduleItems ?? []),
                            { time: "", title: "", description: "" },
                          ];
                          setSettings((prev) => ({ ...prev, scheduleItems: next }));
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-[0.72rem] hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Yeni Adım Ekle
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
                    const isActive = settings.fontFamily === theme.settings.fontFamily;
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
                          <ThemePreviewArt
                            themeId={theme.id}
                            brideName={settings.brideName}
                            groomName={settings.groomName}
                          />
                          {locked && (
                            <div className="absolute inset-0 top-auto h-28 bg-gradient-to-b from-black/50 via-black/70 to-black/90 flex items-center justify-center z-10">
                              <div className="px-3 py-1.5 rounded-full bg-white/95 border border-slate-300 shadow-lg flex items-center gap-1.5">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[0.55rem] text-white">
                                  ★
                                </span>
                                <span className="text-[0.65rem] font-semibold text-slate-900 tracking-[0.12em] uppercase">
                                  Premium Tema
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-2.5">
                          <p className="font-semibold text-[0.78rem] text-slate-900 flex items-center gap-1.5">
                            {theme.label}
                            {theme.requiresLicense && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-[0.58rem] text-amber-700 border border-amber-200 font-medium">
                                Premium
                              </span>
                            )}
                            {isActive && (
                              <span className="ml-auto px-1.5 py-0.5 rounded-full bg-emerald-50 text-[0.58rem] text-emerald-700 border border-emerald-200 font-medium">
                                Aktif
                              </span>
                            )}
                          </p>
                          <p className="text-[0.65rem] text-slate-500 mt-0.5 line-clamp-2">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {THEMES.map((theme) => {
                    const isActive = settings.fontFamily === theme.settings.fontFamily;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => applyTheme(theme.id)}
                        className={[
                          "flex flex-col items-stretch rounded-xl border overflow-hidden text-left text-[0.7rem] transition shadow-sm relative",
                          isActive
                            ? "border-slate-900 bg-slate-900/5"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="h-24 w-full overflow-hidden bg-slate-800 relative">
                          <ThemePreviewArt
                            themeId={theme.id}
                            brideName={settings.brideName}
                            groomName={settings.groomName}
                          />
                        </div>
                        <div className="px-3 py-2 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {theme.label}
                            </p>
                            <p className="text-[0.65rem] text-slate-500 line-clamp-2">
                              {theme.mood}
                            </p>
                          </div>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[0.6rem] font-semibold">
                              Aktif
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
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
                      className={`px-3 py-1.5 rounded-full transition ${familyTab === "family1"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-300 hover:text-white"
                        }`}
                    >
                      Birinci Aile
                    </button>
                    <button
                      type="button"
                      onClick={() => setFamilyTab("family2")}
                      className={`px-3 py-1.5 rounded-full transition ${familyTab === "family2"
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
                          onChange={(e) => {
                            const org = e.target
                              .value as InvitationSettings["donationOrganization"];

                            // Önce organizasyonu güncelle
                            handleChange("donationOrganization", org);

                            // Sonra hazır metni donationText'e yaz
                            setSettings((prev) => ({
                              ...prev,
                              donationText: DONATION_MESSAGES[org],
                            }));
                          }}
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
                  <>
                    <p className="mb-3 text-[0.75rem] text-slate-500">
                      Davetli listesi ve kişiye özel davet linkleri özelliğini
                      kullanmak için önce lisans satın almanız gerekir. Güvenli
                      ödeme altyapısıyla Shopier üzerinden hemen lisans satın
                      alabilirsiniz.
                    </p>
                    <a
                      href="https://www.shopier.com/..." // kendi Shopier ürün/link adresini yaz
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[0.7rem] font-medium hover:bg-slate-800"
                    >
                      Shopier üzerinden lisans satın al
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
                        className="inline-block"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </>
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
                        className="mt-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-1 py-1"
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
                                guest.inviteUrl && guest.inviteUrl.trim()
                                  ? guest.inviteUrl
                                  : isSaved && license.token
                                    ? `${origin}/invite/${guest.slug
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
                                            "absolute z-40 min-w-[220px] max-w-xs rounded-2xl",
                                            "border border-slate-200 bg-white/98 shadow-2xl",
                                            "py-2 max-h-72 overflow-y-auto",
                                            "backdrop-blur-sm",
                                            isLastRow
                                              ? "right-0 bottom-11"
                                              : "right-0 top-11",
                                          ].join(" ")}
                                        >
                                          {/* Başlık */}
                                          <div className="px-3 pb-1 border-b border-slate-100">
                                            <p className="text-[0.7rem] font-semibold text-slate-800 truncate">
                                              {guest.name || "İsimsiz davetli"}
                                            </p>
                                            <p className="text-[0.65rem] text-slate-400">
                                              Davet linki için işlemler
                                            </p>
                                          </div>

                                          {/* Aksiyonlar */}
                                          <div className="py-1">
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
                                              className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[0.7rem] text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1"
                                            >
                                              <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-red-500 text-white text-[0.6rem]">
                                                🗑
                                              </span>
                                              Davetliyi sil
                                            </button>
                                          </div>
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
          <SpeedInsights />
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
    <div className="mt-5 mb-3 flex items-center gap-2.5">
      <span className="block w-[3px] h-4 rounded-full bg-slate-800 flex-shrink-0" />
      <span className="text-[0.68rem] font-semibold tracking-[0.13em] text-slate-700 uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-100" />
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
      <label className="block mb-1.5 text-[0.7rem] font-medium text-slate-600">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-[0.8rem] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/8 focus:border-slate-400 transition shadow-sm"
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
      <label className="block mb-1.5 text-[0.7rem] font-medium text-slate-600">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-[0.8rem] resize-y placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/8 focus:border-slate-400 transition shadow-sm"
      />
      {helperText && (
        <p className="mt-1 text-[0.65rem] text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }: FieldProps) {
  const safeHex = /^#[0-9a-fA-F]{3,6}$/.test(value) ? value : "#ffffff";
  return (
    <div className="mb-2.5">
      <label className="block mb-1.5 text-[0.7rem] font-medium text-slate-600">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg border border-slate-200 shadow-sm cursor-pointer"
            style={{ backgroundColor: safeHex }}
          />
          <input
            type="color"
            value={safeHex}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label={label}
          />
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-[0.72rem] font-mono focus:outline-none focus:ring-2 focus:ring-slate-900/8 focus:border-slate-400 transition shadow-sm"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

/* ---- Theme Preview Art ---- */

const THEME_ART: Record<
  ThemeId,
  {
    bg: string;
    glow: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    deco: "dots" | "lines" | "grid" | "film" | "petals" | "border" | "leaves" | "rays";
  }
> = {
  "Romantik Şeker": {
    bg: "linear-gradient(145deg, #1a0810 0%, #2e1020 50%, #1a0810 100%)",
    glow: "radial-gradient(ellipse at 50% 58%, rgba(255,100,160,0.40) 0%, transparent 65%)",
    textColor: "#ffd6e8",
    accentColor: "rgba(255,120,170,0.55)",
    fontFamily: "'Pacifico', cursive",
    deco: "dots",
  },
  "Klasik Zarafet": {
    bg: "linear-gradient(160deg, #0a0800 0%, #18130a 50%, #0a0800 100%)",
    glow: "radial-gradient(ellipse at 50% 40%, rgba(212,160,23,0.38) 0%, transparent 65%)",
    textColor: "#fff0c0",
    accentColor: "rgba(212,160,23,0.55)",
    fontFamily: "'Italianno', cursive",
    deco: "lines",
  },
  "Aşk Yazısı": {
    bg: "linear-gradient(140deg, #0e0518 0%, #1e0c30 50%, #0e0518 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(192,100,255,0.35) 0%, transparent 65%)",
    textColor: "#f0e0ff",
    accentColor: "rgba(192,100,255,0.50)",
    fontFamily: "'Great Vibes', cursive",
    deco: "dots",
  },
  "Dergi Şıklığı": {
    bg: "linear-gradient(160deg, #080810 0%, #10101e 50%, #080810 100%)",
    glow: "radial-gradient(ellipse at 50% 40%, rgba(120,120,200,0.22) 0%, transparent 58%)",
    textColor: "#c8c8e8",
    accentColor: "rgba(120,120,200,0.38)",
    fontFamily: "'Cormorant Garamond', serif",
    deco: "grid",
  },
  "Film Noir": {
    bg: "linear-gradient(180deg, #060606 0%, #101010 100%)",
    glow: "radial-gradient(ellipse at 50% 50%, rgba(220,220,220,0.10) 0%, transparent 58%)",
    textColor: "#d0d0d0",
    accentColor: "rgba(200,200,200,0.28)",
    fontFamily: "'Lugrasimo', cursive",
    deco: "film",
  },
  "Pastel Rüya": {
    bg: "linear-gradient(140deg, #0e0b1c 0%, #1c1530 50%, #0e0b1c 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(240,150,200,0.32) 0%, transparent 65%)",
    textColor: "#f8d8ec",
    accentColor: "rgba(240,150,200,0.50)",
    fontFamily: "'Charm', cursive",
    deco: "petals",
  },
  "Sade Şıklık": {
    bg: "linear-gradient(160deg, #060610 0%, #0e0e20 50%, #060610 100%)",
    glow: "radial-gradient(ellipse at 50% 40%, rgba(80,120,255,0.22) 0%, transparent 60%)",
    textColor: "#d0d8ff",
    accentColor: "rgba(80,120,255,0.40)",
    fontFamily: "'Sofia', cursive",
    deco: "border",
  },
  "Sonbahar Sıcaklığı": {
    bg: "linear-gradient(145deg, #160a02 0%, #2c1408 50%, #160a02 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(232,148,58,0.38) 0%, transparent 65%)",
    textColor: "#ffe0b0",
    accentColor: "rgba(232,148,58,0.55)",
    fontFamily: "'Cookie', cursive",
    deco: "leaves",
  },
  "Altın Saat": {
    bg: "linear-gradient(145deg, #140e00 0%, #281a02 50%, #140e00 100%)",
    glow: "radial-gradient(ellipse at 50% 50%, rgba(245,200,66,0.35) 0%, transparent 62%)",
    textColor: "#fff0b0",
    accentColor: "rgba(245,200,66,0.55)",
    fontFamily: "'Dancing Script', cursive",
    deco: "rays",
  },
  "Zamansız Klasik": {
    bg: "linear-gradient(160deg, #080608 0%, #12100e 50%, #080608 100%)",
    glow: "radial-gradient(ellipse at 50% 45%, rgba(200,169,110,0.24) 0%, transparent 60%)",
    textColor: "#f0e8d4",
    accentColor: "rgba(200,169,110,0.42)",
    fontFamily: "'Playfair Display', serif",
    deco: "border",
  },
};

function ThemePreviewArt({
  themeId,
  brideName,
  groomName,
}: {
  themeId: ThemeId;
  brideName?: string;
  groomName?: string;
}) {
  const art = THEME_ART[themeId];
  if (!art) return <div className="w-full h-full bg-slate-800" />;

  const b = (brideName ?? "").trim();
  const g = (groomName ?? "").trim();
  const initials =
    b && g
      ? `${b[0].toUpperCase()} & ${g[0].toUpperCase()}`
      : b
        ? b[0].toUpperCase()
        : g
          ? g[0].toUpperCase()
          : "S & M";

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: art.bg }}
      aria-hidden="true"
    >
      {/* Glow layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: art.glow }}
      />

      {/* Decoration layer */}
      <DecoLayer type={art.deco} accentColor={art.accentColor} />

      {/* Initials */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        <span
          style={{
            fontFamily: art.fontFamily,
            color: art.textColor,
            fontSize: "1.55rem",
            lineHeight: 1,
            textShadow: `0 2px 16px ${art.accentColor}`,
            letterSpacing: "0.06em",
            userSelect: "none",
          }}
        >
          {initials}
        </span>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
          zIndex: 3,
        }}
      />
    </div>
  );
}

function DecoLayer({
  type,
  accentColor,
}: {
  type: string;
  accentColor: string;
}) {
  if (type === "dots") {
    const dots = Array.from({ length: 18 });
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.45 }}
      >
        {dots.map((_, i) => (
          <circle
            key={i}
            cx={`${8 + (i % 6) * 17}%`}
            cy={`${12 + Math.floor(i / 6) * 35}%`}
            r="1.5"
            fill={accentColor}
          />
        ))}
      </svg>
    );
  }
  if (type === "lines") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.4 }}
      >
        {[20, 50, 80].map((y, i) => (
          <line
            key={i}
            x1="10%"
            y1={`${y}%`}
            x2="90%"
            y2={`${y}%`}
            stroke={accentColor}
            strokeWidth="0.8"
          />
        ))}
        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke={accentColor} strokeWidth="0.5" strokeDasharray="3 5" />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.25 }}
      >
        {[20, 40, 60, 80].map((v, i) => (
          <React.Fragment key={i}>
            <line x1={`${v}%`} y1="0" x2={`${v}%`} y2="100%" stroke={accentColor} strokeWidth="0.5" />
            <line x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke={accentColor} strokeWidth="0.5" />
          </React.Fragment>
        ))}
      </svg>
    );
  }
  if (type === "film") {
    const holes = Array.from({ length: 6 });
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.35 }}
      >
        {holes.map((_, i) => (
          <React.Fragment key={i}>
            <rect x={`${8 + i * 15}%`} y="8%" width="7%" height="12%" rx="2" fill="none" stroke={accentColor} strokeWidth="0.8" />
            <rect x={`${8 + i * 15}%`} y="78%" width="7%" height="12%" rx="2" fill="none" stroke={accentColor} strokeWidth="0.8" />
          </React.Fragment>
        ))}
      </svg>
    );
  }
  if (type === "petals") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.38 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {[
          [15, 20], [80, 15], [10, 75], [85, 80], [50, 10], [50, 88],
        ].map(([cx, cy], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="6" ry="10" fill={accentColor} transform={`rotate(${i * 60} ${cx} ${cy})`} />
        ))}
      </svg>
    );
  }
  if (type === "border") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.45 }}
      >
        <rect x="6%" y="8%" width="88%" height="84%" rx="4" fill="none" stroke={accentColor} strokeWidth="0.8" />
        <rect x="10%" y="13%" width="80%" height="74%" rx="3" fill="none" stroke={accentColor} strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    );
  }
  if (type === "leaves") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.40 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {[
          [12, 18, 0], [82, 22, 45], [8, 78, -20], [88, 76, 30],
          [25, 8, 10], [70, 90, -15],
        ].map(([cx, cy, rot], i) => (
          <path
            key={i}
            d={`M ${cx} ${cy} Q ${cx + 8} ${cy - 10} ${cx + 16} ${cy} Q ${cx + 8} ${cy + 4} ${cx} ${cy} Z`}
            fill={accentColor}
            transform={`rotate(${rot} ${cx + 8} ${cy})`}
          />
        ))}
      </svg>
    );
  }
  if (type === "rays") {
    const rays = Array.from({ length: 12 });
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, opacity: 0.30 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {rays.map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x2 = 50 + Math.cos(angle) * 55;
          const y2 = 50 + Math.sin(angle) * 55;
          return (
            <line key={i} x1="50" y1="50" x2={x2} y2={y2} stroke={accentColor} strokeWidth="0.6" />
          );
        })}
      </svg>
    );
  }
  return null;
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

  useEffect(() => {
    const els = document.querySelectorAll<Element>(".section-reveal");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [showScheduleSection, settings.showFamilySection, settings.showDonationSection]);

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
    embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - delta
      }%2C${mapLat - delta}%2C${mapLng + delta}%2C${mapLat + delta
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
        {/* <source src="/bg.webm" type="video/webm" /> */}
        <source src="/bg.mp4" type="video/webm" />
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
        {settings.guestName && (
          <section className="section section-invite section-reveal" id="invite">
            <div
              className="section-inner invite-card"
              style={{
                maxWidth: 640,
                margin: "0 auto",
                textAlign: "center",
                background: sectionCardBackground,
                borderRadius: 18,
                border: `1px solid ${sectionCardBorderColor}`,
                boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
                padding: "2.2rem 2rem",
              }}
            >
              <p className="invite-label">Değerli</p>
              <p className="invite-name">{settings.guestName}</p>

              <p className="invite-text">
                Bu özel günümüzde seni de aramızda görmeyi çok isteriz.
              </p>
            </div>
          </section>
        )}
        {settings.showDonationSection && (
          <section className="section section-reveal">
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
          <section className="section section-reveal">
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
            <section className="section section-reveal">
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
        <section className="section section-reveal" id="countdown">
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
        <section className="section section-location section-reveal" id="location">
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
