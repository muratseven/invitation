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

  const { leftInitial, rightInitial } = useMemo(() => {
    const b = (brideName ?? "").trim();
    const g = (groomName ?? "").trim();
    return {
      leftInitial: b ? b[0].toUpperCase() : "S",
      rightInitial: g ? g[0].toUpperCase() : "M",
    };
  }, [brideName, groomName]);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setShowSparkles(true);

    // Opacity ile ana davetiyeyi ortaya bırakmak için
    // önce overlay'i yavaşça soldur, sonra parent onOpen ile unmount et
    const fadeDuration = 1500;

    setTimeout(() => {
      onOpen();
    }, fadeDuration);
  };

  return (
    <div className={`hero-overlay ${isOpening ? "hero-overlay--fading" : ""}`}>
      <div className="hero-bg-glow" />

      <div className="hero-content">
        <button
          type="button"
          className={`seal-button-minimal ${
            isOpening ? "seal-button-minimal--pressed" : ""
          }`}
          onClick={handleClick}
        >
          <span className="seal-ring-minimal" />
          <span className="seal-core-minimal">
            <span className="seal-initial">{leftInitial}</span>
            <span className="seal-amp">&amp;</span>
            <span className="seal-initial">{rightInitial}</span>
          </span>

          {showSparkles && (
            <div className="sparkles">
              <span className="sparkle sparkle-1" />
              <span className="sparkle sparkle-2" />
              <span className="sparkle sparkle-3" />
              <span className="sparkle sparkle-4" />
            </div>
          )}
        </button>

        <div className="hero-text">
          <p className="hero-caption">Davetiyeyi Açmak İçin Dokunun</p>
        </div>
      </div>

      <style jsx>{`
        .hero-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
              circle at top,
              rgba(255, 255, 255, 0.12),
              transparent 60%
            ),
            radial-gradient(
              circle at bottom,
              rgba(248, 210, 180, 0.22),
              transparent 55%
            ),
            rgba(15, 23, 42, 0.97);
          backdrop-filter: blur(14px);
          transition: opacity 1.5s ease, backdrop-filter 1.5s ease;
          opacity: 1;
        }

        .hero-overlay--fading {
          opacity: 0;
          backdrop-filter: blur(0px);
          pointer-events: none;
        }

        .hero-bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              circle at 50% 30%,
              rgba(255, 255, 255, 0.18),
              transparent 55%
            ),
            radial-gradient(
              circle at 50% 80%,
              rgba(248, 210, 180, 0.22),
              transparent 60%
            );
          opacity: 0.9;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem 1.5rem;
        }

        .seal-button-minimal {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: radial-gradient(circle at 30% 20%, #fff3e1, #c58b55);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.65),
            0 0 0 2px rgba(255, 255, 255, 0.6),
            0 0 0 8px rgba(120, 85, 52, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
            box-shadow 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease;
        }

        .seal-button-minimal:hover {
          transform: translateY(2px) scale(1.04);
          box-shadow: 0 22px 46px rgba(0, 0, 0, 0.8),
            0 0 0 2px rgba(255, 255, 255, 0.7),
            0 0 0 10px rgba(120, 85, 52, 0.4);
        }

        .seal-button-minimal--pressed {
          transform: translateY(6px) scale(0.97);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.7),
            0 0 0 2px rgba(255, 255, 255, 0.55),
            0 0 0 5px rgba(120, 85, 52, 0.5);
        }

        .seal-ring-minimal {
          position: absolute;
          inset: 12px;
          border-radius: inherit;
          border: 2px solid rgba(88, 52, 26, 0.35);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
        }

        .seal-core-minimal {
          position: relative;
          z-index: 1;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          background: rgba(255, 243, 228, 0.98);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.28),
            inset 0 0 0 1px rgba(255, 255, 255, 0.8);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.32em;
        }

        .seal-initial {
          font-family: "Great Vibes", "Dancing Script", system-ui;
          font-size: 2rem;
          line-height: 1;
          color: #3a2416;
        }

        .seal-amp {
          font-family: "Playfair Display", "Times New Roman", serif;
          font-size: 1.05rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #b9844b;
          transform: translateY(0.02em);
        }

        .hero-text {
          text-align: center;
        }

        .hero-brand {
          font-size: 0.8rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.8);
        }

        .hero-caption {
          margin-top: 0.35rem;
          font-size: 0.95rem;
          color: rgb(241, 245, 249);
        }

        /* Sparkles – butona tıkladıktan sonra parıltı */
        .sparkles {
          pointer-events: none;
          position: absolute;
          inset: 0;
        }

        .sparkle {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: radial-gradient(circle, #ffffff, rgba(255, 255, 255, 0));
          opacity: 0;
          transform-origin: center;
          animation: sparkle-pulse 1s ease-out forwards;
        }

        .sparkle-1 {
          top: 18%;
          left: 22%;
          animation-delay: 0.02s;
        }

        .sparkle-2 {
          top: 16%;
          right: 18%;
          animation-delay: 0.1s;
        }

        .sparkle-3 {
          bottom: 16%;
          left: 26%;
          animation-delay: 0.16s;
        }

        .sparkle-4 {
          bottom: 18%;
          right: 22%;
          animation-delay: 0.22s;
        }

        @keyframes sparkle-pulse {
          0% {
            opacity: 0;
            transform: translateY(4px) scale(0.4);
          }
          40% {
            opacity: 1;
            transform: translateY(-2px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(1.5);
          }
        }

        /* Süreyi de 1s → 1.4s yapalım */
        .sparkle {
          /* ... */
          animation: sparkle-pulse 1.4s ease-out forwards;
        }

        @media (max-width: 480px) {
          .seal-button-minimal {
            width: 104px;
            height: 104px;
          }
          .seal-initial {
            font-size: 1.8rem;
          }
          .seal-amp {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
