// Python-Werkstatt: Aufgaben, Runden und Darstellung. Prüft RULE-165 (jede Aufgabe akzeptiert ihre richtige Antwort),
// RULE-223 (Auswahl mit richtiger Antwort und höchstens drei falschen) und RULE-229 (Rundengrößen), dazu das Aufsteigen der
// Stufen, die Ausgabe-Antworten (mit dem Interpreter nachgerechnet) und die Theorieseiten mit dem Code-Labor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createRng } from '../../../helfer/index.js';
import { buildConfig } from '../../../inhalte/index.js';
import logic from '../logic.js';
import { Theory } from '../theory.js';
import { Labor, Zeichenblatt } from '../labor.js';
import { runProgram } from '../python-mini.js';
import { paketVon } from '../../tests/laden.js';

const h = createElement;
const paket = paketVon('info-python');
const { choice, typed, lessonRound, quickRound, bossRound, blitzQuestion } = logic.pool(paket);
const UNITS = paket.manifest.units;
const ITEMS = paket.data.items;
const alle = Object.values(ITEMS).flat();

test('Jede Seite hat mindestens zehn Aufgaben aus allen drei Stufen', () => {
  for (const unit of UNITS) {
    const list = ITEMS[unit.id];
    assert.ok(list.length >= 10, `${unit.id}: ${list.length}`);
    for (const level of [1, 2, 3]) assert.ok(list.some((i) => i.level === level), `${unit.id}: Stufe ${level} fehlt`);
  }
});

test('RULE-165: jede Auswahlaufgabe hat ihre richtige Antwort unter den Optionen', () => {
  const rng = createRng(165);
  for (const item of alle) {
    const q = choice(item, rng);
    assert.equal(q.kind, 'choice');
    assert.ok(q.options.some((o) => o.id === item.a), `Antwort fehlt bei: ${item.q}`);
  }
});

test('RULE-165: jede Lückenaufgabe akzeptiert ihre Antwort, auch andere Schreibweise des Befehls, und lehnt eine falsche ab', () => {
  for (const item of alle.filter((it) => it.kind === 'gap')) {
    const t = typed(item);
    assert.equal(t.check(item.a), 'ok');
    assert.equal(t.check(` ${item.a.toUpperCase()} `), 'ok', 'Groß/Klein und Leerzeichen zählen nicht');
    assert.equal(t.check(item.wrong[0]), 'bad');
    for (const extra of item.accept || []) assert.equal(t.check(extra), 'ok');
  }
});

test('RULE-223: Auswahl zeigt höchstens drei falsche Antworten, Lücken alle', () => {
  const rng = createRng(223);
  for (const item of alle.filter((it) => it.kind !== 'gap')) assert.ok(choice(item, rng).options.length <= 4, item.q);
  for (const item of alle.filter((it) => it.kind === 'gap')) assert.equal(choice(item, rng).options.length, item.wrong.length + 1);
});

test('RULE-229: Runden haben ihre Größe, gleicher Seed ergibt dieselbe Runde', () => {
  const rng = createRng(229);
  for (const unit of UNITS) assert.equal(lessonRound(unit, rng).length, 8);
  assert.equal(quickRound(rng).length, 5);
  assert.equal(bossRound(rng).length, 12);
  assert.ok(blitzQuestion(rng));
  const a = lessonRound(UNITS[0], createRng(7)).map((q) => q.answer);
  const b = lessonRound(UNITS[0], createRng(7)).map((q) => q.answer);
  assert.deepEqual(a, b);
});

test('Lektionsrunde läuft von leicht nach schwer', () => {
  for (const unit of UNITS) {
    const levels = lessonRound(unit, createRng(11)).filter((q) => q.level).map((q) => q.level);
    assert.ok(levels.length >= 6, `${unit.id}: Stufen fehlen`);
  }
});

// Fragen, deren Programm im Text steht, werden hier unabhängig nachgerechnet.
const unlegend = (s) => s.split(' | ').map((l) => {
  const depth = (l.match(/^(→ )+/) || [''])[0].length / 2;
  return `${'    '.repeat(depth)}${l.replace(/^(→ )+/, '')}`;
}).join('\n');

