import { useEffect } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrlOrCmd: boolean;
  shift?: boolean;
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlOrCmd, shift, handler }) => {
        const isCtrlOrCmd = e.metaKey || e.ctrlKey;
        const mappedKey = key.toLowerCase();
        
        let match = e.key.toLowerCase() === mappedKey;
        if (key === 'delete' || key === 'del') {
            match = e.key.toLowerCase() === 'delete' || e.key.toLowerCase() === 'backspace';
        }

        if (
          isCtrlOrCmd === ctrlOrCmd &&
          (shift === undefined || e.shiftKey === shift) &&
          match
        ) {
          e.preventDefault();
          handler();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
