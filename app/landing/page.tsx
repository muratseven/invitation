// app/landing/page.tsx
"use client";

import { useEffect, useState } from "react";
import { WizardModal } from "../(public)/form-fields/WizardModal";

const HERO_WORDS = ["Düğün", "Nikah", "Etkinlik", "Doğum Günü", "Parti"];

const STEPS = [
  {
    num: "01",
    title: "Bilgilerini gir",
    desc: "Gelin, damat, tarih, saat ve mekan bilgilerini dakikalar içinde doldur.",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    badge: "text-violet-600",
  },
  {
    num: "02",
    title: "Temayı seç",
    desc: "10 hazır tasarımdan beğendiğini seç. Renkler ve yazı tipleri otomatik ayarlanır.",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    badge: "text-pink-600",
  },
  {
    num: "03",
    title: "Davetlileri ekle",
    desc: "Excel'den yükle veya tek tek ekle. Her davetli için kişiye özel link otomatik oluşur.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    badge: "text-emerald-600",
  },
];

const FEATURES = [
  { icon: "📍", title: "Google Maps", desc: "Tek tıkla yol tarifi.", color: "bg-red-50 text-red-500" },
  { icon: "⏳", title: "Geri sayım", desc: "Anlık sayaç her cihazda.", color: "bg-amber-50 text-amber-500" },
  { icon: "🎨", title: "10 tema", desc: "Profesyonelce tasarlanmış şablonlar.", color: "bg-violet-50 text-violet-500" },
  { icon: "📱", title: "Mobil uyumlu", desc: "Her cihazda kusursuz görünüm.", color: "bg-sky-50 text-sky-500" },
  { icon: "💝", title: "Bağış bölümü", desc: "Hayır kurumlarına yönlendirin.", color: "bg-pink-50 text-pink-500" },
  { icon: "🔗", title: "Kişiye özel URL", desc: "Her davetli için isimli link.", color: "bg-emerald-50 text-emerald-500" },
];

const PRICING = [
  {
    id: "basic",
    name: "Basic",
    guests: "50",
    price: "250",
    desc: "Küçük ve samimi davetler için.",
    gradient: "from-emerald-400 to-teal-500",
    light: "bg-emerald-50 border-emerald-100",
    btn: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    id: "standard",
    name: "Standard",
    guests: "100",
    price: "450",
    desc: "Orta ölçekli etkinlikler için.",
    gradient: "from-violet-500 to-purple-600",
    light: "bg-violet-50 border-violet-100",
    btn: "bg-violet-600 hover:bg-violet-700 text-white",
    popular: true,
  },
  {
    id: "large",
    name: "Large",
    guests: "500",
    price: "1.900",
    desc: "Büyük salon düğünleri için.",
    gradient: "from-pink-500 to-rose-500",
    light: "bg-pink-50 border-pink-100",
    btn: "bg-rose-500 hover:bg-rose-600 text-white",
  },
  {
    id: "xl",
    name: "XL",
    guests: "1000",
    price: "3.500",
    desc: "Festival ve kurumsal etkinlikler.",
    gradient: "from-amber-400 to-orange-500",
    light: "bg-amber-50 border-amber-100",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
  },
];

const FAQS = [
  {
    q: "Davetiye oluşturduktan sonra değiştirebilir miyim?",
    a: "Evet, istediğiniz zaman bilgilerinizi güncelleyebilirsiniz.",
  },
  {
    q: "Kaç kişiye davet gönderebilirim?",
    a: "Seçtiğiniz pakete bağlıdır. Basic ile 50, XL ile 1000 kişiye kadar.",
  },
  {
    q: "Ödeme seçenekleri nelerdir?",
    a: "Kredi kartı, banka kartı ve çevrimiçi banka transferi kabul ediyoruz.",
  },
  {
    q: "Davetiye linki ne zaman hazır olur?",
    a: "Ödeme tamamlandıktan sonra 5 dakika içinde tüm linkler aktif olur.",
  },
  {
    q: "Teknik destek alabilir miyim?",
    a: "Evet, 7/24 müşteri destek ekibimize ulaşabilirsiniz.",
  },
];

