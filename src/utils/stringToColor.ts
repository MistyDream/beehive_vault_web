/**
 * Palette of 14 soft, distinguishable colors that read well on both light
 * and dark theme backgrounds. Used for stock avatars where the color is
 * derived deterministically from the stock symbol.
 */
const PALETTE: readonly string[] = [
  '200 150 70',
  '70 130 160',
  '150 100 160',
  '170 140 90',
  '110 150 110',
  '180 120 120',
  '130 130 180',
  '140 170 100',
  '200 130 100',
  '100 140 170',
  '160 110 150',
  '120 160 140',
  '180 160 100',
  '110 160 180',
];

/**
 * Deterministic CSS `rgb(...)` string derived from the input.
 * Uses djb2 hashing modulo the palette size so the same input always
 * yields the same color.
 */
export function colorFromSymbol(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return `rgb(${PALETTE[index]})`;
}
