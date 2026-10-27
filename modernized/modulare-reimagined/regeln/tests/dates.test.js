import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weekStart } from '../src/dates.js';

test('Montag bleibt Montag', () => assert.equal(weekStart('2026-10-26'), '2026-10-26'));
test('Dienstag geht auf den Montag davor', () => assert.equal(weekStart('2026-10-27'), '2026-10-26'));
test('Sonntag gehört zur Woche des Montags davor', () => assert.equal(weekStart('2026-10-25'), '2026-10-19'));
test('Sonntag über die Jahresgrenze', () => assert.equal(weekStart('2027-01-03'), '2026-12-28'));
test('ungültiger Tag wirft', () => assert.throws(() => weekStart('27.10.2026'), TypeError));
