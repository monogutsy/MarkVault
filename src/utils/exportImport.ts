import { Note } from '../types/note';

export function exportNoteAsMarkdown(note: Note): void {
  const content = `# ${note.title}\n\n${note.content}`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const filename = note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.md';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importMarkdownFile(file: File): Promise<Partial<Note>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let content = (e.target?.result as string) || '';
      let title = file.name.replace(/\.md$/i, '');
      
      const match = content.match(/^#\s+(.+)$/m);
      if (match && match[1]) {
        title = match[1].trim();
        content = content.replace(/^#\s+(.+)\n*/m, '').trim();
      }

      resolve({ title, content });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
