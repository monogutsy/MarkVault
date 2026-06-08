import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useDarkMode(): [boolean, () => void] {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDark, setIsDark] = useLocalStorage<boolean>('md-notes-dark-mode', prefersDark);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  return [isDark, toggle];
}
