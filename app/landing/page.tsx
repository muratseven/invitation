// app/landing/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PRICING = [
  {
    name: "Basic",
    maxGuests: 50,
    price: 250,
  },
  {
    name: "Standard",
    maxGuests: 100,
    price: 450,
  },
  {
    name: "Large",
    maxGuests: 500,
    price: 1900,
  },
  {
    name: "XL",
    maxGuests: 1000,
    price: 3500,
  },
];

const HERO_WORDS = ["Düğün", "Nikah", "Etkinlik", "Doğum Günü", "Parti"];

export default function LandingPage() {
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentHeroWord = HERO_WORDS[heroWordIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf7f7] via-[#f8f3ff] to-[#f1f5ff] text-slate-900">
      {/* Hero / Navbar */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/70">
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between">
          {/* Sol: logo */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-300/60">
              💌
            </span>
            <div className="flex flex-col">
              <span className="text-[0.7rem] tracking-[0.18em] uppercase text-slate-700">
                Dijital Davetiye Stüdyosu
              </span>
              <span className="text-[0.7rem] text-slate-500">
                Kişiye özel linklerle modern dijital davetiyeler
              </span>
            </div>
          </div>

          {/* Sağ: desktop navbar */}
          <nav className="hidden sm:flex items-center gap-2">
            <a
              href="#how-it-works"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-800 bg-white/80 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
            >
              Nasıl çalışır?
            </a>
            <a
              href="#pricing"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-800 bg-white/80 border border-slate-200 hover:bg-amber-400 hover:text-slate-900 hover:border-amber-300 transition-colors"
            >
              Fiyatlandırma
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm shadow-emerald-300/70 hover:bg-emerald-400 transition-colors"
            >
              Davetiyemi Oluştur
              <span className="text-xs">→</span>
            </Link>
          </nav>

          {/* Mobil: hamburger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/90 border border-slate-200 text-slate-800 shadow-sm"
            aria-label="Menüyü aç/kapat"
          >
            {mobileNavOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobil açılır menü */}
        {mobileNavOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white/95">
            <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
              <a
                href="#how-it-works"
                onClick={() => setMobileNavOpen(false)}
                className="w-full inline-flex items-center justify-between rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-medium"
              >
                Nasıl çalışır?
                <span>↓</span>
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileNavOpen(false)}
                className="w-full inline-flex items-center justify-between rounded-xl bg-slate-100 text-slate-900 px-3 py-2 text-xs font-medium border border-slate-200"
              >
                Fiyatlandırma
                <span>↓</span>
              </a>
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-500 text-slate-900 px-3 py-2 text-xs font-semibold shadow-sm"
              >
                Davetiyemi Oluştur
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Nasıl çalışır */}
      <section
        id="how-it-works"
        className="bg-transparent py-10 md:py-14 scroll-mt-24 md:scroll-mt-32"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <p className="text-[0.75rem] tracking-[0.18em] uppercase text-emerald-500">
              Adım adım davetiyen
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
              Üç adımda şık bir{" "}
              <span className="inline-block align-baseline">
                <span className="relative inline-block min-w-[6.0rem]">
                  <span className="inset-0 animate-fadeSlide text-rose-500">
                    {currentHeroWord}
                  </span>
                </span>{" "}
                davetiyesi
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Bilgilerini gir, temayı seç, davetli listeni ekle. Hepsi tek
              akışta, hem düğün hem nikah hem de tüm etkinlikler için.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Adım 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white/80 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm shadow-slate-200">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-semibold">
                1
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                Çift / ev sahibi bilgileri &amp; tarih
              </h3>
              <p className="mt-2 text-[0.8rem] text-slate-600">
                İsimleri, davetiye başlığını, tarih ve saati yazıyorsun. Düğün,
                nikah, doğum günü veya kurumsal etkinlik hiç fark etmiyor.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white/80 bg-gradient-to-b from-sky-50 to-slate-50 p-4 shadow-sm shadow-slate-200">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white text-xs font-semibold">
                2
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                Konum &amp; tema seçimi
              </h3>
              <p className="mt-2 text-[0.8rem] text-slate-600">
                Mekan adını ve adresi yazıyor, Google Maps linkini ekliyorsun.
                Sonra 10 hazır temadan birini seçiyorsun; yazı tipi ve renk
                paleti otomatik ayarlanıyor.
              </p>
              <ul className="mt-2 space-y-1 text-[0.75rem] text-slate-500">
                <li>• Adres &amp; mekan adı</li>
                <li>• Google Maps harita linki</li>
                <li>• Tek tıkla tema ve renk seçimi</li>
              </ul>
            </div>

            {/* Adım 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white/80 bg-gradient-to-b from-emerald-50 to-slate-50 p-4 shadow-sm shadow-slate-200">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-semibold">
                3
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                Davetliler &amp; linkler
              </h3>
              <p className="mt-2 text-[0.8rem] text-slate-600">
                Excel’den davetli listeni içeri alabilir veya editörde tek tek
                isim ekleyebilirsin. Her satır için kişiye özel otomatik bir
                davet linki üretiliyor; WhatsApp, SMS veya e‑posta ile
                paylaşıyorsun.
              </p>
              <ul className="mt-2 space-y-1 text-[0.75rem] text-slate-500">
                <li>• Her davetli için isme özel URL</li>
                <li>• Excel import veya manuel ekleme</li>
                <li>• Tek tıkla “Kopyala” ile paylaş</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler + canlı önizleme */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-rose-200/60 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20 grid gap-12 md:grid-cols-[1.1fr,0.9fr] items-center">
          {/* Sol: metin */}
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-emerald-700">
              Canlı davetiye önizleme
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
              Dijital davetiyen{" "}
              <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
                birkaç tık uzağında
              </span>
              .
            </h1>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed">
              Klasik kart baskılarla uğraşmadan, her davetlin için adına özel
              davet linki oluştur. Video arka plan, geri sayım, harita ve bağış
              bölümü tek bir şık sayfada. Düğün, nişan, nikah, doğum günü veya
              şirket etkinliği; hepsi için tek akış.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-emerald-300/70 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
              >
                Davetiyemi Oluştur
                <span className="text-xs">→</span>
              </Link>
            </div>

            <p className="text-[0.75rem] text-slate-500">
              Her davetlin, kendisi için hazırlanmış{" "}
              <span className="font-semibold text-slate-800">
                kişiye özel URL
              </span>{" "}
              ile bu sayfayı görüyor. Tüm davetiye sayfası mobil, tablet ve
              masaüstü için <span className="font-semibold">tam uyumlu</span>{" "}
              olarak tasarlandı.
            </p>
          </div>

          {/* Sağ: canlı davetiye kartı */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl bg-slate-950/80 border border-white/60 shadow-2xl shadow-slate-400/40 overflow-hidden backdrop-blur-xl">
              <Link
                href="/preview"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-black/70 border border-white/40 px-2.5 py-1 text-[0.7rem] text-slate-50 hover:bg-white hover:text-slate-900 hover:border-slate-900 transition-colors"
              >
                Yeni sekmede aç
                <span className="text-[0.7rem]">↗</span>
              </Link>

              <div className="relative h-44 overflow-hidden">
                <video
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/bg.webm" type="video/webm" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-slate-950/95" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-200/90">
                    Bir ömür boyu mutluluğa evet
                  </p>
                  <p className="text-3xl font-great-vibes text-rose-100 drop-shadow">
                    Sine &amp; Murat
                  </p>
                  <p className="text-[0.8rem] text-slate-200">
                    5 Nisan 2026 Pazar • Vedat Dalokay Nikah Salonu
                  </p>
                </div>
              </div>

              <div className="space-y-4 px-4 pb-4 pt-3">
                <div className="flex items-center justify-between text-[0.75rem] text-slate-100">
                  <div>
                    <p className="uppercase tracking-[0.16em] text-slate-400 text-[0.65rem]">
                      Geri Sayım
                    </p>
                    <p className="mt-0.5 font-semibold">
                      41 Gün{" "}
                      <span className="text-slate-400 font-normal">
                        06 Saat
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="uppercase tracking-[0.16em] text-slate-400 text-[0.65rem]">
                      Konum
                    </p>
                    <button className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-400/90 px-3 py-1 text-[0.7rem] font-medium text-slate-900 hover:bg-emerald-300">
                      Haritada aç
                    </button>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <p className="text-[0.7rem] text-slate-300 text-center">
                  Bu önizleme, davetiye sayfasının mobil görünümünü temsil eder.
                  Gerçek davet linkleri tüm ekran boyutları için optimize
                  edilmiştir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fiyatlandırma */}
      <section
        id="pricing"
        className="bg-transparent py-16 scroll-mt-24 md:scroll-mt-32"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <p className="text-[0.75rem] tracking-[0.18em] uppercase text-amber-500">
              Fiyatlandırma
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
              Aynı güçlü özellikler, sadece davetli sayısı değişiyor
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              Her pakette kişiye özel URL, canlı önizleme, Google Maps ve bağış
              bölümü var. Sadece kaç davetli için link üretmek istediğine karar
              veriyorsun.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {/* Basic */}
            <div className="group relative rounded-2xl border border-slate-200 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-sm shadow-slate-200 hover:-translate-y-1 hover:shadow-emerald-200 transition">
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-[0.14em]">
                Basic
              </p>
              <p className="mt-1 text-[0.8rem] text-slate-600">
                50 davetliye kadar
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                250 TL
              </p>
              <p className="mt-2 text-[0.8rem] text-slate-600">
                Küçük davetler, nikah ve aile etkinlikleri için ideal.
              </p>
              <ul className="mt-3 space-y-1 text-[0.75rem] text-slate-600">
                <li>• Kişiye özel davet URL’leri</li>
                <li>• 10 hazır tema ve canlı önizleme editörü</li>
                <li>• Google Maps ve bağış bölümü</li>
                <li>• 1 yıl boyunca aktif davetiye sayfası</li>
                <li>• 50 kişiye kadar ayrı URL</li>
              </ul>
              <Link
                href="/editor?plan=basic"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-slate-900 py-2 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
              >
                Bu paketle davetiye oluştur
              </Link>
            </div>

            {/* Standard */}
            <div className="group relative rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 to-white p-5 shadow-sm shadow-slate-200 hover:-translate-y-1 hover:shadow-sky-200 transition">
              <p className="text-xs font-medium text-sky-600 uppercase tracking-[0.14em]">
                Standard
              </p>
              <p className="mt-1 text-[0.8rem] text-slate-600">
                100 davetliye kadar
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                450 TL
              </p>
              <p className="mt-2 text-[0.8rem] text-slate-600">
                Orta ölçekli davetler ve şirket etkinlikleri için.
              </p>
              <ul className="mt-3 space-y-1 text-[0.75rem] text-slate-600">
                <li>• Kişiye özel davet URL’leri</li>
                <li>• 10 hazır tema ve canlı önizleme editörü</li>
                <li>• Google Maps ve bağış bölümü</li>
                <li>• 1 yıl boyunca aktif davetiye sayfası</li>
                <li>• 100 kişiye kadar ayrı URL</li>
              </ul>
              <Link
                href="/editor?plan=standard"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-sky-400 text-sm font-semibold text-slate-900 py-2 hover:bg-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
              >
                Bu paketle davetiye oluştur
              </Link>
            </div>

            {/* Large */}
            <div className="group relative rounded-2xl border border-slate-200 bg-gradient-to-b from-amber-50 to-white p-5 shadow-sm shadow-slate-200 hover:-translate-y-1 hover:shadow-amber-200 transition">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-[0.14em]">
                Large
              </p>
              <p className="mt-1 text-[0.8rem] text-slate-600">
                500 davetliye kadar
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                1.900 TL
              </p>
              <p className="mt-2 text-[0.8rem] text-slate-600">
                Büyük salon düğünleri ve geniş katılımlı organizasyonlar için.
              </p>
              <ul className="mt-3 space-y-1 text-[0.75rem] text-slate-600">
                <li>• Kişiye özel davet URL’leri</li>
                <li>• 10 hazır tema ve canlı önizleme editörü</li>
                <li>• Google Maps ve bağış bölümü</li>
                <li>• 1 yıl boyunca aktif davetiye sayfası</li>
                <li>• 500 kişiye kadar ayrı URL</li>
              </ul>
              <Link
                href="/editor?plan=large"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-slate-900 py-2 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
              >
                Bu paketle davetiye oluştur
              </Link>
            </div>

            {/* XL */}
            <div className="group relative rounded-2xl border border-slate-200 bg-gradient-to-b from-rose-50 to-white p-5 shadow-sm shadow-slate-200 hover:-translate-y-1 hover:shadow-rose-200 transition">
              <p className="text-xs font-medium text-rose-600 uppercase tracking-[0.14em]">
                XL
              </p>
              <p className="mt-1 text-[0.8rem] text-slate-600">
                1000 davetliye kadar
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                3.500 TL
              </p>
              <p className="mt-2 text-[0.8rem] text-slate-600">
                En geniş katılımlı düğünler, festival ve kurumsal etkinlikler
                için.
              </p>
              <ul className="mt-3 space-y-1 text-[0.75rem] text-slate-600">
                <li>• Kişiye özel davet URL’leri</li>
                <li>• 10 hazır tema ve canlı önizleme editörü</li>
                <li>• Google Maps ve bağış bölümü</li>
                <li>• 1 yıl boyunca aktif davetiye sayfası</li>
                <li>• 1000 kişiye kadar ayrı URL</li>
              </ul>
              <Link
                href="/editor?plan=xl"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-rose-400 text-sm font-semibold text-slate-900 py-2 hover:bg-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
              >
                Bu paketle davetiye oluştur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Davetli listesi & linkler */}
      <section className="bg-transparent py-16">
        <div className="mx-auto max-w-6xl px-4 grid gap-10 md:grid-cols-[1.2fr,0.8fr] items-center">
          <div>
            <p className="text-[0.75rem] tracking-[0.18em] uppercase text-sky-500">
              Davetli listesi &amp; linkler
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
              Excel listesini yükle, her davetlin için tek tıkla ayrı URL al
            </h2>
            <p className="mt-3 text-sm text-slate-700">
              Davetlilerini Excel’den içeri alabilir veya editörde tek tek isim
              ekleyebilirsin. Her satır için kişiye özel otomatik bir davet
              linki üretiliyor;{" "}
              <span className="font-medium text-slate-900">Kopyala</span>{" "}
              butonuna basman WhatsApp, SMS veya e‑posta göndermek için yeterli.
              Tüm linkler mobil cihazlarda okunabilir ve tıklanabilir olacak
              şekilde kısaltılmış ve optimize edilmiştir.
            </p>

            <ul className="mt-4 space-y-2 text-[0.8rem] text-slate-700">
              <li>
                • Her davetli için isimle eşleşen URL (örn.
                <span className="font-mono"> /davetli/murat-yildirim</span>)
              </li>
              <li>• Excel’den toplu import veya manuel ekleme</li>
              <li>
                • Linkler WhatsApp, SMS, e‑posta ve sosyal medyada sorunsuz
                çalışır
              </li>
              <li>• Hangi kişilere davet gittiği listende net görünür</li>
            </ul>
          </div>

          {/* Sağda mini tablo mock’u */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-md shadow-slate-200">
            <p className="text-[0.75rem] tracking-[0.16em] uppercase text-slate-500 mb-2">
              Örnek davetli listesi
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[0.75rem] text-slate-800">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Davetli</th>
                    <th className="px-3 py-2 text-left font-medium">Link</th>
                    <th className="px-3 py-2 text-center font-medium">
                      Kopyala
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-1.5">
                      Hülya ve Mehmet Yılmaz Ailesi
                    </td>
                    <td className="px-3 py-1.5 text-rose-500 break-all font-mono">
                      /davetli/hulya-mehmet-yilmaz-ailesi
                    </td>
                    <td className="px-3 py-1.5 text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/90 text-slate-900 text-xs">
                        ⧉
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-1.5">
                      Hacer ve Murat Yıldırım Ailesi
                    </td>
                    <td className="px-3 py-1.5 text-rose-500 break-all font-mono">
                      /davetli/hacer-murat-yildirim-ailesi
                    </td>
                    <td className="px-3 py-1.5 text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/90 text-slate-900 text-xs">
                        ⧉
                      </span>
                    </td>
                  </tr>
                  {/* Yeni: “ailesi” olmayan örnekler */}
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-1.5">Elif Arslan</td>
                    <td className="px-3 py-1.5 text-rose-500 break-all font-mono">
                      /davetli/elif-arslan
                    </td>
                    <td className="px-3 py-1.5 text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/90 text-slate-900 text-xs">
                        ⧉
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-1.5">Ayşe &amp; Alp Kaya</td>
                    <td className="px-3 py-1.5 text-rose-500 break-all font-mono">
                      /davetli/ayse-alp-kaya
                    </td>
                    <td className="px-3 py-1.5 text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/90 text-slate-900 text-xs">
                        ⧉
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[0.7rem] text-slate-500">
              Editörde bu tabloyu doldurduğunda, her satır için kişiye özel
              otomatik davetiye linki oluşuyor ve tüm linkler mobilde de
              okunaklı görünecek şekilde kısaltılıyor.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-[0.75rem] text-slate-500 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-slate-700">
              © {new Date().getFullYear()} Dijital Davetiye Stüdyosu.
            </p>
            <p className="max-w-md">
              Modern çiftler ve ev sahipleri için, tüm cihazlarda şık görünen
              kişiye özel dijital davetiyeler.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#how-it-works"
              className="hover:text-slate-800 transition-colors"
            >
              Nasıl çalışır?
            </a>
            <span className="h-3 w-px bg-slate-300" />
            <a
              href="#pricing"
              className="hover:text-slate-800 transition-colors"
            >
              Fiyatlandırma
            </a>
            <span className="h-3 w-px bg-slate-300" />
            <Link
              href="/editor"
              className="hover:text-slate-800 transition-colors"
            >
              Davetiyemi oluştur
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
