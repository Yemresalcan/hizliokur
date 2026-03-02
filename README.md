# HızlıOkur — Speed Reader

**HızlıOkur**, RSVP (Rapid Serial Visual Presentation) tekniğini kullanarak okuma hızını 2–3 katına çıkarmayı hedefleyen, mobil öncelikli bir web uygulamasıdır. Her kelime sabit bir odak noktasında gösterilir; böylece göz hareketi sıfırlanır.

---

## Özellikler

- **RSVP Okuyucu** — Kelimeler tek tek, ayarlanabilir hızda (WPM) gösterilir.
- **ORP Algoritması** — Her kelimenin Optimal Tanıma Noktası hesaplanır; pivot harf vurgulanır.
- **PDF Desteği** — PDF yükle, metni otomatik çıkar, sayfa bazlı ilerleme takibi.
- **Kitap Kütüphanesi** — Son okunan 5 kitap kaydedilir, okuma ilerlemesi korunur.
- **Gemini AI ile Metin Üretimi** — Kategori seçerek (Bilim, Tarih, Uzay vb.) Türkçe pratik metin oluştur.
- **PDF Sayfa Görüntüleyici** — Okumaya başlamadan önce PDF sayfalarını incele.
- **Klavye Kısayolları** — `Space` oynat/duraklat, `←/→` ±10 kelime atla, `Esc` geri dön.
- **Ayarlar** — WPM (100–1000), font boyutu (1–5), değişiklikler otomatik kaydedilir.
- **Onboarding** — İlk açılışta 3 sayfalık tanıtım ekranı.
- **Koyu Tema** — Tam siyah arka plan, mobil dostu arayüz.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Stil | Tailwind CSS (CDN) |
| PDF İşleme | pdfjs-dist |
| AI | Google Gemini (`@google/genai`) |
| Depolama | localStorage + IndexedDB |
| İkonlar | lucide-react |

---

## Kurulum

### Gereksinimler

- Node.js 18+
- Gemini API anahtarı ([Google AI Studio](https://aistudio.google.com/))

### Adımlar

```bash
# Depoyu kopyala
git clone https://github.com/Yemresalcan/h-zl-okur.git
cd h-zl-okur

# Bağımlılıkları yükle
npm install

# Ortam değişkenini ayarla
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

### Build

```bash
npm run build    # dist/ klasörüne üretim build'i
npm run preview  # build'i yerel olarak önizle
```

---

## Proje Yapısı

```
├── App.tsx                  # Ana uygulama bileşeni ve okuma döngüsü
├── types.ts                 # TypeScript tip tanımları
├── constants.ts             # WPM sınırları, model adları, depolama limitleri
├── components/
│   ├── ReaderDisplay.tsx    # ORP kelime görüntüleyici
│   ├── Controls.tsx         # Oynat/duraklat, WPM/font ayarları
│   ├── TextInput.tsx        # Metin girişi, PDF yükleme, kitap kütüphanesi
│   ├── PdfPageViewer.tsx    # Sayfa bazlı PDF önizleyici
│   ├── CompletionScreen.tsx # Okuma tamamlama istatistikleri
│   ├── Onboarding.tsx       # İlk kullanım tanıtım ekranı
│   └── Toast.tsx            # Bildirim sistemi
├── services/
│   ├── geminiService.ts     # Gemini AI metin üretimi
│   ├── storageService.ts    # localStorage kitap yönetimi
│   └── indexedDbService.ts  # IndexedDB PDF dosya depolama
└── utils/
    ├── rsvpUtils.ts         # ORP hesaplama, metin işleme, gecikme hesabı
    ├── pdfUtils.ts          # PDF metin çıkarma ve küçük resim üretimi
    ├── audioUtils.ts        # PCM ses kod çözme
    └── toast.ts             # Toast olay yönetimi
```

---

## Ortam Değişkenleri

| Değişken | Açıklama |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API anahtarı (zorunlu) |

---

## Geliştirici

**Yunus Emre Salcan** — [yunusemresalcan.com](https://www.yunusemresalcan.com)

