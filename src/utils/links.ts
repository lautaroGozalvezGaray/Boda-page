/** Construye un enlace para mostrar un lugar en Google Maps. */
export function buildGoogleMapsPlaceUrl(destination: string): string {
  const encodedDestination = encodeURIComponent(destination);
  return `https://www.google.com/maps/search/?api=1&query=${encodedDestination}`;
}

/** Construye un enlace para mostrar un lugar en Apple Maps. */
export function buildAppleMapsPlaceUrl(destination: string): string {
  const encodedDestination = encodeURIComponent(destination);
  return `https://maps.apple.com/?q=${encodedDestination}`;
}

/** Detecta iPhone/iPad, incluido iPad que se identifica como macOS. */
export function isAppleMobileDevice(userAgent: string, maxTouchPoints = 0): boolean {
  return /iPad|iPhone|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);
}

/**
 * Construye la URL de WhatsApp con número y mensaje precargado.
 */
export function buildWhatsappUrl(phoneNumber: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}
