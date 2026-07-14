const ARGENTINA_TIMEZONE = 'America/Argentina/Cordoba';

/**
 * Formatea una fecha ISO a un string legible en español, zona horaria Argentina.
 * Ej: "sábado, 14 de noviembre de 2026"
 */
export function formatLongDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: ARGENTINA_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formatea una fecha ISO a un string corto. Ej: "14/11/2026"
 */
export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: ARGENTINA_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export { ARGENTINA_TIMEZONE };
