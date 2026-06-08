import { useEffect, useRef, useState } from 'react';
import { CommandPaletteAction } from '../types/note';
import { Search, FilePlus, Moon, Download, Pin, PinOff, Copy, Trash2, FileText } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandPaletteAction[];
}

const ICONS: Record<string, any> = {
  FilePlus,
  Moon,
  Search,
  Download,
  Pin,
  PinOff,
  Copy,
  Trash2,
  FileText,
};

export function CommandPalette({ isOpen, onClose, actions }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredActions = actions.filter(action => {
    if (!query) return true;
    const q = query.toLowerCase();
    return action.label.toLowerCase().includes(q) || action.keywords.some(k => k.toLowerCase().includes(q));
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveIndex(prev => Math.max(prev - 1, 0));
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const action = filteredActions[activeIndex];
          if (action) {
            action.action();
            onClose();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, filteredActions, activeIndex, onClose]);

  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center md:pt-[15vh] md:px-4"
      onClick={onClose}
    >
      <div 
        className="glass-panel overflow-hidden transform transition-all w-full h-[100dvh] md:h-auto md:max-w-xl md:border-white/10 md:rounded-2xl flex flex-col md:animate-in md:fade-in md:zoom-in-95 duration-200 md:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-none rounded-none shadow-none bg-[#070B14]/95 animate-in slide-in-from-bottom"
        role="dialog"
        aria-modal="true"
        aria-label="Search and Commands"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative shrink-0 pt-[env(safe-area-inset-top)] bg-black/20">
          <div className="relative border-b border-white/10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands or notes..."
              className="w-full h-16 pl-14 pr-4 bg-transparent border-none outline-none text-white placeholder:text-zinc-500 text-lg font-medium"
              aria-label="Command search"
              aria-activedescendant={filteredActions[activeIndex] ? `cmd-${filteredActions[activeIndex].id}` : undefined}
            />
            <button onClick={onClose} className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400 font-medium">Cancel</button>
          </div>
        </div>

        <ul 
          ref={listRef}
          className="flex-1 md:max-h-[60vh] overflow-y-auto p-3 space-y-1 scrollbar-thin"
          role="listbox"
        >
          {filteredActions.length === 0 ? (
            <li className="p-6 text-center text-sm text-zinc-500 font-medium">No results found</li>
          ) : (
            filteredActions.map((action, i) => {
              const Icon = ICONS[action.icon] || FileText;
              const isActive = i === activeIndex;
              return (
                <li
                  key={action.id}
                  id={`cmd-${action.id}`}
                  role="option"
                  aria-selected={isActive}
                  className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${
                    isActive ? 'bg-blue-500/20 text-white shadow-[0_0_15px_rgba(79,140,255,0.1)]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                  onClick={() => {
                    action.action();
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <div className="flex items-center gap-3.5 w-0 flex-1 pr-4">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-zinc-400'}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="truncate text-sm font-semibold tracking-wide">{action.label}</span>
                  </div>
                  {action.shortcut && (
                    <kbd className={`shrink-0 text-[10px] font-mono px-2 py-1 rounded-md tracking-widest ${
                      isActive ? 'bg-blue-500/30 text-blue-200' : 'bg-white/10 text-zinc-500'
                    }`}>
                      {action.shortcut}
                    </kbd>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
