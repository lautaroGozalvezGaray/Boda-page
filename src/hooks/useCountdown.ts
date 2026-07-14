import { useEffect, useState } from 'react';

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateCountdown(targetISO: string): CountdownValue {
  const diffMs = new Date(targetISO).getTime() - Date.now();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Hook que calcula el tiempo restante hasta una fecha ISO, actualizado cada segundo.
 */
export function useCountdown(targetISO: string): CountdownValue {
  const [value, setValue] = useState<CountdownValue>(() => calculateCountdown(targetISO));

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(calculateCountdown(targetISO));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetISO]);

  return value;
}
