// Tests für den Inhalts-Unterbau: Trophäen-Regeln, Paketprüfung, Quellen (statisch, HTTP, Cache) und buildConfig.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRule, ruleErrors, ruleTypes } from '../core/js/rules.js';
import { bundleErrors, assertBundle } from '../core/js/validate.js';
import { createStaticSource, createHttpSource, withCache } from '../core/js/content.js';
import { resolveFigure, buildConfig } from '../core/js/appconfig.js';
import { diskFetch, diskSource } from './helpers.js';

const units = [{ id: 'a' }, { id: 'b' }];
const state = (stars = {}, streak = 0) => ({ app: { stars }, streak });
const ev = (rule, s = state(), r = {}) => evaluateRule(rule, s, r, units);

test('Regeln: Seiten und Sterne', () => {
  assert.equal(ev({ type: 'anyUnit' }), false);
  assert.equal(ev({ type: 'anyUnit' }, state({ b: 1 })), true);
  assert.equal(ev({ type: 'unit', id: 'a' }, state({ a: 1 })), true);
  assert.equal(ev({ type: 'unit', id: 'a', stars: 3 }, state({ a: 2 })), false);
  assert.equal(ev({ type: 'units', ids: ['a', 'b'] }, state({ a: 1 })), false);
  assert.equal(ev({ type: 'units', ids: ['a', 'b'] }, state({ a: 1, b: 2 })), true);
});

test('Regeln: Runde, Serie, Blitz, Boss, Tage', () => {
  const clean = { mode: 'lesson', failed: false, wrong: 0, almost: 0 };
  assert.equal(ev({ type: 'perfectRound' }, state(), clean), true);
  assert.equal(ev({ type: 'perfectRound' }, state(), { ...clean, wrong: 1 }), false);
  assert.equal(ev({ type: 'perfectRound' }, state(), { ...clean, mode: 'blitz' }), false);
  assert.equal(ev({ type: 'combo', min: 5 }, state(), { bestCombo: 5 }), true);
  assert.equal(ev({ type: 'combo', min: 5 }, state(), { bestCombo: 4 }), false);
  assert.equal(ev({ type: 'blitz', min: 10 }, state(), { mode: 'blitz', score: 10 }), true);
  assert.equal(ev({ type: 'blitz', min: 10 }, state(), { mode: 'lesson', score: 99 }), false);
  assert.equal(ev({ type: 'boss' }, state(), { mode: 'boss', failed: false }), true);
  assert.equal(ev({ type: 'boss' }, state(), { mode: 'boss', failed: true }), false);
  assert.equal(ev({ type: 'streak', days: 3 }, state({}, 3)), true);
  assert.equal(ev({ type: 'streak', days: 3 }, state({}, 2)), false);
});

test('Regeln: all und any kombinieren', () => {
  const rules = [{ type: 'unit', id: 'a' }, { type: 'unit', id: 'b' }];
  assert.equal(ev({ type: 'all', rules }, state({ a: 1 })), false);
  assert.equal(ev({ type: 'any', rules }, state({ a: 1 })), true);
});

test('Regeln: unbekannter Typ ist ein Fehler, ruleErrors findet Tippfehler', () => {
  assert.throws(() => ev({ type: 'zauberei' }), /Unbekannte/);
  assert.ok(ruleTypes().includes('combo'));
  assert.deepEqual(ruleErrors({ type: 'unit', id: 'a' }, ['a', 'b']), []);
  assert.ok(ruleErrors({ type: 'unit', id: 'x' }, ['a', 'b']).length > 0, 'unbekannte Seite');
  assert.ok(ruleErrors({ type: 'combo' }, ['a']).length > 0, 'min fehlt');
  assert.ok(ruleErrors({ type: 'zauberei' }, ['a']).length > 0, 'unbekannter Typ');
});

test('Paketprüfung: gültiges Paket besteht, kaputte werden benannt', async () => {
  const good = await diskSource().load('vorlage');
  assert.deepEqual(bundleErrors(good), []);
  const broken = structuredClone(good);
  delete broken.lessons.start.rule;
  broken.badges[0].rule = { type: 'zauberei' };
  const errors = bundleErrors(broken).join('\n');
  assert.match(errors, /rule/);
  assert.match(errors, /zauberei|Regel|rule/i);
  assert.throws(() => assertBundle(broken));
});

