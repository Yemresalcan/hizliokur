import { MODELS } from '../constants';
import { Locale, translate } from '../i18n/translations';

const apiKey = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const generatePracticeText = async (
  topic: string,
  locale: Locale = 'tr'
): Promise<string> => {
  const t = (key: Parameters<typeof translate>[1], params?: Record<string, string | number>) =>
    translate(locale, key, params);

  if (!apiKey) {
    throw new Error(t('errors.apiKeyMissing'));
  }

  const resolvedTopic = topic || t('ai.prompt.fallback');
  const prompt = t('ai.systemPrompt', { topic: resolvedTopic });

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer':
          typeof window !== 'undefined'
            ? window.location.origin
            : 'https://hizliokur.vercel.app',
        'X-Title': 'HizliOkur',
      },
      body: JSON.stringify({
        model: MODELS.textGeneration,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('OpenRouter Error:', response.status, errorBody);
      if (response.status === 401) {
        throw new Error(t('errors.apiKeyInvalid'));
      }
      if (response.status === 429) {
        throw new Error(t('errors.apiRateLimit'));
      }
      throw new Error(t('errors.aiGenerate'));
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    return text || t('errors.aiEmpty');
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === t('errors.apiKeyMissing') ||
        error.message === t('errors.apiKeyInvalid') ||
        error.message === t('errors.apiRateLimit') ||
        error.message === t('errors.aiGenerate'))
    ) {
      throw error;
    }
    console.error('OpenRouter Error:', error);
    throw new Error(t('errors.aiGenerate'));
  }
};
