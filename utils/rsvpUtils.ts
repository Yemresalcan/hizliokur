import { WordData } from '../types';

/**
 * Calculates the Optimal Recognition Point (ORP) and splits the word.
 * This helps the eye focus on the center of the word for faster processing.
 */
/**
 * Calculates the Optimal Recognition Point (ORP) index for a word.
 * Research shows the eye naturally fixates slightly left of center.
 * Formula: roughly 30-40% into the word, minimum index 0.
 */
const getOrpIndex = (length: number): number => {
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
};

export const processTextToWords = (text: string): WordData[] => {
  // Normalize whitespace and split
  const rawWords = text.trim().split(/\s+/);

  return rawWords.map(word => {
    const length = word.length;
    const midIndex = getOrpIndex(length);

    const left = word.slice(0, midIndex);
    const middle = word[midIndex];
    const right = word.slice(midIndex + 1);

    // Calculate delay multiplier based on punctuation
    let delayMultiplier = 1;
    if (/[.,;!?]$/.test(word)) delayMultiplier = 1.5; // Pause longer at punctuation
    if (/[.!?]$/.test(word)) delayMultiplier = 2.0;   // Pause even longer at sentence ends
    if (word.length > 8) delayMultiplier = 1.2;       // Slight pause for long words

    return {
      original: word,
      word,
      left,
      middle: middle ?? word[0] ?? '',
      right,
      delayMultiplier
    };
  });
};

export const calculateDelay = (wpm: number, multiplier: number): number => {
  const baseDelay = 60000 / wpm;
  return baseDelay * multiplier;
};