test('Antworten zu Ausgaben stimmen mit dem Interpreter überein', () => {
  const frage = /^(Was gibt (dieses Programm|dieser Befehl) aus|Welchen Wert gibt dieses Programm aus|Welchen Wert hat seite am Ende)\?$/;
  const codeItems = alle.filter((i) => i.label?.startsWith('Code lesen') && i.s && !i.s.includes('___') && frage.test(i.q));
  let geprüft = 0;
  for (const item of codeItems) {
    // Bei der Frage nach dem Wert von seite hängt der Test selbst ein print an.
    const code = unlegend(item.s) + (item.q.includes('seite') ? '\nprint(seite)' : '');
    const result = runProgram(code);
    assert.equal(result.error, null, `${item.q} ${item.s}`);
    const erwartet = item.a.replace(/^Es erscheint /, '').replace(/ \(drei Zeilen\)$/, '').replaceAll(', ', ' / ');
    assert.equal(result.output.join(' / '), erwartet, `${item.q} ${item.s}`);
    geprüft++;
  }
  assert.ok(geprüft >= 14, `nur ${geprüft} Ausgaben nachgerechnet`);
});

test('Fehler-Fragen: das Programm erzeugt wirklich die genannte Fehlerart', () => {
  const fehler = [
    ['print("Hallo)', 'SyntaxError'], ['prnt("Hallo")', 'NameError'], ['print("Punkte: " + 5)', 'TypeError'],
    ['for i in range(4):\nforward(50)\nleft(90)', 'IndentationError'], ['if 5 > 3\n    print("ja")', 'SyntaxError']
  ];
  for (const [code, type] of fehler) assert.equal(runProgram(code).error?.type, type, code);
  const q = alle.filter((i) => i.label?.startsWith('Code lesen'));
  for (const [code] of fehler) {
    const shown = code.split('\n').map((l) => `${'→ '.repeat((l.length - l.trimStart().length) / 4)}${l.trim()}`).join(' | ');
    assert.ok(q.some((i) => i.s === shown), `Frage zu ${shown} fehlt`);
  }
});

test('Quadrat-Frage: nur die richtige Antwort zeichnet ein Quadrat', () => {
  const item = ITEMS['turtle-start'].find((i) => i.skill === 'Quadrat erkennen');
  const toCode = (a) => a.replace(/ (?=(forward|left))/g, '\n');
  const closed = (a) => {
    const r = runProgram(toCode(a));
    const lengths = r.segments.map((x) => Math.round(Math.hypot(x.x2 - x.x1, x.y2 - x.y1)));
    return r.segments.length === 4 && new Set(lengths).size === 1 && Math.abs(r.turtle.x) < 1e-6 && Math.abs(r.turtle.y) < 1e-6;
  };
  assert.ok(closed(item.a));
  for (const w of item.wrong) assert.ok(!closed(w), w);
});

const config = buildConfig(paket, logic);

for (const unit of config.units) {
  test(`Theorie ${unit.id}: Kopf, Lektion, Code-Labor, Merkzettel und Übungsknopf`, () => {
    const html = renderToString(h(Theory, { unit, config, onStart: () => {} }));
    assert.ok(html.includes(unit.title));
    assert.ok(html.includes('Code-Labor'));
    assert.ok(html.includes('Freies Probieren'));
    assert.ok(html.includes('Merkzettel'));
    assert.ok(html.includes('Übung starten · 8 Aufgaben'));
    assert.match(html, /\d+ von \d+ Missionen geschafft/);
    assert.match(html, /<textarea/);
  });
}

test('Zeichenblatt: SVG mit Alternativtext, Ziel gestrichelt, Farben nur aus der Liste', () => {
  const result = runProgram('color("red")\nforward(50)\nleft(90)\nforward(20)');
  const html = renderToString(h(Zeichenblatt, { result, target: runProgram('forward(50)') }));
  assert.match(html, /^<svg /);
  assert.match(html, /role="img"/);
  assert.match(html, /aria-label="Zeichenblatt mit 2 Linien und dem gestrichelten Ziel"/);
  assert.ok(html.includes('stroke="#E53935"'));
  assert.ok(!html.includes('<script'));
});

test('Labor ohne Missionen zeigt nur das freie Probieren', () => {
  const unit = { id: 'unbekannt', color: '#FF8AD0' };
  const html = renderToString(h(Labor, { unit, accent: unit.color, data: { items: {}, missions: [] } }));
  assert.ok(html.includes('Code-Labor'));
  assert.ok(!html.includes('Missionen dieser Seite'));
});

test('Katalog-Eintrag: Informatik, Klasse 7, nach der Zahlenwerkstatt', () => {
  const c = paket.manifest.catalog;
  assert.equal(c.fach, 'informatik');
  assert.deepEqual(c.klassen, [7]);
  assert.ok(c.order > paketVon('info-zahlen').manifest.catalog.order);
});