test('Bilder in Lektionen: Verweis wird über die Diagramme der App aufgelöst', () => {
  const diagrams = { dia: (a, b) => `<svg>${a}${b}</svg>` };
  assert.deepEqual(resolveFigure({ diagram: { name: 'dia', args: [1, 2] }, caption: 'c' }, diagrams), { svg: '<svg>12</svg>', caption: 'c' });
  assert.deepEqual(resolveFigure({ svg: '<svg/>', caption: 'c' }, diagrams), { svg: '<svg/>', caption: 'c' });
  assert.throws(() => resolveFigure({ diagram: { name: 'fehlt' }, caption: 'c' }, diagrams), /fehlt/);
});

test('Statische Quelle lädt Teile, data.json ist optional, fehlende Pflichtteile melden die URL', async () => {
  const bundle = await createStaticSource('https://x.test/content/', diskFetch).load('vorlage');
  assert.equal(bundle.manifest.id, 'vorlage');
  const noData = async (url) => (String(url).endsWith('data.json') ? { ok: false, status: 404 } : diskFetch(url));
  assert.deepEqual((await createStaticSource('https://x.test/content', noData).load('vorlage')).data, {});
  await assert.rejects(createStaticSource('https://x.test/content/', diskFetch).load('gibt-es-nicht'), /gibt-es-nicht/);
});

test('HTTP-Quelle: holt das Paket von der API und prüft es', async () => {
  const good = await diskSource().load('vorlage');
  const calls = [];
  const fetchFn = async (url, init) => { calls.push([String(url), init]); return { ok: true, status: 200, json: async () => good }; };
  const bundle = await createHttpSource('https://api.test/v1/', fetchFn, { Authorization: 'Bearer t' }).load('vorlage');
  assert.equal(bundle.manifest.id, 'vorlage');
  assert.equal(calls[0][0], 'https://api.test/v1/apps/vorlage/content');
  assert.equal(calls[0][1].headers.Authorization, 'Bearer t');
  await assert.rejects(createHttpSource('https://api.test', async () => ({ ok: false, status: 503 })).load('vorlage'), /503/);
  await assert.rejects(createHttpSource('https://api.test', async () => ({ ok: true, json: async () => ({ manifest: {} }) })).load('vorlage'));
});

test('Cache: speichert nach Erfolg und liefert offline aus dem Speicher', async () => {
  const good = await diskSource().load('vorlage');
  const mem = new Map();
  const storage = { get: async (k) => mem.get(k), put: async (k, v) => { mem.set(k, v); } };
  let online = true;
  const source = { name: 'fake', load: async () => { if (!online) throw new Error('offline'); return good; } };
  const cached = withCache(source, storage);
  await cached.load('vorlage');
  assert.ok(mem.has('lernwerkstatt:content:vorlage'));
  online = false;
  assert.equal((await cached.load('vorlage')).manifest.id, 'vorlage');
  await assert.rejects(cached.load('andere'), /offline/);
});

test('buildConfig: ruft init auf, baut Lektionen, Trophäen und Theorie-Funktion', async () => {
  const bundle = await diskSource().load('vorlage');
  let initArgs = null;
  const logic = {
    init: (a) => { initArgs = a; },
    diagrams: { sumDiagram: () => '<svg></svg>' },
    rounds: { lesson: () => [] }
  };
  const config = buildConfig(bundle, logic);
  assert.ok(initArgs && initArgs.manifest.id === 'vorlage' && initArgs.data.items);
  assert.equal(config.id, 'vorlage');
  assert.equal(typeof config.theory, 'function');
  assert.equal(config.lessons.start.figure.svg, '<svg></svg>');
  const first = config.badges.find((b) => b.id === 'first');
  assert.equal(first.when({ app: { stars: { start: 1 } }, streak: 0 }, {}), true);
  assert.equal(first.when({ app: { stars: {} }, streak: 0 }, {}), false);
  assert.throws(() => buildConfig(bundle, { ...logic, diagrams: {} }), /sumDiagram/);
});
