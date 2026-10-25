import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homeHTML } from '../core/js/views/home.js';
import { resultView } from '../core/js/views/result.js';
import { appDefaults } from '../core/js/profile.js';
import config from '../apps/franzoesisch-verben/config.js';

const profile = () => ({ name: '', xp: 0, streak: 0, daily: {}, last: null });
const state = (over = {}) => ({ config, profile: { ...profile(), ...over }, app: appDefaults(), bossOpen: false, resetAsk: false });

test('Startseite zeigt alle Seiten, Trophäen und sperrt den Endgegner', () => {
  const html = homeHTML(state());
  for (const u of config.units) assert.ok(html.includes(`data-id="${u.id}"`), u.id);
  assert.match(html, /Noch gesperrt/);
  assert.match(html, /id="nm"/); // Namensfeld, solange kein Name gesetzt ist
});

test('Startseite maskiert den Namen', () => {
  const html = homeHTML(state({ name: '<b>x</b>' }));
  assert.ok(!html.includes('<b>x</b>'));
  assert.ok(!html.includes('id="nm"'));
});

test('Zurücksetzen fragt erst nach', () => {
  assert.match(homeHTML({ ...state(), resetAsk: true }), /data-act="resetok"/);
  assert.match(homeHTML(state()), /data-act="reset"/);
});

test('Ergebnisansicht: Runde, durchgefallen, Blitz', () => {
  const ctx = { profile: profile(), app: appDefaults(), words: { resultTitles: ['A', 'B', 'C'], blitzTitle: 'Blitz!' } };
  const unit = config.units[0];
  const ok = resultView({ mode: 'lesson', unit, stars: 3, accuracy: 1, xp: 50, bonus: 0, bestCombo: 5, newBadges: [], relearned: 0 }, ctx);
  assert.match(ok.html, /C<\/h1>/);
  assert.equal(ok.celebrate, true);
  const bad = resultView({ mode: 'lesson', unit, stars: 0, failed: true, accuracy: 0.2, xp: 5, bonus: 0, bestCombo: 0, newBadges: [] }, ctx);
  assert.match(bad.html, /Knapp daneben/);
  assert.equal(bad.celebrate, false);
  const blitz = resultView({ mode: 'blitz', score: 12, xp: 80, bestCombo: 4, newBadges: [] }, ctx);
  assert.match(blitz.html, /Blitz!/);
  assert.equal(blitz.celebrate, true);
});
