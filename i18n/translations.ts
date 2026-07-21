export type Locale = 'tr' | 'en';

export const LS_LANG = 'hizliokur_lang';

const tr = {
  'app.brand': 'HızlıOkur',
  'app.library': 'Kütüphanen',
  'app.madeBy': 'yunus emre salcan tarafından yapıldı',
  'app.langTr': 'TR',
  'app.langEn': 'EN',

  'text.recent': 'Son Okunanlar',
  'text.newReading': 'Yeni Okuma',
  'text.tabText': 'Metin',
  'text.tabPdf': 'PDF',
  'text.placeholder': 'Buraya metin yapıştırın veya AI ile oluşturun...',
  'text.aiPrompt': 'Ne tür bir metin oluşturalım?',
  'text.paste': 'Yapıştır',
  'text.aiGenerate': 'AI ile Oluştur',
  'text.clear': 'Temizle',
  'text.start': 'Başla',
  'text.uploadPdf': 'PDF Yükle',
  'text.uploadHint': 'Cihazınızdan bir PDF dosyası seçin ve okumaya başlayın.',
  'text.minsLeft': '{n}dk',
  'text.errGenerate': 'Metin oluşturulurken hata oluştu.',
  'text.errInvalidPdf': 'Lütfen geçerli bir PDF dosyası seçin.',
  'text.errEmptyPdf': 'PDF içeriği boş veya okunamadı.',
  'text.errPdfUpload':
    'PDF yüklenirken bir hata oluştu. Lütfen metin içeren bir PDF olduğundan emin olun.',

  'ai.surprise': 'Beni Şaşırt',
  'ai.science': 'Bilim & Teknoloji',
  'ai.history': 'Tarih',
  'ai.space': 'Uzay & Evren',
  'ai.psychology': 'Psikoloji',
  'ai.nature': 'Doğa & Hayvanlar',
  'ai.philosophy': 'Felsefe',
  'ai.mythology': 'Mitoloji',
  'ai.motivation': 'Motivasyon',
  'ai.art': 'Sanat & Edebiyat',

  'ai.prompt.surprise':
    'Çok az kişinin bildiği, şaşırtıcı ve ilginç bir bilgi veya olay',
  'ai.prompt.science':
    'Bilim ve teknoloji dünyasından ilginç bir konu, keşif veya buluş',
  'ai.prompt.history':
    'Tarihten ilginç bir olay, kişi veya dönem hakkında bilgilendirici bir yazı',
  'ai.prompt.space':
    'Uzay, evren, gezegenler, yıldızlar veya kozmoloji hakkında büyüleyici bir konu',
  'ai.prompt.psychology':
    'İnsan psikolojisi, davranış kalıpları veya zihin hakkında ilginç bir konu',
  'ai.prompt.nature':
    'Doğa, hayvanlar dünyası veya ekosistemler hakkında şaşırtıcı bilgiler',
  'ai.prompt.philosophy':
    'Felsefe, düşünce akımları veya ünlü filozofların fikirleri hakkında bir yazı',
  'ai.prompt.mythology':
    'Yunan, Türk, Mısır veya dünya mitolojisinden ilginç bir hikaye veya efsane',
  'ai.prompt.motivation':
    'İlham verici, motive edici bir başarı hikayesi veya hayat dersi',
  'ai.prompt.art':
    'Sanat, edebiyat, müzik veya sinema dünyasından ilginç bir konu veya eser',
  'ai.prompt.fallback':
    'Genel kültür, bilim veya tarihten rastgele ilginç bir konu seç',

  'ai.systemPrompt': `Sen bir hızlı okuma eğitmenisin. Kullanıcının pratik yapması için Türkçe bir metin oluştur.

Konu: {topic}.

Kurallar:
1. Yaklaşık 300-400 kelime olsun.
2. Akıcı, sürükleyici ve merak uyandırıcı bir dil kullan. Okuyucuyu ilk cümleden yakala.
3. Her seferinde farklı ve özgün bir konu seç, tekrara düşme.
4. Paragraflara ayır ama sadece düz metin (plain text) döndür, markdown kullanma.
5. Sadece metni döndür, giriş/çıkış konuşması veya başlık ekleme.
6. İlk cümle çarpıcı ve dikkat çekici olsun.`,

  'errors.apiKeyMissing': 'API anahtarı eksik.',
  'errors.apiKeyInvalid': 'API anahtarı geçersiz.',
  'errors.apiRateLimit':
    'API limiti aşıldı. Lütfen bir süre bekleyip tekrar deneyin.',
  'errors.aiGenerate': 'Yapay zeka metin oluştururken bir hata oluştu.',
  'errors.aiEmpty': 'Metin oluşturulamadı. Lütfen tekrar deneyin.',
  'errors.pdfRead':
    'PDF metni okunamadı. Lütfen dosyanın bozuk olmadığından emin olun.',

  'controls.speed': 'Hız (WPM)',
  'controls.size': 'Boyut',
  'controls.back': 'Geri Dön',
  'controls.settings': 'Ayarlar',
  'controls.left': '{time} kaldı',

  'completion.title': 'Tamamlandı!',
  'completion.subtitle': 'Harika iş çıkardın.',
  'completion.words': 'Kelime',
  'completion.time': 'Süre',
  'completion.wpm': 'WPM',
  'completion.restart': 'Yeniden Oku',
  'completion.back': 'Kütüphaneye Dön',
  'completion.minSec': '{m}dk {s}sn',
  'completion.sec': '{s}sn',

  'reader.ready': 'Hazır',

  'pdf.start': 'Okumaya Başla',
  'pdf.startFromPage': '{page}. sayfadan başla',

  'onboarding.builtBy': 'Built by',
  'onboarding.s1.t0': 'Oku, anla,',
  'onboarding.s1.t1': 'ilham al',
  'onboarding.s1.sub':
    'HızlıOkur ile okuma hızını 2–3 katına çıkar. Aynı sürede çok daha fazlasını oku.',
  'onboarding.s1.c0': 'Hız Kazan',
  'onboarding.s1.c1': 'Tam Odak',
  'onboarding.s1.c2': 'Her Yerde',
  'onboarding.s1.c3': 'AI Destekli',
  'onboarding.s2.t0': 'Kelimeler',
  'onboarding.s2.t1': 'sana gelir',
  'onboarding.s2.sub':
    'RSVP tekniği göz hareketini sıfırlar. Her kelime sabit odak noktasında belirir, sen sadece okursun.',
  'onboarding.s2.c0': 'Sabit Bakış',
  'onboarding.s2.c1': '500 WPM',
  'onboarding.s2.c2': 'Daha Fazlası',
  'onboarding.s2.c3': 'Derin Anlayış',
  'onboarding.s3.t0': 'İçeriğini',
  'onboarding.s3.t1': 'sen seç',
  'onboarding.s3.sub':
    'PDF yükle, metin yapıştır ya da AI ile anında pratik okuma metni oluştur.',
  'onboarding.s3.c0': 'PDF Yükle',
  'onboarding.s3.c1': 'Metin Yapıştır',
  'onboarding.s3.c2': 'AI ile Oluştur',
  'onboarding.s3.c3': 'Hemen Başla',
} as const;

