export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export type SortField = 'updatedAt' | 'createdAt' | 'title';
export type SortDirection = 'desc' | 'asc';

export interface NoteStats {
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
}

export interface CommandPaletteAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  action: () => void;
  keywords: string[];
}
