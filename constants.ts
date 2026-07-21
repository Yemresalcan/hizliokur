export const MODELS = {
  /** OpenRouter model id — https://openrouter.ai/models */
  textGeneration: 'nvidia/nemotron-3-ultra-550b-a55b:free',
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
