// Zufall mit Seed. Herkunft: legacy/modulare/core/js/ui.js:9-18 (shuffle, pick mit dem globalen Zufallsgenerator).
// Hier bekommt jede Funktion den Zufallsgenerator als Parameter. So sind Tests reproduzierbar,
// und die Antwort landet nachweisbar nicht immer an derselben Stelle (AGENTS.md: Zufall nie fest).

const TWO_TO_32 = 4294967296;
const MAX_SEED = TWO_TO_32 - 1;

/**
 * Liefert einen Zufallsgenerator (mulberry32). Jeder Aufruf gibt eine Zahl in [0, 1).
 * Gleicher Seed ergibt immer dieselbe Folge. Der Seed muss eine ganze Zahl von 0 bis 2^32-1 sein,
 * sonst würden verschiedene Seeds still auf dieselbe Folge fallen.
 */
export function createRng(seed) {
  if (!Number.isInteger(seed)) throw new TypeError('seed muss eine ganze Zahl sein');
  if (seed < 0 || seed > MAX_SEED) throw new RangeError('seed muss zwischen 0 und 2^32-1 liegen');
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / TWO_TO_32;
  };
}

/** Prüft, dass ein Generator übergeben wurde. Ohne ihn gäbe es keinen stillen Rückfall auf den globalen Zufallsgenerator. */
function requireRng(rng) {
  if (typeof rng !== 'function') throw new TypeError('rng ist Pflicht, z. B. createRng(seed)');
}

/** Zieht einen Index in [0, n). Ein Wert außerhalb [0, 1) bricht ab, statt die Mischung zu verfälschen. */
function drawIndex(rng, n) {
  const r = rng();
  if (!(r >= 0 && r < 1)) throw new RangeError(`rng muss Werte in [0, 1) liefern, erhalten: ${r}`);
  return Math.floor(r * n);
}

/** Mischt eine Kopie der Liste (Fisher-Yates). Die Eingabe bleibt unverändert. */
export function shuffle(list, rng) {
  requireRng(rng);
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = drawIndex(rng, i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Wählt ein Element. Bei leerer Liste gibt es nichts zu wählen, deshalb ein Fehler statt undefined. */
export function pick(list, rng) {
  requireRng(rng);
  if (list.length === 0) throw new RangeError('pick: leere Liste');
  return list[drawIndex(rng, list.length)];
}
