# Davetiye & Etkinlik Yönetim Platformu — CLAUDE.md

## Proje Özeti

Organizatörlerin dijital davetiye oluşturmasını, davetlileri yönetmesini ve RSVP takibi yapmasını sağlayan modern bir platform. **Next.js (React)** frontend + **PHP** backend mimarisi kullanılır.

---

## Teknoloji Yığını

| Katman      | Teknoloji                                        |
|-------------|--------------------------------------------------|
| Frontend    | Next.js 14+ (App Router), React 18, TypeScript   |
| Stil        | Tailwind CSS + CSS Modules (bileşen bazlı)       |
| Fontlar     | Google Fonts (Playfair Display + DM Sans)        |
| Animasyon   | Framer Motion                                    |
| Backend     | PHP 8.2+ (REST API)                              |
| Veritabanı  | MySQL 8 / MariaDB                                |
| Auth        | Token tabanlı (UUID v4, JWT opsiyonel)           |
| Deploy      | Vercel (frontend) + VPS/cPanel (PHP backend)     |

---

## Veritabanı Şeması

```sql
-- Etkinlikler
CREATE TABLE events (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(120) UNIQUE NOT NULL,          -- URL dostu kimlik
  title         VARCHAR(255) NOT NULL,
  type          ENUM('wedding','engagement','birthday','corporate','other') DEFAULT 'other',
  event_date    DATETIME NOT NULL,
  location_name VARCHAR(255),
  location_url  VARCHAR(500),                          -- Google Maps linki
  description   TEXT,
  cover_image   VARCHAR(500),                          -- Görsel URL / path
  theme         VARCHAR(80) DEFAULT 'classic',         -- Tema anahtarı
  language      VARCHAR(10) DEFAULT 'tr',
  is_active     TINYINT(1) DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Davetliler
CREATE TABLE guests (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  event_id      INT NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  email         VARCHAR(255),
  rsvp_status   ENUM('pending','attending','not_attending','maybe') DEFAULT 'pending',
  rsvp_note     TEXT,
  plus_one      TINYINT(1) DEFAULT 0,
  table_no      VARCHAR(20),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Erişim Token'ları
CREATE TABLE tokens (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  guest_id      INT NOT NULL,
  event_id      INT NOT NULL,
  token         VARCHAR(64) UNIQUE NOT NULL,           -- UUID v4 / hash
  is_used       TINYINT(1) DEFAULT 0,
  used_at       TIMESTAMP NULL,
  expires_at    TIMESTAMP NULL,                        -- NULL = sınırsız
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

---

## Dizin Yapısı

```
/
├── frontend/                        # Next.js uygulaması
│   ├── app/
│   │   ├── (public)/
│   │   │   └── invite/
│   │   │       └── [token]/
│   │   │           └── page.tsx     # Davetli davetiye sayfası
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Organizatör paneli ana sayfa
│   │   │   ├── events/
│   │   │   │   ├── page.tsx         # Etkinlik listesi
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx     # Yeni etkinlik oluştur
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx     # Etkinlik detayı
│   │   │   │       └── guests/
│   │   │   │           └── page.tsx # Davetli listesi
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── invite/                  # Davetiye bileşenleri
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StorySection.tsx
│   │   │   ├── ProgramSection.tsx
│   │   │   ├── LocationSection.tsx
│   │   │   ├── GiftSection.tsx
│   │   │   └── RsvpForm.tsx
│   │   ├── admin/                   # Yönetim paneli bileşenleri
│   │   │   ├── EventCard.tsx
│   │   │   ├── GuestTable.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/                      # Paylaşılan UI bileşenleri
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── api.ts                   # Backend API istemcisi
│   │   ├── types.ts                 # TypeScript tipleri
│   │   └── utils.ts
│   └── public/
│       └── themes/                  # Tema görselleri / arka planlar
│
└── backend/                         # PHP API
    ├── index.php                    # Router giriş noktası
    ├── config/
    │   └── database.php
    ├── controllers/
    │   ├── EventController.php
    │   ├── GuestController.php
    │   └── TokenController.php
    ├── models/
    │   ├── Event.php
    │   ├── Guest.php
    │   └── Token.php
    └── middleware/
        └── AuthMiddleware.php
