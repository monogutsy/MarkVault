import { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { Note } from '../types/note';

interface DeleteModalProps {
  note: Note | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ note, onConfirm, onCancel }: DeleteModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (note) {
      cancelBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [note, onCancel]);

  if (!note) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onCancel}
    >
      <div 
        className="glass-panel w-full md:max-w-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200 border-t border-white/10 md:border md:rounded-2xl rounded-t-[32px] rounded-b-none shadow-[0_-20px_60px_rgba(0,0,0,0.5)] md:shadow-[0_20px_60px_rgba(0,0,0,0.5)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] md:pb-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-heading"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden" />
        <div className="w-14 h-14 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          <Trash2 className="w-6 h-6 text-pink-400" />
        </div>
        
        <h2 id="delete-heading" className="text-xl font-bold text-center text-white mb-3">
          Delete Note
        </h2>
        
        <p className="text-sm text-center text-zinc-400 mb-8 md:mb-8 leading-relaxed px-4 md:px-0">
          "<strong className="font-semibold text-zinc-200 truncate max-w-[200px] inline-block align-bottom">{note.title || 'Untitled Note'}</strong>" will be permanently deleted. This action cannot be undone.
        </p>
        
        <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 px-2 md:px-0">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className="w-full md:flex-1 py-3.5 md:py-2.5 px-4 rounded-xl glass-button-secondary text-zinc-300 hover:text-white font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full md:flex-1 py-3.5 md:py-2.5 px-4 rounded-xl glass-button-danger text-white font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 text-sm shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
