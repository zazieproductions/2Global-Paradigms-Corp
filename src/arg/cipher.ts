// ============================================================================
// ORDO VOCIS PROFUNDAE — cryptographic helpers
// ----------------------------------------------------------------------------
// Answers are never stored in plaintext. Every seal answer is normalised,
// salted and FNV-1a hashed, then compared against the sealed digest.
// (Yes, a determined investigator could brute force these. Thorne would
// approve. But reading the archive is more fun.)
// ============================================================================

const SALT = 'OVP::';

export const normaliseAnswer = (s: string) => s.toUpperCase().replace(/[^A-Z0-9.|]/g, '');

export const sealDigest = (s: string): string => {
  let h = 0x811c9dc5;
  const input = SALT + normaliseAnswer(s);
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
};

export const matchesDigest = (attempt: string, digest: string) => sealDigest(attempt) === digest;

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
export const ordinalGematria = (s: string) =>
  s
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .reduce((sum, ch) => sum + ch.charCodeAt(0) - 64, 0);
