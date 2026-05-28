// Hieroglyph ↔ English transliteration data.
//
// Sources / references (open data, public Gardiner sign list):
//   - JSesh sign list (https://github.com/rosmord/jsesh)
//   - hieroglyphs-js by Morphir (https://github.com/morphir/hieroglyphs)
//   - Wikipedia: Transliteration of Ancient Egyptian, Gardiner's sign list
//   - Unicode 5.2+ Egyptian Hieroglyphs block (U+13000–U+1342F)
//
// Egyptian script did not write most vowels, so English ↔ hieroglyph
// translation is necessarily an approximate phonetic transliteration
// (this is what real Egyptologists do via the "Manuel de Codage").

export interface SignEntry {
  /** Unicode hieroglyph */
  glyph: string;
  /** Gardiner code, e.g. "G1" */
  gardiner: string;
  /** Egyptological transliteration value (e.g. "A", "i", "nfr") */
  translit: string;
  /** Short English meaning / gloss */
  meaning: string;
}

/** Single-consonant (uniliteral) signs — the "Egyptian alphabet". */
export const UNILITERALS: SignEntry[] = [
  { glyph: '𓄿', gardiner: 'G1',  translit: 'A', meaning: 'Egyptian vulture (ʾ / glottal stop)' },
  { glyph: '𓇋', gardiner: 'M17', translit: 'i', meaning: 'reed leaf (i / j)' },
  { glyph: '𓇌', gardiner: 'M17A',translit: 'y', meaning: 'double reed (y)' },
  { glyph: '𓏭', gardiner: 'Z4',  translit: 'y', meaning: 'two strokes (y)' },
  { glyph: '𓂝', gardiner: 'D36', translit: 'a', meaning: 'forearm (ʿ / ayin)' },
  { glyph: '𓅱', gardiner: 'G43', translit: 'w', meaning: 'quail chick (w / u)' },
  { glyph: '𓏲', gardiner: 'Z7',  translit: 'w', meaning: 'cursive w' },
  { glyph: '𓃀', gardiner: 'D58', translit: 'b', meaning: 'foot (b)' },
  { glyph: '𓊪', gardiner: 'Q3',  translit: 'p', meaning: 'stool (p)' },
  { glyph: '𓆑', gardiner: 'I9',  translit: 'f', meaning: 'horned viper (f)' },
  { glyph: '𓅓', gardiner: 'G17', translit: 'm', meaning: 'owl (m)' },
  { glyph: '𓈖', gardiner: 'N35', translit: 'n', meaning: 'water ripple (n)' },
  { glyph: '𓂋', gardiner: 'D21', translit: 'r', meaning: 'mouth (r)' },
  { glyph: '𓉔', gardiner: 'O4',  translit: 'h', meaning: 'reed shelter (h)' },
  { glyph: '𓎛', gardiner: 'V28', translit: 'H', meaning: 'twisted wick (emphatic ḥ)' },
  { glyph: '𓐍', gardiner: 'Aa1', translit: 'x', meaning: 'placenta (kh / ḫ)' },
  { glyph: '𓄡', gardiner: 'F32', translit: 'X', meaning: 'animal belly (ẖ, soft kh)' },
  { glyph: '𓋴', gardiner: 'S29', translit: 's', meaning: 'folded cloth (s)' },
  { glyph: '𓊃', gardiner: 'O34', translit: 'z', meaning: 'door bolt (z / s)' },
  { glyph: '𓈙', gardiner: 'N37', translit: 'S', meaning: 'pool (sh / š)' },
  { glyph: '𓈎', gardiner: 'N29', translit: 'q', meaning: 'hill slope (q / ḳ)' },
  { glyph: '𓎡', gardiner: 'V31', translit: 'k', meaning: 'basket (k)' },
  { glyph: '𓎼', gardiner: 'W11', translit: 'g', meaning: 'jar stand (g)' },
  { glyph: '𓏏', gardiner: 'X1',  translit: 't', meaning: 'bread loaf (t)' },
  { glyph: '𓍿', gardiner: 'V13', translit: 'T', meaning: 'tether (tj / ṯ, ch)' },
  { glyph: '𓂧', gardiner: 'D46', translit: 'd', meaning: 'hand (d)' },
  { glyph: '𓆓', gardiner: 'I10', translit: 'D', meaning: 'cobra (dj / ḏ, j)' },
];

