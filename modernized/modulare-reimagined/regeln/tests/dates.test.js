import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weekStart } from '../src/dates.js';

test('Montag bleibt Montag', () => assert.equal(weekStart('2026-10-26'), '2026-10-26'));
test('Dienstag geht auf den Montag davor', () => assert.equal(weekStart('2026-10-27'), '2026-10-26'));
test('Sonntag gehört zur Woche des Montags davor', () => assert.equal(weekStart('2026-10-25'), '2026-10-19'));
test('Sonntag über die Jahresgrenze', () => assert.equal(weekStart('2027-01-03'), '2026-12-28'));
test('Samstag gehört zum Montag davor', () => assert.equal(weekStart('2026-10-31'), '2026-10-26'));
test('Schaltjahr: 29. Februar 2028 ist ein Dienstag, die Woche beginnt am 28. Februar', () => assert.equal(weekStart('2028-02-29'), '2028-02-28'));
test('Ein Tag, den der Kalender nicht kennt, wirft (kein Überlauf in den nächsten Monat)', () => assert.throws(() => weekStart('2026-02-30'), TypeError));
test('Kein Schaltjahr: 29. Februar 2027 wirft', () => assert.throws(() => weekStart('2027-02-29'), TypeError));
test('Monat 13 wirft', () => assert.throws(() => weekStart('2026-13-01'), TypeError));
test('ungültiger Tag wirft', () => assert.throws(() => weekStart('27.10.2026'), TypeError));
