// Mini-Python: Rechnen, Variablen, Schleifen, Entscheidungen, Turtle und verständliche Fehler. Der Interpreter ist die Grundlage
// des Code-Labors, deshalb prüfen diese Tests auch die Ausgabeformate (5.0 statt 5) und die Fehlernamen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runProgram, closest, LIMITS } from '../python-mini.js';
import { compareDrawings, cellsOf } from '../zeichnung.js';

const out = (code) => runProgram(code).output.join('|');
const err = (code) => runProgram(code).error;

test('print: Text, Zahlen und mehrere Werte in einer Zeile', () => {
  assert.equal(out('print("Hallo")'), 'Hallo');
  assert.equal(out('print("Alter:", 12)'), 'Alter: 12');
  assert.equal(out('print(3 + 4 * 2)'), '11');
  assert.equal(out('print("3" + "4")'), '34');
  assert.equal(out('print(7 / 2, 4 / 2, 2 ** 3)'), '3.5 2.0 8');
  assert.equal(out('print(10 % 3, 7 // 2, -7 % 3)'), '1 3 2');
  assert.equal(out('print(5 == 5.0, 3 > 4, "a" < "b")'), 'True False True');
});

test('Variablen: speichern, überschreiben, erweitern und umwandeln', () => {
  assert.equal(out('x = 3\nx = x + 2\nprint(x)'), '5');
  assert.equal(out('x = 3\nx += 4\nx *= 2\nprint(x)'), '14');
  assert.equal(out('hefte = 3\nprint("Ich habe " + str(hefte) + " Hefte")'), 'Ich habe 3 Hefte');
  assert.equal(out('print(int("42") + 1, float("2.5") * 2, int(3.9))'), '43 5.0 3');
  assert.equal(out('print(len("Python"), abs(-4), min(3, 8), max(3, 8), round(2.6))'), '6 4 3 8 3');
});

test('Schleifen und if: Zählen, Verschachteln, elif und else', () => {
  assert.equal(out('for i in range(3):\n    print(i)'), '0|1|2');
  assert.equal(out('for i in range(1, 4):\n    print(i)'), '1|2|3');
  assert.equal(out('for i in range(10, 0, -4):\n    print(i)'), '10|6|2');
  assert.equal(out('for i in range(2):\n    for j in range(2):\n        print(i, j)'), '0 0|0 1|1 0|1 1');
  const prog = (z) => `zahl = ${z}\nif zahl < 10:\n    print("klein")\nelif zahl < 20:\n    print("mittel")\nelse:\n    print("groß")`;
  assert.deepEqual([5, 15, 25].map((z) => out(prog(z))), ['klein', 'mittel', 'groß']);
  assert.equal(out('for c in "abc":\n    print(c)'), 'a|b|c');
  assert.equal(out('if 1 < 2 and not 3 < 2:\n    print("ja")'), 'ja');
});

test('Turtle: Start, Drehen, Stift und Rückkehr zum Ausgangspunkt', () => {
  const sq = runProgram('for i in range(4):\n    forward(100)\n    left(90)');
  assert.equal(sq.segments.length, 4);
  assert.ok(Math.abs(sq.turtle.x) < 1e-9 && Math.abs(sq.turtle.y) < 1e-9);
  assert.equal(sq.turtle.heading, 0);
  const up = runProgram('left(90)\nforward(50)');
  assert.ok(Math.abs(up.turtle.y - 50) < 1e-9 && Math.abs(up.turtle.x) < 1e-9, 'left(90) schaut nach oben');
  const right = runProgram('right(90)\nforward(50)');
  assert.ok(Math.abs(right.turtle.y + 50) < 1e-9, 'right(90) schaut nach unten');
  assert.equal(runProgram('penup()\nforward(50)\npendown()\nforward(10)').segments.length, 1);
  assert.equal(runProgram('forward(100)\nbackward(40)').turtle.x, 60);
  assert.equal(runProgram('color("red")\nforward(10)').segments[0].color, '#E53935');
  assert.ok(runProgram('circle(30)').segments.length >= 40);
});

test('Turtle: Schreibweisen mit import, Turtle() und Kurzformen', () => {
  const a = runProgram('import turtle\nt = turtle.Turtle()\nt.forward(50)\nt.left(90)\nt.fd(10)');
  assert.equal(a.error, null);
  assert.equal(a.segments.length, 2);
  const b = runProgram('from turtle import *\nfd(10)\nlt(90)\nrt(90)\npu()\npd()');
  assert.equal(b.error, null);
});

