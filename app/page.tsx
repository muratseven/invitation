// app/page.tsx

"use client";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React, { useState } from "react";

type InvitationSettings = {
  brideName: string;
  groomName: string;
  title: string;
  date: string;
  time: string;
  location: string;
  inviteText: string;
  donationText: string;
  backgroundColor: string;
  primaryTextColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  fontFamily: "great-vibes" | "cormorant";
};

export default function EditorPage() {
  const [settings, setSettings] = useState<InvitationSettings>({
    brideName: "Sine123",
    groomName: "Murat123",
    title: "Nişanımıza davetlisiniz!",
    date: "12 Ekim 2026 Cumartesi",
    time: "18:30 - 22:00",
    location: "Saraç İshak, Tavşantaşı Sk. No:5, 34130 Fatih/İstanbul, Türkiye",
    backgroundColor: "#f7f3ef",
    primaryTextColor: "#000000",
    buttonBackground: "#000000",
    buttonTextColor: "#ffffff",
    inviteText: "Bu özel günümüze davetlisiniz!",
    donationText: "Sizin adınıza TEMA Vakfı'na bir fidan bağışında bulunduk",
    fontFamily: "cormorant",
  });

  const handleChange = (field: keyof InvitationSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 p-4 md:p-6 bg-slate-950 text-slate-50">
      {/* SOL: Editor Formu */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900/90 rounded-xl p-4 md:p-5 border border-slate-800 overflow-y-auto">
        <h1 className="text-lg font-semibold mb-4">Davetiye Editörü</h1>

        <SectionTitle label="Çift Bilgileri" />

        <TextField
          label="Gelin Adı"
          value={settings.brideName}
          onChange={(v) => handleChange("brideName", v)}
        />

        <TextField
          label="Damat Adı"
          value={settings.groomName}
          onChange={(v) => handleChange("groomName", v)}
        />
        <SpeedInsights />
        <TextField
          label="Başlık"
          value={settings.title}
          onChange={(v) => handleChange("title", v)}
        />

        <SectionTitle label="Tarih & Konum" />

        <TextField
          label="Tarih"
          value={settings.date}
          onChange={(v) => handleChange("date", v)}
        />

        <TextField
          label="Saat"
          value={settings.time}
          onChange={(v) => handleChange("time", v)}
        />

        <TextAreaField
          label="Konum"
          value={settings.location}
          onChange={(v) => handleChange("location", v)}
        />
        <SectionTitle label="Yazı Tipi" />

        <select
          value={settings.fontFamily}
          onChange={(e) => handleChange("fontFamily", e.target.value as any)}
          className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-xs"
        >
          <option value="great-vibes">Great Vibes</option>
          <option value="cormorant">Cormorant Garamond</option>
        </select>

        <SectionTitle label="Renkler" />

        <ColorField
          label="Arkaplan Rengi"
          value={settings.backgroundColor}
          onChange={(v) => handleChange("backgroundColor", v)}
        />

        <ColorField
          label="Yazı Rengi"
          value={settings.primaryTextColor}
          onChange={(v) => handleChange("primaryTextColor", v)}
        />

        <ColorField
          label="Buton Arkaplan"
          value={settings.buttonBackground}
          onChange={(v) => handleChange("buttonBackground", v)}
        />

        <ColorField
          label="Buton Yazı Rengi"
          value={settings.buttonTextColor}
          onChange={(v) => handleChange("buttonTextColor", v)}
        />

        <p className="mt-4 text-xs text-slate-400">
          Not: Şu an için bu editör sadece tarayıcıda çalışıyor. Sayfayı
          yenilediğinizde veriler sıfırlanır. Sonraki adımda bunu veritabanına
          kaydedebiliriz.
        </p>
      </div>

      {/* SAĞ: Davetiye Önizleme */}
      <div className="flex-1 flex items-start justify-center md:justify-start">
        <InvitationPreview settings={settings} />
      </div>
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <h2 className="mt-4 mb-2 text-sm font-semibold text-slate-200">{label}</h2>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TextField({ label, value, onChange }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-300">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-300">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-sky-500/60"
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-xs font-medium text-slate-300">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 p-0 border-none bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2.5 py-2 rounded-md border border-slate-700 bg-slate-950/60 text-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>
    </div>
  );
}

function InvitationPreview({ settings }: { settings: InvitationSettings }) {
  const {
    brideName,
    groomName,
    title,
    date,
    time,
    location,
    inviteText,
    donationText,
    backgroundColor,
    primaryTextColor,
    buttonBackground,
    buttonTextColor,
    fontFamily,
  } = settings;

  const [openDonation, setOpenDonation] = useState(false);
  const fontClass =
    fontFamily === "great-vibes" ? "font-great-vibes" : "font-cormorant";

  return (
    <div
      className={`w-full max-w-3xl rounded-3xl shadow-2xl p-6 md:p-8 ${fontClass}`}
      style={{ backgroundColor, color: primaryTextColor }}
    >
      {/* HERO */}
      <section className="relative min-h-[420px] flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10">
          <p className="tracking-[0.3em] text-xs uppercase mb-3">
            Biz Evleniyoruz
          </p>

          <h1 className="text-4xl md:text-5xl font-light leading-tight">
            <span className="block">{brideName}</span>
            <span className="block my-2">&amp;</span>
            <span className="block">{groomName}</span>
          </h1>

          <div className="my-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-current opacity-40" />
            <span className="text-sm">✦</span>
            <span className="h-px w-12 bg-current opacity-40" />
          </div>

          <p className="text-sm">{date}</p>
          <p className="text-sm mt-1">{time}</p>
        </div>
      </section>

      {/* DAVET KARTI */}
      <section className="px-6 py-10 text-center">
        <p className="text-xs uppercase tracking-widest mb-2">Değerli</p>
        <p className="font-medium mb-4">{title}</p>
        <p className="text-sm mb-6">{inviteText}</p>

        {/* FİDAN BAĞIŞI */}
        <button
          onClick={() => setOpenDonation(!openDonation)}
          className="mx-auto flex items-center gap-2 text-xs px-4 py-2 rounded-full border"
        >
          🌱 {donationText}
          <span
            className={`transition-transform ${
              openDonation ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {openDonation && (
          <div className="mt-4">
            <div className="mx-auto w-full max-w-sm h-48 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 text-xs">
              Fidan Sertifikası Görseli
            </div>
          </div>
        )}
      </section>

      {/* KONUM */}
      <section className="px-6 pb-10">
        <div className="rounded-2xl border p-6 text-center">
          <h3 className="text-lg font-medium mb-3">Konum</h3>
          <p className="text-sm whitespace-pre-line mb-4">{location}</p>

          <button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            className="px-5 py-2 rounded-full text-xs font-medium"
          >
            Haritada Aç
          </button>
        </div>
      </section>
    </div>
  );
}
