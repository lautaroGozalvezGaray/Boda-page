export interface RsvpMessageInput {
  partnerOne: string;
  partnerTwo: string;
  attendees: string[];
  dietaryRestrictions?: string;
  /** Código técnico de la invitación (ej: "a7km2"). */
  referenceCode: string;
}

/** Construye el mensaje de confirmación para WhatsApp sin enviar datos a un servidor. */
export function buildRsvpMessage(input: RsvpMessageInput): string {
  const { partnerOne, partnerTwo, attendees, dietaryRestrictions, referenceCode } = input;
  const attendeesList = attendees.map((name) => `• ${name}`).join('\n');
  const restrictions = dietaryRestrictions?.trim() || 'Ninguna';

  return [
    `Hola ${partnerOne} y ${partnerTwo}.`,
    '',
    'Queremos confirmar nuestra asistencia al casamiento.',
    '',
    'Asistentes:',
    '',
    attendeesList,
    '',
    'Cantidad total:',
    '',
    String(attendees.length),
    '',
    'Restricciones alimentarias:',
    '',
    restrictions,
    '',
    'Muchas gracias.',
    '',
    `Referencia: ${referenceCode.toUpperCase()}`,
  ].join('\n');
}
