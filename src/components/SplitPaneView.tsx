import { useState, useEffect } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Editor } from './Editor';
import { MarkdownPreview } from './MarkdownPreview';
import { Note } from '../types/note';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Columns, LayoutTemplate, PenLine } from 'lucide-react';

interface SplitPaneProps {
  note: Note;
  notes: Note[];
  onUpdate: (patch: Partial<Note>) => void;
  onWikiLinkClick: (id: string) => void;
}

export type ViewMode = 'editor' | 'split' | 'preview';

export function ViewModeBar({ mode, setMode }: { mode: ViewMode, setMode: (m: ViewMode) => void }) {
  const modes = [
    { id: 'editor', label: 'Editor', icon: PenLine },
    { id: 'split', label: 'Split', icon: Columns },
    { id: 'preview', label: 'Preview', icon: LayoutTemplate },
  ] as const;

  return (
    <div className="flex justify-center flex-shrink-0 bg-transparent border-b border-white/10 p-3">
      <div className="flex glass-panel rounded-xl p-1 space-x-1 border-white/10">
        {modes.map(m => {
          const isActive = mode === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg ${
                isActive 
                  ? 'bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline tracking-wide">{m.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
}

export function SplitPaneContent({ note, notes, onUpdate, onWikiLinkClick }: SplitPaneProps) {
  const [mode, setMode] = useLocalStorage<ViewMode>('md-notes-view-mode', 'split');

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 640 && mode === 'split') {
        setMode('editor');
      }
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [mode, setMode]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ViewModeBar mode={mode} setMode={setMode} />
      
      <div className="flex-1 overflow-hidden relative">
        {mode === 'split' ? (
          <PanelGroup orientation="horizontal" className="h-full w-full">
            <Panel defaultSize={50} minSize={20} className="h-full border-r border-white/10">
              <Editor note={note} onUpdate={onUpdate} />
            </Panel>
            
            <PanelResizeHandle className="w-1.5 relative group flex items-center justify-center resizer">
              <div className="h-10 w-1 rounded-full bg-white/20 group-hover:bg-white/40 group-data-[resize-handle-state=drag]:bg-white opacity-0 group-hover:opacity-100 transition-all" />
            </PanelResizeHandle>
            
            <Panel defaultSize={50} minSize={20} className="h-full">
              <MarkdownPreview content={note.content} notes={notes} onWikiLinkClick={onWikiLinkClick} />
            </Panel>
          </PanelGroup>
        ) : mode === 'editor' ? (
          <div className="h-full w-full mx-auto max-w-4xl">
             <Editor note={note} onUpdate={onUpdate} />
          </div>
        ) : (
          <div className="h-full w-full mx-auto max-w-4xl">
             <MarkdownPreview content={note.content} notes={notes} onWikiLinkClick={onWikiLinkClick} />
          </div>
        )}
      </div>
    </div>
  );
}
