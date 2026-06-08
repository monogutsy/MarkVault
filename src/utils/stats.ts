import { NoteStats } from '../types/note';

export function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function countChars(text: string): number {
  return text.replace(/\s/g, '').length;
}

export function estimateReadingTime(wordCount: number): number {
  if (wordCount === 0) return 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function getNoteStats(content: string): NoteStats {
  const wordCount = countWords(content);
  return {
    wordCount,
    charCount: countChars(content),
    readingTimeMinutes: estimateReadingTime(wordCount),
  };
}