/** Common multi-consonant signs frequently seen in real inscriptions. */
export const MULTILITERALS: SignEntry[] = [
  { glyph: '𓋹', gardiner: 'S34', translit: 'anx',  meaning: 'ankh – life' },
  { glyph: '𓊽', gardiner: 'R11', translit: 'Dd',   meaning: 'djed – stability' },
  { glyph: '𓌀', gardiner: 'S42', translit: 'sxm',  meaning: 'sekhem – power' },
  { glyph: '𓎟', gardiner: 'V30', translit: 'nb',   meaning: 'neb – lord, all' },
  { glyph: '𓄤', gardiner: 'F35', translit: 'nfr',  meaning: 'nefer – beautiful, good' },
  { glyph: '𓇳', gardiner: 'N5',  translit: 'ra',   meaning: 'ra – sun, day' },
  { glyph: '𓂀', gardiner: 'D10', translit: 'wDAt', meaning: 'wedjat – eye of Horus' },
  { glyph: '𓊵', gardiner: 'R4',  translit: 'Htp',  meaning: 'hetep – offering, peace' },
  { glyph: '𓁹', gardiner: 'D4',  translit: 'ir',   meaning: 'iri – to do, eye' },
  { glyph: '𓐙', gardiner: 'Aa11',translit: 'mAa',  meaning: 'maa – true, justice' },
  { glyph: '𓍑', gardiner: 'U28', translit: 'DA',   meaning: 'dja – fire drill' },
  { glyph: '𓎺', gardiner: 'W19', translit: 'mi',   meaning: 'mi – milk jug, like' },
  { glyph: '𓏤', gardiner: 'Z1',  translit: '1',    meaning: 'single stroke / one' },
  { glyph: '𓏥', gardiner: 'Z2',  translit: 'pl',   meaning: 'plural strokes' },
  { glyph: '𓅂', gardiner: 'G25', translit: 'Ax',   meaning: 'akh – spirit, glorious' },
  { glyph: '𓊨', gardiner: 'Q1',  translit: 'st',   meaning: 'seat / throne (Isis)' },
  { glyph: '𓉐', gardiner: 'O1',  translit: 'pr',   meaning: 'house, to go out' },
  { glyph: '𓇏', gardiner: 'N16', translit: 'tA',   meaning: 'land' },
  { glyph: '𓈗', gardiner: 'N35A',translit: 'mw',   meaning: 'water' },
  { glyph: '𓇼', gardiner: 'N14', translit: 'sbA',  meaning: 'star' },
];

/** Egyptian numerals (powers of ten). */
export const NUMERALS: { value: number; glyph: string; name: string }[] = [
  { value: 1_000_000, glyph: '𓁨', name: 'Heh god – million' },
  { value: 100_000,   glyph: '𓆐', name: 'tadpole – hundred thousand' },
  { value: 10_000,    glyph: '𓂭', name: 'finger – ten thousand' },
  { value: 1_000,     glyph: '𓆼', name: 'lotus – thousand' },
  { value: 100,       glyph: '𓍢', name: 'coiled rope – hundred' },
  { value: 10,        glyph: '𓎆', name: 'cattle hobble – ten' },
  { value: 1,         glyph: '𓏤', name: 'single stroke – one' },
];

const ALL_SIGNS: SignEntry[] = [...MULTILITERALS, ...UNILITERALS];

/** Glyph → entry index (for hiero → English). */
const GLYPH_INDEX = new Map<string, SignEntry>(
  ALL_SIGNS.map((s) => [s.glyph, s]),
);

/**
 * Convert a Latin transliteration token (e.g. "nfr", "ra", "k")
 * into the longest matching sequence of hieroglyphs.
 */