test('Fehler: Python-Name, Zeile und eine Hilfe', () => {
  assert.equal(err('forwad(100)').type, 'NameError');
  assert.match(err('forwad(100)').message, /Meintest du „forward“/);
  assert.equal(err('prnt("Hallo")').type, 'NameError');
  assert.equal(err('print(Hallo)').type, 'NameError');
  assert.equal(err('print("Hallo)').type, 'SyntaxError');
  assert.equal(err('print("Punkte: " + 5)').type, 'TypeError');
  assert.match(err('print("Punkte: " + 5)').message, /str\(zahl\)/);
  assert.equal(err('x = 1 / 0').type, 'ZeroDivisionError');
  assert.equal(err('for i in range(3)\n    forward(1)').type, 'SyntaxError');
  assert.equal(err('for i in range(3):\nforward(1)').type, 'IndentationError');
  assert.equal(err('if 5 > 3\n    print("ja")').type, 'SyntaxError');
  assert.equal(err('forward 100').type, 'SyntaxError');
  assert.match(err('forward 100').message, /Klammern/);
  assert.equal(err('x = 3\nforward(x, 2)').type, 'TypeError');
  assert.equal(err('color("durchsichtig")').type, 'ValueError');
  assert.equal(err('\n\nforwad(1)').line, 3);
  assert.equal(err('if x = 3:\n    pass').type, 'SyntaxError');
});

test('Noch nicht unterrichtete Sprachmittel werden freundlich abgelehnt', () => {
  for (const code of ['while True:\n    pass', 'def f():\n    pass', 'input("x")', 'import os\nos.system("ls")']) {
    const e = err(code);
    assert.ok(e, code);
  }
  assert.match(err('while 1 < 2:\n    forward(1)').message, /noch nicht/);
});

test('Sicherheit: Endlosschleifen und riesige Zeichnungen enden mit einer Meldung, ohne eval', () => {
  const big = runProgram('for i in range(5000):\n    for j in range(5000):\n        forward(1)');
  assert.ok(big.error, 'viele Durchläufe müssen enden');
  assert.ok(big.steps <= LIMITS.steps + 5);
  assert.ok(runProgram('for i in range(5000):\n    forward(1)').segments.length <= LIMITS.segments);
  assert.ok(runProgram('__import__("os")').error);
  assert.ok(runProgram('x = (1).__class__').error);
  assert.ok(runProgram('print(globals())').error);
});

test('Gleicher Code liefert dieselbe Zeichnung', () => {
  const code = 'for i in range(8):\n    forward(40)\n    left(360 / 8)';
  assert.deepEqual(runProgram(code).segments, runProgram(code).segments);
});

test('closest: Tippfehler-Vorschläge', () => {
  assert.equal(closest('forwad', ['forward', 'left']), 'forward');
  assert.equal(closest('xyzxyz', ['forward', 'left']), null);
});

test('Zeichnungen vergleichen: gleiche Figur auf anderem Weg, Rundungen und echte Abweichungen', () => {
  const square = runProgram('for i in range(4):\n    forward(80)\n    left(90)');
  const rueckwaerts = runProgram('left(90)\nfor i in range(4):\n    forward(80)\n    right(90)\nright(90)');
  const manual = runProgram('forward(80)\nleft(90)\nforward(80)\nleft(90)\nforward(80)\nleft(90)\nforward(80)\nleft(90)');
  assert.ok(compareDrawings(square, manual).ok, 'Schleife und Einzelbefehle ergeben dasselbe Bild');
  assert.ok(compareDrawings(square, rueckwaerts).ok, 'dasselbe Quadrat in die andere Richtung gezeichnet');
  const verschoben = runProgram('penup()\nforward(40)\npendown()\nfor i in range(4):\n    forward(80)\n    left(90)');
  assert.ok(!compareDrawings(square, verschoben).ok, 'gleiche Form an anderer Stelle zählt nicht');
  const kurz = runProgram('for i in range(4):\n    forward(60)\n    left(90)');
  assert.ok(!compareDrawings(square, kurz).ok, 'zu kleines Quadrat');
  const schief = runProgram('for i in range(4):\n    forward(80)\n    left(85)');
  assert.ok(!compareDrawings(square, schief).ok, '85 statt 90 Grad');
  assert.ok(compareDrawings(square, runProgram('')).empty);
  const achteck = (n) => runProgram(`n = ${n}\nfor i in range(n):\n    forward(40)\n    left(360 / n)`);
  assert.ok(compareDrawings(achteck(7), achteck(7)).ok, 'Winkel wie 360 / 7 runden sich weg');
  assert.ok(cellsOf(square).size > 40);
});
