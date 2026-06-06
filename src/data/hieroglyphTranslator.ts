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

export interface DictionaryEntry {
  english: string[];      // Keywords/synonyms that map to this word/phrase (lowercase)
  hiero: string;          // Actual hieroglyphic spelling
  translit: string;       // Egyptological transliteration (e.g. "ꜥnḫ", "nfr")
  pronunciation: string;  // Approximate readable pronunciation (e.g. "ankh", "nefer")
  meaning: string;        // Meaning/definition
  type: 'word' | 'phrase';
  notes?: string;         // Historical or grammatical note
}

export const DICTIONARY: DictionaryEntry[] = [
  // PHRASES
  {
    english: ['life prosperity health', 'life prosperity and health', 'ankh wedja seneb'],
    hiero: '𓋹𓍘𓎛',
    translit: 'ꜥnḫ wḏꜣ snb',
    pronunciation: 'ankh wedja seneb',
    meaning: 'Life, Prosperity, and Health (standard blessing formula after names or titles)',
    type: 'phrase',
    notes: 'Often abbreviated in hieroglyphic inscriptions as 𓋹𓍘𓎛.'
  },
  {
    english: ['lord of life'],
    hiero: '𓎟𓋹',
    translit: 'nb ꜥnḫ',
    pronunciation: 'neb ankh',
    meaning: 'Lord of Life',
    type: 'phrase',
    notes: 'Common epithet of Osiris, Ra, or the pharaoh.'
  },
  {
    english: ['lord of the two lands'],
    hiero: '𓎟𓇿𓇿',
    translit: 'nb tꜣwy',
    pronunciation: 'neb tawy',
    meaning: 'Lord of the Two Lands (Upper and Lower Egypt)',
    type: 'phrase',
    notes: 'The standard title of the pharaoh, indicating sovereign control over Egypt.'
  },
  {
    english: ['king of upper and lower egypt', 'nsw-bity'],
    hiero: '𓇓𓏏𓆤',
    translit: 'nsw-bity',
    pronunciation: 'nisut-bity',
    meaning: 'King of Upper and Lower Egypt (He of the Sedge and Bee)',
    type: 'phrase',
    notes: 'The prenomen royal title which links the King with the sacred plants/insects of the two regions.'
  },
  {
    english: ['son of ra', 'son of re'],
    hiero: '𓅭𓇳',
    translit: 'sꜣ rꜥ',
    pronunciation: 'sa ra',
    meaning: 'Son of Ra',
    type: 'phrase',
    notes: 'The nomen title of the pharaoh, signifying divine parentage.'
  },
  {
    english: ['true of voice', 'justified', 'ma kheru'],
    hiero: '𓐙𓊤',
    translit: 'mꜣꜥ-ḫrw',
    pronunciation: 'ma-kheru',
    meaning: 'True of Voice / Justified (epithet given to the deceased who passed the judgment)',
    type: 'phrase',
    notes: 'Equivalent to "Rest in Peace" - meaning the deceased\'s heart was weighed and found truthful.'
  },
  {
    english: ['given life forever', 'given life for ever'],
    hiero: '𓏙𓋹𓆓𓏏𓇿',
    translit: 'di ꜥnḫ ḏt',
    pronunciation: 'di ankh djet',
    meaning: 'Given Life Forever',
    type: 'phrase',
    notes: 'A formula frequently appended to royal names in cartouches.'
  },
  {
    english: ['great god'],
    hiero: '𓊹𓅨',
    translit: 'nṯr ꜥꜣ',
    pronunciation: 'netjer aa',
    meaning: 'Great God',
    type: 'phrase',
    notes: 'Typically refers to Osiris, Ra, or the deceased king.'
  },
  {
    english: ['beloved of amun', 'beloved of amen'],
    hiero: '𓌻𓇋𓇋𓇋𓏠𓈖𓀭',
    translit: 'mry imn',
    pronunciation: 'mery amen',
    meaning: 'Beloved of Amun',
    type: 'phrase',
    notes: 'Common epithet incorporated into royal names like Ramesses (Meryamun).'
  },
  {
    english: ['house of gold'],
    hiero: '𓉐𓋞',
    translit: 'pr nbw',
    pronunciation: 'per nebu',
    meaning: 'House of Gold (sculpture workshop or sarcophagus chamber)',
    type: 'phrase',
    notes: 'Term used for the inner chambers of tombs or temples where gold statues were crafted/kept.'
  },
  {
    english: ['lord of abydos'],
    hiero: '𓎟𓊌𓏤',
    translit: 'nb ꜣbḏw',
    pronunciation: 'neb abdjw',
    meaning: 'Lord of Abydos (Osiris)',
    type: 'phrase',
    notes: 'Abydos was the primary cult center of the god Osiris.'
  },
  {
    english: ['ruler of heliopolis'],
    hiero: '𓋾𓉺𓏤',
    translit: 'ḥqꜣ iwnw',
    pronunciation: 'heqa iunu',
    meaning: 'Ruler of Heliopolis',
    type: 'phrase',
    notes: 'Heliopolis (Iunu) was the ancient city of solar worship.'
  },

  // WORDS
  {
    english: ['life', 'live', 'living'],
    hiero: '𓋹𓈖𓐍',
    translit: 'ꜥnḫ',
    pronunciation: 'ankh',
    meaning: 'Life / to live / living',
    type: 'word',
    notes: 'The mirror-like sign 𓋹 represents a sandal strap or tie, representing life.'
  },
  {
    english: ['beautiful', 'good', 'perfect'],
    hiero: '𓄤𓆑𓂋',
    translit: 'nfr',
    pronunciation: 'nefer',
    meaning: 'Beautiful, good, pleasant, perfect',
    type: 'word',
    notes: 'Depicts a heart and windpipe (𓄣), representing physical wellness and beauty.'
  },
  {
    english: ['sun', 'day'],
    hiero: '𓇳𓏤',
    translit: 'rꜥ',
    pronunciation: 'ra',
    meaning: 'Sun / day',
    type: 'word',
    notes: 'The circle with a dot represents the sun disk, and the stroke represents an ideogram.'
  },
  {
    english: ['peace', 'offering', 'contentment', 'satisfied'],
    hiero: '𓊵𓏏𓊪',
    translit: 'ḥtp',
    pronunciation: 'hetep',
    meaning: 'Peace, offering, contentment, to be pleased',
    type: 'word',
    notes: 'Depicts a loaf of bread on a reed mat (𓊵), the ultimate symbol of peace and offering.'
  },
  {
    english: ['love', 'beloved', 'to love'],
    hiero: '𓌻𓂋𓇋',
    translit: 'mr / mry',
    pronunciation: 'meri',
    meaning: 'To love / beloved',
    type: 'word',
    notes: 'The sign 𓌻 depicts a hoe or digging tool, which phonetically spells out "mr".'
  },
  {
    english: ['lord', 'master', 'owner'],
    hiero: '𓎟',
    translit: 'nb',
    pronunciation: 'neb',
    meaning: 'Lord, master, owner',
    type: 'word',
    notes: 'A wicker basket (𓎟) meaning "lord" or "all/every".'
  },
  {
    english: ['lady', 'mistress'],
    hiero: '𓎟𓏏',
    translit: 'nbt',
    pronunciation: 'nebet',
    meaning: 'Lady, mistress (feminine form of neb)',
    type: 'word'
  },
  {
    english: ['all', 'every'],
    hiero: '𓎟',
    translit: 'nb',
    pronunciation: 'neb',
    meaning: 'All, every, each',
    type: 'word'
  },
  {
    english: ['god', 'deity'],
    hiero: '𓊹',
    translit: 'nṯr',
    pronunciation: 'netjer',
    meaning: 'God, deity, divine',
    type: 'word',
    notes: 'The sign 𓊹 represents a cloth wrapped on a pole, symbol of divinity.'
  },
  {
    english: ['goddess'],
    hiero: '𓊹𓏏𓁐',
    translit: 'nṯrt',
    pronunciation: 'netjeret',
    meaning: 'Goddess',
    type: 'word'
  },
  {
    english: ['king', 'monarch'],
    hiero: '𓇓𓏏𓈖',
    translit: 'nsw',
    pronunciation: 'nisut',
    meaning: 'King, ruler',
    type: 'word',
    notes: 'Represented by the sedge plant (𓇓), symbol of Upper Egypt.'
  },
  {
    english: ['ruler', 'prince'],
    hiero: '𓋾𓂝',
    translit: 'ḥqꜣ',
    pronunciation: 'heqa',
    meaning: 'Ruler, prince, leader',
    type: 'word',
    notes: 'Depicts a crook scepter (𓋾), the symbol of governance and ruling.'
  },
  {
    english: ['scribe', 'writer'],
    hiero: '𓏟',
    translit: 'sš',
    pronunciation: 'sesh',
    meaning: 'Scribe / writer / to write',
    type: 'word',
    notes: 'Shows a palette with ink wells, a water jar, and a pen case (𓏟).'
  },
  {
    english: ['write', 'writing'],
    hiero: '𓏟',
    translit: 'sš',
    pronunciation: 'sesh',
    meaning: 'To write / writing',
    type: 'word'
  },
  {
    english: ['house', 'estate'],
    hiero: '𓉐𓏤',
    translit: 'pr',
    pronunciation: 'per',
    meaning: 'House, estate',
    type: 'word',
    notes: 'Depicts a simple house floor plan (𓉐).'
  },
  {
    english: ['temple'],
    hiero: '𓉡𓊹',
    translit: 'ḥwt-nṯr',
    pronunciation: 'hut-netjer',
    meaning: 'Temple (literally: mansion of the god)',
    type: 'word'
  },
  {
    english: ['soul', 'personality'],
    hiero: '𓅟',
    translit: 'bꜣ',
    pronunciation: 'ba',
    meaning: 'Ba (the traveling soul, represented as a human-headed bird)',
    type: 'word'
  },
  {
    english: ['spirit', 'life force'],
    hiero: '𓂓',
    translit: 'kꜣ',
    pronunciation: 'ka',
    meaning: 'Ka (the spiritual double or life-force, represented by upraised arms)',
    type: 'word'
  },
  {
    english: ['glorified spirit', 'ancestor'],
    hiero: '𓅜',
    translit: 'ꜣḫ',
    pronunciation: 'akh',
    meaning: 'Akh (the transfigured, glowing spirit of the deceased)',
    type: 'word'
  },
  {
    english: ['heart', 'mind', 'will'],
    hiero: '𓄣𓏤',
    translit: 'ib',
    pronunciation: 'ib',
    meaning: 'Heart, mind, seat of thoughts and feelings',
    type: 'word',
    notes: 'The physical heart (𓄣) was believed to be the center of intelligence and character.'
  },
  {
    english: ['truth', 'justice', 'balance', 'cosmic order'],
    hiero: '𓐙𓏏𓁣',
    translit: 'mꜣꜥt',
    pronunciation: 'maat',
    meaning: 'Truth, justice, cosmic balance and order',
    type: 'word',
    notes: 'Represented by a pedestal of justice (𓐙) and the goddess Maat with her ostrich feather.'
  },
  {
    english: ['gold'],
    hiero: '𓋞𓏤',
    translit: 'nbw',
    pronunciation: 'nebu',
    meaning: 'Gold (the flesh of the gods)',
    type: 'word',
    notes: 'Gold was believed to be indestructible and represented divine skin.'
  },
  {
    english: ['silver'],
    hiero: '𓋝𓏤',
    translit: 'ḥḏ',
    pronunciation: 'hedj',
    meaning: 'Silver (the bones of the gods)',
    type: 'word',
    notes: 'Silver was rarer than gold in early Egypt and represented divine bones.'
  },
  {
    english: ['great', 'large', 'elder'],
    hiero: '𓅨',
    translit: 'wr',
    pronunciation: 'wer',
    meaning: 'Great, large, senior',
    type: 'word',
    notes: 'The swallow sign 𓅨 stands for "great".'
  },
  {
    english: ['water'],
    hiero: '𓈗',
    translit: 'mw',
    pronunciation: 'mu',
    meaning: 'Water',
    type: 'word',
    notes: 'Depicts three water ripples (𓈗).'
  },
  {
    english: ['land', 'earth', 'country'],
    hiero: '𓇏𓏤',
    translit: 'tꜣ',
    pronunciation: 'ta',
    meaning: 'Land, earth, ground',
    type: 'word'
  },
  {
    english: ['star'],
    hiero: '𓇼',
    translit: 'sbꜣ',
    pronunciation: 'seba',
    meaning: 'Star / to teach',
    type: 'word',
    notes: 'The star glyph 𓇼 was also used in words for learning or instructing.'
  },
  {
    english: ['sky', 'heaven'],
    hiero: '𓇯',
    translit: 'pt',
    pronunciation: 'pet',
    meaning: 'Sky, heaven',
    type: 'word',
    notes: 'Depicts the vault of the sky 𓇯.'
  },
  {
    english: ['eternity', 'eternal'],
    hiero: '𓆎𓎛𓎛𓇳',
    translit: 'nḥḥ',
    pronunciation: 'neheh',
    meaning: 'Eternity (associated with cyclical time, like the sun\'s daily cycle)',
    type: 'word',
    notes: 'Often contrasted with djet (static eternity).'
  },
  {
    english: ['infinite time', 'duration', 'everlastingness'],
    hiero: '𓆓𓏏𓇿',
    translit: 'ḏt',
    pronunciation: 'djet',
    meaning: 'Eternity / everlastingness (associated with static time, like the afterlife)',
    type: 'word'
  },
  {
    english: ['name'],
    hiero: '𓂋𓈖𓏤',
    translit: 'rn',
    pronunciation: 'ren',
    meaning: 'Name',
    type: 'word',
    notes: 'One of the five crucial parts of the soul; erasing a name caused complete non-existence.'
  },
  {
    english: ['cat'],
    hiero: '𓅓𓇋𓏲𓃠',
    translit: 'miw',
    pronunciation: 'miu',
    meaning: 'Cat',
    type: 'word',
    notes: 'Onomatopoetic word, sounding like "meow".'
  },
  {
    english: ['dog'],
    hiero: '𓋿𓃡',
    translit: 'ṯsm',
    pronunciation: 'tsem',
    meaning: 'Dog (typically sighthounds/tesem)',
    type: 'word'
  },
  {
    english: ['mother'],
    hiero: '𓅐',
    translit: 'mwt',
    pronunciation: 'mut',
    meaning: 'Mother',
    type: 'word',
    notes: 'Written with the vulture sign, sacred to the mother goddess Mut.'
  },
  {
    english: ['father'],
    hiero: '𓇋𓏏𓆑',
    translit: 'it',
    pronunciation: 'it',
    meaning: 'Father',
    type: 'word'
  },
  {
    english: ['son'],
    hiero: '𓅭',
    translit: 'sꜣ',
    pronunciation: 'sa',
    meaning: 'Son',
    type: 'word',
    notes: 'Written with the pintail duck sign.'
  },
  {
    english: ['daughter'],
    hiero: '𓅭𓏏',
    translit: 'sꜣt',
    pronunciation: 'sat',
    meaning: 'Daughter',
    type: 'word'
  },
  {
    english: ['brother'],
    hiero: '𓈖𓃒',
    translit: 'sn',
    pronunciation: 'sen',
    meaning: 'Brother',
    type: 'word'
  },
  {
    english: ['sister'],
    hiero: '𓈖𓏏𓁐',
    translit: 'snt',
    pronunciation: 'senet',
    meaning: 'Sister',
    type: 'word'
  },
  {
    english: ['man', 'person'],
    hiero: '𓀀',
    translit: 'z / s',
    pronunciation: 'se',
    meaning: 'Man / person',
    type: 'word'
  },
  {
    english: ['woman'],
    hiero: '𓁐',
    translit: 'st',
    pronunciation: 'set',
    meaning: 'Woman',
    type: 'word'
  },
  {
    english: ['child', 'youth'],
    hiero: '𓀐',
    translit: 'ẖrd',
    pronunciation: 'khered',
    meaning: 'Child / youth',
    type: 'word'
  },
  {
    english: ['strength', 'power', 'mighty'],
    hiero: '𓂧𓆱',
    translit: 'wsr',
    pronunciation: 'weser',
    meaning: 'Strength, power, mighty',
    type: 'word'
  },
  {
    english: ['stability', 'endurance', 'djed'],
    hiero: '𓊽',
    translit: 'ḏd',
    pronunciation: 'djed',
    meaning: 'Stability, endurance, duration',
    type: 'word',
    notes: 'Depicted as a pillar representing the backbone of Osiris.'
  },
  {
    english: ['health', 'wellness'],
    hiero: '𓋴𓈖𓃀',
    translit: 'snb',
    pronunciation: 'seneb',
    meaning: 'Health, wellness',
    type: 'word'
  },
  {
    english: ['city', 'town'],
    hiero: '𓊖𓏤',
    translit: 'niwt',
    pronunciation: 'niwt',
    meaning: 'City, town, settlement',
    type: 'word',
    notes: 'The circle with crossing roads represents a walled city crossroads.'
  },
  {
    english: ['soldier', 'army'],
    hiero: '𓀜',
    translit: 'mšꜥ',
    pronunciation: 'mesha',
    meaning: 'Soldier / army / expedition',
    type: 'word'
  },
  {
    english: ['voice', 'sound'],
    hiero: '𓊤𓏤',
    translit: 'ḫrw',
    pronunciation: 'kheru',
    meaning: 'Voice, sound',
    type: 'word'
  },
  {
    english: ['hear', 'listen', 'obey'],
    hiero: '𓄓𓈖𓅓',
    translit: 'sḏm',
    pronunciation: 'sedjem',
    meaning: 'To hear, listen, obey',
    type: 'word'
  },
  {
    english: ['breath', 'wind', 'air'],
    hiero: '𓊴𓏤',
    translit: 'ṯꜣw',
    pronunciation: 'tjau',
    meaning: 'Breath, wind, air',
    type: 'word',
    notes: 'Represented by a sail filled with wind.'
  },
  {
    english: ['west', 'western'],
    hiero: '𓊿',
    translit: 'imnt',
    pronunciation: 'iment',
    meaning: 'West, western (associated with the realm of the dead)',
    type: 'word'
  },
  {
    english: ['east', 'eastern'],
    hiero: '𓋁',
    translit: 'iꜣbt',
    pronunciation: 'iabet',
    meaning: 'East, eastern',
    type: 'word'
  },
  {
    english: ['south', 'southern'],
    hiero: '𓄿𓏜',
    translit: 'rsy',
    pronunciation: 'resy',
    meaning: 'South, southern',
    type: 'word'
  },
  {
    english: ['north', 'northern'],
    hiero: '𓎕',
    translit: 'mḥty',
    pronunciation: 'mehty',
    meaning: 'North, northern',
    type: 'word'
  },
  {
    english: ['horus'],
    hiero: '𓅃',
    translit: 'ḥrw',
    pronunciation: 'heru',
    meaning: 'Horus (The Sky God, patron of kingship)',
    type: 'word'
  },
  {
    english: ['osiris'],
    hiero: '𓊨𓁹',
    translit: 'wsir',
    pronunciation: 'wesir',
    meaning: 'Osiris (God of the underworld, rebirth, and agriculture)',
    type: 'word'
  },
  {
    english: ['isis'],
    hiero: '𓊨𓏏𓁐',
    translit: 'ꜣst',
    pronunciation: 'aset',
    meaning: 'Isis (Goddess of magic, motherhood, and healing)',
    type: 'word'
  },
  {
    english: ['anubis'],
    hiero: '𓇋𓈖𓊪𓅱𓃥',
    translit: 'inpw',
    pronunciation: 'anubis',
    meaning: 'Anubis (God of mummification and guide to the afterlife)',
    type: 'word'
  },
  {
    english: ['amun', 'amen'],
    hiero: '𓇋𓏠𓈖𓀭',
    translit: 'imn',
    pronunciation: 'amun',
    meaning: 'Amun (The Hidden One, King of the Gods)',
    type: 'word'
  },
  {
    english: ['thoth'],
    hiero: '𓲓𓏏𓏭𓀭',
    translit: 'ḏḥwty',
    pronunciation: 'djehuty',
    meaning: 'Thoth (God of wisdom, writing, and the moon)',
    type: 'word'
  }
];

