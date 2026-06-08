import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note, SortDirection, SortField } from '../types/note';
import { useLocalStorage } from './useLocalStorage';
import { extractTags } from '../utils/tags';

export interface UseNotesReturn {
  notes: Note[];
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortField: SortField;
  setSortField: (f: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (d: SortDirection) => void;
  filterPinned: boolean;
  setFilterPinned: (v: boolean) => void;
  filteredNotes: Note[];
  createNote: () => Note;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => Note;
  togglePin: (id: string) => void;
  importNote: (partial: Partial<Note>) => Note;
}

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useLocalStorage<Note[]>('md-notes-data', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useLocalStorage<SortField>('md-notes-sort-field', 'updatedAt');
  const [sortDirection, setSortDirection] = useLocalStorage<SortDirection>('md-notes-sort-dir', 'desc');
  const [filterPinned, setFilterPinned] = useState(false);

  const activeNote = useMemo(() => {
    if (!activeNoteId) return null;
    return notes.find(n => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  const setActiveNote = (note: Note | null) => {
    setActiveNoteId(note ? note.id : null);
  };

  const createNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    return newNote;
  };

  const updateNote = (id: string, patch: Partial<Note>) => {
    setNotes(prev => prev.map(note => {
      if (note.id !== id) return note;
      const updatedNote = { ...note, ...patch, updatedAt: new Date().toISOString() };
      if (patch.content !== undefined) {
        updatedNote.tags = extractTags(patch.content);
      }
      return updatedNote;
    }));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      const idx = notes.findIndex(n => n.id === id);
      if (notes.length > 1) {
        const nextId = notes[idx === notes.length - 1 ? idx - 1 : idx + 1].id;
        setActiveNoteId(nextId);
      } else {
        setActiveNoteId(null);
      }
    }
  };

  const duplicateNote = (id: string) => {
    const original = notes.find(n => n.id === id);
    if (!original) throw new Error('Note not found');
    const newNote: Note = {
      ...original,
      id: uuidv4(),
      title: `Copy of ${original.title}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id !== id) return note;
      return { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() };
    }));
  };

  const importNote = (partial: Partial<Note>) => {
    const newNote: Note = {
      id: uuidv4(),
      title: partial.title || 'Untitled Note',
      content: partial.content || '',
      tags: extractTags(partial.content || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const filteredNotes = useMemo(() => {
    let result = [...notes];
    
    if (filterPinned) {
      result = result.filter(n => n.pinned);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => ('#' + t).includes(q) || t.includes(q))
      );
    }

    result.sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      let cmp = 0;
      if (sortField === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (sortField === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }

      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [notes, filterPinned, searchQuery, sortField, sortDirection]);

  return {
    notes,
    activeNote,
    setActiveNote,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    filterPinned,
    setFilterPinned,
    filteredNotes,
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    togglePin,
    importNote,
  };
}
