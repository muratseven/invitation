"use client";

import React, { useEffect, useState } from "react";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

function computeCountdown(target: Date): Countdown {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    finished: false,
  };
}

const EVENT_DATE = new Date("2026-05-24T13:30:00");

const SCHEDULE = [
  { time: "18:00", label: "Karşılama ve Kokteyl", desc: "Müzik eşliğinde sohbet ve ikramlar" },
  { time: "19:00", label: "Yemek Servisi", desc: "Yemek servisi başlıyor" },
  { time: "20:00", label: "Pasta Kesimi", desc: "Pasta kesimi ve kutlama" },
  { time: "∞", label: "DJ & Dans", desc: "Müzik durmayacak, pistin ortası her zaman açık." },
];

const C = "#973a47";

type Props = {
  guestName?: string;
};

export default function SineMuratDavetiye({ guestName }: Props) {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0, hours: 0, minutes: 0, seconds: 0, finished: false,
  });

  useEffect(() => {
    setCountdown(computeCountdown(EVENT_DATE));
    const id = setInterval(() => setCountdown(computeCountdown(EVENT_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const dateText = EVENT_DATE.toLocaleDateString("tr-TR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });

  const scrollToCountdown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("guest")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        /*
          Renk paleti:
          #6B0F18  — koyu şarap (başlıklar, vurgular)
          #a06070  — soluk gül (ikincil, etiketler)
          #c4849a  — açık pudra (süslemeler, ayırıcılar)

          Fontlar:
          Great Vibes        → büyük isim başlıkları (Sine & Murat)
          Cormorant Garamond → tarih, altyazı, konum etiketi
          Charm              → tarih/saat hero, aile isimleri
          Roboto             → adres, küçük etiket, teknik metin
        */

        /* ── Video arka plan ── */
        .sm-bg-video {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          z-index: -1;
        }
        @media (min-width: 768px) {
          .sm-bg-video { object-position: center top; }
        }

        /* ── Kök ── */
        .sm-root {
          position: relative;
          min-height: 100vh;
          color: #a06070;
          font-family: var(--font-cormorant-garamond), Georgia, serif;
        }

        /* ── HERO ── */
        .sm-hero {
          min-height: 90svh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(6rem, 18vh, 12rem) 1.25rem 2rem;
          text-align: center;
        }
        .sm-hero-inner { max-width: 560px; width: 100%; }

        .sm-subtitle {
          font-family: var(--font-charm), cursive;
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          letter-spacing: 0.08em;
          text-transform: none;
          color: #a06070;
          margin-bottom: 1.4rem;
          font-weight: 600;
        }
        .sm-title {
          font-family: var(--font-great-vibes), cursive;
          font-size: clamp(3.8rem, 13vw, 7.5rem);
          line-height: 1.05;
          letter-spacing: 0.04em;
          margin-bottom: 0.5rem;
          color: #6B0F18;
        }
        .sm-title-line { display: block; }
        .sm-ampersand {
          font-family: var(--font-cormorant-garamond), serif;
          display: block;
          font-size: clamp(1.3rem, 3vw, 1.7rem);
          color: #a06070;
          margin: 0.3rem 0;
          font-style: italic;
        }

        .sm-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 0;
        }
        .sm-divider-line {
          height: 1px;
          width: 3rem;
          background: linear-gradient(90deg, transparent, rgba(196,132,154,0.5) 40%, rgba(196,132,154,0.5) 60%, transparent);
        }
        .sm-divider-icon { font-size: 0.75rem; color: #c4849a; }

        .sm-date {
          font-family: var(--font-charm), cursive;
          font-size: clamp(1.5rem, 4vw, 2rem);
          letter-spacing: 0.06em;
          color: #6B0F18;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        .sm-time-row {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 0.3rem;
        }
        .sm-time-label {
          font-family: var(--font-charm), cursive;
          font-size: 1.5rem;
          color: #a06070;
          font-weight: 700;
        }
        .sm-time-text {
          font-family: var(--font-charm), cursive;
          font-size: 1.5rem;
          color: #a06070;
          font-weight: 700;
        }

        .sm-hero-families {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          width: 100%;
          padding-bottom: 0.7rem;
          border-bottom: 1px solid rgba(196,132,154,0.3);
          margin-bottom: 0.2rem;
        }
        .sm-hero-family-item {
          font-family: var(--font-charm), cursive;
          font-size: clamp(0.38rem, 0.9vw, 0.5rem);
          white-space: nowrap;
          color: #6B0F18;
          font-weight: 700;
          letter-spacing: 0.04em;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sm-hero-family-item:first-child { text-align: center; }
        .sm-hero-family-item:last-child  { text-align: center; }
        .sm-hero-family-surname {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6B0F18;
          display: block;
        }
        .sm-hero-family-sep {
          color: #c4849a;
          font-size: 0.7rem;
          opacity: 0.8;
        }

        /* Scroll butonu */
        .sm-scroll { margin-top: 1.6rem; display: flex; justify-content: center; }
        .sm-scroll-btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.25); border: 1px solid rgba(107,15,24,0.35);
          border-radius: 50%; width: 2.6rem; height: 2.6rem;
          cursor: pointer; color: #6B0F18; opacity: 0.9; padding: 0;
          backdrop-filter: blur(6px);
          animation: sm-bounce 2.2s ease-in-out infinite;
        }
        .sm-scroll-btn:hover { opacity: 1; animation: none; transform: translateY(6px); }
        @keyframes sm-bounce {
          0%, 100% { transform: translateY(0);   opacity: 0.7; }
          50%       { transform: translateY(8px); opacity: 1;   }
        }

        /* ── Bölümler ── */
        .sm-section { padding: 4rem 1.5rem; }
        .sm-section-inner { max-width: 960px; margin: 0 auto; }
        .sm-section h2 {
          font-family: var(--font-great-vibes), cursive;
          font-size: clamp(2.2rem, 5vw, 2.8rem);
          text-align: center;
          margin-bottom: 0.4rem;
          letter-spacing: 0.04em;
          color: #6B0F18;
        }
        .sm-section-subtitle {
          text-align: center;
          font-family: var(--font-charm), cursive;
          font-size: 1.25rem;
          letter-spacing: 0.06em;
          color: #a06070;
          margin-bottom: 2.2rem;
        }

        .sm-title-row {
          display: flex; align-items: center; justify-content: center;
          gap: 0.6rem; margin-bottom: 0.4rem;
        }
        .sm-title-icon { font-size: 1.6rem; line-height: 1; }

        /* ── Davetli kartı ── */
        .sm-guest-card {
          max-width: 640px; margin: 0 auto;
          padding: 2rem 2rem; text-align: center;
        }
        .sm-guest-label {
          font-family: var(--font-charm), cursive;
          font-size: clamp(2.2rem, 5.5vw, 3rem);
          letter-spacing: 0.04em;
          color: #6B0F18;
          display: block;
          margin-bottom: 0.6rem;
        }
        .sm-guest-name {
          font-family: var(--font-great-vibes), cursive;
          font-size: clamp(2.4rem, 6vw, 3.4rem);
          color: #a06070;
          line-height: 1.15;
          display: block;
        }

        /* ── Glassmorphism kart ── */
        .sm-glass {
          background: rgba(255, 248, 244, 0.55);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(122, 48, 69, 0.13);
          border-radius: 22px;
          box-shadow: 0 12px 48px rgba(74, 21, 37, 0.09), inset 0 1px 0 rgba(255,255,255,0.65);
        }

        /* ── Countdown ── */
        .sm-countdown-card {
          max-width: 640px; margin: 0 auto;
          padding: 2.5rem 2rem; text-align: center;
        }
        .sm-countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .sm-countdown-item {
          background: rgba(255, 248, 244, 0.58);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(122, 48, 69, 0.12);
          border-radius: 18px;
          padding: 1.5rem 0.75rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 24px rgba(74, 21, 37, 0.08), inset 0 1px 0 rgba(255,255,255,0.7);
        }
        .sm-countdown-item::before {
          content: "";
          position: absolute;
          top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,132,154,0.25), transparent);
        }
        .sm-count-number {
          display: block;
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 2.1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #6B0F18;
        }
        .sm-count-label {
          display: block;
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #a06070;
          margin-top: 0.25rem;
        }

        /* ── Etkinlik Akışı ── */
        .sm-schedule-card { max-width: 640px; margin: 0 auto; padding: 1.8rem 1.8rem 1.5rem; }
        .sm-schedule-header {
          display: flex; align-items: center; gap: 0.85rem;
          margin-bottom: 1.3rem; padding-bottom: 1rem;
          border-bottom: 1px solid rgba(122,48,69,0.12);
        }
        .sm-schedule-icon {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #f9f0e8 0%, #ecddd2 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(74,21,37,0.12);
          border: 1px solid rgba(122,48,69,0.1);
        }
        .sm-schedule-icon svg { width: 17px; height: 17px; stroke: #a06070; fill: none; stroke-width: 1.6; }
        .sm-schedule-title {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.82rem; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: #6B0F18;
        }
        .sm-schedule-sub {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.74rem; color: #a06070; margin-top: 0.1rem;
        }
        .sm-schedule-list {
          display: flex; flex-direction: column;
          position: relative; padding-left: 1.6rem;
        }
        .sm-schedule-list::before {
          content: "";
          position: absolute;
          left: 0.5rem; top: 0.8rem; bottom: 0.8rem; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(196,132,154,0.3) 15%, rgba(196,132,154,0.3) 85%, transparent);
        }
        .sm-schedule-row {
          display: grid; grid-template-columns: 72px 1fr;
          column-gap: 1rem; padding: 0.7rem 0;
          border-bottom: 1px solid rgba(122,48,69,0.08);
          position: relative; align-items: center;
        }
        .sm-schedule-row:last-child { border-bottom: none; }
        .sm-schedule-row::before {
          content: "";
          position: absolute;
          left: -1.22rem; top: 50%; transform: translateY(-50%);
          width: 7px; height: 7px; border-radius: 50%;
          background: #c4849a;
          box-shadow: 0 0 6px rgba(196,132,154,0.5);
          border: 1.5px solid rgba(255,248,244,0.9);
        }
        .sm-schedule-time {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.75rem; font-weight: 600;
          color: #a06070; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .sm-schedule-content { display: flex; flex-direction: column; gap: 0.12rem; }
        .sm-schedule-label {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.88rem; font-weight: 500; color: #6B0F18;
        }
        .sm-schedule-desc {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.75rem; color: #a06070; line-height: 1.4;
        }

        /* ── Konum ── */
        .sm-location-card { max-width: 720px; margin: 0 auto; padding: 2.5rem 2rem; text-align: center; }
        .sm-location-pin {
          width: 3.5rem; height: 3.5rem; margin: 0 auto 1.2rem;
          background: rgba(122,48,69,0.07); border: 1px solid rgba(122,48,69,0.12);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }
        .sm-location-pin svg { width: 1.6rem; height: 1.6rem; color: #a06070; }
        .sm-location-label {
          font-family: var(--font-charm), cursive;
          font-size: clamp(1.4rem, 3.5vw, 1.7rem);
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #6B0F18;
          margin-bottom: 0.6rem;
          font-weight: 700;
        }
        .sm-location-title {
          font-family: var(--font-great-vibes), cursive;
          font-size: clamp(2rem, 5vw, 2.8rem);
          margin-bottom: 0.75rem;
          letter-spacing: 0.04em;
          color: #6B0F18;
        }
        .sm-location-name {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: clamp(0.8rem, 1.8vw, 0.9rem);
          margin-bottom: 0.75rem; display: block;
          color: #a06070; line-height: 1.6;
        }
        .sm-location-time-row {
          display: inline-flex; align-items: center; gap: 0.4rem;
          margin-bottom: 1.75rem; color: #a06070;
        }
        .sm-location-time-row svg { width: 1rem; height: 1rem; opacity: 0.55; }
        .sm-location-time-row span {
          font-family: var(--font-cormorant-garamond), serif;
          font-size: 1.2rem; color: #a06070; font-style: italic;
        }
        .sm-location-img { position: relative; overflow: hidden; border-radius: 14px; margin-bottom: 0.75rem; }
        .sm-location-img img { width: 100%; height: 22rem; object-fit: cover; border-radius: 14px; transition: transform 0.6s ease; }
        .sm-location-img:hover img { transform: scale(1.02); }
        .sm-location-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 55%, rgba(74,21,37,0.2));
          border-radius: 14px; pointer-events: none;
        }
        .sm-map-wrap { border-radius: 14px; overflow: hidden; margin-bottom: 1.5rem; }
        .sm-map-wrap iframe { width: 100%; height: 220px; border: 0; display: block; }
        .sm-map-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.65rem 1.5rem; border-radius: 999px;
          border: 1px solid rgba(122,48,69,0.38);
          background: rgba(122,48,69,0.05);
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; color: #a06070;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .sm-map-btn:hover { background: rgba(122,48,69,0.1); border-color: rgba(122,48,69,0.6); }

        /* ── Footer ── */
        .sm-footer {
          text-align: center;
          padding: 3rem 1.5rem 3.5rem;
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          color: #a06070;
          background: rgba(255, 248, 244, 0.65);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-top: 1px solid rgba(122, 48, 69, 0.12);
        }
        .sm-footer::before {
          content: "";
          display: block; width: 50%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,132,154,0.35) 30%, rgba(196,132,154,0.35) 70%, transparent);
          margin: 0 auto 2.5rem;
        }
        .sm-footer-heart {
          width: 1.7rem; height: 1.7rem;
          margin: 0 auto 1rem;
          color: #c4849a;
          animation: sm-heart 2.2s ease-in-out infinite;
        }
        @keyframes sm-heart {
          0%, 100% { transform: scale(1);    opacity: 0.8; }
          50%       { transform: scale(1.2); opacity: 1;   }
        }
        .sm-footer-names {
          font-family: var(--font-great-vibes), cursive;
          font-size: clamp(2.2rem, 6vw, 3rem);
          letter-spacing: 0.04em;
          margin-bottom: 0.75rem;
          line-height: 1.1;
          color: #6B0F18;
        }
        .sm-footer-date {
          font-family: var(--font-charm), cursive;
          font-size: 1.15rem; letter-spacing: 0.1em;
          color: #a06070; margin-bottom: 0.4rem;
          font-weight: 600;
        }
        .sm-footer-credit {
          font-family: var(--font-charm), cursive;
          font-size: 0.95rem; letter-spacing: 0.18em;
          color: #a06070; margin-top: 0.5rem;
        }

        /* ── Aile ── */
        .sm-family-card {
          max-width: 640px; margin: 0 auto;
          padding: 2.5rem 2rem; text-align: center;
        }
        .sm-section .sm-family-title {
          font-family: var(--font-charm), cursive;
          font-size: clamp(2.2rem, 5.5vw, 3rem);
          letter-spacing: 0.04em; color: #6B0F18;
          margin-bottom: 0.3rem;
        }
        .sm-family-subtitle {
          font-family: var(--font-charm), cursive;
          font-size: 1.1rem; color: #a06070;
          margin-bottom: 2rem;
        }
        .sm-family-layout {
          display: flex; align-items: stretch;
          justify-content: center; gap: 1rem;
          margin-top: 0.5rem;
        }
        .sm-family-side {
          flex: 1; min-width: 0; padding: 0.8rem 0.8rem 1rem;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
          border-radius: 18px;
        }
        .sm-family-divider-dot { font-size: 0.75rem; color: #c4849a; }
        .sm-family-surname {
          font-family: var(--font-charm), cursive;
          letter-spacing: 0.12em;
          font-weight: 700;
          text-transform: uppercase;
          color: #6B0F18;
        }
        .sm-family-name {
          font-family: var(--font-charm), cursive;
          font-size: clamp(1.4rem, 3.2vw, 1.9rem);
          color: #6B0F18; line-height: 1.5;
          display: block; font-weight: 800;
        }
        .sm-family-sep {
          display: block;
          font-family: var(--font-cormorant-garamond), serif;
          font-size: 1rem; color: #c4849a;
          font-style: italic; margin: 0.2rem 0;
        }
        .sm-donation-divider {
          display: flex; align-items: center;
          justify-content: center; gap: 0.75rem;
          margin: 1rem 0 1.5rem;
        }
        .sm-donation-divider-line {
          height: 1px; width: 2.5rem;
          background: linear-gradient(90deg, transparent, rgba(196,132,154,0.5), transparent);
        }
        .sm-donation-divider-dot { font-size: 0.7rem; color: #c4849a; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .sm-countdown-grid { grid-template-columns: repeat(2, 1fr); }
          .sm-schedule-card  { padding: 1.3rem 1.1rem 1.1rem; }
          .sm-schedule-row   { grid-template-columns: 60px 1fr; column-gap: 0.75rem; }
          .sm-location-img img { height: 13rem; }
          .sm-location-card  { padding: 2rem 1.25rem; }
          .sm-family-card    { padding: 2rem 1.25rem; }
          .sm-family-layout  { gap: 0.6rem; }
          .sm-family-side    { padding: 0.6rem 0.5rem 0.8rem; }
          .sm-family-name    { font-size: 1.3rem; }
        }
        @media (max-width: 380px) {
          .sm-title { font-size: clamp(2.6rem, 13vw, 3.5rem); }
        }
      `}</style>

      {/* ── Warm fallback ── */}
      <div style={{ position: "fixed", inset: 0, backgroundColor: "#f5e8dd", zIndex: -2 }} />

      {/* ── Video arka plan ── */}
      <video className="sm-bg-video" autoPlay muted playsInline>
        <source src="/bg-new.MP4" type="video/mp4" />
      </video>

      <div className="sm-root">

        <header className="sm-hero" id="top">
          <div className="sm-hero-inner">
            <p className="sm-subtitle">Bu özel günde sizleri de aramızda görmekten<br />mutluluk duyarız...</p>

            <h1 className="sm-title">
              <span className="sm-title-line">Sine</span>
              <span className="sm-ampersand">&amp;</span>
              <span className="sm-title-line">Murat</span>
            </h1>

            <div className="sm-divider">
              <span className="sm-divider-line" />
              <span className="sm-divider-icon">✦</span>
              <span className="sm-divider-line" />
            </div>

            <p className="sm-date">{dateText}</p>

            <div className="sm-time-row">
              <span className="sm-time-label">Saat:</span>
              <span className="sm-time-text">13:30</span>
            </div>

            <div className="sm-scroll">
              <button className="sm-scroll-btn" onClick={scrollToCountdown} aria-label="Aşağı kaydır">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main>

          {/* ── DAVETLİ ── */}
          <section className="sm-section" id="guest" style={{ paddingTop: "0" }}>
            <div className="sm-guest-card sm-glass">
              <span className="sm-guest-label">Sevgili</span>
              <span className="sm-guest-name">{guestName ?? "—"}</span>
            </div>
          </section>

          {/* ── AİLE ── */}
          <section className="sm-section" id="family">
            <div className="sm-family-card sm-glass">
              <div className="sm-title-row">
                <h2 className="sm-family-title">Ailelerimiz</h2>
              </div>
              <p className="sm-family-subtitle">Bu mutlu günde bizimle olan sevgili ailelerimiz</p>

              <div className="sm-donation-divider">
                <span className="sm-donation-divider-line" />
                <span className="sm-donation-divider-dot">✦</span>
                <span className="sm-donation-divider-line" />
              </div>

              <div className="sm-family-layout">
                <div className="sm-family-side">
                  <span className="sm-family-name">Nesrin - Sinan <span className="sm-family-surname">Gökhan</span></span>
                </div>
                <div className="sm-family-side">
                  <span className="sm-family-name">Müzeyyen - Nihat <span className="sm-family-surname">Seven</span></span>
                </div>
              </div>
            </div>
          </section>

          {/* ── GERİ SAYIM ── */}
          <section className="sm-section" id="countdown">
            <div className="sm-countdown-card sm-glass">
              <div className="sm-title-row">
                <h2>Geri Sayım</h2>
              </div>
              <p className="sm-section-subtitle">Hayatımızın en özel günü için</p>
              <div className="sm-donation-divider">
                <span className="sm-donation-divider-line" />
                <span className="sm-donation-divider-dot">✦</span>
                <span className="sm-donation-divider-line" />
              </div>
              <div className="sm-countdown-grid">
                {[
                  { value: countdown.days, label: "Gün" },
                  { value: countdown.hours, label: "Saat" },
                  { value: countdown.minutes, label: "Dakika" },
                  { value: countdown.seconds, label: "Saniye" },
                ].map(({ value, label }) => (
                  <div className="sm-countdown-item" key={label}>
                    <span className="sm-count-number">
                      {label === "Gün" ? value : value.toString().padStart(2, "0")}
                    </span>
                    <span className="sm-count-label">{label}</span>
                  </div>
                ))}
              </div>
              {countdown.finished && (
                <p style={{ textAlign: "center", marginTop: "1.5rem", color: C, opacity: 0.8 }}>
                  Mutlu sonsuza dek! 💛
                </p>
              )}
            </div>
          </section>

          {/* ── KONUM ── */}
          <section className="sm-section" id="location" style={{ paddingBottom: "4rem" }}>
            <div className="sm-location-card sm-glass">
              <div className="sm-title-row">
                <p className="sm-location-label">Konum</p>
              </div>

              <div className="sm-donation-divider">
                <span className="sm-donation-divider-line" />
                <span className="sm-donation-divider-dot">✦</span>
                <span className="sm-donation-divider-line" />
              </div>

              <h3 className="sm-location-title">Vedat Dalokay Nikah Salonu</h3>
              <a
                href="https://maps.app.goo.gl/1YD5SPwiD4wCZz1R6"
                target="_blank"
                rel="noopener noreferrer"
                className="sm-location-name"
                style={{ textDecoration: "underline", textDecorationColor: "rgba(160,96,112,0.35)", textUnderlineOffset: "3px" }}
              >
                Fidanlık, Prof. Dr. Nusret Fişek Cd. No:39, 06420 Çankaya/Ankara
              </a>

              <div className="sm-location-time-row">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>13:30</span>
              </div>

              <div className="sm-location-img">
                <img src="/vedat-dalokay-nikah-salonu.png" alt="Etkinlik mekanı" />
                <div className="sm-location-img-overlay" />
              </div>

              <div className="sm-map-wrap">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.672441411708!2d32.85890307571768!3d39.92634597152264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34e5118453e7b%3A0x1a24327dbe143027!2sVedat%20Dalokay%20Nikah%20Salonu!5e0!3m2!1str!2str!4v1774374728744!5m2!1str!2str"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mekan Haritası"
                />
              </div>

              <a
                href="https://maps.app.goo.gl/1YD5SPwiD4wCZz1R6"
                target="_blank"
                rel="noopener noreferrer"
                className="sm-map-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Haritada Aç
              </a>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="sm-footer">
            <svg
              className="sm-footer-heart"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <p className="sm-footer-names">Sine &amp; Murat</p>
            <p className="sm-footer-date">{dateText}</p>
            <p className="sm-footer-credit">Sevgiyle hazırlandı</p>
          </footer>

        </main>
      </div>
    </>
  );
}
