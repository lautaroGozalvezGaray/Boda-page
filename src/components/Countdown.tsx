import { useCountdown } from '@/hooks/useCountdown';

interface CountdownProps {
  targetISO: string;
}

interface UnitProps {
  value: number;
  label: string;
}

function Unit({ value, label }: UnitProps) {
  return (
    <div className="card-surface flex flex-col items-center gap-1 px-3 py-4 sm:px-4 sm:py-5">
      <span className="font-serif text-3xl font-medium tabular-nums text-blush-700 sm:text-5xl">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="section-eyebrow text-[0.65rem]">{label}</span>
    </div>
  );
}

export default function Countdown({ targetISO }: CountdownProps) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetISO);

  if (isPast) {
    return (
      <p className="text-center font-serif text-xl text-blush-700" role="status">
        ¡Ya estamos celebrando!
      </p>
    );
  }

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-4"
      role="timer"
      aria-live="polite"
      aria-label="Cuenta regresiva para la boda"
    >
      <Unit value={days} label="Días" />
      <Unit value={hours} label="Horas" />
      <Unit value={minutes} label="Min" />
      <Unit value={seconds} label="Seg" />
    </div>
  );
}
