/**
 * Formatea un número como moneda en pesos argentinos.
 * Ej: 90000 -> "$90.000,00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