export type TranslationKey = keyof typeof tr;

const en: Record<TranslationKey, string> = {
  'app.brand': 'HızlıOkur',
  'app.library': 'Your Library',
  'app.madeBy': 'made by yunus emre salcan',
  'app.langTr': 'TR',
  'app.langEn': 'EN',

  'text.recent': 'Recently Read',
  'text.newReading': 'New Reading',
  'text.tabText': 'Text',
  'text.tabPdf': 'PDF',
  'text.placeholder': 'Paste text here or generate with AI...',
  'text.aiPrompt': 'What kind of text should we create?',
  'text.paste': 'Paste',
  'text.aiGenerate': 'Generate with AI',
  'text.clear': 'Clear',
  'text.start': 'Start',
  'text.uploadPdf': 'Upload PDF',
  'text.uploadHint': 'Pick a PDF from your device and start reading.',
  'text.minsLeft': '{n}m',
  'text.errGenerate': 'Failed to generate text.',
  'text.errInvalidPdf': 'Please select a valid PDF file.',
  'text.errEmptyPdf': 'PDF is empty or could not be read.',
  'text.errPdfUpload':
    'Failed to upload PDF. Make sure the file contains selectable text.',

  'ai.surprise': 'Surprise Me',
  'ai.science': 'Science & Tech',
  'ai.history': 'History',
  'ai.space': 'Space & Cosmos',
  'ai.psychology': 'Psychology',
  'ai.nature': 'Nature & Animals',
  'ai.philosophy': 'Philosophy',
  'ai.mythology': 'Mythology',
  'ai.motivation': 'Motivation',
  'ai.art': 'Art & Literature',

  'ai.prompt.surprise':
    'A surprising, little-known fact or story that most people have never heard',
  'ai.prompt.science':
    'An interesting science or technology topic, discovery, or invention',
  'ai.prompt.history':
    'An informative piece about an intriguing historical event, person, or era',
  'ai.prompt.space':
    'A fascinating topic about space, the universe, planets, stars, or cosmology',
  'ai.prompt.psychology':
    'An interesting topic about human psychology, behavior patterns, or the mind',
  'ai.prompt.nature':
    'Surprising facts about nature, the animal kingdom, or ecosystems',
  'ai.prompt.philosophy':
    'A piece about philosophy, schools of thought, or famous philosophers’ ideas',
  'ai.prompt.mythology':
    'An interesting myth or legend from Greek, Turkish, Egyptian, or world mythology',
  'ai.prompt.motivation':
    'An inspiring success story or life lesson that motivates the reader',
  'ai.prompt.art':
    'An interesting topic or work from art, literature, music, or cinema',
  'ai.prompt.fallback':
    'Pick a random interesting topic from general knowledge, science, or history',

  'ai.systemPrompt': `You are a speed-reading coach. Create an English practice text for the user.

Topic: {topic}.

Rules:
1. About 300–400 words.
2. Use fluent, engaging language. Hook the reader from the first sentence.
3. Choose a different, original topic each time — avoid repetition.
4. Use paragraphs but return plain text only — no markdown.
5. Return only the text — no intro, outro, or title.
6. Make the first sentence striking and attention-grabbing.`,

  'errors.apiKeyMissing': 'API key is missing.',
  'errors.apiKeyInvalid': 'API key is invalid.',
  'errors.apiRateLimit': 'API rate limit reached. Please wait and try again.',
  'errors.aiGenerate': 'Something went wrong while generating text.',
  'errors.aiEmpty': 'Could not generate text. Please try again.',
  'errors.pdfRead':
    'Could not read PDF text. Make sure the file is not corrupted.',

  'controls.speed': 'Speed (WPM)',
  'controls.size': 'Size',
  'controls.back': 'Go Back',
  'controls.settings': 'Settings',
  'controls.left': '{time} left',

  'completion.title': 'Completed!',
  'completion.subtitle': 'Great job.',
  'completion.words': 'Words',
  'completion.time': 'Time',
  'completion.wpm': 'WPM',
  'completion.restart': 'Read Again',
  'completion.back': 'Back to Library',
  'completion.minSec': '{m}m {s}s',
  'completion.sec': '{s}s',

  'reader.ready': 'Ready',

  'pdf.start': 'Start Reading',
  'pdf.startFromPage': 'Start from page {page}',

  'onboarding.builtBy': 'Built by',
  'onboarding.s1.t0': 'Read, understand,',
  'onboarding.s1.t1': 'get inspired',
  'onboarding.s1.sub':
    'Boost your reading speed 2–3× with HızlıOkur. Read much more in the same time.',
  'onboarding.s1.c0': 'Gain Speed',
  'onboarding.s1.c1': 'Full Focus',
  'onboarding.s1.c2': 'Anywhere',
  'onboarding.s1.c3': 'AI-Powered',
  'onboarding.s2.t0': 'Words come',
  'onboarding.s2.t1': 'to you',
  'onboarding.s2.sub':
    'RSVP eliminates eye movement. Each word appears at a fixed focus point — you just read.',
  'onboarding.s2.c0': 'Fixed Gaze',
  'onboarding.s2.c1': '500 WPM',
  'onboarding.s2.c2': 'Read More',
  'onboarding.s2.c3': 'Deep Comprehension',
  'onboarding.s3.t0': 'You choose',
  'onboarding.s3.t1': 'the content',
  'onboarding.s3.sub':
    'Upload a PDF, paste text, or generate a practice reading with AI instantly.',
  'onboarding.s3.c0': 'Upload PDF',
  'onboarding.s3.c1': 'Paste Text',
  'onboarding.s3.c2': 'Generate with AI',
  'onboarding.s3.c3': 'Start Now',
};

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  tr,
  en,
};

export function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(LS_LANG);
    if (saved === 'tr' || saved === 'en') return saved;
  } catch {
    /* ignore */
  }
  const nav =
    typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'tr';
  return nav.startsWith('tr') ? 'tr' : 'en';
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  let text = dictionaries[locale][key] ?? dictionaries.tr[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}
