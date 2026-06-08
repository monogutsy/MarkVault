import { memo, useState, useRef, useEffect } from 'react';
import { Pin, PinOff, MoreHorizontal, Copy, Download, Trash2 } from 'lucide-react';
import { Note } from '../types/note';
import { TagBadge } from './TagBadge';

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  searchQuery: string;
  onClick: () => void;
  onPin: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onExport: () => void;
  onTagClick?: (tag: string) => void;
}

function formatRelativeTime(dateString: string): string {
  const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return "Yesterday";
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-inherit rounded-sm px-0.5">{part}</mark> : part
      )}
    </>
  );
}

export const NoteItem = memo(({
  note, isActive, searchQuery, onClick, onPin, onDuplicate, onDelete, onExport, onTagClick
}: NoteItemProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 60) {
      onDelete();
    } else if (diff < -60) {
      onPin();
    }
    touchStartX.current = null;
  };

  const previewText = note.content.replace(/[#*_`>\[\]]/g, '').slice(0, 80) + (note.content.length > 80 ? '...' : '');

  return (
    <div
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`group relative p-4 cursor-pointer transition-all duration-300 rounded-xl mb-2 mx-2 border ${
        isActive 
          ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_4px_15px_rgba(79,140,255,0.15)] active:scale-[0.98]' 
          : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:scale-[0.98]'
      }`}
    >
      {isActive && <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-blue-500" />}
      
      <div className="flex justify-between items-start mb-1.5 gap-2">
        <h3 className={`font-semibold text-sm truncate flex-1 tracking-wide ${isActive ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
          <HighlightText text={note.title || 'Untitled Note'} query={searchQuery} />
        </h3>
        <div className="flex items-center space-x-1 shrink-0">
          {note.pinned && <PinOff className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-blue-400/70'}`} />}
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className={`p-2 md:p-1.5 rounded-xl opacity-100 md:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white/20 transition-all ${menuOpen ? 'opacity-100 bg-white/10' : ''}`}
            >
              <MoreHorizontal className="w-5 h-5 md:w-4 md:h-4 text-zinc-400 group-hover:text-zinc-200" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 glass-dropdown py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicate(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm md:text-xs text-zinc-300 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
                >
                  <Copy className="w-4 h-4 md:w-3.5 md:h-3.5" /> Duplicate
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onExport(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm md:text-xs text-zinc-300 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
                >
                  <Download className="w-4 h-4 md:w-3.5 md:h-3.5" /> Export
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onPin(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm md:text-xs text-zinc-300 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
                >
                  {note.pinned ? <PinOff className="w-4 h-4 md:w-3.5 md:h-3.5" /> : <Pin className="w-4 h-4 md:w-3.5 md:h-3.5" />} 
                  {note.pinned ? 'Unpin' : 'Pin'}
                </button>
                <div className="h-px bg-white/10 my-1 font-sans font-medium tracking-tight" />
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm md:text-xs text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 flex items-center gap-3 transition-colors"
                >
                  <Trash2 className="w-4 h-4 md:w-3.5 md:h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className={`text-xs mb-3 truncate font-sans leading-relaxed transition-colors ${isActive ? 'text-blue-100/70' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
        {previewText || 'No content...'}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-blue-300/60' : 'text-zinc-600'}`}>
          {formatRelativeTime(note.updatedAt)}
        </span>
        <div className="flex gap-1.5 overflow-hidden">
          {note.tags.slice(0, 3).map(tag => (
            <TagBadge key={tag} tag={tag} onClick={onTagClick ? () => onTagClick(tag) : undefined} />
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-zinc-500 font-medium">+{note.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
});
NoteItem.displayName = 'NoteItem';
