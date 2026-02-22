export const MODELS = {
  textGeneration: 'gemini-3-flash-preview',
  tts: 'gemini-2.5-flash-preview-tts',
} as const;

export const AUDIO = {
  sampleRate: 24000,
  voiceName: 'Kore',
  ttsMaxChars: 8000,
} as const;

export const WPM = {
  min: 100,
  max: 1000,
  default: 300,
  step: 25,
} as const;

export const STORAGE = {
  maxBooks: 5,
  progressDebounceMs: 1000,
} as const;

export const ORP_ARTIFACT_SCAN_LIMIT = 20;