```

---

## PHP Backend — API Endpoint'leri

### Genel Kural
- Tüm yanıtlar `Content-Type: application/json`
- Hata yanıtları: `{ "error": "mesaj", "code": 400 }`
- Başarı yanıtları: `{ "data": {...}, "message": "..." }`
- Admin endpoint'leri `Authorization: Bearer <jwt>` başlığı gerektirir

### Etkinlikler

```
GET    /api/events                  # Tüm etkinlikleri listele (admin)
POST   /api/events                  # Yeni etkinlik oluştur (admin)
GET    /api/events/{id}             # Etkinlik detayı (admin)
PUT    /api/events/{id}             # Etkinlik güncelle (admin)
DELETE /api/events/{id}             # Etkinlik sil (admin)
GET    /api/events/{id}/stats       # RSVP istatistikleri (admin)
```

### Davetliler

```
GET    /api/events/{id}/guests      # Davetli listesi (admin)
POST   /api/events/{id}/guests      # Davetli ekle (admin)
POST   /api/events/{id}/guests/bulk # Toplu davetli ekle (CSV) (admin)
PUT    /api/guests/{id}             # Davetli güncelle (admin)
DELETE /api/guests/{id}             # Davetli sil (admin)
GET    /api/guests/{id}/token       # Davetlinin token'ını getir (admin)
POST   /api/guests/{id}/resend      # Linki yeniden oluştur (admin)
```

### Token / Davetiye

```
GET    /api/invite/{token}          # Token doğrula, etkinlik + davetli verisini getir (public)
POST   /api/invite/{token}/rsvp     # RSVP yanıtı gönder (public)
```

---

## Frontend Sayfaları

### 1. Davetiye Sayfası — `/invite/[token]`

**Veri akışı:**
1. `token` ile `GET /api/invite/{token}` çağrılır (SSR veya ISR)
2. Geçersiz/süresi dolmuş token → 404 / hata sayfası
3. Geçerli ise etkinlik + davetli bilgisi render edilir

**Section sırası:**
```
HeroSection       → Etkinlik başlığı, tarih, "Sizi bekliyoruz" mesajı, cover görseli
StorySection      → Etkinlik açıklaması / hikâye metni
ProgramSection    → Saat bazlı program akışı (zaman çizelgesi)
LocationSection   → Mekan adı + Google Maps iframe / linki
GiftSection       → Hediye / banka bilgisi (opsiyonel, event'e göre göster/gizle)
RsvpForm          → Katılım formu
```

**RsvpForm alanları:**
```typescript
{
  status: 'attending' | 'not_attending' | 'maybe'
  note?: string        // Özel mesaj
  plus_one?: boolean   // +1 misafir
}
```

**Tasarım Yönü:**
- Tipografi: `Playfair Display` (başlıklar) + `DM Sans` (body)
- Renk paleti: Krem/fildişi zemin, altın/şampanya aksanlar, koyu antrasit metin
- Animasyon: Framer Motion ile section'lar aşağıdan yukarı fade-in (stagger: 0.15s)
- Responsive: Mobile-first, tek sütun → tablet/desktop'ta geniş düzen
- Arka plan: Hafif doku overlay (noise texture), section aralarında ince dekoratif çizgiler

### 2. Admin — Dashboard `/admin/dashboard`

- Toplam etkinlik sayısı, bekleyen RSVP, onaylı katılımcı istatistikleri
- Son eklenen etkinlikler kartları
- Hızlı eylemler: "Yeni Etkinlik Oluştur" butonu

### 3. Admin — Etkinlik Listesi `/admin/events`

- Kart tabanlı ızgara (grid)
- Her kart: etkinlik adı, tarih, tür badge'i, davetli sayısı, RSVP durumu progress bar'ı
- Filtre: tür, tarih aralığı, durum

### 4. Admin — Yeni Etkinlik `/admin/events/new`

Multi-step form:
```
Adım 1: Temel Bilgiler   → başlık, tür, tarih/saat, konum
Adım 2: İçerik           → açıklama, program, hediye bilgisi
Adım 3: Görsel & Tema    → cover görseli yükle, tema seç
Adım 4: Önizleme & Kaydet
```

### 5. Admin — Davetli Yönetimi `/admin/events/[id]/guests`

- Tablo: ad soyad, telefon, e-posta, RSVP durumu (badge), token linki
- Inline RSVP durumu güncelleme
- Davet linkini panoya kopyala butonu
- CSV ile toplu davetli içe aktarma
- Her satırda: "Linki Yeniden Oluştur" aksiyonu

---

## TypeScript Tipleri

```typescript
// lib/types.ts

export type EventType = 'wedding' | 'engagement' | 'birthday' | 'corporate' | 'other'
export type RsvpStatus = 'pending' | 'attending' | 'not_attending' | 'maybe'

export interface Event {
  id: number
  slug: string
  title: string
  type: EventType
  event_date: string          // ISO 8601
  location_name: string | null
  location_url: string | null
  description: string | null
  cover_image: string | null
  theme: string
  language: string
  is_active: boolean
  created_at: string
}

export interface Guest {
  id: number
  event_id: number
  first_name: string
  last_name: string
  phone: string | null
  email: string | null
  rsvp_status: RsvpStatus
  rsvp_note: string | null
  plus_one: boolean
  table_no: string | null
}

export interface Token {
  id: number
  guest_id: number
  event_id: number
  token: string
  is_used: boolean
  used_at: string | null
  expires_at: string | null
}

export interface InvitePageData {
  event: Event
  guest: Guest
  token: Pick<Token, 'token' | 'is_used' | 'expires_at'>
}

export interface EventStats {
  total: number
  attending: number
  not_attending: number
  maybe: number
  pending: number
}
```

---

## Ortam Değişkenleri

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...

# backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=davetiye_db
DB_USER=db_user
DB_PASS=db_password
JWT_SECRET=super_secret_key_32chars
TOKEN_EXPIRY_DAYS=30         # 0 = sınırsız
APP_ENV=production
```

---

## Güvenlik Gereksinimleri

1. **Token doğrulama**: Her `/invite/{token}` isteğinde token'ın var olduğu, süresi dolmadığı ve etkinliğin aktif olduğu kontrol edilir.
2. **RSVP koruması**: Bir token ile yalnızca bir kez RSVP gönderilebilir. `is_used = 1` ise form devre dışı bırakılır (görüntüleme modunda açılır).
3. **Admin koruması**: Tüm `/api/admin/*` endpoint'leri JWT Bearer token gerektirir.
4. **Rate limiting**: RSVP endpoint'ine IP başına dakikada max 10 istek.
5. **CORS**: Backend yalnızca `NEXT_PUBLIC_BASE_URL` origin'ine izin verir.
6. **Input sanitizasyon**: Tüm PHP kontrolcülerinde `htmlspecialchars` + prepared statements kullanılır.

---

## Tema Sistemi

`events.theme` alanı davetiye sayfasının görsel temasını belirler.

| Tema Anahtarı | Açıklama                                    |
|---------------|---------------------------------------------|
| `classic`     | Krem/altın, serif tipografi, zarif           |
| `modern`      | Beyaz/siyah, sans-serif, geometrik          |
| `garden`      | Yeşil/beyaz, botanik, doğal dokular         |
| `royal`       | Lacivert/altın, premium, koyu tema          |
| `minimal`     | Saf beyaz, çok az dekor, maksimum boşluk    |

Frontend'de tema anahtarına göre CSS değişkenleri (`--color-primary`, `--color-bg`, `--font-display` vb.) dinamik olarak uygulanır.

---

## Geliştirme Notları

- **SSR vs SSG**: Davetiye sayfaları `generateStaticParams` yerine SSR (`cache: 'no-store'`) kullanır; RSVP durumu her zaman güncel olmalıdır.
- **Görsel optimizasyonu**: Cover görselleri `next/image` ile sunulur; blur placeholder eklenir.
- **Çoklu dil**: `i18next` veya Next.js built-in i18n ile TR/EN desteği sonradan eklenebilir; şimdilik `language` alanı altyapıya yazılır.
- **Test**: Her API endpoint için PHP'de PHPUnit unit testi; frontend için Playwright e2e (davetiye akışı + RSVP akışı).
- **Erişilebilirlik**: Tüm form elemanları `aria-label` alır, renk kontrastı WCAG AA standardını karşılar, klavye navigasyonu desteklenir.

---

## Öncelikli Geliştirme Sırası

1. Veritabanı şeması oluştur ve seed data ekle
2. PHP: Token doğrulama + RSVP endpoint'leri (public)
3. Next.js: `/invite/[token]` davetiye sayfası (tüm section'lar)
4. PHP: Admin CRUD endpoint'leri (events + guests + tokens)
5. Next.js: Admin login + dashboard + event listesi
6. Next.js: Davetli yönetimi tablosu + link kopyalama
7. Tema sistemi + görsel yükleme
8. CSV toplu import
9. E-posta / SMS gönderim entegrasyonu (opsiyonel)
