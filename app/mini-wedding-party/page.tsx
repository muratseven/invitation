// app/mini-wedding-party/page.tsx
"use client";

import React from "react";
import "../globals.css";

export default function MiniWeddingPartyPage() {
  return (
    <div className="mini-wedding-bg">
      <div className="mini-wedding-bg-inner">
        <div className="page-overlay invitation-root--mini">
          <main>
            {/* HERO */}
            <header className="hero">
              <div className="hero-inner">
                <p
                  className="hero-subtitle mini-text"
                  style={{ marginBottom: "0.6rem" }}
                >
                  BİZİMLE EĞLENMEYE DAVETLİSİNİZ
                </p>

                <h1 className="hero-title">Mini Wedding Party</h1>

                <p className="hero-date mini-text">24 MAYIS 2026</p>

                <div
                  className="location-time-row"
                  style={{ justifyContent: "center", marginBottom: "0.4rem" }}
                >
                  <span className="location-time-text">18:00</span>
                </div>

                <p
                  className="mini-text"
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  123 Anywhere Street, Any City
                  <br />
                  RSVP: +123&nbsp;456&nbsp;7890
                </p>

                <p
                  className="mini-text"
                  style={{
                    marginTop: "1.1rem",
                    fontSize: "0.78rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  BİZİMLE EĞLENMEYE DAVETLİSİNİZ
                </p>
              </div>
            </header>

            {/* FLOW BLOĞU */}
            <section className="mini-section-card">
              <h2 className="mini-flow-title">FLOW</h2>

              <div className="mini-section-card-inner">
                <div
                  className="mini-text"
                  style={{
                    fontSize: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>
                      STARTING&nbsp;•&nbsp;
                    </span>
                    <span>18:00 – BİZİMLE EĞLENMEYE DAVETLİSİNİZ</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>FLOW&nbsp;•&nbsp;</span>
                    <span>DJ, kokteyl ve bol kahkaha</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>CAKE&nbsp;•&nbsp;</span>
                    <span>DECADENT ROMANCE</span>
                  </div>
                </div>
              </div>
            </section>

            {/* DRESS CODE + FOOTER */}
            <section>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <p className="mini-text" style={{ marginBottom: "0.5rem" }}>
                  Dress Code
                </p>
                <button
                  type="button"
                  className="mini-dresscode-link"
                  onClick={() => {
                    window.open(
                      "https://www.pinterest.com/search/pins/?q=semi%20formal%20wedding",
                      "_blank"
                    );
                  }}
                >
                  Fikir için tıklayınız...
                </button>
              </div>

              <footer>
                <p
                  className="mini-text"
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    opacity: 0.7,
                  }}
                >
                  Sevgiyle hazırlandı
                </p>
              </footer>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
