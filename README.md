<p align="center">
  <img src="public/favicon.svg" alt="HızlıOkur" width="72" height="72" />
</p>

<h1 align="center">HızlıOkur</h1>

<p align="center">
  <strong>RSVP tabanlı hız okuma uygulaması</strong><br />
  Kelimeler sabit odak noktasında akar — göz hareketi azalır, okuma hızı artar.
</p>

<p align="center">
  <a href="https://hizliokur.vercel.app"><img src="https://img.shields.io/badge/Live-Demo-0A84FF?style=for-the-badge" alt="Live Demo" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <img src="https://img.shields.io/badge/License-Private-6b7280?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <a href="https://hizliokur.vercel.app">Canlı Demo</a> ·
  <a href="#özellikler">Özellikler</a> ·
  <a href="#kurulum">Kurulum</a> ·
  <a href="#ortam-değişkenleri">Yapılandırma</a>
</p>

---

## Neden HızlıOkur?

Klasik okumada göz satır boyunca zıplar. **RSVP** (Rapid Serial Visual Presentation) her kelimeyi tek bir noktada gösterir; **ORP** (Optimal Recognition Point) ile pivot harf vurgulanır. Sonuç: daha az göz hareketi, daha yüksek WPM.

| | |
|---|---|
| **Hız** | 100–1000 WPM, anlık ayar |
| **İçerik** | Metin yapıştır, PDF yükle veya AI ile üret |
| **Dil** | Türkçe / English arayüz |
| **Kalıcılık** | İlerleme, WPM ve font ayarları cihazda saklanır |

---

## Özellikler

- **RSVP okuyucu** — Kelimeler ayarlanabilir hızda, sabit odak noktasında
- **ORP vurgusu** — Her kelimenin optimal tanıma noktası hesaplanır
- **PDF desteği** — Metin çıkarma, sayfa önizleme, sayfadan devam
- **Kitaplık** — Son 5 kitap + okuma ilerlemesi
- **AI metin üretimi** — OpenRouter üzerinden kategori bazlı pratik metinler (TR/EN)
- **Klavye kısayolları** — `Space` oynat/duraklat · `←` / `→` ±10 kelime · `Esc` geri
- **Onboarding** — İlk açılışta 3 adımlı tanıtım
- **Koyu tema** — Mobil öncelikli, tam siyah arayüz

---

## Teknoloji

| Katman | Teknoloji |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite 6 |
| Stil | Tailwind CSS (CDN) |
| PDF | pdfjs-dist |
| AI | [OpenRouter](https://openrouter.ai) (chat completions) |
| Depolama | localStorage + IndexedDB |
| İkonlar | lucide-react |
| i18n | Yerel TR/EN sözlükleri |

---

## Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/) 18+
- [OpenRouter](https://openrouter.ai/keys) API anahtarı

### Adımlar

```bash
git clone https://github.com/Yemresalcan/hizliokur.git
cd hizliokur

npm install

cp .env.example .env
# OPENROUTER_API_KEY=sk-or-v1-...

npm run dev
```

Uygulama: [http://localhost:3000](http://localhost:3000)

### Scriptler

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim build (`dist/`) |
| `npm run preview` | Build önizleme |

---

## Ortam değişkenleri

`.env` dosyası oluşturun (şablon: `.env.example`):

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Evet | OpenRouter API anahtarı |

> **Not:** Anahtar Vite build sırasında istemci bundle’ına gömülür. Üretimde Vercel → Project → **Settings → Environment Variables** altına ekleyin; değişiklikte yeniden deploy gerekir.

---

## Proje yapısı

```text
├── App.tsx                 # Ana durum, okuma döngüsü
├── constants.ts            # WPM, model, depolama limitleri
├── i18n/                   # TR/EN çeviriler + context
├── components/
│   ├── ReaderDisplay.tsx   # ORP kelime gösterimi
│   ├── Controls.tsx        # Oynat / WPM / font
│   ├── TextInput.tsx       # Metin, PDF, AI, kitaplık
│   ├── PdfPageViewer.tsx   # PDF sayfa önizleme
│   ├── CompletionScreen.tsx
│   ├── Onboarding.tsx
│   └── Toast.tsx
├── services/
│   ├── openRouterService.ts
│   ├── storageService.ts
│   └── indexedDbService.ts
└── utils/
    ├── rsvpUtils.ts
    ├── pdfUtils.ts
    └── toast.ts
```

---

## Klavye kısayolları

| Tuş | Eylem |
| --- | --- |
| `Space` | Oynat / duraklat |
| `←` | 10 kelime geri |
| `→` | 10 kelime ileri |
| `Esc` | Okuyucudan çık |

---

## Dağıtım

Proje [Vercel](https://vercel.com) üzerinde çalışır:

**Canlı:** [hizliokur.vercel.app](https://hizliokur.vercel.app)

```bash
# Ortam değişkenini Vercel'e ekledikten sonra
vercel --prod
```

---

## Geliştirici

**Yunus Emre Salcan**  
[yunusemresalcan.com](https://www.yunusemresalcan.com) · [GitHub](https://github.com/Yemresalcan)

---

<p align="center">
  <sub>HızlıOkur — daha az göz hareketi, daha çok okuma.</sub>
</p>
