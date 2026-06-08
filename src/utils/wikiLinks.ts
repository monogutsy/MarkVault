export function resolveWikiLinks(content: string, noteIds: Record<string, string>): string {
  return content.replace(/\[\[(.*?)\]\]/g, (match, title) => {
    return `[${title}](#wiki-${encodeURIComponent(title)})`;
  });
}
