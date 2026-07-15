import { useEffect, useRef, useState } from 'react';

const AUDIO_SOURCE = '/music/nuestra-cancion.mp3';
const INITIAL_VOLUME = 0.3;

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const audio = new Audio(AUDIO_SOURCE);
    audio.volume = INITIAL_VOLUME;
    audio.loop = true;
    audio.preload = 'metadata';

    const handleError = (): void => {
      setIsPlaying(false);
      setErrorMessage('No pudimos reproducir la música en este momento.');
    };

    audio.addEventListener('error', handleError);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, []);

  async function togglePlayback(): Promise<void> {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setErrorMessage('');
      if (!hasStartedRef.current) {
        audio.currentTime = 0;
      }
      await audio.play();
      hasStartedRef.current = true;
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setErrorMessage('No pudimos reproducir la música en este momento.');
    }
  }

  const label = isPlaying ? 'Pausar música' : 'Escuchar nuestra canción';

  return (
    <div className="music-player pointer-events-none fixed right-[max(1rem,env(safe-area-inset-right))] z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => void togglePlayback()}
        aria-label={label}
        aria-pressed={isPlaying}
        title={label}
        className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-sand-200/70 bg-white/80 text-ink-600 shadow-[0_4px_12px_rgba(79,72,63,0.07)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blush-300 hover:bg-blush-50/80 hover:text-blush-700 hover:shadow-md active:translate-y-0"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-9 w-9 animate-pulse motion-reduce:animate-none"
            aria-hidden="true"
          >
            <path d="M6.5 5.5h3v13h-3zm8 0h3v13h-3z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-9 w-9"
            aria-hidden="true"
          >
            <path d="m9 6 9 6-9 6V6Z" fill="currentColor" stroke="none" />
          </svg>
        )}
      </button>
      {errorMessage && (
        <span role="status" aria-live="polite" className="sr-only">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
