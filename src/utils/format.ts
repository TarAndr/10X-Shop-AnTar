
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Formats a numeric price as USD currency.
 * Example: 99.9 -> "$99.90"
 */
export function formatPrice(price: number): string {
  return usdFormatter.format(price);
}

/**
 * Calculates a product's price after applying a percentage discount.
 * Returns a number rounded to two decimal places.
 * Example: discountedPrice(100, 15) -> 85
 */
export function discountedPrice(
  price: number,
  discountPercentage: number,
): number {
  const result = price * (1 - discountPercentage / 100);

  return Math.round((result + Number.EPSILON) * 100) / 100;
}
