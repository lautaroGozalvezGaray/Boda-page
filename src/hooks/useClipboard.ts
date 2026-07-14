import { useCallback, useState } from 'react';

interface UseClipboardResult {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Hook para copiar texto al portapapeles usando la Clipboard API.
 * Expone un flag `copied` que vuelve a false luego de `resetDelayMs`.
 */
export function useClipboard(resetDelayMs = 2000): UseClipboardResult {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelayMs);
      } catch {
        setCopied(false);
      }
    },
    [resetDelayMs],
  );

  return { copied, copy };
}
