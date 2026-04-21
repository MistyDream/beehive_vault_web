const PALETTE: readonly [number, number, number][] = [
  [200, 150, 70],
  [70, 130, 160],
  [150, 100, 160],
  [170, 140, 90],
  [110, 150, 110],
  [180, 120, 120],
  [130, 130, 180],
  [140, 170, 100],
  [200, 130, 100],
  [100, 140, 170],
  [160, 110, 150],
  [120, 160, 140],
  [180, 160, 100],
  [110, 160, 180],
];

function hashIndex(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  }
  return Math.abs(hash) % PALETTE.length;
}

function relativeLuminance([r, g, b]: readonly [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function colorFromSymbol(input: string): string {
  const [r, g, b] = PALETTE[hashIndex(input)];
  return `rgb(${r} ${g} ${b})`;
}

/**
 * Picks white or near-black foreground so initials meet WCAG AA (≥4.5:1)
 * against the deterministic palette background.
 */
export function foregroundFromSymbol(input: string): string {
  return relativeLuminance(PALETTE[hashIndex(input)]) > 0.35
    ? 'rgb(26 26 26)'
    : 'rgb(255 255 255)';
}