function tokenToGlyphs(token: string): { glyphs: string; signs: SignEntry[] } {
  let i = 0;
  let glyphs = '';
  const signs: SignEntry[] = [];
  while (i < token.length) {
    let matched: SignEntry | null = null;
    // Try longest-first match against multiliterals (case-sensitive),
    // then fall back to a single uniliteral.
    for (let len = Math.min(5, token.length - i); len >= 1; len--) {
      const slice = token.slice(i, i + len);
      const found =
        MULTILITERALS.find((s) => s.translit === slice) ||
        (len === 1
          ? UNILITERALS.find((s) => s.translit === slice)
          : undefined);
      if (found) {
        matched = found;
        i += len;
        break;
      }
    }
    if (!matched) {
      // Skip unknown character but keep it visible.
      glyphs += token[i];
      i += 1;
      continue;
    }
    glyphs += matched.glyph;
    signs.push(matched);
  }
  return { glyphs, signs };
}

/**
 * Convert plain English (Latin letters) to an approximate transliteration,
 * then to hieroglyphs. This mirrors the standard scholarly approach:
 * Egyptian wrote consonants only, with a handful of weak consonants for vowels.
 */
export function englishToTranslit(input: string): string {
  let s = input.toLowerCase();
  // Common digraphs first (longest match wins).
  const digraphs: [RegExp, string][] = [
    [/sh/g, 'S'],
    [/ch/g, 'T'],
    [/kh/g, 'x'],
    [/th/g, 't'],
    [/ph/g, 'f'],
    [/qu/g, 'kw'],
    [/ck/g, 'k'],
    [/dj|j/g, 'D'],
    [/c/g, 'k'],
    [/x/g, 'ks'],
    [/v/g, 'f'],
    [/z/g, 'z'],
  ];
  for (const [re, rep] of digraphs) s = s.replace(re, rep);
  // Vowels → Egyptian weak consonants (approximation).
  s = s
    .replace(/a/g, 'A')
    .replace(/e/g, 'i')
    .replace(/o/g, 'w')
    .replace(/u/g, 'w');
  return s;
}

export interface TranslationResult {
  translit: string;
  hieroglyphs: string;
  perWord: { word: string; translit: string; glyphs: string; signs: SignEntry[] }[];
}

/** English → Hieroglyphs (phonetic transliteration). */
export function translateEnglishToHiero(text: string): TranslationResult {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const perWord = words.map((word) => {
    const translit = englishToTranslit(word.replace(/[^A-Za-z]/g, ''));
    const { glyphs, signs } = tokenToGlyphs(translit);
    return { word, translit, glyphs, signs };
  });
  return {
    translit: perWord.map((w) => w.translit).join(' '),
    hieroglyphs: perWord.map((w) => w.glyphs).join(' '),
    perWord,
  };
}

export interface HieroReadingPart {
  glyph: string;
  translit: string;
  meaning: string;
  gardiner: string;
  known: boolean;
}

/** Hieroglyphs → transliteration + English gloss. */
export function translateHieroToEnglish(text: string): {
  parts: HieroReadingPart[];
  translit: string;
  gloss: string;
} {
  const parts: HieroReadingPart[] = [];
  // Iterate Unicode code points (hieroglyphs are surrogate pairs).
  for (const ch of Array.from(text)) {
    if (/\s/.test(ch)) {
      parts.push({ glyph: ' ', translit: ' ', meaning: '', gardiner: '', known: true });
      continue;
    }
    const entry = GLYPH_INDEX.get(ch);
    if (entry) {
      parts.push({
        glyph: ch,
        translit: entry.translit,
        meaning: entry.meaning,
        gardiner: entry.gardiner,
        known: true,
      });
    } else {
      parts.push({
        glyph: ch,
        translit: '?',
        meaning: 'unknown sign',
        gardiner: '',
        known: false,
      });
    }
  }
  const translit = parts.map((p) => p.translit).join('').replace(/\s+/g, ' ').trim();
  const gloss = parts
    .filter((p) => p.known && p.meaning)
    .map((p) => p.meaning.split(' – ')[1] || p.meaning.split(' (')[0])
    .join(' · ');
  return { parts, translit, gloss };
}

export const TRANSLATOR_SIGN_COUNT = ALL_SIGNS.length;
