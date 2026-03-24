// app/(public)/form-fields/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WizardModal } from "./WizardModal";

export default function FormFieldsPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [wizardOpen, setWizardOpen] = useState(false);

  const steps = [
    {
      number: 1,
      title: "Etkinlik Türü",
      description: "Düğün, Nişan, Baby Shower, vb. seçin",
      icon: "🎯",
    },
    {
      number: 2,
      title: "Şablon Seçimi",
      description: "Tercih ettiğiniz tasarımı seçin",
      icon: "🎨",
    },
    {
      number: 3,
      title: "Ev Sahibi Bilgileri",
      description: "Gelin, damat, aile bilgileri girin",
      icon: "👥",
    },
    {
      number: 4,
      title: "Tarih & Mekan",
      description: "Tarih, saat, konum ayarlamışını yapın",
      icon: "📍",
    },
    {
      number: 5,
      title: "Tema Özelleştir",
      description: "Font ve renkleri özelleştirin",
      icon: "🎭",
    },
    {
      number: 6,
      title: "Aile & Bağış",
      description: "Aile bilgileri ve bağış seçenekleri",
      icon: "💝",
    },
    {
      number: 7,
      title: "Fatura Bilgileri",
      description: "Sipariş detaylarını girin",
      icon: "📋",
    },
    {
      number: 8,
      title: "Ödeme",
      description: "Güvenli ödeme ile tamamlayın",
      icon: "💳",
    },
  ];

  const features = [
    {
      icon: "🎨",
      title: "8 Adımlı Wizard",
      description:
        "Kolay ve adım adım davetiye oluşturma süreci",
    },
    {
      icon: "📱",
      title: "Mobil Uyumlu",
      description:
        "Tüm cihazlarda mükemmel görüntü",
    },
    {
      icon: "🎬",
      title: "Video & Galeri",
      description:
        "Hatıralar ve fotoğraflar paylaşın",
    },
    {
      icon: "🔗",
      title: "QR Kod",
      description:
        "Davetiyeye QR kod ile erişim sağlayın",
    },
    {
      icon: "🎵",
      title: "Sesli Mesaj",
      description:
        "Kişisel sesli mesaj kaydı ekleyin",
    },
    {
      icon: "💌",
      title: "Sınırsız Davetli",
      description:
        "Kaç davetli olursa olsun tümünü davet edin",
    },
  ];

  const plans = [
    {
      id: "baby-shower",
      name: "Baby Shower",
      price: "549",
      features: [
        "10.000'e kadar davetli",
        "Tüm özelliklere erişim",
        "Sınırsız düzenleme",
        "1 yıl depolama",
      ],
    },
    {
      id: "standard",
      name: "Düğün / Nişan",
      price: "999",
      features: [
        "15.000'e kadar davetli",
        "Tüm özelliklere erişim",
        "Premium şablonlar",
        "Video yükleme",
        "2 yıl depolama",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Paket",
      price: "1.099",
      features: [
        "Sınırsız davetli",
        "Tüm özellikler + ekstralar",
        "Özel tasarım desteği",
        "Sesli mesaj kaydı",
        "3 yıl depolama",
      ],
    },
  ];

  const faqs = [
    {
      q: "Davetiye oluşturduktan sonra değiştirebilir miyim?",
      a: "Evet, istediğiniz zaman değiştirebilir, güncelleyebilirsiniz.",
    },
    {
      q: "Kaç kişiye davet gönderebilirim?",
      a: "Seçtiğiniz pakete göre değişir. Premium paket sınırsız davetli içerir.",
    },
    {
      q: "Ödeme seçenekleri nelerdir?",
      a: "Kredi kartı, debit kartı ve çevrimiçi banka transferi kabul ediyoruz.",
    },
    {
      q: "Davetiye linki paylaşmak kaç gün alır?",
      a: "Ödeme yapıldıktan sonra 5 dakika içinde hazır olur.",
    },
    {
      q: "Teknik destek alabilir miyim?",
      a: "Evet, 7/24 müşteri destek hizmeti sunuyoruz.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <h1 className="font-bold text-lg text-slate-900">Dijital Davetiye</h1>
            </div>
            <div className="hidden md:flex gap-8 text-sm">
              <a href="#ozellikler" className="text-slate-600 hover:text-slate-900">Özellikler</a>
              <a href="#adimlar" className="text-slate-600 hover:text-slate-900">Adımlar</a>
              <a href="#fiyatlandirma" className="text-slate-600 hover:text-slate-900">Fiyatlandırma</a>
              <a href="#sss" className="text-slate-600 hover:text-slate-900">SSS</a>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
            >
              Anasayfa
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 sm:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Dijital Davetiye Hizmetleri
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Sevdiklerinizi en şık şekilde davet edin. Modern, etkileşimli ve unutulmaz davetiyeler oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setWizardOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105">
              Şimdi Başla
            </button>
            <button
              onClick={() => {
                setWizardOpen(true);
                // Burada demo verilerini yükleyebiliriz
              }}
              className="px-8 py-3 border-2 border-slate-900 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition">
              Demo Gör
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="ozellikler" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Neden Dijital Davetiye?
            </h2>
            <p className="text-lg text-slate-600">
              Davetiye oluşturmayı hiç bu kadar kolay ve güzel hale getirdik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition hover:border-purple-300"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="adimlar" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              8 Adımda Davetiye Oluştur
            </h2>
            <p className="text-lg text-slate-600">
              Kolay, hızlı ve gözetim altında
            </p>
          </div>

          {/* Step Navigation */}
          {/* Interactive Step Display */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Step Navigation - Left Side */}
            <div className="space-y-3">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number - 1)}
                  className={`w-full p-4 rounded-xl font-semibold transition text-left border-2 ${
                    activeStep === step.number - 1
                      ? "bg-purple-600 text-white border-purple-600 shadow-lg scale-105"
                      : "bg-white text-slate-900 border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{step.icon}</div>
                    <div>
                      <div className="font-bold">Adım {step.number}</div>
                      <div className="text-sm opacity-80">{step.title}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Step Details - Right Side */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 sticky top-20">
              <div className="text-7xl mb-4 text-center">{steps[activeStep].icon}</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3 text-center">
                {steps[activeStep].title}
              </h3>
              <p className="text-lg text-slate-700 mb-6 text-center leading-relaxed">
                {steps[activeStep].description}
              </p>
              <div className="bg-white rounded-lg p-4 text-sm text-slate-600 text-center">
                <span className="font-semibold text-purple-600">Adım {activeStep + 1} / {steps.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="fiyatlandirma" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Şeffaf Fiyatlandırma
            </h2>
            <p className="text-lg text-slate-600">
              Tüm özellikler KDV dahil bir ödeme
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition transform hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105"
                    : "bg-white border border-slate-200 text-slate-900"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-900 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    ⭐ Popüler
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}₺</span>
                  <span className={plan.popular ? "text-pink-100" : "text-slate-600"}>
                    {" "}
                    / bir kez
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold mb-6 transition ${
                    plan.popular
                      ? "bg-white text-purple-600 hover:bg-slate-100"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Seç
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-xl">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="sss" className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
              >
                <summary className="font-semibold text-slate-900 flex justify-between items-center">
                  {faq.q}
                  <span className="group-open:rotate-180 transition text-2xl">▼</span>
                </summary>
                <p className="mt-4 text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Sevdiklerinizi Davet Etmeye Hazır mısınız?
          </h2>
          <p className="text-lg mb-8 text-purple-100">
            Şimdi başlayın ve unutulmaz bir davetiye oluşturun
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105">
            Ücretsiz Başla
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <h3 className="font-bold">Dijital Davetiye</h3>
              </div>
              <p className="text-slate-400">
                Dijital davetiye çözümleri
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ürün</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Özellikler</a></li>
                <li><a href="#" className="hover:text-white">Şablonlar</a></li>
                <li><a href="#" className="hover:text-white">Fiyatlandırma</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Şirket</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Hakkımız</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">İletişim</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Yasal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Gizlilik</a></li>
                <li><a href="#" className="hover:text-white">Kullanım Şartları</a></li>
                <li><a href="#" className="hover:text-white">Çerez Politikası</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© 2026 Dijital Davetiye. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Wizard Modal */}
      <WizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
