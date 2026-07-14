interface ScrollHintProps {
  targetId: string;
  label?: string;
}

export default function ScrollHint({ targetId, label = 'Deslizá para ver más' }: ScrollHintProps) {
  function handleClick(): void {
    const target = document.getElementById(targetId);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${label}: ir a la siguiente sección`}
      className="pointer-events-auto fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit items-center gap-2 rounded-full border border-sand-200/60 bg-white/70 px-5 py-2.5 text-xs font-medium tracking-wide text-ink-500 shadow-sm backdrop-blur-sm"
    >
      {label}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-3.5 w-3.5 animate-bounce motion-reduce:animate-none"
        aria-hidden="true"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </button>
  );
}
