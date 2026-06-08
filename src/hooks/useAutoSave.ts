import { useEffect, useRef } from 'react';

export function useAutoSave(
  value: string,
  onSave: (value: string) => void,
  delay: number = 500
): void {
  const latestValue = useRef(value);

  useEffect(() => {
    latestValue.current = value;
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSave(latestValue.current);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, onSave]);
}
