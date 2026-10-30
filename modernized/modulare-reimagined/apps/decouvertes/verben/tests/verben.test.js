// Cahier de Verbes (jetzt in der Französisch-Werkstatt): Aufgaben aus content/decouvertes-2. Prüft RULE-165 (jede Aufgabe akzeptiert ihre Antwort),
// RULE-223 (Auswahl mit höchstens drei Ablenkern), RULE-229 (Rundengrößen), die Konjugation, die Eingabeprüfung,
// die Diagramme, die Theorie und die Anbindung an den Rahmen. Herkunft der Fälle: legacy/modulare/tests/french.test.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRng } from '../../../../helfer/index.js';
import { buildConfig } from '../../../../inhalte/index.js';
import { appDefaults, profileDefaults, startRound } from '../../../../seiten/ablauf.js';
import { paketVon } from '../../../tests/laden.js';
import { createBuilders } from '../../builders.js';
import { createVerbDiagrams } from '../diagrams.js';
import { speak } from '../../sprache.js';
import logic from '../../logic.js';

const paket = paketVon('decouvertes-2');
const { model, verbs, bossRound, quickRound, blitzQuestion } = createBuilders(paket);
const { V, UNITS, SP, RAW } = model;
const { personDiagram, endingsDiagram } = createVerbDiagrams(model);
const { lessonRound, checkForm, hint, distract } = verbs;

const alleFragen = (runden) => runden.flat();

test('RULE-165: jede Seite liefert mindestens 300 Aufgaben, und jede akzeptiert ihre eigene Antwort', () => {
  for (const unit of UNITS) {
    const rng = createRng(165);
    const fragen = [];
    while (fragen.length < 300) fragen.push(...lessonRound(unit, rng));
    for (const q of fragen) {
      if (q.kind === 'choice') {
        assert.ok(q.options.some((o) => o.id === q.answer), `Antwort fehlt bei ${unit.id}: ${q.answer}`);
      } else if (q.kind === 'type') {
        assert.equal(q.check(q.answer), 'ok', `Eingabe verwirft ihre Antwort bei ${unit.id}: ${q.answer}`);
      } else {
        assert.equal(q.kind, 'match');
        assert.deepEqual([...q.leftValues].sort(), q.right.map((r) => r.value).sort());
      }
    }
  }
});

test('RULE-223: Auswahl zeigt die richtige Antwort und höchstens drei falsche, nie mehr', () => {
  for (let seed = 1; seed <= 60; seed++) {
    const rng = createRng(seed);
    for (const q of alleFragen([lessonRound(UNITS[seed % UNITS.length], rng), bossRound(rng), quickRound(rng)])) {
      if (q.kind !== 'choice') continue;
      assert.ok(q.options.length >= 2 && q.options.length <= 4, `Optionszahl ${q.options.length}`);
    }
  }
});

test('RULE-223: die richtige Antwort steht nicht immer an derselben Stelle', () => {
  const stellen = new Set();
  for (let seed = 1; seed <= 60; seed++) {
    const q = lessonRound(UNITS[0], createRng(seed)).find((x) => x.kind === 'choice');
    stellen.add(q.options.findIndex((o) => o.id === q.answer));
  }
  assert.ok(stellen.size > 1, 'die Antwort liegt immer an derselben Stelle');
});

test('RULE-229: Lektion 8, Endgegner 12, Schnellrunde 5, Blitz ist Auswahl (200 Seeds)', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = createRng(seed);
    for (const unit of UNITS) {
      const lektion = lessonRound(unit, rng);
      assert.equal(lektion.length, 8);
      lektion.forEach((q) => {
        if (q.kind === 'match') assert.ok(q.leftValues.length === 6);
      });
    }
    assert.equal(bossRound(rng).length, 12);
    assert.equal(quickRound(rng).length, 5);
    assert.equal(blitzQuestion(rng).kind, 'choice');
  }
});

// Prüffunktionen sind Closures und nie gleich, deshalb vergleicht der Test die Daten ohne sie (check wird ausgelassen).
const daten = (x) => JSON.stringify(x, (k, v) => (typeof v === 'function' ? 'check' : v));

test('Gleicher Seed ergibt dieselben Aufgaben', () => {
  assert.equal(daten(lessonRound(UNITS[4], createRng(42))), daten(lessonRound(UNITS[4], createRng(42))));
  assert.equal(daten(bossRound(createRng(7))), daten(bossRound(createRng(7))));
  assert.equal(daten(blitzQuestion(createRng(9))), daten(blitzQuestion(createRng(9))));
});

