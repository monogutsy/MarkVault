import { forwardRef, useRef } from 'react';
import { SearchBar } from './SearchBar';
import { NoteItem } from './NoteItem';
import { Note, SortField } from '../types/note';
import { Pin, Upload, FileText } from 'lucide-react';

interface SidebarProps {
  notes: Note[];
  activeNote: Note | null;
  onSelectNote: (note: Note) => void;
  onNewNote: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortField: SortField;
  onSortChange: (f: SortField) => void;
  filterPinned: boolean;
  onFilterPinnedChange: (v: boolean) => void;
  onImport: (file: File) => void;
  onDeleteNote: (id: string) => void;
  onDuplicateNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onExportNote: (note: Note) => void;
  onTagClick?: (tag: string) => void;
}

export const Sidebar = forwardRef<HTMLInputElement, SidebarProps>(({
  notes, activeNote, onSelectNote, onNewNote,
  searchQuery, onSearchChange, sortField, onSortChange,
  filterPinned, onFilterPinnedChange, onImport,
  onDeleteNote, onDuplicateNote, onTogglePin, onExportNote, onTagClick
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
    e.target.value = '';
  };

  return (
    <aside className="w-full md:w-[var(--sidebar-width)] h-full flex flex-col glass-panel rounded-[28px] border border-white/10 shrink-0">
      <div className="p-5 flex flex-col gap-4 border-b border-white/10 shrink-0">
        <SearchBar value={searchQuery} onChange={onSearchChange} ref={ref} />
        
        <div className="flex items-center justify-between px-1">
          <select
            value={sortField}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="bg-transparent text-xs text-zinc-400 focus:outline-none cursor-pointer hover:text-white transition-colors"
          >
            <option value="updatedAt" className="bg-zinc-900 border-none">Last Updated</option>
            <option value="createdAt" className="bg-zinc-900 border-none">Date Created</option>
            <option value="title" className="bg-zinc-900 border-none">A-Z</option>
          </select>
          
          <div className="flex gap-2">
            <button
              onClick={() => onFilterPinnedChange(!filterPinned)}
              className={`p-1.5 rounded-lg transition-colors ${
                filterPinned 
                  ? 'bg-violet-500/20 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]' 
                  : 'glass-button-secondary text-zinc-400 hover:text-white'
              }`}
              title="Filter by pinned"
            >
              <Pin className={`w-3.5 h-3.5 ${filterPinned ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleImportClick}
              className="p-1.5 rounded-lg transition-colors glass-button-secondary text-zinc-400 hover:text-white"
              title="Import .md file"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
          <input 
            type="file" 
            accept=".md,text/markdown" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin font-sans" role="listbox">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-zinc-400">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="font-semibold text-white mb-2">No notes yet</h3>
            <p className="text-sm mb-5 text-zinc-500">Create your first note to get started.</p>
            <button
              onClick={onNewNote}
              className="px-5 h-10 glass-button text-white text-sm font-medium rounded-xl focus:outline-none"
            >
              New Note
            </button>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNote?.id === note.id}
                searchQuery={searchQuery}
                onClick={() => onSelectNote(note)}
                onPin={() => onTogglePin(note.id)}
                onDuplicate={() => onDuplicateNote(note.id)}
                onDelete={() => onDeleteNote(note.id)}
                onExport={() => onExportNote(note)}
                onTagClick={onTagClick}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});
Sidebar.displayName = 'Sidebar';
