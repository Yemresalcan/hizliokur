# HızlıOkur Flutter Mobil App Tasarımı

## Özet
Mevcut React web uygulamasının (RSVP hızlı okuyucu) Flutter ile Android + iOS mobil uygulaması olarak yeniden yazılması. Web projesi aynen kalacak, mobil ayrı proje olacak (`f:/2026Projects/hizliokur_mobile`).

## Faz 1 (Bu fazda yapılacaklar)
- Temel RSVP okuyucu
- Kitap kütüphanesi (metin girişi + PDF yükleme)
- İlerleme kaydetme
- Ayarlar (WPM, font boyutu)
- Onboarding

## Faz 2 (Sonra)
- Gemini AI / TTS entegrasyonu

## Mimari

### State Management: Riverpod
- `appStateProvider` — IDLE, READING, PAUSED, COMPLETED
- `wordsProvider` — işlenmiş kelime listesi
- `currentIndexProvider` — mevcut kelime indeksi
- `settingsProvider` — WPM, fontSize (persisted)
- `booksProvider` — kitap kütüphanesi

### Veri Depolama
- **SharedPreferences** — ayarlar (WPM, font boyutu)
- **SQLite (sqflite)** — kitap kütüphanesi ve ilerleme
- **File system** — PDF dosyaları cache

### Paketler
- `flutter_riverpod` — state management
- `sqflite` — veritabanı
- `shared_preferences` — ayarlar
- `file_picker` — dosya seçici (PDF)
- `syncfusion_flutter_pdf` veya `pdfx` — PDF metin çıkarma
- `google_fonts` — tipografi

## Ekranlar

### 1. Kütüphane (HomeScreen)
- Üst: "HızlıOkur" başlık + AI badge
- Kitap kartları listesi (thumbnail, başlık, ilerleme)
- FAB: metin ekle / PDF yükle
- Swipe-to-delete

### 2. Okuyucu (ReaderScreen)
- Tam ekran, koyu arka plan
- ORP kelime gösterimi (sol | **pivot** | sağ)
- Alt kontrol barı: geri, skip, play/pause, ayarlar
- İlerleme barı

### 3. Tamamlanma (CompletionOverlay)
- Overlay: toplam kelime, süre, ortalama WPM
- Tekrar oku / geri dön butonları

### 4. Onboarding (OnboardingScreen)
- PageView ile 3 sayfa tanıtım

## Tema
- Koyu tema (arka plan: #0A0A0F)
- Accent: turuncu/amber (#F97316 benzeri)
- Mono font: okuyucu ekranı
- Sans font: UI

## Temel Algoritmalar (Web'den taşınacak)
- `getOrpIndex()` — ORP hesaplama
- `processTextToWords()` — metin işleme
- `calculateDelay()` — WPM bazlı gecikme
