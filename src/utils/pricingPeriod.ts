import type { PricingPeriod } from '@/config/wedding';

/**
 * Devuelve el índice del período vigente según la fecha actual.
 * Si `now` es anterior a todos los períodos, devuelve el primero (0).
 * Si `now` es posterior a todos los períodos, devuelve el último.
 */
export function getCurrentPeriodIndex(periods: PricingPeriod[], now: Date = new Date()): number {
  if (periods.length === 0) return -1;

  const nowTime = now.getTime();

  for (let i = 0; i < periods.length; i += 1) {
    const start = new Date(periods[i].startDate).getTime();
    const end = new Date(periods[i].endDate).getTime();

    if (nowTime < start) {
      // Antes del primer período se muestra el primero; entre períodos se
      // conserva el último iniciado hasta que empiece el siguiente.
      return Math.max(0, i - 1);
    }

    if (nowTime >= start && nowTime <= end) {
      return i;
    }
  }

  return periods.length - 1;
}

/**
 * Devuelve el próximo inicio de período posterior a `now`, o `null` si no quedan cambios.
 */
export function getNextPeriodStart(periods: PricingPeriod[], now: Date = new Date()): Date | null {
  const nowTime = now.getTime();

  for (const period of periods) {
    const start = new Date(period.startDate);

    if (start.getTime() > nowTime) {
      return start;
    }
  }

  return null;
}
