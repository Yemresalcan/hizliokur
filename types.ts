export interface ReaderSettings {
  wpm: number;
  chunkSize: number;
  darkMode: boolean;
}

export interface WordData {
  original: string;
  left: string;
  middle: string;
  right: string;
  delayMultiplier: number; // For punctuation pauses
  word: string; // The full word for audio sync
}

export enum AppState {
  IDLE = 'IDLE',
  READING = 'READING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export interface Book {
  id: string;
  title: string;
  text: string;
  totalWords: number;
  progress: number; // Current word index
  lastRead: number; // Timestamp
  wpm: number;
  thumbnail?: string; // Base64 JPEG of first PDF page
  pageOffsets?: number[]; // Word index where each page starts (pageOffsets[i] = page i+1 start)
}
