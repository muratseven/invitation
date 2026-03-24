// app/invite/[slug]/InviteClient.tsx

"use client";

import React, { useEffect, useState } from "react";
import { parseMapInput } from "../../lib/mapUtils";

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

type InvitationPayload = {
  bride?: string;
  groom?: string;
  date?: string;
  time?: string;
  location?: string;
  mapsUrl?: string;
  guestName?: string;

  sectionCardBackground?: string;
  sectionCardBorderColor?: string;
  footerBackground?: string;

  backgroundColor?: string;
  backgroundOverlayOpacity?: number;

  fontFamily?: FontFamily;
  heroSubtitle?: string;
  heroSubtitleColor?: string;
  heroNamesColor?: string;
  ampersandColor?: string;
  dividerColor?: string;

  donationBackground?: string;
  showDonationSection?: boolean;
  donationText?: string;
  donationImageUrl?: string;

  locationBackground?: string;
  locationImageUrl?: string;

  showFamilySection?: boolean;
  family1Mother?: string;
  family1Father?: string;
  family1Surname?: string;
  family2Mother?: string;
  family2Father?: string;
  family2Surname?: string;

  mapLat?: number | null;
  mapLng?: number | null;
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

  sectionCardBackground: string;
  sectionCardBorderColor: string;
  footerBackground: string;

  backgroundColor: string;
  backgroundOverlayOpacity: number;

  fontFamily: FontFamily;
  heroSubtitle: string;
  heroSubtitleColor: string;
  heroNamesColor: string;
  ampersandColor: string;
  dividerColor: string;

  donationBackground: string;
  showDonationSection: boolean;
  donationText: string;
  donationImageUrl: string;

  locationBackground: string;
  locationImageUrl: string;

  showFamilySection: boolean;
  family1Mother: string;
  family1Father: string;
  family1Surname: string;
  family2Mother: string;
  family2Father: string;
  family2Surname: string;

  mapLat: number | null;
  mapLng: number | null;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

// UTF-8 safe base64 decode
function base64DecodeUnicode(str: string): string {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

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

function decodePayload(encoded?: string): InvitationPayload | null {
  if (!encoded) return null;
  try {
    const json = base64DecodeUnicode(decodeURIComponent(encoded));
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== "object") return null;
    return {
      bride: obj.bride,
      groom: obj.groom,
      date: obj.date,
      time: obj.time,
      location: obj.location,
      mapsUrl: obj.mapsUrl,
      guestName: obj.guestName,

      sectionCardBackground: obj.sectionCardBackground,
      sectionCardBorderColor: obj.sectionCardBorderColor,
      footerBackground: obj.footerBackground,
      backgroundColor: obj.backgroundColor,
      backgroundOverlayOpacity: obj.backgroundOverlayOpacity,

      fontFamily: obj.fontFamily,
      heroSubtitle: obj.heroSubtitle,
      heroSubtitleColor: obj.heroSubtitleColor,
      heroNamesColor: obj.heroNamesColor,
      ampersandColor: obj.ampersandColor,
      dividerColor: obj.dividerColor,

      donationBackground: obj.donationBackground,
      showDonationSection: obj.showDonationSection,
      donationText: obj.donationText,
      donationImageUrl: obj.donationImageUrl,

      locationBackground: obj.locationBackground,
      locationImageUrl: obj.locationImageUrl,

      showFamilySection: obj.showFamilySection,
      family1Mother: obj.family1Mother,
      family1Father: obj.family1Father,
      family1Surname: obj.family1Surname,
      family2Mother: obj.family2Mother,
      family2Father: obj.family2Father,
      family2Surname: obj.family2Surname,
      mapLat: obj.mapLat ?? null,
      mapLng: obj.mapLng ?? null,
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

      sectionCardBackground:
        payload?.sectionCardBackground ?? "rgba(0,0,0,0.75)",
      sectionCardBorderColor:
        payload?.sectionCardBorderColor ?? "rgba(255,255,255,0.12)",
      footerBackground: payload?.footerBackground ?? "rgba(0,0,0,0.75)",

      backgroundColor: payload?.backgroundColor ?? "#000000",
      backgroundOverlayOpacity: payload?.backgroundOverlayOpacity ?? 0.6,

      fontFamily: payload?.fontFamily ?? "pacifico",
      heroSubtitle: payload?.heroSubtitle ?? "Biz evleniyoruz",
      heroSubtitleColor: payload?.heroSubtitleColor ?? "#ffffff",
      heroNamesColor: payload?.heroNamesColor ?? "#ffffff",
      ampersandColor: payload?.ampersandColor ?? "#ffffff",
      dividerColor: payload?.dividerColor ?? "rgba(255,255,255,0.5)",

      donationBackground: payload?.donationBackground ?? "rgba(0,0,0,0.58)",
      showDonationSection: payload?.showDonationSection ?? false,
      donationText:
        payload?.donationText ??
        "Sizin adınıza TEMA Vakfı'na bir fidan bağışında bulunduk",
      donationImageUrl: payload?.donationImageUrl ?? "/fidan_ga_wm.jpg",

      locationBackground: payload?.locationBackground ?? "rgba(0,0,0,0.58)",
      locationImageUrl:
        payload?.locationImageUrl ?? "/vedat-dalokay-nikah-salonu.png",

      showFamilySection: payload?.showFamilySection ?? false,
      family1Mother: payload?.family1Mother ?? "",
      family1Father: payload?.family1Father ?? "",
      family1Surname: payload?.family1Surname ?? "",
      family2Mother: payload?.family2Mother ?? "",
      family2Father: payload?.family2Father ?? "",
      family2Surname: payload?.family2Surname ?? "",

      mapLat: payload?.mapLat ?? null,
      mapLng: payload?.mapLng ?? null,
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

  let embedUrl = "about:blank";
  let buttonHref = "";

  if (settings.mapLat != null && settings.mapLng != null) {
    const { mapLat, mapLng } = settings;
    const delta = 0.0015; // daha da yakın zoom
    embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - delta
      }%2C${mapLat - delta}%2C${mapLng + delta}%2C${mapLat + delta
      }&layer=mapnik&marker=${mapLat}%2C${mapLng}`;
    buttonHref = `https://www.google.com/maps/search/?api=1&query=${mapLat},${mapLng}`;
  } else {
    // HATA BURADAYDI: mapsUrl yerine settings.mapsUrl kullanmalıyız
    const parsed = parseMapInput(settings.mapsUrl);
    embedUrl = parsed.embedSrc;
    buttonHref = parsed.buttonHref;
  }

  const displayGuestName = settings.guestName || slug.replace(/-/g, " ");
  const overlayColor = hexToRgba(
    settings.backgroundColor,
    settings.backgroundOverlayOpacity
  );

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
    <div
      className={`page-overlay invitation-root ${currentFontClass}`}
      style={{ background: overlayColor }}
    >
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
            "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 55%), \
       radial-gradient(circle at bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.95))",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          zIndex: -1,
        }}
      />

      {/* Hero */}
      <header className="hero" id="top">
        <div className="hero-inner" style={{ backgroundColor: "transparent" }}>
          <p
            className="hero-subtitle"
            style={{
              color: settings.heroSubtitleColor,
              fontFamily: "Italianno",
              fontWeight: "400",
              fontStyle: "normal",
            }}
          >
            {settings.heroSubtitle}
          </p>

          <h1
            className="hero-title"
            style={{
              color: settings.heroNamesColor,
              fontSize: "clamp(3rem, 5.4vw, 4.8rem)",
            }}
          >
            <span className="hero-line">{settings.brideName}</span>
            <span
              className="hero-ampersand"
              style={{
                color: settings.ampersandColor || settings.heroNamesColor,
              }}
            >
              &amp;
            </span>
            <span className="hero-line">{settings.groomName}</span>
          </h1>

          <div className="fancy-divider">
            <span
              className="fancy-divider-line"
              style={{ backgroundColor: settings.dividerColor }}
            />
            <span
              className="fancy-divider-icon"
              style={{ color: settings.dividerColor }}
            >
              ✦
            </span>
            <span
              className="fancy-divider-line"
              style={{ backgroundColor: settings.dividerColor }}
            />
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
        {settings.guestName && (
          <section className="section section-invite" id="invite">
            <div
              className="section-inner invite-card"
              style={{
                maxWidth: 640,
                margin: "0 auto",
                textAlign: "center",
                background:
                  settings.sectionCardBackground || "rgba(0,0,0,0.75)",
                borderRadius: 18,
                border: `1px solid ${settings.sectionCardBorderColor || "rgba(255,255,255,0.12)"
                  }`,
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
          <div
            className="section-inner location-card"
            style={{
              background: settings.sectionCardBackground,
              borderRadius: 18,
              border: `1px solid ${settings.sectionCardBorderColor}`,
            }}
          >
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

            <h3 className="location-title" style={{ fontSize: "2.4rem" }}>
              Konum
            </h3>

            <div className="location-info">
              <div className="location-name-row">
                <span className="location-name" style={{ fontSize: "1.9rem" }}>
                  {settings.locationText}
                </span>
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
              <div className="location-image-wrapper">
                <img
                  src={
                    settings.locationImageUrl ||
                    "/vedat-dalokay-nikah-salonu.png"
                  }
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
