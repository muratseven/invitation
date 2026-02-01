// app/page.tsx

"use client";

import React, { useState } from "react";

type InvitationSettings = {
  brideName: string;
  groomName: string;
  title: string;
  date: string;
  time: string;
  location: string;
  backgroundColor: string;
  primaryTextColor: string;
  buttonBackground: string;
  buttonTextColor: string;
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
    <h2 className="mt-4 mb-2 text-sm font-semibold text-slate-200">
      {label}
    </h2>
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
    backgroundColor,
    primaryTextColor,
    buttonBackground,
    buttonTextColor,
  } = settings;

  return (
    <div
      className="w-full max-w-xl rounded-2xl shadow-2xl p-6 md:p-8"
      style={{ backgroundColor, color: primaryTextColor }}
    >
      <section className="text-center mb-8">
        <p className="tracking-[0.28em] text-[0.7rem] uppercase">
          {brideName} &amp; {groomName}
        </p>
        <h1 className="mt-3 text-2xl font-medium">{title}</h1>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">Konum &amp; Tarih</h2>
        <p className="text-sm mb-0.5">{date}</p>
        <p className="text-sm mb-3">{time}</p>
        <p className="text-sm whitespace-pre-line">{location}</p>
        <button
          type="button"
          className="mt-3 px-4 py-2 rounded-full text-xs font-medium"
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
        >
          Yol Tarifi
        </button>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3">
          Katılım Durumunuz &amp; Hatıra Notunuz
        </h2>

        <div className="mb-3">
          <label className="block mb-1 text-xs font-medium">Ad Soyad</label>
          <input
            disabled
            placeholder="Ad Soyad"
            className="w-full px-2.5 py-2 rounded-md border border-slate-300 text-xs bg-white text-slate-900"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 text-xs font-medium">
            Katılım Durumu
          </label>
          <select
            disabled
            className="w-full px-2.5 py-2 rounded-md border border-slate-300 text-xs bg-white text-slate-900"
          >
            <option>Seçiniz</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block mb-1 text-xs font-medium">
            Toplam katılımcı sayısı
          </label>
          <select
            disabled
            className="w-full px-2.5 py-2 rounded-md border border-slate-300 text-xs bg-white text-slate-900"
          >
            <option>Seçiniz</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-xs font-medium">
            Hatıra notunuz
          </label>
          <textarea
            disabled
            rows={3}
            className="w-full px-2.5 py-2 rounded-md border border-slate-300 text-xs bg-white text-slate-900 resize-y"
          />
        </div>

        <button
          type="button"
          disabled
          className="px-5 py-2 rounded-full text-xs font-medium bg-slate-900 text-slate-50"
        >
          Gönder
        </button>

        <p className="mt-3 text-[0.7rem] text-slate-600">
          Hatıra defteri aktif. Davetliler not bıraktıkça kayıtlar burada
          gözükecek.
        </p>
      </section>
    </div>
  );
}
