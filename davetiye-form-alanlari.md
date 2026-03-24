# Davetiye Form Alanları — davethemen.com & Proje Analizi

## 📋 İçindekiler

1. [davethemen.com — 8 Adımlı Form Akışı](#davethemencom--8-adımlı-form-akışı)
2. [Mevcut Proje — Form Alanları](#mevcut-proje--form-alanları)
3. [Karşılaştırma Tablosu](#karşılaştırma-tablosu)
4. [Eksik Alanlar & Öneriler](#eksik-alanlar--öneriler)

---

## davethemen.com — 8 Adımlı Form Akışı

davethemen.com, kullanıcıları bir **8 adımlı wizard formu** ile davetiye oluşturmaya yönlendirir. Her adım belirli bilgiler toplayıp, son olarak ödeme alır.

### 🎯 Adım 1: Etkinlik Türü Seçimi

Hangi tür etkinlik için davetiye açılacak?

- 💍 Düğün
- 💎 Nişan
- 🔥 Kına
- ✂️ Sünnet
- 🎀 Baby Shower
- 🎂 Çocuk Doğum Günü
- 🎉 Doğum Günü
- 🏢 Açılış
- 📖 Mevlid

**Etki:** Seçilen türe göre sonraki adımlardaki alan isimleri ve sayısı değişir.

---

### 🎨 Adım 2: Şablon Seçimi

Adım 1'de seçilen etkinlik türüne uygun hazır şablonları gösterir.

- Farklı tasarım temaları (renkli, minimalist, vb.)
- Önizleme görselleri
- Tercih edilen şablonu seçme

---

### 👥 Adım 3: Ev Sahibi Bilgileri

**Düğün için (en kapsamlı örnek):**

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `brideName` | string | ✅ | Gelin Adı |
| `groomName` | string | ✅ | Damat Adı |
| `motherName` | string | ❌ | Anne Adı (gelin tarafı) |
| `fatherName` | string | ❌ | Baba Adı (gelin tarafı) |

**Diğer etkinlik türleri için:**

| Etkinlik | Alanlar |
|----------|---------|
| Baby Shower | Bebek Adı, Hamile Anne Adı |
| Çocuk Doğum Günü | Çocuk Adı, Anne Adı, Baba Adı |
| Nişan | Kız Adı, Erkek Adı, Anne/Baba (opsiyonel) |
| Genel Etkinlik | Ev Sahibi Adı |

---

### 📅 Adım 4: Etkinlik Bilgileri

Tarih, saat ve kişisel mesaj gibi temel bilgiler.

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `date` | date picker | ✅ | Tarih (gün/ay/yıl) |
| `time` | time picker | ✅ | Saat (HH:MM) |
| `personalMessage` | textarea | ❌ | Kişisel mesaj (örn. "Sevgilerimizle...") |
| `urlSlug` | string | ❌ | Özelleştirilmiş davetiye linki (örn. site.com/alin-emre) |

---

### 📍 Adım 5: Konum

Etkinliğin yapılacağı mekan bilgileri.

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `venueName` | string | ✅ | Mekan Adı (örn. "İstanbul Hilton") |
| `venueAddress` | string | ✅ | Mekan Adresi (tam adres) |

**Not:** davethemen.com'da harita entegrasyonu otomatik olabilir (adres yazılınca Google Maps'e bağlanır).

---

### 👁️ Adım 6: Önizleme

Oluşturulan davetiyenin tam önizlemesi gösterilir.

- Davetiye tasarımı görüntüleme
- Mobil & desktop uyumluluk kontrolü
- Geri dön / İleri git seçeneği

**Alan yok** — sadece onay ekranı.

---

### 💳 Adım 7: Sipariş / Fatura Bilgileri

Ödeme yapacak kişinin iletişim ve fatura bilgileri.

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `fullName` | string | ✅ | Ad Soyad |
| `email` | email | ✅ | E-posta Adresi |
| `phone` | tel | ✅ | Telefon Numarası |
| `address` | string | ✅ | Adres |
| `city` | string | ✅ | Şehir |
| `postalCode` | string | ✅ | Posta Kodu |
| `country` | string | ✅ | Ülke |
| `tcKimlik` | string | ❌ | T.C. Kimlik Numarası (opsiyonel, fatura için) |

---

### 💰 Adım 8: Güvenli Ödeme

Kredi kartı / ödeme yöntemi seçimi ve işlemi.

- Şifreli ödeme kapısı (Shopier, iyzico vb.)
- Fatura oluşturma
- Başarı mesajı

---

## Mevcut Proje — Form Alanları

Proje `/Users/muratseven/Desktop/invitation/davetiye/app/page.tsx` dosyasında **5 adımlı form** sunmaktadır.

### 📝 Adım 1: Çift

Davetiyenin ana taraflarının adları ve başlık metni.

| Alan | Tip | Açıklama |
|------|-----|----------|
| `heroSubtitle` | string | Davetiye başlık metni (örn. "Sizi Kutlu Bir Günün Şahidi Olmaya Davet Ediyoruz") |
| `brideName` | string | Gelin Adı |
| `groomName` | string | Damat Adı |

**Preset mesajları:** Seçenekler arasında seçim + "Rastgele Öner" butonu.

---

### 🗓️ Adım 2: Tarih & Mekan

Tarih, saat, mekan ve etkinlik programı bilgileri.

| Alan | Tip | Açıklama |
|------|-----|----------|
| `dateRaw` | string (YYYY-MM-DD) | Tarih (gün/ay/yıl dropdown'larla giriş) |
| `eventDate` | Date \| null | İşlenmiş tarih (countdown için) |
| `time` | string (HH:MM) | Saat |
| `showScheduleSection` | boolean | Etkinlik akışını göster/gizle |
| `scheduleItems` | object[] | Etkinlik programı (Adım adım: saat + başlık + açıklama) |
|  | → `time` | Saat (örn. "14:00") |
|  | → `title` | Başlık (örn. "Davetlilerin Gelişi") |
|  | → `description` | Açıklama (örn. "Misafirler öğleden sonra 14:00'ten itibaren gelebilirler") |
| `locationImageUrl` | string (URL) | Mekan görseli yükleme |
| `locationText` | string | Mekan adresi (textarea) |
| `mapLat` | number \| null | Harita enlem (MapPicker bileşeni) |
| `mapLng` | number \| null | Harita boylam (MapPicker bileşeni) |

**Not:** MapPicker bileşeni ile harita üzerinde konumu işaretleyebilme.

---

### 🎨 Adım 3: Tema

Davetiyenin görsel tasarımı (font, renkler, stil).

| Alan | Tip | Açıklama |
|------|-----|----------|
| `fontFamily` | enum | Yazı tipi seçimi (Great Vibes, Pacifico, Playfair Display, vb. — 11 seçenek) |
| Diğer renk alanları | string (hex) | Tema seçimi yapılınca tüm renkler otomatik ayarlanır |

**Tema örnekleri:**
- Soft Romance (pembe/altın)
- Classic Elegance (krem/koyu kahve)
- Romantic Script (zarif yazı)
- Modern Minimal (siyah/beyaz)
- Vintage Noir (retro/altın)
- Pastel Dream (yumuşak renkler)
- Golden Hour (altın tonlar)
- Timeless Classic (geleneksel)

**Premium Temalar:** Lisans token'ı olmayan kullanıcılar kilitli temalar görebilir ama kullanamamazlar.

---

### 👨‍👩‍👧 Adım 4: Aile & Bağış

Gelin ve damat ailelerinin bilgileri + bağış seçenekleri.

#### Aile Bilgileri

| Alan | Açıklama |
|------|----------|
| `showFamilySection` | Aile bölümünü göster/gizle (toggle) |
| **Birinci Aile (Gelin Tarafı)** | |
| `family1Mother` | Anne Adı |
| `family1Father` | Baba Adı |
| `family1Surname` | Soyadı |
| **İkinci Aile (Damat Tarafı)** | |
| `family2Mother` | Anne Adı |
| `family2Father` | Baba Adı |
| `family2Surname` | Soyadı |

#### Bağış Seçenekleri

| Alan | Tip | Açıklama |
|------|-----|----------|
| `showDonationSection` | boolean | Bağış bölümünü göster/gizle |
| `donationOrganization` | enum | Bağış yapılacak kuruluş seçimi |
|  | | Seçenekler: "tema" (TEMA Vakfı), "cydd", "kiz-cocuklari", "losev", "custom" |
| `donationText` | string | Bağış metni (örn. "Sevgilerimize Fidan Bağışında Bulunduk") |
| `donationImageUrl` | string (URL) | Bağış sertifikası görseli yükleme |

---

### 📬 Adım 5: Davetliler

Davet linki oluşturma ve davetli yönetimi.

#### Lisans Kontrolü

Eğer lisans token'ı yoksa:
- "Shopier'den Lisans Satın Al" linki gösterilir

Eğer lisans var ama `maxGuests = 0`:
- Bilgi mesajı: "Daha fazla davetli linki almak için paket yükseltin"

Eğer lisans ve hak var:
- Davetli listesi yönetimi alanı

#### Davetli Ekleme

| Alan | Tip | Açıklama |
|------|-----|----------|
| `guest.name` | string | Davetli Adı |
| `guest.slug` | string | Davetli Linki slug'ı (otomatik veya manuel) |
| `guest.email` | string (opsiyonel) | E-posta |
| `guest.phone` | string (opsiyonel) | Telefon |
| `guest.inviteUrl` | string (otomatik) | Tam davetiye linki |

**Operasyonlar:**
- Davetli ekleme
- Davetli satırını kopyala (linki panoya kopyala)
- Davetli silme
- CSV ile toplu davetli içe aktarma (gelecek)

---

## Karşılaştırma Tablosu

| Bilgi | davethemen.com | Mevcut Proje | Durum |
|------|--------|--------|-------|
| **Ev Sahibi — Gelin Adı** | ✅ Adım 3 | ✅ Adım 1 | ✅ Var |
| **Ev Sahibi — Damat Adı** | ✅ Adım 3 | ✅ Adım 1 | ✅ Var |
| **Ev Sahibi — Anne Adı** | ✅ Adım 3 (opsiyonel) | ✅ Adım 4 (family1Mother) | ✅ Var |
| **Ev Sahibi — Baba Adı** | ✅ Adım 3 (opsiyonel) | ✅ Adım 4 (family1Father) | ✅ Var |
| **Tarih** | ✅ Adım 4 | ✅ Adım 2 | ✅ Var |
| **Saat** | ✅ Adım 4 | ✅ Adım 2 | ✅ Var |
| **Mekan Adı** | ✅ Adım 5 | ❌ Yok (locationText'te tam adres var) | ⚠️ Kısmi |
| **Mekan Adresi** | ✅ Adım 5 | ✅ Adım 2 (locationText) | ✅ Var |
| **Harita Konumu** | ✅ Adım 5 (otomatik) | ✅ Adım 2 (manuel MapPicker) | ✅ Var |
| **Etkinlik Programı** | ❌ Yok | ✅ Adım 2 (scheduleItems) | ⭐ Proje daha gelişmiş |
| **Tema/Şablon Seçimi** | ✅ Adım 2 | ✅ Adım 3 | ✅ Var |
| **Yazı Tipi** | ✅ (Tema ile) | ✅ Adım 3 (fontFamily) | ✅ Var |
| **Renk Özelleştirmesi** | ✅ (Tema ile) | ✅ Adım 3 (Admin modda) | ✅ Var |
| **Aile Bilgileri** | ❌ Yok | ✅ Adım 4 | ⭐ Proje özelliği |
| **Bağış Seçeneği** | ❌ Yok | ✅ Adım 4 | ⭐ Proje özelliği |
| **Kişisel Mesaj** | ✅ Adım 4 | ❌ Yok (heroSubtitle'ta preset var) | ⚠️ Kısmi |
| **Fatura Bilgileri** | ✅ Adım 7 | ❌ Yok (backend'de mi?) | ❌ Eksik |
| **Ödeme Sistemi** | ✅ Adım 8 | ❌ Yok | ❌ Eksik |

---

## Eksik Alanlar & Öneriler

### 🔴 Eksik Alanlar (davethemen.com'da var, projede yok)

| Alan | davethemen.com Adımı | Zorunluluk | Önerilen Konum |
|------|--------|-----------|--------|
| **Etkinlik Türü Seçimi** | Adım 1 | Zorunlu | Yeni Adım 1 (şablon seçiminden önce) |
| **Şablon Seçimi** | Adım 2 | Zorunlu | Şu anki Adım 3'ten önce |
| **Mekan Adı** | Adım 5 | Zorunlu | Adım 2'ye ekle (locationText'ten ayrı) |
| **Kişisel Mesaj** | Adım 4 | Opsiyonel | Adım 1 veya Adım 2'ye ekle |
| **Özelleştirilmiş URL Slug** | Adım 4 | Opsiyonel | Adım 5'e ekle (davetli listesinden önce) |
| **Fatura Bilgileri** | Adım 7 | Zorunlu | Yeni Adım (Ödeme öncesi) |
| **Ödeme Sistemi** | Adım 8 | Zorunlu | Backend + frontend entegrasyonu |

### 🟡 Type'da Var Ama Formda Düzenlenemeyen Alanlar

| Alan | Nerede Tanımlanmış | Sorun | Çözüm |
|------|--------|--------|--------|
| `title` | InvitationSettings (satır 51) | Ana başlık formda düzenlenemiyor | Adım 1'e "Davetiye Başlığı" input'u ekle |
| `inviteText` | InvitationSettings (satır 59) | Davet metni formda yok | Adım 2'ye "Davet Metni" textarea'sı ekle |
| `mapsUrl` | InvitationSettings (satır 57) | Eski embed URL alanı, MapPicker ile yerine geçilmiş | Temizle veya kaldır |
| `primaryTextColor` | InvitationSettings (satır 69) | Admin modunda renk editörü yok | Admin modda renk palette'i ekle |
| `buttonBackground` | InvitationSettings (satır 70) | Admin modunda editör yok | Admin renk palette'ine ekle |
| `buttonTextColor` | InvitationSettings (satır 71) | Admin modunda editör yok | Admin renk palette'ine ekle |
| `heroTitleSize` | InvitationSettings (satır 76) | Sadece tema seçimi ile değişiyor | Manuel input ekle (px cinsinden) |
| `heroSubtitleSize` | InvitationSettings (satır 77) | Sadece tema seçimi ile değişiyor | Manuel input ekle (px cinsinden) |
| `guestName` | InvitationSettings (satır 72) | Sadece davetli listesinden dolup, ön bilgi yok | Dinamik olarak davet linkinden set ediliyor |

### 💡 Öneriler

#### 1. Form Akışı Yeniden Düzenleme

**Şu anki:** 5 adım (Çift → Tarih → Tema → Aile → Davetliler)

**Önerilen:** 7-8 adım (davethemen.com'a yaklaştırılmış)

```
1. Etkinlik Türü Seçimi     (Düğün, Nişan, vb.)
2. Şablon Seçimi            (Theme preview)
3. Ev Sahibi Bilgileri      (Gelin, Damat, Anne, Baba)
4. Tarih & Mekan            (Date, Time, Venue, Address, Map)
5. Tema Özelleştirmesi      (Font, Renkler)
6. Aile & Bağış             (Family, Donation) [ŞIMDIKI ADIM 4]
7. Fatura Bilgileri         (NEW - sipariş ve iletişim)
8. Ödeme & Tamamlama        (NEW - Shopier entegrasyonu)
```

#### 2. Eksik Alan Eklemeleri (Öncelik)

- **Yüksek Öncelik:**
  - `title` → Davetiye Başlığı input'u
  - `venueName` → Mekan Adı (locationText'ten ayrı)
  - `personalMessage` / `inviteText` → Kişisel Davet Metni

- **Orta Öncelik:**
  - `eventType` → Etkinlik Türü seçimi
  - `templateId` → Şablon/Tema şeçimi
  - `eventSlug` → Özelleştirilmiş davetiye linki

- **Düşük Öncelik:**
  - `heroTitleSize` / `heroSubtitleSize` → Manuel boyut girişi
  - Admin modda renk palette'i

#### 3. Backend Entegrasyon

- **Fatura Tablosu:** `invoices` tabelası oluştur
- **Ödeme Sistemi:** Shopier veya iyzico API entegrasyonu
- **Durum Takibi:** `events.status` → (draft, pending_payment, published, archived)

---

## 📊 Özet

| Kriter | davethemen.com | Mevcut Proje | Sonuç |
|--------|--------|--------|--------|
| **Form Adımı Sayısı** | 8 | 5 | Proje daha kısa ama eksik alanlar var |
| **Temel Alanlar Tamamlığı** | ✅ 100% | ⚠️ 70% | Eksik: Ödeme, Fatura, Etkinlik Türü |
| **Ek Özellikler** | QR, Sesli, Galeri | Program, Aile, Bağış | Projede benzersiz özellikler var |
| **Ödeme Sistemi** | ✅ Entegre | ❌ Yok | Yapılması gerekli |
| **Geliştirim Potansiyeli** | Orta | 🌟 Yüksek | Proje daha geliştirilmeye açık |

---

**Son Güncelleme:** 19 Mart 2026
**Hazırlayan:** Claude
**Proje:** davetiye.co (Davetiye Oluşturma Platformu)
