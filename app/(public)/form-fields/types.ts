// types.ts — Wizard için paylaşılan tipler

import type {
  InvitationSettings,
  Countdown,
} from "../../page";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface WizardState {
  step: WizardStep;
  settings: InvitationSettings;
  countdown: Countdown;
}

export type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "UPDATE_SETTINGS"; patch: Partial<InvitationSettings> }
  | { type: "APPLY_THEME"; themeId: string }
  | { type: "SET_COUNTDOWN"; countdown: Countdown };

export const wizardSteps = [
  {
    step: 1 as const,
    label: "Çift",
    icon: "👩‍❤️‍👨",
    description: "Gelin ve damat bilgileri",
  },
  {
    step: 2 as const,
    label: "Tarih & Mekan",
    icon: "📅",
    description: "Etkinlik tarihi ve mekanı",
  },
  {
    step: 3 as const,
    label: "Tema",
    icon: "🎨",
    description: "Davetiye tasarımı",
  },
  {
    step: 4 as const,
    label: "Aile & Bağış",
    icon: "🏡",
    description: "Aile bilgileri ve bağış",
  },
  {
    step: 5 as const,
    label: "Önizleme",
    icon: "👁️",
    description: "Davetiye önizlemesi",
  },
];
