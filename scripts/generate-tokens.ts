/**
 * Token Üretici
 * ---------------------
 * Kullanım:
 *   npx ts-node scripts/generate-tokens.ts
 *
 * NAMES dizisine davetli isimlerini yazın.
 * Script lib/davetliler.ts dosyasını otomatik günceller.
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Davetli Listesi ─────────────────────────────────────────────────────────
// Buraya davetli isimlerini ekleyin:
const NAMES: string[] = [
  "Mümin Berk Yonca",
  "Sadık Kaya",
  "Fatih Kaya",
  "Rukiye Kaya",
  "Şevval ve Bora Baş Ailesi",
  "Ceren ve Deniz Can Ilgın Ailesi",
  "Kübra ve Ömer Doğan Ailesi",
  "Merve ve Nedim Şahin Ailesi",
  "Elif ve Alperen Karaköse Ailesi",
  "Eyüp Yükselir",
  "Selen Kalender",
  "İklim",
  "Saygın",
  "Dylan ve Pelinsu Cooper Ailesi",
  "Gizem Gürel",
  "Emre Balcı",
  "Elif Güney",
  "Gamze ve Selim Talay Ailesi",
  "Enes Seven",
  "Sude ve Abdurrahman Tekir Ailesi",
  "Çelebi",
  "Seren Çetin",
  "Ceren Çetin",
  "Mutlu Güder",
];
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_LENGTH = 8;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateToken(existingTokens: Set<string>): string {
  let token: string;
  do {
    const bytes = crypto.randomBytes(TOKEN_LENGTH);
    token = Array.from(bytes)
      .map((b) => CHARS[b % CHARS.length])
      .join("");
  } while (existingTokens.has(token));
  existingTokens.add(token);
  return token;
}

function main() {
  if (NAMES.length === 0) {
    console.error("Hata: NAMES dizisi boş. scripts/generate-tokens.ts içine davetli isimlerini ekleyin.");
    process.exit(1);
  }

  const existingTokens = new Set<string>();
  const entries: [string, string][] = NAMES.map((name) => [
    generateToken(existingTokens),
    name,
  ]);

  const lines = entries.map(([token, name]) => `  "${token}": "${name}",`).join("\n");

  const output = `/**
 * Davetliler Kayıt Defteri
 * token → "Ad Soyad"
 *
 * Bu dosyayı scripts/generate-tokens.ts ile otomatik doldurun:
 *   npx ts-node scripts/generate-tokens.ts
 */
export const davetliler: Record<string, string> = {
${lines}
};
`;

  const outPath = path.resolve(__dirname, "../lib/davetliler.ts");
  fs.writeFileSync(outPath, output, "utf8");
  console.log(`✓ ${entries.length} davetli kaydedildi → lib/davetliler.ts`);

  console.log("\nDavet linkleri:");
  entries.forEach(([token, name]) => {
    console.log(`  ${name.padEnd(30)} → /sine-murat/${token}`);
  });
}

main();
