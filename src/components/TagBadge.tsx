interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
}

export function TagBadge({ tag, onClick }: TagBadgeProps) {
  return (
    <span
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border transition-colors ${onClick ? 'cursor-pointer hover:-translate-y-[1px]' : ''} bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20`}
    >
      #{tag}
    </span>
  );
}
