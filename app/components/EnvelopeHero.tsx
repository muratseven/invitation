// components/EnvelopeHero.tsx
"use client";

import React, { useState, useMemo } from "react";

type EnvelopeHeroProps = {
  onOpen: () => void;
  brideName?: string;
  groomName?: string;
};

export function EnvelopeHero({
  onOpen,
  brideName,
  groomName,
}: EnvelopeHeroProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const { leftInitial, rightInitial, displayNames } = useMemo(() => {
    const b = (brideName ?? "").trim();
    const g = (groomName ?? "").trim();
    return {
      leftInitial: b ? b[0].toUpperCase() : "S",
      rightInitial: g ? g[0].toUpperCase() : "M",
      displayNames:
        b && g ? `${b} & ${g}` : b || g || "",
    };
  }, [brideName, groomName]);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setShowSparkles(true);
    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <div className={`hero-overlay ${isOpening ? "hero-overlay--fading" : ""}`}>
      <div className="hero-bg-glow" />

      {/* Floating particles — mix of white + gold */}
      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className={`particle particle-${i % 6}${
              i % 3 === 0 ? " particle-gold" : ""
            }`}
          />
        ))}
      </div>

      <div className="hero-content">
        {/* Couple names above the seal */}
        {displayNames && (
          <p className="hero-names-display">{displayNames}</p>
        )}

        <button
          type="button"
          className={`seal-button-minimal ${
            isOpening ? "seal-button-minimal--pressed" : ""
          }`}
          onClick={handleClick}
          aria-label="Davetiyeyi aç"
        >
          {/* Outer pulse rings */}
          <span className="seal-pulse-ring" />
          <span className="seal-pulse-ring seal-pulse-ring-2" />

          {/* Inner etching ring */}
          <span className="seal-ring-minimal" />

          {/* Shimmer sweep */}
          <span className="seal-shimmer" aria-hidden="true" />

          {/* Initials core */}
          <span className="seal-core-minimal">
            <span className="seal-initial">{leftInitial}</span>
            <span className="seal-amp">&amp;</span>
            <span className="seal-initial">{rightInitial}</span>
          </span>

          {/* Sparkle burst on click */}
          {showSparkles && (
            <div className="sparkles">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`sparkle sparkle-${(i % 4) + 1}`}
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${10 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.055}s`,
                    width: `${5 + Math.random() * 9}px`,
                    height: `${5 + Math.random() * 9}px`,
                  }}
                />
              ))}
            </div>
          )}
        </button>

        <div className="hero-text">
          <p className="hero-caption">Davetiyeyi Açmak İçin Dokunun</p>
          <p className="hero-caption-sub">Tap to open your invitation</p>
        </div>
      </div>

      <style jsx>{`
        /* ===== OVERLAY ===== */
        .hero-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
              ellipse at 50% 0%,
              rgba(255, 255, 255, 0.10),
              transparent 55%
            ),
            radial-gradient(
              ellipse at 50% 100%,
              rgba(197, 139, 85, 0.16),
              transparent 55%
            ),
            rgba(10, 14, 26, 0.98);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: opacity 1.5s ease, backdrop-filter 1.5s ease;
          opacity: 1;
          overflow: hidden;
        }

        .hero-overlay--fading {
          opacity: 0;
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          pointer-events: none;
        }

        /* ===== BACKGROUND GLOW ===== */
        .hero-bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              ellipse at 50% 25%,
              rgba(255, 255, 255, 0.12),
              transparent 52%
            ),
            radial-gradient(
              ellipse at 50% 85%,
              rgba(197, 139, 85, 0.18),
              transparent 55%
            );
          animation: glow-breathe 5s ease-in-out infinite;
        }

        @keyframes glow-breathe {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }

        /* ===== FLOATING PARTICLES ===== */
        .hero-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.65), transparent);
          animation: particle-float linear infinite;
        }

        .particle-gold {
          background: radial-gradient(
            circle,
            rgba(255, 200, 100, 0.75),
            transparent
          );
        }

        .particle-0 { width: 3px; height: 3px; top: 10%; left: 15%; animation-duration: 12s; animation-delay: 0s; }
        .particle-1 { width: 2px; height: 2px; top: 30%; left: 70%; animation-duration: 15s; animation-delay: 2s; }
        .particle-2 { width: 4px; height: 4px; top: 60%; left: 40%; animation-duration: 18s; animation-delay: 4s; }
        .particle-3 { width: 2px; height: 2px; top: 80%; left: 80%; animation-duration: 14s; animation-delay: 1s; }
        .particle-4 { width: 3px; height: 3px; top: 50%; left: 20%; animation-duration: 16s; animation-delay: 3s; }
        .particle-5 { width: 2px; height: 2px; top: 20%; left: 55%; animation-duration: 13s; animation-delay: 5s; }

        @keyframes particle-float {
          0%   { transform: translate(0, 0) scale(1); opacity: 0; }
          10%  { opacity: 0.75; }
          50%  { transform: translate(40px, -70px) scale(1.6); opacity: 0.45; }
          90%  { opacity: 0; }
          100% { transform: translate(-25px, -130px) scale(0.4); opacity: 0; }
        }

        /* ===== HERO CONTENT ===== */
        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.6rem;
          padding: 2rem 1.5rem;
        }

        /* ===== COUPLE NAMES DISPLAY ===== */
        .hero-names-display {
          font-family: "Great Vibes", "Dancing Script", cursive;
          font-size: clamp(1.4rem, 5vw, 2rem);
          color: rgba(255, 238, 210, 0.72);
          letter-spacing: 0.1em;
          text-align: center;
          line-height: 1.3;
          animation: caption-fade-in 1.8s ease-out 0.2s both;
          user-select: none;
        }

        /* ===== SEAL BUTTON ===== */
        .seal-button-minimal {
          position: relative;
          width: 132px;
          height: 132px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: radial-gradient(circle at 32% 22%, #fff3e1, #c58b55 80%);
          box-shadow:
            0 20px 52px rgba(0, 0, 0, 0.68),
            0 0 0 2px rgba(255, 255, 255, 0.62),
            0 0 0 9px rgba(120, 85, 52, 0.32),
            0 0 90px rgba(197, 139, 85, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
            box-shadow 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease;
          animation: seal-entrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          overflow: hidden;
        }

        @keyframes seal-entrance {
          0%   { opacity: 0; transform: scale(0.55) translateY(24px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .seal-button-minimal:hover {
          transform: translateY(-2px) scale(1.06);
          box-shadow:
            0 26px 58px rgba(0, 0, 0, 0.82),
            0 0 0 2px rgba(255, 255, 255, 0.72),
            0 0 0 11px rgba(120, 85, 52, 0.38),
            0 0 110px rgba(197, 139, 85, 0.28);
        }

        .seal-button-minimal--pressed {
          transform: translateY(5px) scale(0.94);
          box-shadow:
            0 10px 24px rgba(0, 0, 0, 0.72),
            0 0 0 2px rgba(255, 255, 255, 0.52),
            0 0 0 5px rgba(120, 85, 52, 0.48);
        }

        /* ===== PULSE RINGS ===== */
        .seal-pulse-ring {
          position: absolute;
          inset: -14px;
          border-radius: inherit;
          border: 1.5px solid rgba(197, 139, 85, 0.32);
          animation: pulse-ring 2.8s ease-out infinite;
          pointer-events: none;
        }

        .seal-pulse-ring-2 {
          inset: -20px;
          border-color: rgba(197, 139, 85, 0.16);
          animation-delay: 1.4s;
        }

        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.7; }
          80%  { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        /* ===== INNER RING ===== */
        .seal-ring-minimal {
          position: absolute;
          inset: 12px;
          border-radius: inherit;
          border: 1.5px solid rgba(88, 52, 26, 0.32);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.65);
          pointer-events: none;
        }

        /* ===== SHIMMER SWEEP ===== */
        .seal-shimmer {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
        }

        .seal-shimmer::after {
          content: "";
          position: absolute;
          top: -60%;
          left: -80%;
          width: 45%;
          height: 220%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.22),
            transparent
          );
          transform: skewX(-18deg);
          animation: shimmer-sweep 4.5s ease-in-out infinite 1.8s;
        }

        @keyframes shimmer-sweep {
          0%         { left: -80%; opacity: 0; }
          8%         { opacity: 1; }
          48%, 100%  { left: 130%; opacity: 0; }
        }

        /* ===== SEAL CORE ===== */
        .seal-core-minimal {
          position: relative;
          z-index: 1;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          background: rgba(255, 243, 228, 0.97);
          box-shadow:
            0 3px 10px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px rgba(255, 255, 255, 0.82);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.3em;
        }

        .seal-initial {
          font-family: "Great Vibes", "Dancing Script", system-ui;
          font-size: 2.1rem;
          line-height: 1;
          color: #3a2416;
        }

        .seal-amp {
          font-family: "Playfair Display", "Times New Roman", serif;
          font-size: 1.05rem;
          letter-spacing: 0.14em;
          color: #b9844b;
          transform: translateY(0.03em);
        }

        /* ===== CAPTION ===== */
        .hero-text {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }

        .hero-caption {
          font-size: 0.95rem;
          color: rgb(241, 245, 249);
          animation: caption-breathe 3s ease-in-out infinite,
                     caption-fade-in 1.5s ease-out 0.5s both;
          letter-spacing: 0.07em;
        }

        .hero-caption-sub {
          font-size: 0.7rem;
          color: rgba(241, 245, 249, 0.42);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          animation: caption-fade-in 2s ease-out 1.1s both;
        }

        @keyframes caption-breathe {
          0%, 100% { opacity: 0.82; }
          50%       { opacity: 1; }
        }

        @keyframes caption-fade-in {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* ===== SPARKLES ===== */
        .sparkles {
          pointer-events: none;
          position: absolute;
          inset: -22px;
        }

        .sparkle {
          position: absolute;
          border-radius: 999px;
          background: radial-gradient(circle, #ffffff, rgba(255, 215, 160, 0));
          opacity: 0;
          transform-origin: center;
          animation: sparkle-pulse 1.5s ease-out forwards;
        }

        @keyframes sparkle-pulse {
          0%  { opacity: 0; transform: translateY(4px) scale(0.3); }
          28% { opacity: 1; transform: translateY(-5px) scale(1.3); }
          100%{ opacity: 0; transform: translateY(-20px) scale(1.9); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 480px) {
          .seal-button-minimal {
            width: 116px;
            height: 116px;
          }
          .seal-initial   { font-size: 1.9rem; }
          .seal-amp        { font-size: 0.95rem; }
          .hero-names-display { font-size: 1.35rem; }
        }
      `}</style>
    </div>
  );
}
