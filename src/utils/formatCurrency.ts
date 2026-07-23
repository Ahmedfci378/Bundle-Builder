/**
 * Formats a numeric amount as a localized currency string.
 * Every price rendered anywhere in the app goes through this function —
 * a currency or locale change is a one-line edit here, never a
 * find-and-replace across components.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