export default function LandingPage() {
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const openWizard = () => setWizardOpen(true);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-white text-sm shadow-md shadow-violet-200">
              💌
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Dijital Davetiye
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {[
              { label: "Nasıl çalışır?", id: "how-it-works" },
              { label: "Özellikler", id: "features" },
              { label: "Fiyatlandırma", id: "pricing" },
              { label: "SSS", id: "sss" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a
              href="/token"
              className="ml-2 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all"
            >
              🔑 Token Gir
            </a>
            <button
              onClick={openWizard}
              className="ml-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-medium shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-300 transition-all"
            >
              Davetiye Oluştur
            </button>
          </nav>

          <button
            onClick={() => setMobileNavOpen((v) => !v)}
            className="sm:hidden h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 text-sm"
          >
            {mobileNavOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-5xl px-5 py-3 flex flex-col gap-1">
              {[
                { label: "Nasıl çalışır?", id: "how-it-works" },
                { label: "Özellikler", id: "features" },
                { label: "Fiyatlandırma", id: "pricing" },
                { label: "SSS", id: "sss" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setMobileNavOpen(false); scrollTo(item.id); }}
                  className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="/token"
                onClick={() => setMobileNavOpen(false)}
                className="mt-1 w-full text-center px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-sm font-medium hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all"
              >
                🔑 Token Gir
              </a>
              <button
                onClick={() => { setMobileNavOpen(false); openWizard(); }}
                className="mt-1 w-full px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-medium"
              >
                Davetiye Oluştur
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Ambient gradient arka plan */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-200/50 blur-3xl" />
          <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-violet-100 shadow-sm px-4 py-1.5 text-xs font-medium text-violet-600 mb-8">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            Dijital davetiye platformu — Türkiye&apos;nin en şık çözümü
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-slate-900 leading-[1.05] mb-6">
            Şık{" "}
            <span
              key={heroWordIndex}
              className="bg-gradient-to-r from-violet-600 via-pink-500 to-rose-400 bg-clip-text text-transparent"
              style={{ animation: "fadeIn 0.4s ease" }}
            >
              {HERO_WORDS[heroWordIndex]}
            </span>{" "}
            <br className="hidden sm:block" />
            davetiyesi oluştur.
          </h1>

          <p className="mx-auto max-w-xl text-lg text-slate-500 leading-relaxed mb-10">
            Kişiye özel link, video arka plan, geri sayım ve harita.
            Her şey tek sayfada, dakikalar içinde hazır.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={openWizard}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold shadow-lg shadow-violet-300/50 hover:shadow-xl hover:shadow-violet-400/40 hover:-translate-y-0.5 transition-all"
            >
              Ücretsiz Başla
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-violet-300 hover:text-violet-600 transition-colors"
            >
              Nasıl çalışır? →
            </button>
          </div>

          {/* Güven sinyalleri */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Kurulum gerekmez</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> 5 dakikada hazır</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Sınırsız düzenleme</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> 7/24 destek</span>
          </div>

          {/* Token girişi linki */}
          <p className="mt-5 text-xs text-slate-400">
            Zaten bir tokeniniz var mı?{" "}
            <a href="/token" className="text-violet-500 hover:text-violet-700 font-medium underline underline-offset-2">
              🔑 Token ile giriş yapın
            </a>
          </p>
        </div>
      </section>

      {/* ── Demo kartı ── */}
      <section className="mx-auto max-w-3xl px-5 pb-28">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5">
          {/* Degrade üst çerçeve */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-pink-500 to-rose-400" />

          <div className="bg-slate-950">
            {/* Video */}
            <div className="relative h-60 sm:h-80 overflow-hidden">
              <video
                className="absolute inset-0 h-full w-full object-cover opacity-55"
                autoPlay muted loop playsInline
              >
                {/* <source src="/bg.webm" type="video/webm" /> */}
                <source src="/bg.mp4" type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/50">
                  Bir ömür boyu mutluluğa evet
                </p>
                <p className="text-5xl sm:text-6xl font-great-vibes text-white drop-shadow-lg">
                  Sine &amp; Murat
                </p>
                <p className="text-sm text-white/60 mt-1">
                  5 Nisan 2026 Pazar &bull; Vedat Dalokay Nikah Salonu
                </p>
              </div>
            </div>

            {/* Alt bilgi */}
            <div className="px-6 pb-6 pt-5 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[0.6rem] uppercase tracking-widest text-slate-500 mb-1.5">Geri Sayım</p>
                <p className="text-white text-sm font-semibold">41g 06s 22d</p>
              </div>
              <div>
                <p className="text-[0.6rem] uppercase tracking-widest text-slate-500 mb-1.5">Konum</p>
                <button className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
                  Haritada aç <span className="text-xs">↗</span>
                </button>
              </div>
              <div>
                <p className="text-[0.6rem] uppercase tracking-widest text-slate-500 mb-1.5">RSVP</p>
                <button className="inline-flex items-center gap-1 text-rose-400 text-sm font-medium hover:text-rose-300 transition-colors">
                  Katılıyorum <span className="text-xs">✓</span>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute top-5 right-5">
            <button
              onClick={openWizard}
              className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors"
            >
              Kendininkini oluştur →
            </button>
          </div>
        </div>
      </section>

      {/* ── Nasıl Çalışır ── */}
      <section
        id="how-it-works"
        className="py-24 scroll-mt-20 bg-slate-50"
      >
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-14 text-center">
            <span className="inline-flex items-center rounded-full bg-violet-100 text-violet-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-3">
              Nasıl çalışır?
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Üç adımda hazır.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className={`rounded-2xl p-7 ${step.bg} border border-white`}>
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${step.color} text-white text-sm font-bold shadow-md mb-5`}>
                  {step.num}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={openWizard}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Hemen Başla →
            </button>
          </div>
        </div>
      </section>

      {/* ── Özellikler ── */}
      <section id="features" className="py-24 scroll-mt-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-14 text-center">
            <span className="inline-flex items-center rounded-full bg-pink-100 text-pink-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-3">
              Özellikler
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              İhtiyacınız olan her şey içeride.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.color} text-xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Davetli Listesi ── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-5xl px-5 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-100 text-sky-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-4">
              Davetli listesi
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-5">
              Excel&apos;den yükle,<br />anında paylaş.
            </h2>
            <p className="text-base text-slate-500 leading-relaxed mb-6">
              Her davetli için ismiyle eşleşen kişisel bir URL otomatik oluşturuluyor.
              WhatsApp, SMS veya e‑posta ile tek tıkla paylaş.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              {[
                { text: "Excel'den toplu içeri aktar veya tek tek ekle", color: "bg-emerald-500" },
                { text: "Her davetli için isimli kişisel URL", color: "bg-sky-500" },
                { text: "WhatsApp, SMS, e‑posta ile anında paylaş", color: "bg-violet-500" },
                { text: "Kim açtı, kim katıldı — canlı takip", color: "bg-pink-500" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className={`mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full ${item.color}`} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white">
            <div className="bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 flex items-center gap-2">
              <span className="text-white text-xs font-semibold">Örnek davetli listesi</span>
              <span className="ml-auto inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[0.6rem] text-white font-medium">
                4 davetli
              </span>
            </div>
            <table className="w-full text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-slate-400">Davetli</th>
                  <th className="px-4 py-2.5 text-left font-medium text-slate-400">Link</th>
                  <th className="px-4 py-2.5 text-center font-medium text-slate-400">⧉</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Hülya Yılmaz Ailesi", slug: "hulya-yilmaz" },
                  { name: "Murat Yıldırım", slug: "murat-yildirim" },
                  { name: "Elif Arslan", slug: "elif-arslan" },
                  { name: "Ayşe & Alp Kaya", slug: "ayse-alp-kaya" },
                ].map((row, i) => (
                  <tr key={row.slug} className={`border-t border-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                    <td className="px-4 py-2.5 font-medium">{row.name}</td>
                    <td className="px-4 py-2.5 text-violet-400 font-mono text-[0.7rem]">/{row.slug}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-pink-500 text-white text-[0.6rem] cursor-pointer hover:opacity-80 transition-opacity">
                        ⧉
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Fiyatlandırma ── */}
      <section id="pricing" className="py-24 scroll-mt-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-14 text-center">
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-3">
              Fiyatlandırma
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Sadece davetli sayısı değişiyor.
            </h2>
            <p className="mt-3 text-base text-slate-500 max-w-lg mx-auto">
              Tüm paketlerde aynı özellikler. Kaç kişiyi davet edeceğine göre seç.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl shadow-sm ${plan.light}`}
              >
                {/* Üst gradient şerit */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${plan.gradient}`} />

                <div className="p-6 bg-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{plan.name}</p>
                  <p className="text-[0.8rem] text-slate-500 mb-4">{plan.guests} davetliye kadar</p>
                  <p className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">
                    {plan.price}
                    <span className="text-sm font-normal text-slate-400 ml-1">TL</span>
                  </p>
                  <p className="text-xs text-slate-400 mb-6">{plan.desc}</p>
                  <button
                    onClick={openWizard}
                    className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${plan.btn}`}
                  >
                    Seç →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Tüm paketlerde &bull; Kişiye özel URL &bull; 10 hazır tema &bull; Google Maps &bull; Bağış bölümü &bull; 1 yıl aktif sayfa
          </p>
        </div>
      </section>

      {/* ── SSS ── */}
      <section id="sss" className="py-24 scroll-mt-20 bg-slate-50">
        <div className="mx-auto max-w-2xl px-5">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center rounded-full bg-teal-100 text-teal-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-3">
              SSS
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Sıkça sorulan sorular.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-xl border bg-white overflow-hidden transition-all ${openFaq === idx ? "border-violet-200 shadow-md shadow-violet-100" : "border-slate-200"
                  }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 px-5 py-4"
                >
                  <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                  <span
                    className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-sm transition-all ${openFaq === idx
                        ? "bg-violet-500 text-white rotate-45"
                        : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    +
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Davetiyenizi oluşturmaya<br />hazır mısınız?
          </h2>
          <p className="text-base text-slate-500 mb-8">
            Dakikalar içinde hazır. Kredi kartı gerekmez.
          </p>
          <button
            onClick={openWizard}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold shadow-xl shadow-violet-300/50 hover:shadow-2xl hover:shadow-violet-400/40 hover:-translate-y-0.5 transition-all"
          >
            Ücretsiz Başla →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto max-w-5xl px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 text-white text-[0.6rem] shadow-sm">
              💌
            </span>
            <span className="font-medium text-slate-600">Dijital Davetiye</span>
            <span>— © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "Nasıl çalışır?", id: "how-it-works" },
              { label: "Fiyatlandırma", id: "pricing" },
              { label: "SSS", id: "sss" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="hover:text-slate-700 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={openWizard}
              className="text-violet-600 font-semibold hover:text-violet-700 transition-colors"
            >
              Davetiye Oluştur
            </button>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <WizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
