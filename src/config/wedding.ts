/**
 * Fuente única de verdad para toda la información de la boda.
 * Editá este archivo para actualizar nombres, fecha, lugar, pagos, textos, etc.
 * Ningún componente debe tener datos hardcodeados: todo sale de acá.
 */

export interface PricingPeriod {
  /** Texto del período, ej: "Julio - Agosto" */
  label: string;
  /** Inicio del período, ISO 8601 con zona horaria de Argentina */
  startDate: string;
  /** Fin del período (inclusive), ISO 8601 con zona horaria de Argentina */
  endDate: string;
  /** Monto para la variante de valores reducidos, en pesos argentinos (número, sin formatear) */
  reducedAmount: number;
  /** Monto para la variante de valores generales, en pesos argentinos (número, sin formatear) */
  generalAmount: number;
}

/**
 * Identificador interno de variante de precios. NUNCA debe renderizarse en la UI,
 * mensajes, metadatos ni URLs. Solo se usa para elegir qué columna de `PricingPeriod` mostrar.
 */
export type EntryType = 'reduced' | 'general';

export interface InvitationVariant {
  /** Código de la invitación, usado en la URL /invitacion/[codigo] */
  code: string;
  /** Si se debe mostrar la sección de pago (tabla, datos bancarios) */
  showPayment: boolean;
  /**
   * Variante de precios interna (solo usada para elegir la columna de montos).
   * Jamás se renderiza como texto en la UI.
   */
  entryType?: EntryType;
}

export interface WeddingConfig {
  /** Nombre de la pareja, en el orden a mostrar */
  coupleNames: {
    partnerOne: string;
    partnerTwo: string;
  };
  /** Fecha y hora única y oficial del evento, en formato ISO 8601 con zona horaria de Argentina */
  eventDateISO: string;
  /** Título del único horario del evento, ej: "Recepción y Ceremonia Civil" */
  eventTimeTitle: string;
  /** Horario único visible del evento, ej: "21:30 hs" */
  eventTimeLabel: string;
  venue: {
    name: string;
    city: string;
    /** Dirección exacta. */
    address: string;
    /** Destino completo usado para las indicaciones de Maps. */
    mapsDestination: string;
  };
  whatsapp: {
    /**
     * Número en formato internacional para wa.me: 54 (Argentina) + 9 + código de área sin el 0 + número sin el 15.
     * Ej: número local 0351 15-9952937 -> 5493515952937
     */
    phoneNumber: string;
  };
  payment: {
    bank: string;
    accountHolder: string;
    cuit: string;
    alias: string;
    cbu: string;
    accountNumber: string;
    pricingPeriods: PricingPeriod[];
  };
  /** Sección de regalos, independiente del pago de entrada. Se muestra en las 3 variantes. */
  gifts: {
    message: string;
  };
  dressCode: {
    title: string;
    description: string;
  };
  cover: {
    kicker: string;
    ctaLabel: string;
  };
  photo: {
    /** Ruta de la imagen principal. Reemplazar cuando exista la foto real. */
    src: string | null;
    alt: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

/**
 * Datos compartidos por todas las variantes de invitación.
 * PLACEHOLDER: reemplazar la foto real cuando esté disponible.
 */
const baseConfig: WeddingConfig = {
  coupleNames: {
    partnerOne: 'Belén',
    partnerTwo: 'Lautaro',
  },
  eventDateISO: '2027-02-27T21:30:00-03:00',
  eventTimeTitle: 'Recepción y Ceremonia Civil',
  eventTimeLabel: '21:30 hs',
  venue: {
    name: 'Espacio Nikkei',
    city: 'Córdoba Capital',
    address: 'Celso Barrios 3500, X5000 Córdoba',
    mapsDestination: 'Espacio Nikkei, Celso Barrios 3500, Córdoba, Argentina',
  },
  whatsapp: {
    phoneNumber: '5493515952937',
  },
  payment: {
    bank: 'Brubank',
    accountHolder: 'LAUTARO GOZALVEZ GARAY',
    cuit: '20394464180',
    alias: 'boda.lautaro.belen',
    cbu: '1430001713020019030012',
    accountNumber: '1302001903001',
    pricingPeriods: [
      {
        label: 'Julio - Agosto',
        startDate: '2026-07-01T00:00:00-03:00',
        endDate: '2026-08-31T23:59:59-03:00',
        reducedAmount: 90000,
        generalAmount: 127000,
      },
      {
        label: 'Septiembre - Octubre',
        startDate: '2026-09-01T00:00:00-03:00',
        endDate: '2026-10-31T23:59:59-03:00',
        reducedAmount: 95500,
        generalAmount: 135000,
      },
      {
        label: 'Noviembre - Diciembre',
        startDate: '2026-11-01T00:00:00-03:00',
        endDate: '2026-12-31T23:59:59-03:00',
        reducedAmount: 101000,
        generalAmount: 143000,
      },
      {
        label: 'Enero - Febrero',
        startDate: '2027-01-01T00:00:00-03:00',
        endDate: '2027-02-27T23:59:59-03:00',
        reducedAmount: 110000,
        generalAmount: 150000,
      },
    ],
  },
  gifts: {
    message:
      'Su presencia es el mejor regalo que podemos recibir.\n\nSi además desean hacernos un obsequio para acompañarnos en esta nueva etapa, pueden hacerlo utilizando los siguientes datos de transferencia.',
  },
  dressCode: {
    title: 'Dress code',
    description: 'Elegante sport',
  },
  cover: {
    kicker: 'Nos casamos',
    ctaLabel: 'Ver invitación',
  },
  photo: {
    src: null,
    alt: 'Fotografía de la pareja (próximamente)',
  },
  seo: {
    title: 'Belén & Lautaro — Nos casamos',
    description: 'Acompañanos a celebrar el casamiento de Belén y Lautaro. Toda la información del evento acá.',
    ogImage: '/og-image.svg',
  },
};

/**
 * Variantes de invitación por código. Mismo evento, distinto contenido de pago.
 * Para agregar una nueva variante: sumar una entrada acá con un nuevo código único.
 */
export const invitationVariants: Record<string, InvitationVariant> = {
  a7km2: { code: 'a7km2', showPayment: false },
  r9px4: { code: 'r9px4', showPayment: true, entryType: 'reduced' },
  t3vn8: { code: 't3vn8', showPayment: true, entryType: 'general' },
};

export function getVariantByCode(code: string): InvitationVariant | undefined {
  return invitationVariants[code];
}

export function getAllVariantCodes(): string[] {
  return Object.keys(invitationVariants);
}

export const weddingConfig: WeddingConfig = baseConfig;
