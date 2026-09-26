/**
 * The Order's cipher helpers. Answers are NOT checked here — see validate.ts.
 */

/** Vigenère decryption — the "Mercury Wheel" used by the Order's couriers. */
export const vigenereDecrypt = (cipherText: string, key: string): string => {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return cipherText;
  let j = 0;
  return cipherText
    .toUpperCase()
    .split('')
    .map((ch) => {
      if (ch < 'A' || ch > 'Z') return ch;
      const shift = k.charCodeAt(j % k.length) - 65;
      j++;
      return String.fromCharCode(((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
    })
    .join('');
};

/** Simple English ordinal gematria (A=1 … Z=26) — the Order's favourite parlour trick. */
export const ordinalGematria = (s: string): number =>
  s
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .reduce((sum, ch) => sum + ch.charCodeAt(0) - 64, 0);
