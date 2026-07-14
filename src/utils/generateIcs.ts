export interface IcsEventInput {
  title: string;
  description: string;
  location: string;
  /** Fecha/hora de inicio en ISO 8601 */
  startISO: string;
  /** Duración del evento en horas */
  durationHours?: number;
}

function toIcsDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Genera el contenido de un archivo .ics para agregar el evento al calendario.
 */
export function generateIcsContent(event: IcsEventInput): string {
  const start = new Date(event.startISO);
  const end = new Date(start.getTime() + (event.durationHours ?? 4) * 60 * 60 * 1000);
  const uid = `wedding-${start.getTime()}@invitacion`;

  const escapeText = (text: string): string =>
    text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitacion Digital//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Dispara la descarga de un archivo .ics en el navegador.
 */
export function downloadIcsFile(event: IcsEventInput, filename = 'evento.ics'): void {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
