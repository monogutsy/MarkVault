import { useEffect, useState, useRef } from 'react';
import { Bold, Italic, Strikethrough, Code, Link, Image, Heading, List, ListOrdered, Quote, Minus } from 'lucide-react';
import { Note } from '../types/note';
import { useAutoSave } from '../hooks/useAutoSave';

interface EditorProps {
  note: Note;
  onUpdate: (patch: Partial<Note>) => void;
}

export function Editor({ note, onUpdate }: EditorProps) {
  const [content, setContent] = useState(note.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContent(note.content);
    
    if (note.title === 'Untitled Note' && note.content === '') {
      setTimeout(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
      }, 0);
    }
  }, [note.id]);

  useAutoSave(content, (val) => {
    if (val !== note.content) onUpdate({ content: val });
  }, 500);

  const insertFormat = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected}${suffix}`;

    const newText = text.slice(0, start) + replacement + text.slice(end);
    setContent(newText);
    
    onUpdate({ content: newText });

    setTimeout(() => {
      el.focus();
      if (selected.length === 0) {
        el.setSelectionRange(start + prefix.length, start + prefix.length);
      } else {
        el.setSelectionRange(start, start + replacement.length);
      }
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const text = el.value;
    
    let lineStart = start;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') {
      lineStart--;
    }

    const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
    setContent(newText);
    onUpdate({ content: newText });

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;

      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value;
      const newText = val.substring(0, start) + '  ' + val.substring(end);
      
      setContent(newText);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      }, 0);
    }
  };

  const ToolbarButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button
      onClick={onClick}
      title={label}
      className="p-2 text-zinc-400 hover:text-white glass-button-secondary border-none shadow-none rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-2 relative overflow-hidden">
      <input
        ref={titleInputRef}
        type="text"
        value={note.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Note title..."
        className="w-full bg-transparent text-2xl md:text-3xl font-bold text-white border-none outline-none placeholder:text-zinc-600 mb-6 font-sans tracking-tight focus:ring-0"
        spellCheck="false"
      />
      
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        placeholder="Start writing in Markdown...&#10;&#10;Type # for a heading, **bold**, *italic*, - for lists..."
        className="flex-1 w-full resize-none border-none outline-none bg-transparent font-mono text-base leading-relaxed text-zinc-300 placeholder:text-zinc-600 focus:ring-0 scrollbar-thin px-2 relative z-0 mb-16"
        aria-label="Note content editor"
      />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 py-2 px-4 glass-panel rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-10 animate-in slide-in-from-bottom-8 duration-500 border border-white/10 bg-black/40 max-w-[calc(100vw-32px)] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-1.5 shrink-0">
          <ToolbarButton icon={Bold} label="Bold" onClick={() => insertFormat('**', '**')} />
          <ToolbarButton icon={Italic} label="Italic" onClick={() => insertFormat('*', '*')} />
          <ToolbarButton icon={Strikethrough} label="Strikethrough" onClick={() => insertFormat('~~', '~~')} />
          <div className="w-px h-5 bg-white/10 mx-1" />
          <ToolbarButton icon={Code} label="Code" onClick={() => insertFormat('`', '`')} />
          <ToolbarButton icon={Link} label="Link" onClick={() => insertFormat('[', '](url)')} />
          <ToolbarButton icon={Image} label="Image" onClick={() => insertFormat('![alt](', ')')} />
          <div className="w-px h-5 bg-white/10 mx-1" />
          <ToolbarButton icon={Heading} label="Heading" onClick={() => insertLinePrefix('## ')} />
          <ToolbarButton icon={List} label="Unordered List" onClick={() => insertLinePrefix('- ')} />
          <ToolbarButton icon={ListOrdered} label="Ordered List" onClick={() => insertLinePrefix('1. ')} />
          <div className="w-px h-5 bg-white/10 mx-1" />
          <ToolbarButton icon={Quote} label="Quote" onClick={() => insertLinePrefix('> ')} />
          <ToolbarButton icon={Minus} label="Horizontal Rule" onClick={() => insertFormat('\n---\n')} />
        </div>
      </div>
    </div>
  );
}
