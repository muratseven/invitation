"use client";

import React, { useCallback, useMemo } from "react";
import type { InvitationSettings } from "../../../editor/page";

interface StepAileProps {
  settings: InvitationSettings;
  onUpdate: (patch: Partial<InvitationSettings>) => void;
}

const DONATION_OPTIONS = [
  {
    id: "tema",
    label: "TEMA Vakfı (Ağaçlandırma)",
    text: "Sizin adınıza TEMA Vakfı'na bir fidan bağışında bulunduk.",
    url: "https://www.tema.org.tr",
  },
  {
    id: "cydd",
    label: "ÇYDD (Eğitim)",
    text: "Sizin adınıza Çağdaş Yaşamı Destekleme Derneği'ne eğitim bursu desteğinde bulunduk.",
    url: "https://www.cydd.org.tr",
  },
  {
    id: "kiz-cocuklari",
    label: "Kız Çocuklarının Eğitimi",
    text: "Sizin adınıza kız çocuklarının eğitimine destek sağlayan bir bursa katkıda bulunduk.",
    url: "https://www.ungei.org",
  },
  {
    id: "losev",
    label: "LÖSEV (Kanser Çocuklara)",
    text: "Sizin adınıza LÖSEV'e bağışta bulunarak lösemili çocukların tedavisine destek olduk.",
    url: "https://www.losev.org.tr",
  },
  {
    id: "custom",
    label: "Özel Kuruluş",
    text: "Bu özel günümüzde, sizin adınıza seçtiğimiz bir kuruluşa bağışta bulunduk.",
    url: "",
  },
];

/**
 * StepAile — Adım 4: Aile & Bağış
 * - Aile bölümü toggle
 * - İki aile için (Gelin & Damat): Anne, Baba, Soyadı
 * - Bağış bölümü toggle
 * - Kuruluş seçimi (otomatik metin + linkler)
 * - Özel bağış metni
 */
export function StepAile({ settings, onUpdate }: StepAileProps) {
  const selectedDonationOption = useMemo(
    () => DONATION_OPTIONS.find((o) => o.id === settings.donationOrganization),
    [settings.donationOrganization]
  );

  const handleFamilyToggle = useCallback(() => {
    onUpdate({ showFamilySection: !settings.showFamilySection });
  }, [settings.showFamilySection, onUpdate]);

  const handleFamily1Mother = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ family1Mother: e.target.value });
    },
    [onUpdate]
  );

  const handleFamily1Father = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ family1Father: e.target.value });
    },
    [onUpdate]
  );

  const handleFamily1Surname = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ family1Surname: e.target.value });
    },
    [onUpdate]
  );

  const handleFamily2Mother = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ family2Mother: e.target.value });
    },
    [onUpdate]
  );

  const handleFamily2Father = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ family2Father: e.target.value });
    },
    [onUpdate]
  );

  const handleFamily2Surname = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ family2Surname: e.target.value });
    },
    [onUpdate]
  );

  const handleDonationToggle = useCallback(() => {
    onUpdate({ showDonationSection: !settings.showDonationSection });
  }, [settings.showDonationSection, onUpdate]);

  const handleDonationOrg = useCallback(
    (org: InvitationSettings["donationOrganization"]) => {
      const option = DONATION_OPTIONS.find((o) => o.id === org);
      onUpdate({
        donationOrganization: org,
        donationText: option?.text || "",
      });
    },
    [onUpdate]
  );

  const handleDonationText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate({ donationText: e.target.value });
    },
    [onUpdate]
  );

  return (
    <div className="space-y-8">
      {/* Family Section */}
      <div className="border-b border-slate-200 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            id="family-toggle"
            checked={settings.showFamilySection || false}
            onChange={handleFamilyToggle}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="family-toggle"
            className="text-sm font-semibold text-slate-700 cursor-pointer"
          >
            👨‍👩‍👧‍👦 Ailelerimiz Bölümü Ekle
          </label>
        </div>

        {settings.showFamilySection && (
          <div className="space-y-6">
            {/* Family 1 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-300">
                {settings.brideName}'nin Ailesi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Anne
                  </label>
                  <input
                    type="text"
                    value={settings.family1Mother}
                    onChange={handleFamily1Mother}
                    placeholder="Anne adı"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Baba
                  </label>
                  <input
                    type="text"
                    value={settings.family1Father}
                    onChange={handleFamily1Father}
                    placeholder="Baba adı"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Soyadı
                  </label>
                  <input
                    type="text"
                    value={settings.family1Surname}
                    onChange={handleFamily1Surname}
                    placeholder="Soyadı"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Family 2 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-300">
                {settings.groomName}'nin Ailesi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Anne
                  </label>
                  <input
                    type="text"
                    value={settings.family2Mother}
                    onChange={handleFamily2Mother}
                    placeholder="Anne adı"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Baba
                  </label>
                  <input
                    type="text"
                    value={settings.family2Father}
                    onChange={handleFamily2Father}
                    placeholder="Baba adı"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Soyadı
                  </label>
                  <input
                    type="text"
                    value={settings.family2Surname}
                    onChange={handleFamily2Surname}
                    placeholder="Soyadı"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donation Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            id="donation-toggle"
            checked={settings.showDonationSection || false}
            onChange={handleDonationToggle}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="donation-toggle"
            className="text-sm font-semibold text-slate-700 cursor-pointer"
          >
            ❤️ Bağış Bölümü Ekle
          </label>
        </div>

        {settings.showDonationSection && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4 border border-blue-200">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Bağış Yapılacak Kuruluş
              </label>
              <div className="space-y-2">
                {DONATION_OPTIONS.map((org) => (
                  <label
                    key={org.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="donation-org"
                      value={org.id}
                      checked={settings.donationOrganization === org.id}
                      onChange={() =>
                        handleDonationOrg(
                          org.id as InvitationSettings["donationOrganization"]
                        )
                      }
                      className="w-4 h-4 text-blue-600 mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {org.label}
                      </p>
                      {org.url && (
                        <a
                          href={org.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                        >
                          🔗 {org.url}
                        </a>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bağış Metni
              </label>
              <textarea
                value={settings.donationText}
                onChange={handleDonationText}
                placeholder="Bağış hakkında açıklamayı yazınız..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-900"
              />
            </div>

            {selectedDonationOption && selectedDonationOption.url && (
              <div className="bg-white p-3 rounded border border-blue-300">
                <p className="text-xs text-slate-600 mb-2">
                  <span className="font-semibold">💡 İpucu:</span> Konuklarınız aşağıdaki linkten doğrudan bağış yapabilirler:
                </p>
                <a
                  href={selectedDonationOption.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium break-all"
                >
                  {selectedDonationOption.url} →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
