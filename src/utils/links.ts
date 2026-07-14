/**
 * Construye la URL de Google Maps a partir de una query de búsqueda.
 */
export function buildMapsUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}

/**
 * Construye la URL de WhatsApp con número y mensaje precargado.
 */
export function buildWhatsappUrl(phoneNumber: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}
