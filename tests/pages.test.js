// Prüft die statischen Dateien: gemeinsamer CSS-Einstieg, keine externen Schriften, alle Verweise existieren.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { APPS } from '../registry.js';

const root = new URL('../', import.meta.url);
const pages = ['index.html', ...APPS.filter((a) => a.status === 'live').map((a) => a.href), 'apps/_template/index.html'];

for (const page of pages) {
  test(`Seite ${page}: ein Kern-CSS, lokale Schriften, vorhandene Dateien`, () => {
    const html = readFileSync(new URL(page, root), 'utf8');
    assert.ok(/core\/styles\/app\.css/.test(html), 'bindet core/styles/app.css ein');
    assert.ok(!/fonts\.googleapis|fonts\.gstatic/.test(html), 'keine Google-Schriften (Datenschutz, Offline)');
    assert.ok(/<html lang="de">/.test(html) && /viewport/.test(html), 'lang und viewport gesetzt');
    const base = new URL(page, root);
    for (const m of html.matchAll(/(?:href|src)="([^":]+)"/g)) {
      assert.ok(existsSync(new URL(m[1], base)), `Verweis fehlt: ${m[1]}`);
    }
  });
}

test('Kern-CSS: alle importierten Dateien und Schriften existieren', () => {
  const css = readFileSync(new URL('core/styles/app.css', root), 'utf8');
  for (const m of css.matchAll(/@import url\('([^']+)'\)/g)) assert.ok(existsSync(new URL('core/styles/' + m[1], root)), m[1]);
  const fonts = readFileSync(new URL('core/styles/fonts.css', root), 'utf8');
  for (const m of fonts.matchAll(/url\('([^']+)'\)/g)) assert.ok(existsSync(new URL('core/styles/' + m[1], root)), m[1]);
  assert.ok(readdirSync(new URL('core/fonts/', root)).some((f) => f.startsWith('LICENSE')), 'Schrift-Lizenzen liegen bei');
});
