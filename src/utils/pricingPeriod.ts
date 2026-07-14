import type { PricingPeriod } from '@/config/wedding';

/**
 * Devuelve el índice del período vigente según la fecha actual.
 * Si `now` es anterior a todos los períodos, devuelve el primero (0).
 * Si `now` es posterior a todos los períodos, devuelve el último.
 */
export function getCurrentPeriodIndex(periods: PricingPeriod[], now: Date = new Date()): number {
  const nowTime = now.getTime();

  for (let i = 0; i < periods.length; i += 1) {
    const start = new Date(periods[i].startDate).getTime();
    const end = new Date(periods[i].endDate).getTime();

    if (nowTime < start) {
      return 0;
    }

    if (nowTime >= start && nowTime <= end) {
      return i;
    }
  }

  return periods.length - 1;
}
