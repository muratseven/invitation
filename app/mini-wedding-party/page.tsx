// app/mini-wedding-party/page.tsx
"use client";

import React from "react";
import "../globals.css";

export default function MiniWeddingPartyPage() {
  return (
    <div className="mini-wedding-bg">
      {/* 1. ARKA PLAN BÖLÜMÜ – SADECE HERO */}
      <section className="mini-bg-section mini-bg-section--top">
        <div className="page-overlay invitation-root--mini">
          <main>

            <header className="hero">
              <div className="hero-inner">
                <h1
                  className="hero-title font-beth-ellen"
                  style={{ color: "#78803F" }}
                >
                  Mini <br /> Wedding Party
                </h1>

                <p
                  className="hero-date mini-text font-special-elite"
                  style={{ color: "#7E111B" }}
                >
                  24 MAYIS 2026
                </p>

                <div
                  className="location-time-row"
                  style={{ justifyContent: "center", marginBottom: "0.4rem" }}
                >
                  <span
                    className="location-time-text font-special-elite"
                    style={{ color: "#7E111B", fontSize: "1.2rem" }}
                  >
                    18:00
                  </span>
                </div>

                <p
                  className="mini-text font-special-elite"
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    textAlign: "center",
                    color: "#7E111B",
                  }}
                >
                  123 Anywhere Street, Any City
                  <br />
                  RSVP: +123&nbsp;456&nbsp;7890
                </p>

                <p
                  className="mini-text font-special-elite"
                  style={{
                    marginTop: "1.1rem",
                    fontSize: "0.78rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    textAlign: "center",
                    color: "#7E111B",
                  }}
                >
                  BİZİMLE EĞLENMEYE DAVETLİSİNİZ
                </p>
              </div>
            </header>
          </main>
        </div>
      </section>

      {/* 2. ARKA PLAN BÖLÜMÜ – FLOW + DRESS CODE + FOOTER */}
      <section className="mini-bg-section mini-bg-section--bottom">
        <div className="page-overlay invitation-root--mini">
          <main>
            {/* DRESS CODE + FOOTER */}
            <section className="mini-section-card mini-flow-section">
              <h2
                className="mini-flow-title font-beth-ellen"
                style={{
                  color: "#78803F",
                  textAlign: "center",
                  fontSize: "2.2rem",
                  marginBottom: "1.2rem",
                }}
              >
                FLOW
              </h2>

              <div className="mini-section-card-inner">
                <div className="mini-text font-special-elite mini-flow-list">
                  <div className="mini-flow-item">
                    <span className="mini-flow-label">
                      STARTING&nbsp;•&nbsp;
                    </span>
                    <span>18:00 – BİZİMLE EĞLENMEYE DAVETLİSİNİZ</span>
                  </div>
                  <div className="mini-flow-item">
                    <span className="mini-flow-label">FLOW&nbsp;•&nbsp;</span>
                    <span>DJ, kokteyl ve bol kahkaha</span>
                  </div>
                  <div className="mini-flow-item">
                    <span className="mini-flow-label">CAKE&nbsp;•&nbsp;</span>
                    <span>DECADENT ROMANCE</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </section>
    </div>
  );
}
