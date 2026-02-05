// app/invite/[slug]/InviteClient.tsx

"use client";

import React, { useEffect, useState } from "react";
import { parseMapInput } from "../../lib/mapUtils"; // relative path’i dosya yapına göre düzelt

type InvitationPayload = {
  bride: string;
  groom: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  mapsUrl: string;
  guestName?: string;
};

type InvitationSettings = {
  brideName: string;
  groomName: string;
  dateRaw: string;
  eventDate: Date | null;
  time: string;
  locationText: string;
  mapsUrl: string;
  guestName?: string;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

// UTF-8 safe base64 decode (page.tsx ile aynı mantık)
function base64DecodeUnicode(str: string): string {
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

function decodePayload(encoded?: string): InvitationPayload | null {
  if (!encoded) return null;
  try {
    const json = base64DecodeUnicode(decodeURIComponent(encoded));
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== "object") return null;
    return {
      bride: obj.bride ?? "Gelin",
      groom: obj.groom ?? "Damat",
      date: obj.date ?? "",
      time: obj.time ?? "",
      location: obj.location ?? "Adres daha sonra paylaşılacaktır.",
      mapsUrl: obj.mapsUrl ?? "",
      guestName: obj.guestName ?? undefined,
    };
  } catch {
    return null;
  }
}

export default function InviteClient({
  slug,
  encodedData,
}: {
  slug: string;
  encodedData?: string;
}) {
  const payload = decodePayload(encodedData);

  const [settings] = useState<InvitationSettings>(() => {
    const dateRaw = payload?.date ?? "";
    const eventDate = dateRaw ? new Date(dateRaw + "T00:00:00") : null;

    return {
      brideName: payload?.bride ?? "Gelin",
      groomName: payload?.groom ?? "Damat",
      dateRaw,
      eventDate,
      time: payload?.time ?? "",
      locationText: payload?.location ?? "Adres daha sonra paylaşılacaktır.",
      mapsUrl: payload?.mapsUrl ?? "",
      guestName: payload?.guestName ?? slug.replace(/-/g, " "),
    };
  });

  const emptyCountdown: Countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  };

  const [countdown, setCountdown] = useState<Countdown>(emptyCountdown);

  useEffect(() => {
    setCountdown(computeCountdown(settings.eventDate));
    const id = setInterval(() => {
      setCountdown(computeCountdown(settings.eventDate));
    }, 1000);
    return () => clearInterval(id);
  }, [settings.eventDate]);

  const dateText = settings.eventDate
    ? settings.eventDate.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : "Tarih seçilmedi";

  const countdownFinished = countdown.finished;

  const rawMapsUrl = settings.mapsUrl || "";
  let embedUrl = "about:blank";
  if (
    rawMapsUrl.includes("google.com/maps") &&
    !rawMapsUrl.includes("/embed")
  ) {
    embedUrl = rawMapsUrl.replace("/maps/", "/maps/embed/");
  } else if (rawMapsUrl) {
    embedUrl = rawMapsUrl;
  }

  const displayGuestName = settings.guestName || slug.replace(/-/g, " ");

  return (
    <div className="page-overlay invitation-root font-cormorant">
      {/* Arka plan video */}
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/bg.webm" type="video/webm" />
        Tarayıcınız video desteklemiyor.
      </video>

      {/* Hero */}
      <header className="hero" id="top">
        <div className="hero-inner">
          <p className="hero-subtitle">Bu mutlu günümüzde yanımızda olun</p>
          <h1 className="hero-title">
            <span className="hero-line">{settings.brideName}</span>
            <span className="hero-ampersand">&amp;</span>
            <span className="hero-line">{settings.groomName}</span>
          </h1>

          <div className="fancy-divider">
            <span className="fancy-divider-line" />
            <span className="fancy-divider-icon">✦</span>
            <span className="fancy-divider-line" />
          </div>

          <p className="hero-date">{dateText}</p>

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
            <span className="location-time-text">{settings.time}</span>
          </div>

          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Sevgili <span style={{ fontWeight: 600 }}>{displayGuestName}</span>,
            bu özel günümüzde seni de aramızda görmek isteriz.
          </p>

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
            <p className="invite-name">{displayGuestName}</p>

            <p className="invite-text">
              Bu özel günümüzde seni de aramızda görmeyi çok isteriz.
            </p>
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
                <span className="location-name">{settings.locationText}</span>
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
                <span className="location-time-text">{settings.time}</span>
              </div>
            </div>

            <div className="location-media">
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
            </div>

            <div className="location-actions">
              <a
                href={settings.mapsUrl || "#"}
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
            {settings.brideName} &amp; {settings.groomName}
          </p>
          <p className="footer-date">{dateText}</p>
          <p className="footer-date footer-credit">Sevgiyle hazırlandı</p>
        </footer>
      </main>
    </div>
  );
}
