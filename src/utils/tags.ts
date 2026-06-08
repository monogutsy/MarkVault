export function extractTags(content: string): string[] {
  const noCodeBlocks = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  const matches = noCodeBlocks.match(/(^|\s)#[a-zA-Z0-9_-]+/g);
  if (!matches) return [];
  const tags = matches.map(m => m.trim().substring(1).toLowerCase());
  return Array.from(new Set(tags));
}
