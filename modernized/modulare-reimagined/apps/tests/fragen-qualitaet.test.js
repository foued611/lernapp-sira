// Prüft den Fragentext aller Apps mit Aufgabenlisten (data.items). Eine Frage muss für sich verständlich sein:
// Wer sie liest, muss wissen, was gefragt ist, und darf die Antwort nicht schon im Text finden.
// Entstanden aus Fragen wie "Wähle die richtige Zahl" (ohne Zahlwort) oder "Ende" (Antwort: 2015).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalise } from '../../runde/index.js';
import { LIVE } from '../../seiten/registry.js';
import { APPS, paketVon } from './laden.js';

// Bei diesen Fragen stecken die Unterschiede in den Antworten, derselbe Text mehrmals ist also in Ordnung.
const AUSWAHL_AUS_OPTIONEN = /^Welche[rs]? (Satz|Wort|Form)\b/;

// Sagt nichts darüber, was gesucht ist. Mit einem Satz in s oder als Lücke ist die Aufgabe dagegen klar.
const LEERE_ANWEISUNG = /^Wähle (die|das|den|der) richtig/;

const alsWort = (wort) => new RegExp(`(^|[^\\p{L}])${wort.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'iu');
const enthält = (text, wort) => alsWort(wort).test(text);
const gleicheAntwort = (a, b) => normalise(a) === normalise(b);

const apps = APPS
  .filter((entry) => entry.status === LIVE)
  .map((entry) => ({ id: entry.id, items: paketVon(entry.id).data.items }))
  .filter((app) => app.items);

for (const { id, items } of apps) {
  const alle = Object.entries(items).flatMap(([unit, list]) => list.map((item, i) => ({ ...item, wo: `${id}/${unit}#${i}` })));
  const lücken = alle.filter((item) => item.kind === 'gap');
  const fragen = alle.filter((item) => item.kind !== 'gap');

  test(`FRAGE ${id}: jede Auswahlfrage ist eine vollständige Frage oder Anweisung`, () => {
    const fehler = fragen
      .filter((item) => !/[?:.…]["“”»]?$/.test(item.q.trim()) || item.q.trim().split(/\s+/).length < 3
        || (!item.s && LEERE_ANWEISUNG.test(item.q)))
      .map((item) => `${item.wo}: ${item.q}`);
    assert.deepEqual(fehler, []);
  });

  test(`FRAGE ${id}: gleicher Fragetext hat auch dieselbe Antwort`, () => {
    const texte = new Map();
    for (const item of alle) {
      if (AUSWAHL_AUS_OPTIONEN.test(item.q) && item.kind !== 'gap') continue;
      const text = normalise(item.kind === 'gap' ? item.s : `${item.q} ${item.s || ''}`);
      if (!texte.has(text)) texte.set(text, []);
      texte.get(text).push(item);
    }
    const fehler = [...texte.values()]
      .filter((list) => list.some((item) => !gleicheAntwort(item.a, list[0].a)))
      .map((list) => list.map((item) => item.wo).join(', '));
    assert.deepEqual(fehler, []);
  });

  test(`FRAGE ${id}: der Hinweis zur Lücke verrät die Antwort nicht`, () => {
    const fehler = lücken
      // Nennt der Hinweis auch falsche Optionen ("tout, toute, tous, toutes"), verrät er nichts.
      .filter((item) => item.a.length >= 3 && !item.q.includes(' oder ') && enthält(item.q, item.a)
        && !item.wrong.some((wrong) => enthält(item.q, wrong)))
      .map((item) => `${item.wo}: ${item.q} -> ${item.a}`);
    assert.deepEqual(fehler, []);
  });

  // Das Etikett steht in der Auswahl über der Frage. "chs" bei Fuchs/Fuks wäre die Lösung im Titel.
  test(`FRAGE ${id}: das Etikett verrät die Antwort nicht`, () => {
    const nennt = (text, teil) => normalise(text).includes(teil);
    const fehler = lücken
      .filter((item) => item.label)
      .filter((item) => {
        const teil = normalise(item.label).replace(/^-/, '');
        return nennt(item.a, teil) && !item.wrong.some((wrong) => nennt(wrong, teil));
      })
      .map((item) => `${item.wo}: ${item.label} -> ${item.a}`);
    assert.deepEqual(fehler, []);
  });

  // Ohne Etikett ist der Fragetext die Kategorie (skillOf). Gleicher Text hieße: Der Fehler-Abruf hält eine fremde Aufgabe für die verfehlte.
  test(`FRAGE ${id}: gleicher Fragetext auf einer Seite hat eine eigene Kategorie`, () => {
    const fehler = Object.entries(items).flatMap(([unit, list]) => {
      const ohne = list.filter((item) => !item.skill && !item.w && !item.label && !item.s).map((item) => item.q);
      return [...new Set(ohne.filter((q, i) => ohne.indexOf(q) !== i))].map((q) => `${id}/${unit}: ${q}`);
    });
    assert.deepEqual(fehler, []);
  });

  test(`FRAGE ${id}: die Antwort steht nicht schon im Satz oder in der Frage`, () => {
    const fehler = alle
      .filter((item) => item.a.length >= 4 && enthält(`${item.kind === 'gap' ? '' : item.q} ${item.s || ''}`.trim(), item.a))
      .map((item) => `${item.wo}: ${item.kind === 'gap' ? item.s : item.q} -> ${item.a}`);
    assert.deepEqual(fehler, []);
  });

  test(`FRAGE ${id}: Optionen sind verschieden und die Erklärung fehlt nie`, () => {
    const fehler = alle
      .filter((item) => new Set([item.a, ...item.wrong]).size !== item.wrong.length + 1 || !item.why.trim())
      .map((item) => item.wo);
    assert.deepEqual(fehler, []);
  });

  test(`FRAGE ${id}: level ist 1, 2 oder 3 und nennt, was geübt wird`, () => {
    const fehler = alle
      .filter((item) => item.level !== undefined && (![1, 2, 3].includes(item.level) || !item.skill?.trim()))
      .map((item) => item.wo);
    assert.deepEqual(fehler, []);
  });
}