test('Konjugation: Unregelmäßige und Endungen der regelmäßigen Verben stimmen', () => {
  assert.deepEqual(V.etre.forms, ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']);
  assert.deepEqual(V.faire.forms, ['fais', 'fais', 'fait', 'faisons', 'faites', 'font']);
  assert.deepEqual(V.parler.forms, ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent']);
  assert.deepEqual(V.finir.forms, ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent']);
  assert.deepEqual(V.attendre.forms, ['attends', 'attends', 'attend', 'attendons', 'attendez', 'attendent']);
});

test('Konjugation: jedes regelmäßige Verb ist Stamm plus Endung seiner Gruppe', () => {
  const gruppen = paket.data.endings;
  for (const [key, v] of Object.entries(V)) {
    if (v.irr) continue;
    assert.deepEqual(v.ends, gruppen[v.group], `${key} hat die falschen Endungen`);
    assert.deepEqual(v.forms, v.ends.map((e) => v.stem + e), `${key} hat falsche Formen`);
  }
});

test('Jeder Beispielsatz hat genau eine Lücke und eine gültige Person', () => {
  for (const [unit, rows] of Object.entries(RAW)) {
    assert.ok(UNITS.some((u) => u.id === unit), `Unbekannte Seite ${unit}`);
    rows.forEach(([verb, person, fr, de]) => {
      assert.ok(V[verb], `Unbekanntes Verb ${verb}`);
      assert.ok(person >= 0 && person <= 5);
      assert.equal(fr.split('___').length, 2, fr);
      assert.ok(de.length > 3);
    });
    assert.equal(SP[unit].length, rows.length);
  }
});

test('Eingabeprüfung: Pronomen erlaubt, fehlender Akzent ist "fast"', () => {
  const check = checkForm('êtes');
  assert.equal(check('êtes'), 'ok');
  assert.equal(check('vous êtes'), 'ok');
  assert.equal(check('  ÊTES '), 'ok');
  assert.equal(check('etes'), 'almost');
  assert.equal(check('étez'), 'bad');
  assert.equal(checkForm('ai')("j'ai"), 'ok');
  assert.equal(checkForm('ai')('j’ai'), 'ok');
});

test('Hinweise vorhanden, Ablenker enthalten die richtige Form nie', () => {
  const rng = createRng(3);
  for (const v of Object.values(V)) {
    for (let p = 0; p < 6; p++) {
      assert.ok(hint(v, p).length > 5);
      assert.ok(!distract(v, p, 3, rng).includes(v.forms[p]));
    }
  }
});

test('Diagramme liefern ein svg mit role img und aria-label', () => {
  for (const markup of [renderToStaticMarkup(personDiagram('etre', [0])), renderToStaticMarkup(personDiagram('avoir', [0]))]) {
    assert.match(markup, /^<svg /);
    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-label="Die Formen von/);
  }
  const rows = [{ inf: 'parler (sprechen)', stem: 'parl', ends: ['e', 'es', 'e', 'ons', 'ez', 'ent'], silent: [0, 1, 2, 5] }];
  const endings = renderToStaticMarkup(endingsDiagram(rows));
  assert.match(endings, /role="img"/);
  assert.match(endings, /aria-label="Stamm und Endungen: parler/);
});

test('Anbindung: Inhalte, Logik und Rahmen starten Lektion, Schnellrunde und Endgegner', () => {
  const config = buildConfig(paket, logic);
  for (const unit of config.units) {
    assert.ok(config.lessons[unit.id].figure.svg || config.lessons[unit.id].figure.diagram, `Figur fehlt: ${unit.id}`);
  }
  const app = { ...appDefaults(), stars: Object.fromEntries(config.units.map((u) => [u.id, 1])) };
  const profile = profileDefaults();

  const lektion = startRound({ config, mode: 'lesson', unit: config.units[0], app, profile, rng: createRng(5) });
  assert.equal(lektion.ok, true, lektion.message);
  assert.equal(lektion.round.current().total, 8);

  const schnell = startRound({ config, mode: 'quick', app, profile, rng: createRng(6) });
  assert.equal(schnell.ok, true, schnell.message);
  assert.equal(schnell.round.current().total, 5);

  const boss = startRound({ config, mode: 'boss', app, profile, rng: createRng(7) });
  assert.equal(boss.ok, true, boss.message);
  assert.equal(boss.round.current().total, 12);
});

test('Theorie: Konjugation, Lektion und Übungsknopf sind da, ohne Sprachausgabe keine Vorlesen-Knöpfe', () => {
  const config = buildConfig(paket, logic);
  const etre = config.units.find((u) => u.id === 'etre');
  const markup = renderToStaticMarkup(createElement(config.Theory, { unit: etre, config, onStart: () => {} }));
  assert.match(markup, /<h1>être<\/h1>/);
  assert.equal((markup.match(/<tr>/g) || []).length, 6);
  assert.match(markup, /Übung starten · 8 Aufgaben/);
  assert.doesNotMatch(markup, /aria-label="Vorlesen"/);
  assert.doesNotThrow(() => speak('Je suis'));
});
