import { CommandPaletteAction, Note } from '../types/note';

interface BuildActionsParams {
  notes: Note[];
  activeNote: Note | null;
  createNote: () => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleDark: () => void;
  setActiveNote: (note: Note) => void;
  exportNoteAsMarkdown: (note: Note) => void;
  onFocusSearch: () => void;
}

export function buildCommandPaletteActions({
  notes,
  activeNote,
  createNote,
  deleteNote,
  duplicateNote,
  togglePin,
  toggleDark,
  setActiveNote,
  exportNoteAsMarkdown,
  onFocusSearch,
}: BuildActionsParams): CommandPaletteAction[] {
  const actions: CommandPaletteAction[] = [
    {
      id: 'new-note',
      label: 'New Note',
      icon: 'FilePlus',
      shortcut: 'Ctrl+N',
      action: createNote,
      keywords: ['create', 'add', 'new'],
    },
    {
      id: 'toggle-dark',
      label: 'Toggle Dark Mode',
      icon: 'Moon',
      action: toggleDark,
      keywords: ['theme', 'dark', 'light', 'mode'],
    },
    {
      id: 'focus-search',
      label: 'Search Notes',
      icon: 'Search',
      shortcut: 'Ctrl+F',
      action: onFocusSearch,
      keywords: ['find', 'search'],
    },
  ];

  if (activeNote) {
    actions.push(
      {
        id: 'export-current',
        label: 'Export Current Note',
        icon: 'Download',
        action: () => exportNoteAsMarkdown(activeNote),
        keywords: ['export', 'download', 'save', 'markdown', 'md'],
      },
      {
        id: 'toggle-pin-current',
        label: activeNote.pinned ? 'Unpin Current Note' : 'Pin Current Note',
        icon: activeNote.pinned ? 'PinOff' : 'Pin',
        action: () => togglePin(activeNote.id),
        keywords: ['pin', 'unpin', 'favorite', 'favorite'],
      },
      {
        id: 'duplicate-current',
        label: 'Duplicate Current Note',
        icon: 'Copy',
        action: () => duplicateNote(activeNote.id),
        keywords: ['duplicate', 'copy', 'clone'],
      },
      {
        id: 'delete-current',
        label: 'Delete Current Note',
        icon: 'Trash2',
        shortcut: 'Ctrl+Del',
        action: () => deleteNote(activeNote.id),
        keywords: ['remove', 'delete', 'trash'],
      }
    );
  }

  const noteActions: CommandPaletteAction[] = notes.map((note) => ({
    id: `note-${note.id}`,
    label: `Go to: ${note.title}`,
    icon: 'FileText',
    action: () => setActiveNote(note),
    keywords: ['go to', 'open', 'note', ...note.tags],
  }));

  return [...actions, ...noteActions];
}