export interface TranslateWordResult {
  word: string;
  glyphs: string;
  translit: string;
  pronunciation: string;
  meaning: string;
  type: 'semantic-phrase' | 'semantic-word' | 'phonetic';
  notes?: string;
  signs?: SignEntry[];
}

export interface TranslationResult {
  translit: string;
  hieroglyphs: string;
  perWord: TranslateWordResult[];
}

/** English → Hieroglyphs (phonetic transliteration). */
export function translateEnglishToHiero(text: string): TranslationResult {
  // Clean punctuation but keep spaces
  const cleanedText = text.replace(/[,.!?;:]/g, ' ');
  const words = cleanedText.trim().split(/\s+/).filter(Boolean);
  
  const perWord: TranslateWordResult[] = [];
  let i = 0;
  
  while (i < words.length) {
    let matched = false;
    
    // Try matching phrases/words of descending length, from max possible words down to 1
    for (let len = Math.min(8, words.length - i); len >= 1; len--) {
      const slice = words.slice(i, i + len).join(' ').toLowerCase();
      
      // Look up in DICTIONARY
      const found = DICTIONARY.find(entry => 
        entry.english.includes(slice)
      );
      
      if (found) {
        perWord.push({
          word: words.slice(i, i + len).join(' '),
          glyphs: found.hiero,
          translit: found.translit,
          pronunciation: found.pronunciation,
          meaning: found.meaning,
          type: found.type === 'phrase' ? 'semantic-phrase' : 'semantic-word',
          notes: found.notes
        });
        i += len;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      // Fallback: translate the single word phonetically
      const word = words[i];
      const translit = englishToTranslit(word.replace(/[^A-Za-z]/g, ''));
      const { glyphs, signs } = tokenToGlyphs(translit);
      
      perWord.push({
        word: word,
        glyphs: glyphs,
        translit: translit,
        pronunciation: word,
        meaning: 'Phonetic Spelling (Approximation)',
        type: 'phonetic',
        notes: 'This word is not in the Middle Egyptian dictionary. It was spelled phonetically using the uniliteral/multiliteral signs.',
        signs: signs
      });
      i += 1;
    }
  }
  
  return {
    translit: perWord.map(w => w.translit).join(' '),
    hieroglyphs: perWord.map(w => w.glyphs).join(' '),
    perWord
  };
}

export interface HieroReadingPart {
  glyph: string;
  translit: string;
  meaning: string;
  gardiner: string;
  known: boolean;
  type?: 'semantic-phrase' | 'semantic-word' | 'sign';
  notes?: string;
}

/** Hieroglyphs → transliteration + English gloss. */
export function translateHieroToEnglish(text: string): {
  parts: HieroReadingPart[];
  translit: string;
  gloss: string;
} {
  const chars = Array.from(text);
  const parts: HieroReadingPart[] = [];
  let i = 0;
  
  while (i < chars.length) {
    const char = chars[i];
    if (/\s/.test(char)) {
      parts.push({ glyph: ' ', translit: ' ', meaning: '', gardiner: '', known: true, type: 'sign' });
      i += 1;
      continue;
    }
    
    let matched = false;
    
    // Try matching dictionary entries (longest hiero string first)
    // We sort DICTIONARY entries by hiero length descending
    const sortedDict = [...DICTIONARY].sort((a, b) => b.hiero.length - a.hiero.length);
    
    for (const entry of sortedDict) {
      const entryLen = Array.from(entry.hiero).length;
      if (i + entryLen <= chars.length) {
        const slice = chars.slice(i, i + entryLen).join('');
        if (slice === entry.hiero) {
          parts.push({
            glyph: entry.hiero,
            translit: entry.translit,
            meaning: entry.meaning,
            gardiner: '', // Dictionary entries might contain multiple signs so Gardiner code is omitted or composite
            known: true,
            type: entry.type === 'phrase' ? 'semantic-phrase' : 'semantic-word',
            notes: entry.notes
          });
          i += entryLen;
          matched = true;
          break;
        }
      }
    }
    
    if (!matched) {
      // Fallback to individual sign lookup
      const entry = GLYPH_INDEX.get(char);
      if (entry) {
        parts.push({
          glyph: char,
          translit: entry.translit,
          meaning: entry.meaning,
          gardiner: entry.gardiner,
          known: true,
          type: 'sign'
        });
      } else {
        parts.push({
          glyph: char,
          translit: '?',
          meaning: 'unknown sign',
          gardiner: '',
          known: false
        });
      }
      i += 1;
    }
  }
  
  const translit = parts
    .map(p => p.translit)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
    
  const gloss = parts
    .filter(p => p.known && p.meaning)
    .map(p => {
      if (p.type === 'semantic-phrase' || p.type === 'semantic-word') {
        // Use full meaning for semantically parsed chunks
        return p.meaning;
      }
      // For signs, extract simple gloss
      return p.meaning.split(' – ')[1] || p.meaning.split(' (')[0];
    })
    .join(' · ');
    
  return { parts, translit, gloss };
}

export const TRANSLATOR_SIGN_COUNT = ALL_SIGNS.length;
