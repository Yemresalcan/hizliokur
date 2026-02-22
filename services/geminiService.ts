import { GoogleGenAI, Modality } from "@google/genai";
import { MODELS, AUDIO } from '../constants';

const apiKey = process.env.API_KEY || '';

// Initialize only if key is present to avoid errors on load if missing (though required)
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generatePracticeText = async (topic: string): Promise<string> => {
  if (!ai) {
    throw new Error("API anahtarı eksik.");
  }

  try {
    const prompt = `Sen bir hızlı okuma eğitmenisin. Kullanıcının pratik yapması için Türkçe bir metin oluştur.

Konu: ${topic || 'Genel kültür, bilim veya tarihten rastgele ilginç bir konu seç'}.

Kurallar:
1. Yaklaşık 300-400 kelime olsun.
2. Akıcı, sürükleyici ve merak uyandırıcı bir dil kullan. Okuyucuyu ilk cümleden yakala.
3. Her seferinde farklı ve özgün bir konu seç, tekrara düşme.
4. Paragraflara ayır ama sadece düz metin (plain text) döndür, markdown kullanma.
5. Sadece metni döndür, giriş/çıkış konuşması veya başlık ekleme.
6. İlk cümle çarpıcı ve dikkat çekici olsun.`;

    const response = await ai.models.generateContent({
      model: MODELS.textGeneration,
      contents: prompt,
    });

    return response.text || "Metin oluşturulamadı. Lütfen tekrar deneyin.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Yapay zeka metin oluştururken bir hata oluştu.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  if (!ai) throw new Error("API anahtarı eksik.");

  const truncatedText = text.length > AUDIO.ttsMaxChars
    ? text.slice(0, AUDIO.ttsMaxChars)
    : text;

  try {
    const response = await ai.models.generateContent({
      model: MODELS.tts,
      contents: [{ parts: [{ text: truncatedText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: AUDIO.voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("API ses verisi döndürmedi.");
    }

    return base64Audio;
  } catch (error: unknown) {
    console.error("Gemini TTS Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('quota') || message.includes('429')) {
      throw new Error("API limiti aşıldı. Lütfen bir süre bekleyip tekrar deneyin.");
    }
    if (message.includes('API ses verisi döndürmedi') || message.includes('API anahtarı')) {
      throw error;
    }
    throw new Error("Ses oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};
