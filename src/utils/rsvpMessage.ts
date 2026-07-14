export interface RsvpMessageInput {
  partnerOne: string;
  partnerTwo: string;
  responsible: string;
  attendees: string[];
  dietaryRestrictions?: string;
  /** Código técnico de la invitación (ej: "a7km2"). Nunca revela el tipo de invitación. */
  referenceCode: string;
}

/**
 * Construye el mensaje de confirmación de asistencia para WhatsApp
 * a partir de los datos ingresados en el formulario RSVP.
 * No persiste ni envía datos a ningún servidor: solo compone el texto.
 */
export function buildRsvpMessage(input: RsvpMessageInput): string {
  const { partnerOne, partnerTwo, responsible, attendees, dietaryRestrictions, referenceCode } =
    input;

  const attendeesList = attendees.map((name) => `- ${name}`).join('\n');

  const lines = [
    `Hola ${partnerOne} y ${partnerTwo}.`,
    '',
    'Queremos confirmar nuestra asistencia al casamiento.',
    '',
    'Responsable:',
    responsible,
    '',
    'Cantidad de asistentes:',
    String(attendees.length),
    '',
    'Asistentes:',
    '',
    attendeesList,
  ];

  const trimmedRestrictions = dietaryRestrictions?.trim();
  if (trimmedRestrictions) {
    lines.push('', 'Restricciones alimentarias:', trimmedRestrictions);
  }

  lines.push('', 'Muchas gracias.', '', `Referencia: ${referenceCode.toUpperCase()}`);

  return lines.join('\n');
}
