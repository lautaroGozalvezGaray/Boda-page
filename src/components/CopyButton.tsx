import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  successMessage?: string;
  /** 'solid' para acciones destacadas, 'ghost' para acciones discretas (ej. secciones no bancarias) */
  variant?: 'solid' | 'ghost';
}

const VARIANT_CLASSES: Record<'solid' | 'ghost', string> = {
  solid:
    'bg-blush-600 text-white shadow-sm hover:-translate-y-0.5 hover:bg-blush-700 hover:shadow-md active:translate-y-0 active:bg-blush-800',
  ghost:
    'border border-blush-200 bg-transparent text-blush-700 hover:border-blush-400 hover:bg-blush-50',
};

export default function CopyButton({
  textToCopy,
  label = 'Copiar alias',
  successMessage = 'Copiado.',
  variant = 'solid',
}: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => copy(textToCopy)}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${VARIANT_CLASSES[variant]}`}
        aria-label={label}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
        {label}
      </button>
      {copied && (
        <span role="status" aria-live="polite" className="text-sm text-blush-700">
          {successMessage}
        </span>
      )}
    </div>
  );
}
