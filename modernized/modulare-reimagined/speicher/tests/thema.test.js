// Farbschema auf dem Gerät: gültige Werte bleiben, alles andere gilt als nicht gewählt, Fehler brechen nichts ab.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readTheme, saveTheme } from '../index.js';

const fakeStorage = () => {
  const map = new Map();
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => map.set(k, v) };
};
const kaputt = { getItem: () => { throw new Error('gesperrt'); }, setItem: () => { throw new Error('voll'); } };

test('THEMA: gespeichertes Schema kommt zurück', () => {
  const storage = fakeStorage();
  assert.equal(readTheme(storage), null);
  assert.equal(saveTheme('dark', storage), true);
  assert.equal(readTheme(storage), 'dark');
});

test('THEMA: unbekannte Werte werden weder gelesen noch gespeichert', () => {
  const storage = fakeStorage();
  assert.equal(saveTheme('blau', storage), false);
  storage.setItem('lernwerkstatt-theme', 'blau');
  assert.equal(readTheme(storage), null);
});

test('THEMA: ohne nutzbaren Speicher gibt es keinen Fehler', () => {
  assert.equal(readTheme(kaputt), null);
  assert.equal(saveTheme('dark', kaputt), false);
  assert.equal(readTheme(null), null);
  assert.equal(saveTheme('dark', null), false);
});
