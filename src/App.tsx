import { useState, useRef, useMemo } from 'react';
import { useNotes } from './hooks/useNotes';
import { useDarkMode } from './hooks/useDarkMode';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getNoteStats } from './utils/stats';
import { exportNoteAsMarkdown, importMarkdownFile } from './utils/exportImport';
import { buildCommandPaletteActions } from './utils/commands';
import { Note } from './types/note';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmptyState } from './components/EmptyState';
import { DeleteModal } from './components/DeleteModal';
import { CommandPalette } from './components/CommandPalette';
import { SplitPaneContent } from './components/SplitPaneView';
import { StatsBar } from './components/StatsBar';
import { Menu, ArrowLeft, MoreHorizontal, Sun, Moon } from 'lucide-react';

export default function App() {
  const {
    notes, activeNote, setActiveNote,
    filteredNotes, searchQuery, setSearchQuery,
    sortField, setSortField, sortDirection, setSortDirection, filterPinned, setFilterPinned,
    createNote, updateNote, deleteNote,
    duplicateNote, togglePin, importNote,
  } = useNotes();

  const [isDark, toggleDark] = useDarkMode();
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'notes' | 'favorites'>('home');
  
  const searchRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() =>
    activeNote ? getNoteStats(activeNote.content) : { wordCount: 0, charCount: 0, readingTimeMinutes: 0 },
    [activeNote?.content]
  );

  const handleDelete = (note: Note) => setDeleteTarget(note);
  const confirmDelete = () => { if (deleteTarget) deleteNote(deleteTarget.id); setDeleteTarget(null); };

  useKeyboardShortcuts([
    { key: 'n', ctrlOrCmd: true, handler: () => { createNote(); setSidebarOpen(false); } },
    { key: 's', ctrlOrCmd: true, handler: () => {} },
    { key: 'f', ctrlOrCmd: true, handler: () => { setSidebarOpen(true); setTimeout(() => searchRef.current?.focus(), 100); } },
    { key: 'k', ctrlOrCmd: true, handler: () => setIsPaletteOpen(true) },
  ]);

  const handleImport = async (file: File) => {
    try {
      const partial = await importMarkdownFile(file);
      const note = importNote(partial);
      setActiveNote(note);
      setSidebarOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
    setSidebarOpen(false);
  };

  const actions = useMemo(() => 
    buildCommandPaletteActions({
      notes, 
      activeNote, 
      createNote, 
      deleteNote: () => { if (activeNote) handleDelete(activeNote); },
      duplicateNote, 
      togglePin, 
      toggleDark,
      setActiveNote, 
      exportNoteAsMarkdown,
      onFocusSearch: () => { setSidebarOpen(true); setTimeout(() => searchRef.current?.focus(), 100); },
    }), 
  [notes, activeNote, createNote, duplicateNote, togglePin, toggleDark, setActiveNote]);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden text-zinc-100 font-sans selection:bg-violet-500/30 md:p-4 md:gap-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      
      <div className="hidden md:block shrink-0">
        <Header
          isDark={isDark}
          onToggleDark={toggleDark}
          onNewNote={createNote}
          onOpenCommandPalette={() => setIsPaletteOpen(true)}
          activeNote={activeNote}
          stats={stats}
        />
      </div>

      <div className="md:hidden flex items-center justify-between px-4 h-14 shrink-0 glass-panel border-b border-white/5 z-30">
        {activeNote ? (
          <>
            <button onClick={() => setActiveNote(null)} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 py-2 -ml-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span className="font-semibold">Notes</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsPaletteOpen(true)} className="p-2 -mr-2 text-zinc-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-zinc-300 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold tracking-tight text-white text-lg">MarkVault</span>
            <button onClick={() => setIsPaletteOpen(true)} className="p-2 -mr-2 text-zinc-300 hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden relative md:gap-4">
        
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`
          md:hidden fixed inset-y-0 left-0 w-[280px] bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-xl text-white">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-zinc-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
            </div>
            <div className="flex flex-col gap-2 font-medium">
              <button className="flex items-center gap-3 p-3 text-white bg-white/10 rounded-xl transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg> All Notes</button>
              <button onClick={() => { setFilterPinned(true); setSidebarOpen(false); }} className="flex items-center gap-3 p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Favorites</button>
              <button className="flex items-center gap-3 p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l8.29-8.29c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg> Tags</button>
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <button onClick={toggleDark} className="flex items-center gap-3 p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />} Theme Toggle
              </button>
            </div>
          </div>
        </div>

        <div className={`
          md:relative z-10 w-full md:w-auto h-full transition-transform duration-300
          ${activeNote || (activeMobileTab === 'home' && !activeNote) ? 'hidden md:block' : 'block'}
        `}>
          <Sidebar
            notes={filteredNotes}
            activeNote={activeNote}
            onSelectNote={handleNoteSelect}
            onNewNote={createNote}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortField={sortField}
            onSortChange={setSortField}
            filterPinned={filterPinned}
            onFilterPinnedChange={setFilterPinned}
            onImport={handleImport}
            onDeleteNote={(id) => handleDelete(notes.find(n => n.id === id)!)}
            onDuplicateNote={duplicateNote}
            onTogglePin={togglePin}
            onExportNote={exportNoteAsMarkdown}
            onTagClick={(tag) => setSearchQuery('#' + tag)}
            ref={searchRef}
          />
        </div>

        <main className={`
          flex-1 flex flex-col overflow-hidden min-w-0 md:glass-panel md:rounded-[28px] bg-[#070B14] md:bg-transparent
          ${!activeNote ? 'hidden md:flex' : 'flex'}
        `}>
          {activeNote ? (
            <>
              <SplitPaneContent
                note={activeNote}
                notes={notes}
                onUpdate={(patch) => updateNote(activeNote.id, patch)}
                onWikiLinkClick={(id) => {
                   const tgt = notes.find(n => n.id === id);
                   if (tgt) setActiveNote(tgt);
                }}
              />
              <StatsBar stats={stats} note={activeNote} />
            </>
          ) : (
            <div className={`flex-1 flex ${activeMobileTab !== 'home' ? 'hidden md:flex' : 'flex'}`}>
               <EmptyState onNewNote={createNote} onImport={handleImport} noteCount={notes.length} />
            </div>
          )}
        </main>
      </div>

      {!activeNote && (
        <button
          onClick={createNote}
          className="md:hidden fixed right-5 bottom-[84px] w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/90 to-purple-600/90 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-[0_8px_32px_rgba(139,92,246,0.6)] z-40 transition-all active:scale-90 hover:shadow-[0_8px_40px_rgba(139,92,246,0.8)]"
          aria-label="New Note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      )}

      {!activeNote && (
        <div className="md:hidden shrink-0 glass-panel border-t border-white/5 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-around h-[68px] px-4">
             <button 
                onClick={() => { setActiveMobileTab('home'); setFilterPinned(false); setSearchQuery(""); }} 
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all ${activeMobileTab === 'home' ? 'bg-white/15 text-blue-400 shadow-[0_0_20px_rgba(79,140,255,0.15)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={activeMobileTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
               {activeMobileTab === 'home' && <span className="text-sm font-semibold tracking-wide">Home</span>}
             </button>
             <button 
                onClick={() => { setActiveMobileTab('notes'); setFilterPinned(false); setSearchQuery(""); }} 
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all ${activeMobileTab === 'notes' ? 'bg-white/15 text-blue-400 shadow-[0_0_20px_rgba(79,140,255,0.15)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={activeMobileTab === 'notes' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
               {activeMobileTab === 'notes' && <span className="text-sm font-semibold tracking-wide">Notes</span>}
             </button>
             <button 
                onClick={() => setIsPaletteOpen(true)} 
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all text-zinc-500 hover:text-zinc-300 hover:bg-white/5`}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
             </button>
             <button 
                onClick={() => { setActiveMobileTab('favorites'); setFilterPinned(true); }} 
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all ${activeMobileTab === 'favorites' ? 'bg-white/15 text-blue-400 shadow-[0_0_20px_rgba(79,140,255,0.15)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={activeMobileTab === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
               {activeMobileTab === 'favorites' && <span className="text-sm font-semibold tracking-wide">Liked</span>}
             </button>
          </div>
        </div>
      )}

      <DeleteModal
        note={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        actions={actions}
      />
    </div>
  );
}
