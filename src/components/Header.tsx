import { Sun, Moon, Keyboard, Plus, FileText } from 'lucide-react';
import { Note, NoteStats } from '../types/note';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  onNewNote: () => void;
  onOpenCommandPalette: () => void;
  activeNote: Note | null;
  stats: NoteStats;
}

export function Header({ isDark, onToggleDark, onNewNote, onOpenCommandPalette, activeNote, stats }: HeaderProps) {
  return (
    <header className="h-[var(--header-height)] w-full flex items-center justify-between px-6 glass-panel border border-white/10 shrink-0 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3 w-[240px] shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(139,92,246,0.4)]">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <span className="font-sans font-semibold tracking-tight text-white text-lg">
          MarkVault
        </span>
      </div>

      <div className="flex-1 flex justify-center uppercase hidden md:flex">
        {activeNote && (
          <div className="text-xs font-sans text-zinc-400 flex items-center gap-3 px-4 py-1.5 glass-panel rounded-full shadow-none border-white/5">
            <span>{stats.wordCount} words</span>
            <span className="text-zinc-600">&middot;</span>
            <span>{stats.charCount} chars</span>
            <span className="text-zinc-600">&middot;</span>
            <span>{stats.readingTimeMinutes} min read</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 w-[240px] justify-end">
        <button
          onClick={onToggleDark}
          className="relative w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-white glass-button-secondary rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 overflow-hidden"
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          <Sun className={`absolute w-5 h-5 transition-all duration-500 ${isDark ? 'opacity-0 scale-50 rotate-[90deg]' : 'opacity-100 scale-100 rotate-0'}`} />
          <Moon className={`absolute w-5 h-5 transition-all duration-500 ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-[90deg]'}`} />
        </button>
        <button
          onClick={onOpenCommandPalette}
          className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-white glass-button-secondary rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label="Command Palette"
          title="Command Palette (Ctrl+K)"
        >
          <Keyboard className="w-4 h-4" />
        </button>
        <button
          onClick={onNewNote}
          className="flex items-center gap-2 px-4 h-10 text-white glass-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="New Note"
          title="New Note (Ctrl+N)"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Note</span>
        </button>
      </div>
    </header>
  );
}
