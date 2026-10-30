// Fragen aus Aufgaben in data.items: das Gerüst für jede App, deren Stoff im Inhalt steht (Sprachen, Sachfächer).
// Eine neue App dieser Art braucht nur noch logic.js mit poolApp(), keine eigenen Erzeuger.
// Jeder Aufruf von createPool hat seinen eigenen Stand. Zwei Apps können denselben Code mit anderem Inhalt nutzen.
// Die Reihenfolge der Zufallsaufrufe ist fest, gleicher Seed liefert dieselben Fragen (Dual-Execution, analysis/modulare).
//
// Eine Aufgabe: { q, s?, kind?, a, wrong[], why, label?, skill?, accept? }
//   q       Frage oder Anweisung (reiner Text)
//   s       optional: ein Satz, der unter der Frage steht
//   kind    'gap' = Lückensatz. In s steht ___ als Lücke. Dann sind Auswahl und Eintippen möglich
//   a       richtige Antwort, wrong: falsche Antworten (bei 'gap' genügt eine, sonst mindestens drei)
//   skill   optional: was die Aufgabe übt, für den Fehler-Abruf (runde/src/abruf.js). Fehlt es, gilt skillOf
//   accept  optional: weitere richtige Eingaben beim Eintippen
import { pick, shuffle, trackOf } from '../../helfer/index.js';
import { choiceQuestion, option, typedQuestion } from './questions.js';
import { esc, normalise } from './text.js';

export const isGap = (item) => item.kind === 'gap';
const gapText = (s) => s.split('___').map(esc).join('{{blank}}');
// Das richtige Wort fett in der Lücke. Nur <b> ist im Inhaltsmarkup erlaubt (SEC-003).
const filled = (s, word) => s.split('___').map(esc).join(`<b>${esc(word)}</b>`);

/** Was eine Aufgabe übt. Ohne Angabe im Inhalt: Wort oder eigenes Etikett, sonst die Aufgabe selbst, damit genau sie wiederkommt. */
export const skillOf = (item) => item.skill || item.w || item.label || item.s || item.q;

/**
 * Erzeuger für ein Inhaltspaket.
 * @param {{ data: object, manifest: object }} paket
 * @param {object} [options]
 * @param {string} [options.typedLabel]  Etikett der Eingabefragen
 * @param {boolean} [options.withTrack]  Fragen zeigen den Lernstrang ihrer Seite
 */
export function createPool({ data, manifest }, { typedLabel = 'Schreibe das fehlende Wort', withTrack = false } = {}) {
  const units = manifest.units;
  const items = data.items;
  const tracks = manifest.tracks || {};
  const owner = new Map(units.flatMap((u) => (items[u.id] || []).map((item) => [item, u])));
  const chipFor = (item) => (withTrack ? trackOf(tracks, owner.get(item)) || null : undefined);

  /** Auswahlfrage. Lückensätze zeigen alle falschen Antworten, sonst höchstens drei (RULE-223). */
  function choice(item, rng) {
    const label = item.label || (isGap(item) ? 'Lücke füllen' : 'Wähle die richtige Antwort');
    if (isGap(item)) {
      const choices = [item.a, ...item.wrong].map((w) => option(w, esc(w), w));
      return choiceQuestion({
        label, skill: skillOf(item), chip: chipFor(item), prompt: gapText(item.s), sub: item.q, answer: item.a, choices,
        reveal: filled(item.s, item.a), why: item.why, rng
      });
    }
    return choiceQuestion({
      label, skill: skillOf(item), chip: chipFor(item), prompt: esc(item.q) + (item.s ? `<br><em>${esc(item.s)}</em>` : ''),
      answer: item.a, choices: [item.a, ...shuffle(item.wrong, rng).slice(0, 3)], why: item.why, rng,
      optionsLayout: item.a.length > 40 ? 'list' : undefined
    });
  }

  /** Eingabefrage. Gilt nur, was nach normalise() gleich ist (Groß/Klein und Leerzeichen zählen nicht). */
  function typed(item) {
    const accepted = [item.a, ...(item.accept || [])].map(normalise);
    return typedQuestion({
      label: typedLabel, skill: skillOf(item), chip: chipFor(item), prompt: gapText(item.s), sub: item.q, answer: item.a,
      check: (input) => (accepted.includes(normalise(input)) ? 'ok' : 'bad'), placeholder: 'Wort eintippen',
      reveal: filled(item.s, item.a), why: item.why
    });
  }

  const pickItems = (unitId, count, rng) => {
    const pool = shuffle(items[unitId], rng);
    return Array.from({ length: count }, (_, i) => pool[i % pool.length]);
  };

  /** 8 Fragen einer Seite, jede dritte Lücke zum Eintippen. */
  const lessonRound = (unit, rng) => pickItems(unit.id, 8, rng)
    .map((item, i) => (i % 3 === 2 && isGap(item) ? typed(item) : choice(item, rng)));

  const anyItem = (rng) => pick(items[pick(units, rng).id], rng);
  const quickRound = (rng) => Array.from({ length: 5 }, () => choice(anyItem(rng), rng));
  const blitzQuestion = (rng) => choice(anyItem(rng), rng);
  const bossRound = (rng) => Array.from({ length: 12 }, (_, i) => {
    const item = pick(items[units[i % units.length].id], rng);
    return i % 4 === 3 && isGap(item) ? typed(item) : choice(item, rng);
  });

  return { units, items, choice, typed, pickItems, lessonRound, quickRound, bossRound, blitzQuestion };
}

/** Macht aus Erzeugern den Teil des App-Vertrags, den eine Runde braucht. */
export const logicOf = (b) => ({
  rounds: { lesson: b.lessonRound, quick: b.quickRound, boss: b.bossRound },
  blitz: b.blitzQuestion
});

/** Eine fertige App aus Inhalt. diagrams und Theory bleiben Sache der App, der Rest geht an createPool. */
export function poolApp({ diagrams, Theory, ...options } = {}) {
  const pool = (paket) => createPool(paket, options);
  return { diagrams, Theory, pool, create: (paket) => logicOf(pool(paket)) };
}
