import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { APPS, SUBJECT_COLORS } from '../registry.js';

test('App-IDs sind eindeutig und Fächer haben eine Farbe', () => {
  assert.equal(new Set(APPS.map((a) => a.id)).size, APPS.length);
  APPS.forEach((a) => assert.ok(SUBJECT_COLORS[a.subject], `Farbe fehlt für ${a.subject}`));
});

test('Live-Apps haben Ziel, Seitenzahl und existierende Startdatei', () => {
  for (const app of APPS.filter((a) => a.status === 'live')) {
    assert.ok(app.units > 0, `units fehlt bei ${app.id}`);
    assert.ok(existsSync(new URL('../' + app.href, import.meta.url)), `Datei fehlt: ${app.href}`);
  }
});

test('Status ist live oder soon', () => {
  APPS.forEach((a) => assert.ok(['live', 'soon'].includes(a.status)));
});
