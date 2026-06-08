import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, onFocus }, ref) => {
    return (
      <div className="relative flex items-center w-full group">
        <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 group-focus-within:text-violet-400 transition-colors pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder="Search notes... (Ctrl+F)"
          className="w-full h-10 pl-10 pr-8 glass-input text-sm text-zinc-100 placeholder-zinc-500"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
