"use client";

import React, { useEffect, useState } from "react";

// ─── Countdown ───────────────────────────────────────────────────────────────

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

// ─── Sabit Etkinlik Verisi ────────────────────────────────────────────────────

const EVENT_DATE = new Date("2026-05-24T18:00:00");

const SCHEDULE = [
  { time: "18:00", label: "Karşılama ve Kokteyl", desc: "Müzik eşliğinde sohbet ve ikramlar" },
  { time: "19:00", label: "Yemek Servisi", desc: "Yemek servisi başlıyor" },
  { time: "20:00", label: "Pasta Kesimi", desc: "Pasta kesimi ve kutlama" },
  { time: "∞", label: "DJ & Dans", desc: "Müzik durmayacak, pistin ortası her zaman açık." },
];

// Ana renk: koyu kahve
const C = "#493930";

// ─── Sayfa ────────────────────────────────────────────────────────────────────

export default function SineMuratPage() {
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
    document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        /* ── Video ── */
        .sm-bg-video {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          z-index: -1;
        }
        @media (min-width: 768px) {
          .sm-bg-video { object-position: center 70%; }
        }

        /* ── Kök: koyu kahve metin, arka plan yok ── */
        .sm-root {
          position: relative;
          min-height: 100vh;
          color: #493930;
          font-family: var(--font-great-vibes), cursive;
        }

        /* ── HERO: sectionless, sadece metin ── */
        .sm-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          text-align: center;
        }
        .sm-hero-inner {
          max-width: 560px;
          width: 100%;
          /* arka plan yok — video doğrudan görünüyor */
        }

        .sm-subtitle {
          font-family: var(--font-italianno), serif;
          font-size: clamp(1.4rem, 4vw, 1.9rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #493930;
          opacity: 0.82;
          margin-bottom: 1.4rem;
        }
        .sm-title {
          font-size: clamp(3rem, 11vw, 6rem);
          line-height: 1.05;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
          color: #493930;
        }
        .sm-title-line { display: block; }
        .sm-ampersand {
          display: block;
          font-size: clamp(1.8rem, 4.5vw, 2.6rem);
          color: #7a4a38;
          margin: 0.2rem 0 0.25rem;
          opacity: 0.9;
        }

        .sm-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 1.4rem 0;
        }
        .sm-divider-line {
          height: 1px;
          width: 3rem;
          background: linear-gradient(90deg, transparent, rgba(73,57,48,0.4) 40%, rgba(73,57,48,0.4) 60%, transparent);
        }
        .sm-divider-icon { font-size: 0.9rem; color: #7a4a38; opacity: 0.85; }

        .sm-date {
          font-size: clamp(1rem, 3vw, 1.35rem);
          letter-spacing: 0.08em;
          color: #493930;
          opacity: 0.82;
          margin-bottom: 0.5rem;
        }
        .sm-time-row {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 0.3rem;
        }
        .sm-time-icon { width: 1rem; height: 1rem; opacity: 0.7; color: #493930; }
        .sm-time-text { font-size: 1.35rem; opacity: 0.82; color: #493930; }

        /* Scroll butonu */
        .sm-scroll { margin-top: 1.6rem; display: flex; justify-content: center; }
        .sm-scroll-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #493930;
          opacity: 0.65;
          padding: 0;
          animation: sm-bounce 2.2s ease-in-out infinite;
        }
        .sm-scroll-btn:hover { opacity: 1; animation: none; transform: translateY(6px); }
        @keyframes sm-bounce {
          0%, 100% { transform: translateY(0);   opacity: 0.65; }
          50%       { transform: translateY(8px); opacity: 0.95; }
        }

        /* ── Bölümler ── */
        .sm-section { padding: 4rem 1.5rem; }
        .sm-section-inner { max-width: 960px; margin: 0 auto; }
        .sm-section h2 {
          font-size: clamp(2rem, 5vw, 2.6rem);
          text-align: center;
          margin-bottom: 0.4rem;
          letter-spacing: 0.06em;
          color: #493930;
        }
        .sm-section-subtitle {
          text-align: center;
          font-family: var(--font-italianno), serif;
          font-size: 1.25rem;
          letter-spacing: 0.1em;
          color: #493930;
          opacity: 0.72;
          margin-bottom: 2.2rem;
        }

        /* ── Açık glassmorphism kart (krem/fildişi) ── */
        .sm-glass {
          background: rgba(255, 250, 242, 0.48);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(73, 57, 48, 0.16);
          border-radius: 22px;
          box-shadow: 0 12px 48px rgba(73,57,48,0.12), inset 0 1px 0 rgba(255,255,255,0.6);
        }

        /* ── Countdown ── */
        .sm-countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .sm-countdown-item {
          background: rgba(255, 250, 242, 0.52);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(73, 57, 48, 0.15);
          border-radius: 18px;
          padding: 1.5rem 0.75rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 24px rgba(73,57,48,0.1), inset 0 1px 0 rgba(255,255,255,0.7);
        }
        .sm-countdown-item::before {
          content: "";
          position: absolute;
          top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(73,57,48,0.18), transparent);
        }
        .sm-count-number {
          display: block;
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #493930;
        }
        .sm-count-label {
          display: block;
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          color: #493930;
          opacity: 0.65;
          margin-top: 0.25rem;
        }

        /* ── Etkinlik Akışı ── */
        .sm-schedule-card { max-width: 640px; margin: 0 auto; padding: 1.8rem 1.8rem 1.5rem; }
        .sm-schedule-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.3rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(73,57,48,0.14);
        }
        .sm-schedule-icon {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f9f0e8 0%, #ecddd2 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(73,57,48,0.18);
          border: 1px solid rgba(73,57,48,0.12);
        }
        .sm-schedule-icon svg { width: 17px; height: 17px; stroke: #493930; fill: none; stroke-width: 1.6; }
        .sm-schedule-title {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.85rem; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: #493930;
        }
        .sm-schedule-sub {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.74rem; color: #7a5c52; margin-top: 0.1rem;
        }
        .sm-schedule-list {
          display: flex; flex-direction: column;
          position: relative; padding-left: 1.6rem;
        }
        .sm-schedule-list::before {
          content: "";
          position: absolute;
          left: 0.5rem; top: 0.8rem; bottom: 0.8rem; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(73,57,48,0.22) 15%, rgba(73,57,48,0.22) 85%, transparent);
        }
        .sm-schedule-row {
          display: grid;
          grid-template-columns: 72px 1fr;
          column-gap: 1rem;
          padding: 0.7rem 0;
          border-bottom: 1px solid rgba(73,57,48,0.1);
          position: relative;
          align-items: center;
        }
        .sm-schedule-row:last-child { border-bottom: none; }
        .sm-schedule-row::before {
          content: "";
          position: absolute;
          left: -1.22rem; top: 50%; transform: translateY(-50%);
          width: 7px; height: 7px; border-radius: 50%;
          background: #c4865a;
          box-shadow: 0 0 7px rgba(196,134,90,0.55);
          border: 1.5px solid rgba(255,250,242,0.8);
        }
        .sm-schedule-time {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.78rem; font-weight: 600;
          color: #7a5c52; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .sm-schedule-content { display: flex; flex-direction: column; gap: 0.12rem; }
        .sm-schedule-label {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.88rem; font-weight: 500; color: #493930;
        }
        .sm-schedule-desc {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.75rem; color: #7a5c52; line-height: 1.4;
        }

        /* ── Konum ── */
        .sm-location-card { max-width: 720px; margin: 0 auto; padding: 2.5rem 2rem; text-align: center; }
        .sm-location-pin {
          width: 3.5rem; height: 3.5rem;
          margin: 0 auto 1.2rem;
          background: rgba(73,57,48,0.08);
          border: 1px solid rgba(73,57,48,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .sm-location-pin svg { width: 1.6rem; height: 1.6rem; color: #493930; }
        .sm-location-title { font-size: clamp(2rem, 5vw, 2.6rem); margin-bottom: 1rem; letter-spacing: 0.08em; color: #493930; }
        .sm-location-name {
          font-family: var(--font-charm), cursive;
          font-size: clamp(1.3rem, 3.2vw, 1.8rem);
          margin-bottom: 0.5rem; display: block;
          color: #493930; opacity: 0.82;
        }
        .sm-location-time-row {
          display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.75rem; color: #493930;
        }
        .sm-location-time-row svg { width: 1rem; height: 1rem; opacity: 0.75; }
        .sm-location-time-row span { font-size: 1.3rem; opacity: 0.82; }
        .sm-location-img { position: relative; overflow: hidden; border-radius: 14px; margin-bottom: 0.75rem; }
        .sm-location-img img { width: 100%; height: 22rem; object-fit: cover; border-radius: 14px; transition: transform 0.6s ease; }
        .sm-location-img:hover img { transform: scale(1.02); }
        .sm-location-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 55%, rgba(73,57,48,0.25));
          border-radius: 14px; pointer-events: none;
        }
        .sm-map-wrap { border-radius: 14px; overflow: hidden; margin-bottom: 1.5rem; }
        .sm-map-wrap iframe { width: 100%; height: 220px; border: 0; display: block; }
        .sm-map-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.7rem 1.6rem;
          border-radius: 999px;
          border: 1px solid rgba(73,57,48,0.45);
          background: rgba(73,57,48,0.06);
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; color: #493930;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .sm-map-btn:hover { background: rgba(73,57,48,0.12); border-color: rgba(73,57,48,0.7); }

        /* ── Footer: açık krem glassmorphism ── */
        .sm-footer {
          text-align: center;
          padding: 3rem 1.5rem 3.5rem;
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          color: #493930;
          background: rgba(255, 250, 242, 0.6);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-top: 1px solid rgba(73, 57, 48, 0.14);
        }
        .sm-footer::before {
          content: "";
          display: block;
          width: 50%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(73,57,48,0.22) 30%, rgba(73,57,48,0.22) 70%, transparent);
          margin: 0 auto 2.5rem;
        }
        .sm-footer-heart {
          width: 1.7rem; height: 1.7rem;
          margin: 0 auto 1rem;
          color: #7a4a38;
          animation: sm-heart 2.2s ease-in-out infinite;
        }
        @keyframes sm-heart {
          0%, 100% { transform: scale(1);    opacity: 0.75; }
          50%       { transform: scale(1.2); opacity: 1;    }
        }
        .sm-footer-names {
          font-size: clamp(1.8rem, 5vw, 2.4rem);
          letter-spacing: 0.08em;
          margin-bottom: 1rem;
          line-height: 1.1;
          color: #493930;
        }
        .sm-footer-date {
          font-family: var(--font-italianno), serif;
          font-size: 1.25rem; letter-spacing: 0.08em;
          color: #493930; opacity: 0.78; margin-bottom: 0.4rem;
        }
        .sm-footer-credit {
          font-family: var(--font-roboto), system-ui, sans-serif;
          font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: #493930; opacity: 0.38; margin-top: 0.5rem;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .sm-countdown-grid { grid-template-columns: repeat(2, 1fr); }
          .sm-schedule-card  { padding: 1.3rem 1.1rem 1.1rem; }
          .sm-schedule-row   { grid-template-columns: 60px 1fr; column-gap: 0.75rem; }
          .sm-location-img img { height: 13rem; }
          .sm-location-card  { padding: 2rem 1.25rem; }
        }
        @media (max-width: 380px) {
          .sm-title { font-size: clamp(2.6rem, 13vw, 3.5rem); }
        }
      `}</style>

      {/* ── Video arka plan ── */}
      <video className="sm-bg-video" autoPlay muted loop playsInline>
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="sm-root">

        {/* ── HERO: arka plan yok, sadece metin ── */}
        <header className="sm-hero" id="top">
          <div className="sm-hero-inner">
            <p className="sm-subtitle">Biz evleniyoruz</p>

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
              <svg className="sm-time-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="sm-time-text">18:00</span>
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

          {/* ── GERİ SAYIM ── */}
          <section className="sm-section" id="countdown">
            <div className="sm-section-inner">
              <h2>Geri Sayım</h2>
              <p className="sm-section-subtitle">Hayatımızın en özel günü için</p>
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

          {/* ── ETKİNLİK AKIŞI ── */}
          <section className="sm-section" id="schedule">
            <div className="sm-section-inner">
              <h2>Etkinlik Akışı</h2>
              <p className="sm-section-subtitle">24 Mayıs 2026</p>

              <div className="sm-schedule-card sm-glass">
                <div className="sm-schedule-header">
                  <div className="sm-schedule-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="sm-schedule-title">Etkinlik Programı</p>
                  </div>
                </div>

                <div className="sm-schedule-list">
                  {SCHEDULE.map((item, i) => (
                    <div className="sm-schedule-row" key={i}>
                      <span className="sm-schedule-time">{item.time}</span>
                      <div className="sm-schedule-content">
                        <span className="sm-schedule-label">{item.label}</span>
                        <span className="sm-schedule-desc">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── KONUM ── */}
          <section className="sm-section" id="location" style={{ paddingBottom: "4rem" }}>
            <div className="sm-location-card sm-glass">
              <div className="sm-location-pin">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>

              <h3 className="sm-location-title">Kastro No 3</h3>
              <span className="sm-location-name">Kale, Gözcü Sk. No:3 / A, 06230 Altındağ/Ankara</span>

              <div className="sm-location-time-row">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>18:00</span>
              </div>

              <div className="sm-location-img">
                <img src="/kastro_v3.png" alt="Etkinlik mekanı" />
                <div className="sm-location-img-overlay" />
              </div>

              <div className="sm-map-wrap">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12236.503353710532!2d32.8624175!3d39.9385748!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34fd5682b59f3%3A0xd6e3448004f10267!2sKastro%20No%203!5e0!3m2!1str!2str!4v1774373130292!5m2!1str!2str"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mekan Haritası"
                />
              </div>

              <a
                href="https://maps.app.goo.gl/zvNtkwybBLiwVX4Y7"
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
