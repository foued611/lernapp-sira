// Klangbeispiele der Musik-Werkstatt: Daten, Planung und Anzeige. Der Ton selbst entsteht im Browser (klang-audio.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { initKlang, klangOf, validateKlang, beatSeconds, scheduleScore, scoreSeconds, midiToFreq, VOICES, MAX_SECONDS } from '../klang.js';
import { createPlayer } from '../klang-audio.js';
import { KlangBox } from '../theory.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('musik');
const ids = paket.manifest.units.map((u) => u.id);
initKlang(paket.data);

test('Jede Seite hat mindestens ein gültiges Klangbeispiel', () => {
  assert.deepEqual(validateKlang(paket.data.klang, ids), []);
  for (const id of ids) assert.ok(klangOf(id).length >= 2, `${id}: weniger als zwei Beispiele`);
});

test('Frequenz: a′ hat 440 Hertz, eine Oktave höher 880', () => {
  assert.equal(midiToFreq(69), 440);
  assert.equal(midiToFreq(81), 880);
});

test('Zeit: bei 120 Schlägen pro Minute dauert ein Viertel eine halbe Sekunde', () => {
  assert.equal(beatSeconds(2, 120), 1);
  assert.equal(beatSeconds(1.5, 120), 0.75);
});

test('Swing verschiebt nur die Achtel nach dem Schlag', () => {
  assert.equal(beatSeconds(1, 60, 1), 1);
  assert.ok(Math.abs(beatSeconds(1.5, 60, 1) - (1 + 2 / 3)) < 1e-9);
  assert.equal(beatSeconds(1.25, 60, 1), 1.25);
});

test('Planung: Töne sind nach Beginn sortiert, Lautstärke und Spurgewicht bleiben erhalten', () => {
  const score = { bpm: 60, tracks: [{ voice: 'sine', gain: 0.5, events: [[2, 1, 69, 0.8], [0, 1, 60, 0.4]] }] };
  const out = scheduleScore(score);
  assert.deepEqual(out.map((e) => e.t), [0, 2]);
  assert.equal(out[0].gain, 0.5);
  assert.equal(scoreSeconds(score), 3);
});

test('Kein Beispiel ist länger als die Obergrenze', () => {
  for (const id of ids) for (const s of klangOf(id)) assert.ok(scoreSeconds(s) <= MAX_SECONDS, `${id}/${s.id}`);
});

test('Die Prüfung findet kaputte Beispiele', () => {
  const kaputt = { takt: [{ id: 'x', label: 'x', hint: 'zu kurz', bpm: 10, tracks: [{ voice: 'laser', events: [[0, 0, 60, 2]] }] }] };
  const fehler = validateKlang(kaputt, ['takt', 'andere']);
  assert.ok(fehler.some((f) => /Hörhinweis/.test(f)));
  assert.ok(fehler.some((f) => /Tempo/.test(f)));
  assert.ok(fehler.some((f) => /unbekannte Stimme/.test(f)));
  assert.ok(fehler.some((f) => /ungültiges Ereignis/.test(f)));
  assert.ok(fehler.some((f) => /andere: kein Klangbeispiel/.test(f)));
});

test('Alle Stimmen der Daten sind bekannt', () => {
  for (const id of ids) for (const s of klangOf(id)) for (const t of s.tracks) assert.ok(VOICES.includes(t.voice), t.voice);
});

test('Anzeige: jede Seite zeigt Titel und Knöpfe, ohne dass Ton entsteht', () => {
  for (const id of ids) {
    const html = renderToString(h(KlangBox, { unitId: id }));
    for (const s of klangOf(id)) assert.ok(html.includes(s.label.replace(/&/g, '&amp;')) || html.includes(s.label), `${id}/${s.id} fehlt`);
    assert.match(html, /Zum Anhören/);
    assert.match(html, /aria-pressed="false"/);
  }
});

test('Anzeige: eine unbekannte Seite zeigt keine Karte', () => {
  assert.equal(renderToString(h(KlangBox, { unitId: 'gibt-es-nicht' })), '');
});

test('Spieler: ohne Audio im Browser meldet play() false und wirft nicht', () => {
  const player = createPlayer({});
  assert.equal(player.play(klangOf('takt')[0], () => {}), false);
  player.stop();
});

test('Spieler: stoppt den Kontext und meldet das Ende genau einmal', () => {
  const calls = { closed: 0, timers: 0, cleared: 0, end: 0, nodes: 0 };
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} });
  const node = () => {
    calls.nodes += 1;
    const n = { connect: (x) => x || n, start() {}, stop() {}, gain: param(), frequency: param(), detune: param(), Q: param(), buffer: null, type: '', loop: false };
    return n;
  };
  class FakeContext {
    constructor() { this.currentTime = 0; this.sampleRate = 8000; this.state = 'running'; this.destination = node(); }
    createGain() { return node(); }
    createOscillator() { return node(); }
    createBiquadFilter() { return node(); }
    createDynamicsCompressor() { return node(); }
    createWaveShaper() { return node(); }
    createBufferSource() { return node(); }
    createBuffer(c, length) { return { getChannelData: () => new Float32Array(length) }; }
    close() { calls.closed += 1; }
  }
  const host = { AudioContext: FakeContext, setTimeout: () => { calls.timers += 1; return 7; }, clearTimeout: () => { calls.cleared += 1; } };
  const player = createPlayer(host);
  for (const id of ids) for (const s of klangOf(id)) assert.equal(player.play(s, () => { calls.end += 1; }), true, `${id}/${s.id}`);
  assert.ok(calls.nodes > 100);
  player.stop();
  player.stop();
  assert.equal(calls.closed, calls.timers, 'jeder Kontext wird geschlossen');
  assert.equal(calls.end, calls.timers, 'jedes Ende wird einmal gemeldet');
});
