import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { trackOf, TrackLabel } from '../tracks.js';

const h = createElement;

const tracks = { lrs: { label: 'LRS-Förderung', desc: 'Zusatzangebot für Lese-Rechtschreib-Schwierigkeiten' } };

// 15 Seiten, 6 davon im LRS-Strang (wie im Verhaltensvertrag beschrieben). Namen sind erfunden.
const units = Array.from({ length: 15 }, (_, i) => (i < 6 ? { id: `u${i}`, title: `Seite ${i}`, track: 'lrs' } : { id: `u${i}`, title: `Seite ${i}` }));

test('RULE-258 Etikett erscheint genau auf den 6 LRS-Seiten von 15', () => {
  const markup = units.map((u) => renderToStaticMarkup(h(TrackLabel, { track: trackOf(tracks, u) })));
  assert.equal(markup.filter((m) => m.includes('LRS-Förderung')).length, 6);
  assert.equal(markup.filter((m) => m === '').length, 9, 'Standardseiten bleiben ohne Etikett');
});

test('RULE-258 Etikett trägt den Titel aus desc und den Text aus label', () => {
  const markup = renderToStaticMarkup(h(TrackLabel, { track: trackOf(tracks, units[0]) }));
  assert.match(markup, /class="trk trk-lrs"/);
  assert.match(markup, />LRS-Förderung<\/span>$/);
  assert.match(markup, /title="Zusatzangebot/);
});

test('RULE-258 Seite mit unbekanntem Strang bekommt kein Etikett', () => {
  assert.equal(trackOf(tracks, { track: 'gibt-es-nicht' }), null);
  assert.equal(renderToStaticMarkup(h(TrackLabel, { track: null })), '');
});

test('RULE-258 Prototyp-Schlüssel wie constructor liefern keinen Strang', () => {
  assert.equal(trackOf(tracks, { track: 'constructor' }), null);
  assert.equal(trackOf(tracks, { track: '__proto__' }), null);
});

test('RULE-258 die id des Strangs ist der Schlüssel, nicht ein Wert aus dem Manifest', () => {
  const sneaky = { lrs: { label: 'LRS', id: 'anders' } };
  assert.equal(trackOf(sneaky, { track: 'lrs' }).id, 'lrs');
});
