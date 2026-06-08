import { Note, NoteStats } from '../types/note';

interface StatsBarProps {
  stats: NoteStats;
  note: Note;
}

function formatRelativeTime(dateString: string): string {
  const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  
  if (diffInSeconds < 60) return "a few seconds ago";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return "yesterday";
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return new Date(dateString).toLocaleDateString();
}

export function StatsBar({ stats, note }: StatsBarProps) {
  return (
    <footer className="h-10 shrink-0 flex items-center justify-between px-6 border-t border-white/10 bg-black/20 text-[11px] text-zinc-400 font-medium">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
        <span>Last saved {formatRelativeTime(note.updatedAt)}</span>
      </div>
      <div className="flex items-center gap-4 text-zinc-500">
        <span>{stats.wordCount} words, {stats.charCount} chars</span>
        <span className="uppercase tracking-widest hidden sm:inline">UTF-8</span>
        <span className="px-2 py-0.5 glass-panel border-white/5 rounded-md font-mono text-[9px] hidden sm:inline">MDX</span>
      </div>
    </footer>
  );
}
