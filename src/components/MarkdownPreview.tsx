import { memo, useMemo, Component, ReactNode, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-rust';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { Note } from '../types/note';
import { resolveWikiLinks } from '../utils/wikiLinks';

interface PreviewProps {
  content: string;
  notes: Note[];
  onWikiLinkClick?: (noteId: string) => void;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm max-w-lg mx-auto mt-8 border border-red-100 dark:border-red-900/50">
          <p className="font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Preview unavailable
          </p>
          <p className="mt-2 text-xs opacity-80">There was an error rendering this markdown. Switch to Editor view to continue editing.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function CodeBlock({ children, className, inline }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!inline && lang) {
    let highlighted = codeString;
    if (Prism.languages[lang]) {
      highlighted = Prism.highlight(codeString, Prism.languages[lang], lang);
    } else {
      highlighted = Prism.highlight(codeString, Prism.languages.markup || {}, lang);
    }

    return (
      <div className="relative group rounded-xl overflow-hidden glass-panel my-6 border-white/10 font-mono">
        <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{lang}</span>
          <button
            onClick={handleCopy}
            className="text-[10px] uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-2 py-1 rounded"
            title="Copy code"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className={`language-${lang} p-5 overflow-x-auto text-sm leading-relaxed my-0! bg-transparent!`} style={{ margin: 0, backgroundColor: 'transparent' }}>
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    );
  }

  return (
    <code className={className}>
      {children}
    </code>
  );
}

const MarkdownPreviewInner = memo(({ content, notes, onWikiLinkClick }: PreviewProps) => {
  const noteIndex = useMemo(() => {
    return Object.fromEntries(notes.map(n => [n.title, n.id]));
  }, [notes]);

  const resolvedContent = useMemo(() => {
    return resolveWikiLinks(content, noteIndex);
  }, [content, noteIndex]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLAnchorElement) {
        const href = e.target.getAttribute('href');
        if (href?.startsWith('#wiki-') && onWikiLinkClick) {
          e.preventDefault();
          const targetTitle = decodeURIComponent(href.replace('#wiki-', ''));
          const targetId = noteIndex[targetTitle];
          if (targetId) onWikiLinkClick(targetId);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [noteIndex, onWikiLinkClick]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          a({ href, children, ...props }) {
            if (href?.startsWith('#wiki-')) {
              return <a href={href} className="text-violet-600 dark:text-violet-400 font-medium" {...props}>{children}</a>;
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 align-baseline text-violet-600 dark:text-violet-400" {...props}>
                {children}
                <ExternalLink className="w-3 h-3 inline translate-y-[1px]" />
              </a>
            );
          },
          input({ type, checked, ...props }) {
            if (type === 'checkbox') {
              return <input type="checkbox" checked={checked} readOnly className="accent-violet-600 rounded-sm w-3.5 h-3.5 mr-2" {...props} />;
            }
            return <input type={type} {...props} />;
          },
          img({ src, alt, ...props }) {
            return <img src={src} alt={alt} loading="lazy" className="max-w-full rounded-lg border bordersrc/components/CommandPalette.tsx200 dark:bordersrc/components/CommandPalette.tsx800" {...props} />;
          }
        }}
      >
        {resolvedContent}
      </ReactMarkdown>
  );
});
MarkdownPreviewInner.displayName = 'MarkdownPreviewInner';

export function MarkdownPreview(props: PreviewProps) {
  return (
    <ErrorBoundary>
      <div className="h-full overflow-y-auto px-6 md:px-12 py-8 md:py-10 pb-24 font-sans bg-black/10">
        <div className="prose prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3 prose-h2:mb-6 prose-p:text-zinc-300 prose-p:leading-relaxed prose-strong:text-white">
          <MarkdownPreviewInner {...props} />
        </div>
      </div>
    </ErrorBoundary>
  )
}
