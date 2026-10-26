// RULE-144: Materiallinks sind nur relative Pfade im Ordner files/.
// SEC-002: Backslash ablehnen und den Ursprung prüfen (legacy core/js/validate.js:8).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSafeMaterialHref, materialErrors, assertBundle } from '../index.js';
import { validBundle } from './helpers.js';

test('RULE-144: relativer Pfad im Ordner files/ wird angenommen', () => {
  for (const href of ['files/merkwoerter.pdf', 'files/a/b.pdf', 'files/Übung-1_neu.pdf']) {
    assert.deepEqual(materialErrors(href), [], href);
  }
});

test('RULE-144: absolute URL mit https wird abgelehnt', () => {
  assert.ok(!isSafeMaterialHref('https://evil.example/x.pdf'));
});

test('RULE-144: andere Schemata (ftp, file) werden abgelehnt', () => {
  assert.ok(!isSafeMaterialHref('ftp://evil.example/x.pdf'));
  assert.ok(!isSafeMaterialHref('file:///etc/passwd'));
});

test('RULE-144: schemarelative URL mit // wird abgelehnt', () => {
  assert.ok(!isSafeMaterialHref('//evil.example/x.pdf'));
});

test('RULE-144: javascript: wird abgelehnt', () => {
  assert.ok(!isSafeMaterialHref('javascript:alert(1)'));
  assert.ok(!isSafeMaterialHref('JaVaScRiPt:alert(1)'));
});

test('RULE-144: data: wird abgelehnt', () => {
  assert.ok(!isSafeMaterialHref('data:text/html,<p>x</p>'));
});

test('RULE-144: Leerzeichen im Pfad werden abgelehnt', () => {
  assert.ok(!isSafeMaterialHref('files/mein merkblatt.pdf'));
  assert.ok(!isSafeMaterialHref('files/x.pdf\tfoo'));
});

test('RULE-144: Pfade außerhalb von files/ werden abgelehnt', () => {
  for (const href of ['merkblatt.pdf', 'other/x.pdf', './files/x.pdf', 'filesx/x.pdf', 'files']) {
    assert.ok(!isSafeMaterialHref(href), href);
  }
});

test('RULE-144: ".." im Pfad wird abgelehnt', () => {
  for (const href of ['files/../secret.pdf', 'files/..%2fsecret.pdf', 'files/a..b.pdf', '../files/x.pdf']) {
    assert.ok(!isSafeMaterialHref(href), href);
  }
});

test('RULE-144: führender Schrägstrich wird abgelehnt', () => {
  assert.ok(!isSafeMaterialHref('/files/x.pdf'));
});

test('RULE-144: fehlender oder leerer Link wird abgelehnt', () => {
  assert.ok(!isSafeMaterialHref(undefined));
  assert.ok(!isSafeMaterialHref(''));
  assert.ok(!isSafeMaterialHref(42));
});

test('RULE-144: Anführungszeichen und spitze Klammern werden abgelehnt', () => {
  assert.ok(!isSafeMaterialHref('files/x"onload.pdf'));
  assert.ok(!isSafeMaterialHref("files/x'.pdf"));
  assert.ok(!isSafeMaterialHref('files/<x>.pdf'));
});

test('RULE-144: ein Paket mit unsicherem Link wird als Ganzes abgelehnt', () => {
  const bundle = validBundle();
  bundle.manifest.resources[0].href = '../geheim.pdf';
  assert.throws(() => assertBundle(bundle), /das ganze Paket wird abgelehnt/);
});

const backslashCases = [
  'files\\merkblatt.pdf',
  'files/..\\secret.pdf',
  '\\\\evil.example\\x.pdf',
  '/\\evil.example/x.pdf',
  'files\\..\\..\\x.pdf'
];

for (const href of backslashCases) {
  test(`SEC-002: Backslash im Pfad wird abgelehnt (${href})`, () => {
    assert.match(materialErrors(href).join(' '), /Backslash/);
  });
}

test('SEC-002: der Browser liest den Backslash als Schrägstrich, deshalb wird er abgelehnt', () => {
  // Beleg für die Begründung: WHATWG-URL macht aus \\ einen Link auf einen fremden Host.
  const resolved = new URL('\\\\evil.example/x.pdf', 'https://materialien.invalid/apps/app/index.html');
  assert.equal(resolved.host, 'evil.example');
  assert.ok(!isSafeMaterialHref('\\\\evil.example/x.pdf'));
});

test('SEC-002: zugelassene Pfade bleiben auf derselben Herkunft und im Ordner files/', () => {
  const base = new URL('https://materialien.invalid/apps/app/index.html');
  for (const href of ['files/merkblatt.pdf', 'files/a/b.pdf']) {
    const url = new URL(href, base);
    assert.equal(url.origin, base.origin, href);
    assert.ok(url.pathname.startsWith('/apps/app/files/'), href);
  }
});

test('SEC-002: kodierte Pfadteile und Trennzeichen-Tricks werden abgelehnt', () => {
  // Kodierte Punkte (%2e) würde der Browser erst beim Auflösen zu ".." machen. Die Dateinamen-Regel verbietet das %-Zeichen.
  assert.ok(!isSafeMaterialHref('files/%2e%2e/%2e%2e/x.pdf'));
  assert.ok(!isSafeMaterialHref('files/..;/x.pdf'));
});
