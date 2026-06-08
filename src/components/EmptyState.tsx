import { FileText, Plus, Download, Keyboard, Sparkles, Clock, LayoutTemplate, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface EmptyStateProps {
  onNewNote: () => void;
  onImport: (file: File) => void;
  noteCount?: number;
}

export function EmptyState({ onNewNote, onImport, noteCount = 0 }: EmptyStateProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-thin scroll-smooth p-6 md:p-12 font-sans">
      <div className="md:hidden flex flex-col h-full animate-in fade-in duration-500">
        <header className="mb-8 pt-4">
          <div className="w-12 h-12 glass-button rounded-2xl flex items-center justify-center mb-4 shadow-[0_8px_32px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            {greeting} 👋
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            {noteCount} Note{noteCount === 1 ? '' : 's'} • Tap + to create {noteCount === 0 ? 'your first' : 'a new'} note
          </p>
        </header>

        <div className="space-y-4">
           <div className="glass-panel p-4 rounded-2xl border-white/5 bg-black/20">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group active:scale-95">
                   <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                     <Download className="w-4 h-4 text-pink-400" />
                   </div>
                   <span className="text-sm font-medium text-zinc-200">Import Markdown</span>
                </button>
              </div>
           </div>

           <div className="glass-panel p-4 rounded-2xl border-white/5 bg-black/20">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Tips</h3>
              <ul className="space-y-3">
                 <li className="flex items-start gap-3 text-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                   <p className="text-zinc-400">Swipe a note left to delete it.</p>
                 </li>
                 <li className="flex items-start gap-3 text-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                   <p className="text-zinc-400">Tap search or press Ctrl+F to find files.</p>
                 </li>
              </ul>
           </div>
        </div>
      </div>

      <div className="hidden md:block max-w-4xl w-full mx-auto space-y-12 pb-12">
        <header className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 glass-button rounded-2xl flex items-center justify-center mb-2 shadow-[0_10px_40px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {greeting}
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
            Your personal digital brain. Capture ideas, write documents, and organize your knowledge with premium Markdown.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <button
            onClick={onNewNote}
            className="group relative overflow-hidden glass-card p-6 flex flex-col items-start gap-4 text-left transition-all hover:border-violet-500/30"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <div>
               <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                 Create New Note
                 <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
               </h3>
               <p className="text-sm text-zinc-400">Start writing from scratch</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative overflow-hidden glass-card p-6 flex flex-col items-start gap-4 text-left transition-all hover:border-pink-500/30"
          >
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center border border-pink-500/20 group-hover:bg-pink-500/30 transition-colors">
              <Download className="w-6 h-6 text-pink-400" />
            </div>
            <div>
               <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                 Import Markdown
                 <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-pink-400" />
               </h3>
               <p className="text-sm text-zinc-400">Upload existing .md files</p>
            </div>
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="glass-panel p-6 rounded-2xl border-white/5 bg-black/20">
            <div className="flex items-center gap-3 mb-6">
              <Keyboard className="w-5 h-5 text-zinc-400" />
              <h3 className="font-semibold text-zinc-200">Global Shortcuts</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Command Palette</span>
                <kbd className="px-2 py-1 glass-panel text-zinc-300 rounded font-mono text-xs border border-white/10 tracking-widest">Ctrl + K</kbd>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">New Note</span>
                <kbd className="px-2 py-1 glass-panel text-zinc-300 rounded font-mono text-xs border border-white/10 tracking-widest">Ctrl + N</kbd>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Search Notes</span>
                <kbd className="px-2 py-1 glass-panel text-zinc-300 rounded font-mono text-xs border border-white/10 tracking-widest">Ctrl + F</kbd>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-white/5 bg-black/20">
            <div className="flex items-center gap-3 mb-6">
              <LayoutTemplate className="w-5 h-5 text-zinc-400" />
              <h3 className="font-semibold text-zinc-200">Pro Tips</h3>
            </div>
            <ul className="space-y-4">
               <li className="flex items-start gap-3 text-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                 <p className="text-zinc-400">Tags are auto-extracted from notes (e.g. <span className="text-violet-300 bg-violet-500/10 px-1 rounded">#idea</span>)</p>
               </li>
               <li className="flex items-start gap-3 text-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                 <p className="text-zinc-400">Type <code className="text-zinc-300 bg-white/5 px-1 rounded">[[title]]</code> to link to other notes instantly.</p>
               </li>
               <li className="flex items-start gap-3 text-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                 <p className="text-zinc-400">Everything saves automatically in real-time.</p>
               </li>
            </ul>
          </div>
        </section>
      </div>

      <input 
        type="file" 
        accept=".md,text/markdown"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImport(file);
          e.target.value = '';
        }}
        className="hidden" 
      />
    </div>
  );
}
