// SEC-003: html- und svg-Felder werden gegen die Allow-list geprüft (legacy core/js/validate.js prüfte sie nicht).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertBundle, bundleMarkupErrors, markupErrors } from '../index.js';
import { validBundle } from './helpers.js';

test('SEC-003: erlaubtes Markup <p> und <b> wird angenommen', () => {
  assert.deepEqual(markupErrors('<p>Das ist <b>fett</b>.</p><p>Zweiter Absatz.</p>'), []);
});

test('SEC-003: reiner Text ohne Tags wird angenommen', () => {
  assert.deepEqual(markupErrors('Nur Text, auch mit Umlauten & Prozent 50 %.'), []);
  assert.deepEqual(markupErrors('a > b'), []);
});

const forbidden = [
  ['script', '<script>alert(1)</script>'],
  ['iframe', '<iframe src="https://evil.example"></iframe>'],
  ['object', '<object data="x.swf"></object>'],
  ['embed', '<embed src="x.swf">'],
  ['style', '<style>body{display:none}</style>'],
  ['a mit javascript:-Link', '<p><a href="javascript:alert(1)">Klick</a></p>'],
  ['img mit onerror', '<p><img src=x onerror="alert(1)"></p>'],
  ['Großschreibung SCRIPT', '<SCRIPT>alert(1)</SCRIPT>'],
  ['svg-Tag im html-Feld', '<svg><script>alert(1)</script></svg>']
];

for (const [name, markup] of forbidden) {
  test(`SEC-003: ${name} im html-Feld wird abgelehnt`, () => {
    assert.ok(markupErrors(markup, 'html').length > 0, markup);
  });
}

test('SEC-003: verbotene Tags nennen den Grund (script)', () => {
  assert.match(markupErrors('<script>x</script>').join(' '), /Tag <script> ist verboten/);
});

test('SEC-003: jedes on*-Attribut wird abgelehnt, auch an erlaubten Tags', () => {
  for (const markup of ['<b onclick="x()">a</b>', '<p ONMOUSEOVER="x()">a</p>', '<b onload=x>a</b>']) {
    assert.match(markupErrors(markup, 'html').join(' '), /Ereignis-Attribut/, markup);
  }
});

test('SEC-003: on*-Attribut im svg-Feld wird abgelehnt', () => {
  const markup = '<svg viewBox="0 0 10 10" onload="alert(1)"><rect x="1" y="1" width="2" height="2"/></svg>';
  assert.match(markupErrors(markup, 'svg').join(' '), /Ereignis-Attribut "onload"/);
});

test('SEC-003: javascript:-URL in einem Attribut wird erkannt, auch mit Entities und Leerzeichen', () => {
  // title steht nicht auf der Allow-list. Die URL-Prüfung greift zusätzlich, sobald ein künftiger Eintrag ein URL-Attribut erlaubt.
  const plain = '<b title="javascript:alert(1)">a</b>';
  const encoded = '<b title="&#106;avascript:alert(1)">a</b>';
  const spaced = '<b title=" java&#x09;script:alert(1)">a</b>';
  for (const markup of [plain, encoded, spaced]) {
    assert.match(markupErrors(markup, 'html').join(' '), /URL mit Schema/, markup);
  }
});

test('SEC-003: Attribut, das nicht auf der Allow-list steht, wird abgelehnt', () => {
  assert.match(markupErrors('<p class="rot">x</p>').join(' '), /Attribut "class" an <p> ist nicht erlaubt/);
});

test('SEC-003: Kommentare, CDATA und ein "<" ohne Tag werden abgelehnt', () => {
  assert.ok(markupErrors('<p>x</p><!-- versteckt -->').length > 0);
  assert.ok(markupErrors('<![CDATA[x]]>').length > 0);
  assert.ok(markupErrors('a < b und <p>c</p>').length > 0);
});

test('SEC-003: nicht geschlossene und falsch verschachtelte Tags werden abgelehnt', () => {
  assert.match(markupErrors('<p><b>x</p>').join(' '), /passt nicht|nicht geschlossen/);
  assert.match(markupErrors('<p>x').join(' '), /nicht geschlossen/);
  assert.match(markupErrors('x</p>').join(' '), /passt nicht/);
});

test('SEC-003: "/>" ist im HTML-Feld nicht erlaubt (Parser und Prüfer lesen gleich)', () => {
  assert.match(markupErrors('<p/>', 'html').join(' '), /\/>/);
});

const svgDiagram = '<svg class="dg" viewBox="0 0 120 60" role="img" aria-label="Ein Kasten" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
  '<path class="arw-head" d="M0 0 L10 5 L0 10 z"/></marker></defs>' +
  '<rect class="box" x="4" y="4" width="50" height="30" rx="10"/>' +
  '<circle class="hi" cx="90" cy="20" r="8"/>' +
  '<line class="ar" x1="54" y1="19" x2="80" y2="19"/>' +
  '<text class="md" x="10" y="24">5</text>' +
  '</svg>';

test('SEC-003: svg-Diagramm mit den Tags aus svg.js wird angenommen', () => {
  assert.deepEqual(markupErrors(svgDiagram, 'svg'), []);
});

test('SEC-003: svg mit Verweis nach außen (use, image, a, foreignObject) wird abgelehnt', () => {
  const bad = [
    '<svg><use href="https://evil.example/x.svg#a"/></svg>',
    '<svg><image href="https://evil.example/x.png"/></svg>',
    '<svg><a href="javascript:alert(1)"><rect class="box" x="1" y="1" width="2" height="2"/></a></svg>',
    '<svg><foreignObject><div>x</div></foreignObject></svg>'
  ];
  for (const markup of bad) {
    assert.ok(markupErrors(markup, 'svg').length > 0, markup);
  }
});

test('SEC-003: svg-Feld muss mit <svg> beginnen und mit </svg> enden', () => {
  assert.match(markupErrors('<rect class="box" x="1" y="1" width="2" height="2"/>', 'svg').join(' '), /<svg>/);
  assert.match(markupErrors('<svg class="dg" viewBox="0 0 1 1">', 'svg').join(' '), /<\/svg>/);
});

test('SEC-003: html- und svg-Felder werden im ganzen Paket geprüft, auch in data.json', () => {
  const bundle = validBundle();
  bundle.data = { fragen: [{ prompt: 'Frage', html: '<p><script>alert(1)</script></p>' }] };
  assert.ok(bundleMarkupErrors(bundle).some((e) => e.startsWith('data.fragen[0].html')));
  assert.throws(() => assertBundle(bundle), /das ganze Paket wird abgelehnt/);
});

test('SEC-003: ein svg-Feld in der Lektion wird geprüft (figure.svg)', () => {
  const bundle = validBundle();
  bundle.lessons.start.figure = { caption: 'Bild', svg: '<svg class="dg"><script>x</script></svg>' };
  assert.ok(bundleMarkupErrors(bundle).some((e) => e.startsWith('lessons.start.figure.svg')));
});

test('SEC-003: ein Text mit "<" in einem Feld namens tldr wird trotzdem geprüft', () => {
  const bundle = validBundle();
  bundle.lessons.weiter.tldr = ['Ein Satz mit <img src=x onerror=alert(1)>.', 'Zweiter.'];
  assert.ok(bundleMarkupErrors(bundle).some((e) => e.startsWith('lessons.weiter.tldr[0]')));
});

test('SEC-003: Markup in den Teilen einer Lektion mit erlaubten Tags bleibt gültig', () => {
  assert.deepEqual(bundleMarkupErrors(validBundle()), []);
});
