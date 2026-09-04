export function getHouseholdMonogram(name: string, locale: string): string {
  const words = name.trim().split(' ').filter(Boolean);
  const characters =
    words.length > 1
      ? [words[0]?.[0], words[1]?.[0]]
      : [...(words[0] ?? '')].slice(0, 2);

  return characters.filter(Boolean).join('').toLocaleUpperCase(locale);
}
