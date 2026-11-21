// Mini-Python für die Python-Werkstatt: führt die Grundlagen aus, die in Klasse 7 vorkommen, ohne eval und ohne Netz.
// Unterstützt: print, Variablen, Zahlen (ganz und Komma), Text, Rechnen, Vergleiche, and/or/not, if/elif/else,
// for ... in range(...), und die Turtle-Befehle (forward, left, penup, color, circle ...). Alles andere bleibt ein
// verständlicher Fehler, kein Absturz. Die Fehlermeldungen tragen die echten Python-Namen (NameError, SyntaxError ...),
// damit Sira sie später in echtem Python wiedererkennt.
//
// Reine Funktion: kein DOM, kein Zufall, kein Zugriff auf Speicher. Gleicher Code liefert immer dieselbe Zeichnung.
// Quelltext ist hier Daten. Er wird nur gelesen und selbst ausgewertet, nie an JavaScript-eval gegeben.

export const LIMITS = { steps: 20000, segments: 4000, output: 200 };

// Python unterscheidet ganze Zahlen und Kommazahlen (5 und 5.0). Ganze Zahlen sind hier JS-Zahlen, Kommazahlen Flt.
export class Flt { constructor(v) { this.v = v; } }

export class PyError extends Error {
  constructor(type, line, message) { super(message); this.type = type; this.line = line; }
}

const isFlt = (x) => x instanceof Flt;
const isNum = (x) => typeof x === 'number' || isFlt(x);
const num = (x) => (isFlt(x) ? x.v : x);

/** Anzeige wie Python: 5.0 bleibt 5.0, Wahrheitswerte großgeschrieben. */
export function show(x) {
  if (isFlt(x)) return Number.isInteger(x.v) ? `${x.v}.0` : String(x.v);
  if (x === true) return 'True';
  if (x === false) return 'False';
  if (x === null) return 'None';
  return String(x);
}
const typeName = (x) => (isFlt(x) ? 'Kommazahl' : typeof x === 'number' ? 'ganze Zahl' : typeof x === 'string' ? 'Text' : typeof x === 'boolean' ? 'Wahrheitswert' : 'Objekt');

// ---------- Farben: nur bekannte Namen und #RRGGBB, damit nichts Fremdes in die Zeichnung gelangt ----------
export const COLORS = {
  black: '#000000', white: '#FFFFFF', red: '#E53935', green: '#2E9E44', blue: '#1E6FE0', yellow: '#F2C200', orange: '#F57C00',
  purple: '#8E44AD', pink: '#F06292', brown: '#8D5B3A', gray: '#808080', grey: '#808080', cyan: '#00B8D4', magenta: '#D81B8F'
};

// ---------- Hilfsfunktionen für Tippfehler-Hinweise ----------
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
/** Der ähnlichste bekannte Name (höchstens zwei Buchstaben Unterschied), sonst null. */
export function closest(word, known) {
  let best = null;
  let bestD = 3;
  for (const k of known) {
    const d = distance(word.toLowerCase(), k.toLowerCase());
    if (d < bestD) { best = k; bestD = d; }
  }
  return best;
}

// ---------- Zerlegen einer Zeile in Wörter, Zahlen, Texte und Zeichen ----------
const OPS2 = ['==', '!=', '<=', '>=', '//', '**', '+=', '-=', '*=', '/='];
const OPS1 = '+-*/%()<>=,:.';
const KEYWORDS = new Set(['and', 'or', 'not', 'in', 'for', 'if', 'elif', 'else', 'True', 'False', 'None', 'import', 'from', 'as', 'pass']);
const UNSUPPORTED = new Set(['while', 'def', 'class', 'return', 'try', 'with', 'lambda', 'global', 'break', 'continue', 'del', 'assert', 'raise', 'yield', 'is']);

function tokenize(text, line) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === ' ') { i++; continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(text[i + 1] || ''))) {
      const m = /^(\d+\.?\d*|\.\d+)/.exec(text.slice(i));
      const raw = m[0];
      out.push({ t: 'num', v: raw.includes('.') ? new Flt(Number(raw)) : Number(raw), raw });
      i += raw.length;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      let s = '';
      while (j < text.length && text[j] !== c) {
        if (text[j] === '\\' && j + 1 < text.length) {
          const n = text[j + 1];
          s += n === 'n' ? '\n' : n;
          j += 2;
        } else { s += text[j]; j++; }
      }
      if (j >= text.length) throw new PyError('SyntaxError', line, 'Ein Text wurde nicht beendet: Am Ende fehlt ein Anführungszeichen.');
      out.push({ t: 'str', v: s });
      i = j + 1;
      continue;
    }
    const nm = /^[\p{L}_][\p{L}\p{N}_]*/u.exec(text.slice(i));
    if (nm) { out.push({ t: 'name', v: nm[0] }); i += nm[0].length; continue; }
    const two = text.slice(i, i + 2);
    if (OPS2.includes(two)) { out.push({ t: 'op', v: two }); i += 2; continue; }
    if (OPS1.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    throw new PyError('SyntaxError', line, `Das Zeichen „${c}“ versteht Python hier nicht.`);
  }
  return out;
}

/** Kommentar ab # abschneiden, aber nicht innerhalb eines Textes. */
function stripComment(text) {
  let q = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === '#') return text.slice(0, i);
  }
  return text;
}

// ---------- Ausdrücke ----------
class Parser {
  constructor(tokens, line) { this.tokens = tokens; this.pos = 0; this.line = line; }
  peek(o = 0) { return this.tokens[this.pos + o]; }
  next() { return this.tokens[this.pos++]; }
  isOp(v, o = 0) { const t = this.peek(o); return t && t.t === 'op' && t.v === v; }
  isWord(v) { const t = this.peek(); return t && t.t === 'name' && t.v === v; }
  fail(msg) { throw new PyError('SyntaxError', this.line, msg); }
  expectOp(v, msg) { if (!this.isOp(v)) this.fail(msg || `Hier fehlt „${v}“.`); return this.next(); }
  atEnd() { return this.pos >= this.tokens.length; }
  expectEnd() {
    if (this.atEnd()) return;
    const t = this.peek();
    const before = this.tokens[this.pos - 1];
    if (before && before.t === 'name' && (Object.hasOwn(TURTLE_FUNCS, before.v) || Object.hasOwn(BUILTINS, before.v))) {
      this.fail(`Hinter ${before.v} fehlen die Klammern. Richtig ist zum Beispiel ${before.v}(…).`);
    }
    if (t.t === 'op' && t.v === ')') this.fail('Eine Klammer „)“ ist zu viel oder steht an der falschen Stelle.');
    this.fail(`Das passt hier nicht hin: „${t.raw ?? t.v}“. Fehlt vielleicht ein Operator oder ein Komma?`);
  }

  expr() { return this.orExpr(); }
  orExpr() { let l = this.andExpr(); while (this.isWord('or')) { this.next(); l = { k: 'or', l, r: this.andExpr() }; } return l; }
  andExpr() { let l = this.notExpr(); while (this.isWord('and')) { this.next(); l = { k: 'and', l, r: this.notExpr() }; } return l; }
  notExpr() { if (this.isWord('not')) { this.next(); return { k: 'not', e: this.notExpr() }; } return this.cmp(); }
  cmp() {
    const l = this.sum();
    const t = this.peek();
    if (t && t.t === 'op' && ['==', '!=', '<', '>', '<=', '>='].includes(t.v)) {
      this.next();
      const r = this.sum();
      const t2 = this.peek();
      if (t2 && t2.t === 'op' && ['==', '!=', '<', '>', '<=', '>='].includes(t2.v)) this.fail('Zwei Vergleiche hintereinander gehen hier nicht. Nimm and: a < b and b < c.');
      return { k: 'cmp', op: t.v, l, r, line: this.line };
    }
    if (t && t.t === 'op' && t.v === '=') this.fail('Zum Vergleichen nimmt man zwei Gleichheitszeichen: ==. Ein einzelnes = speichert einen Wert.');
    return l;
  }
  sum() {
    let l = this.term();
    while (this.isOp('+') || this.isOp('-')) { const op = this.next().v; l = { k: 'bin', op, l, r: this.term(), line: this.line }; }
    return l;
  }
  term() {
    let l = this.unary();
    while (this.isOp('*') || this.isOp('/') || this.isOp('//') || this.isOp('%')) { const op = this.next().v; l = { k: 'bin', op, l, r: this.unary(), line: this.line }; }
    return l;
  }
  unary() {
    if (this.isOp('-')) { this.next(); return { k: 'neg', e: this.unary(), line: this.line }; }
    if (this.isOp('+')) { this.next(); return this.unary(); }
    return this.power();
  }
  power() {
    const base = this.atom();
    if (this.isOp('**')) { this.next(); return { k: 'bin', op: '**', l: base, r: this.unary(), line: this.line }; }
    return base;
  }
  atom() {
    const t = this.next();
    if (!t) this.fail('Der Ausdruck ist nicht fertig: Hier fehlt noch etwas.');
    if (t.t === 'num') return { k: 'lit', v: t.v };
    if (t.t === 'str') return { k: 'lit', v: t.v };
    if (t.t === 'op' && t.v === '(') {
      const e = this.expr();
      if (!this.isOp(')')) this.fail('Eine Klammer wurde nicht geschlossen: Es fehlt „)“.');
      this.next();
      return e;
    }
    if (t.t === 'name') return this.nameAtom(t);
    if (t.t === 'op') this.fail(`Hier darf „${t.v}“ nicht stehen.`);
    return this.fail('Das verstehe ich hier nicht.');
  }
  nameAtom(t) {
    if (t.v === 'True') return { k: 'lit', v: true };
    if (t.v === 'False') return { k: 'lit', v: false };
    if (t.v === 'None') return { k: 'lit', v: null };
    if (UNSUPPORTED.has(t.v)) throw new PyError('SyntaxError', this.line, `„${t.v}“ gibt es in dieser Werkstatt noch nicht. Es ist Stoff für später.`);
    if (KEYWORDS.has(t.v)) this.fail(`„${t.v}“ steht hier an der falschen Stelle.`);
    let obj = null;
    let name = t.v;
    if (this.isOp('.')) {
      this.next();
      const m = this.next();
      if (!m || m.t !== 'name') this.fail('Nach dem Punkt muss ein Befehl stehen, zum Beispiel t.forward(50).');
      obj = t.v;
      name = m.v;
      if (!this.isOp('(')) this.fail(`Nach ${name} fehlen die Klammern: ${obj}.${name}(…).`);
    }
    if (this.isOp('(')) {
      this.next();
      const args = [];
      if (!this.isOp(')')) {
        for (;;) {
          args.push(this.expr());
          if (this.isOp(',')) { this.next(); if (this.isOp(')')) break; continue; }
          break;
        }
      }
      if (!this.isOp(')')) this.fail('Eine Klammer wurde nicht geschlossen: Es fehlt „)“.');
      this.next();
      return { k: 'call', obj, name, args, line: this.line };
    }
    return { k: 'name', n: name, line: this.line };
  }
}

// ---------- Programm in Zeilen und Blöcke gliedern ----------
function toLines(code) {
  const lines = [];
  String(code).replace(/\r\n?/g, '\n').split('\n').forEach((raw, idx) => {
    const text = stripComment(raw.replace(/\t/g, '    ')).replace(/\s+$/, '');
    if (!text.trim()) return;
    lines.push({ indent: text.length - text.trimStart().length, text: text.trim(), line: idx + 1 });
  });
  return lines;
}

function endsWithColon(tokens, line, what) {
  const last = tokens[tokens.length - 1];
  if (!last || last.t !== 'op' || last.v !== ':') throw new PyError('SyntaxError', line, `Am Ende der ${what}-Zeile fehlt ein Doppelpunkt „:“.`);
  return tokens.slice(0, -1);
}

function parseProgram(code) {
  const lines = toLines(code);
  let i = 0;

  function block(indent) {
    const body = [];
    while (i < lines.length && lines[i].indent >= indent) {
      const ln = lines[i];
      if (ln.indent > indent) throw new PyError('IndentationError', ln.line, 'Diese Zeile ist eingerückt, obwohl davor keine Zeile mit Doppelpunkt steht.');
      body.push(statement(ln));
    }
    return body;
  }

  function subBlock(header) {
    const next = lines[i];
    if (!next || next.indent <= header.indent) throw new PyError('IndentationError', header.line, `Nach dem Doppelpunkt in Zeile ${header.line} muss eine eingerückte Zeile folgen.`);
    const body = block(next.indent);
    return body;
  }

  function statement(ln) {
    i++;
    const tokens = tokenize(ln.text, ln.line);
    const first = tokens[0];
    const word = first && first.t === 'name' ? first.v : null;
    if (word === 'for') return forStatement(ln, tokens);
    if (word === 'if') return ifStatement(ln, tokens);
    if (word === 'elif' || word === 'else') throw new PyError('SyntaxError', ln.line, `„${word}“ gehört zu einem if davor und steht hier allein.`);
    if (word === 'import' || word === 'from') return { k: 'import', line: ln.line };
    if (word === 'pass') return { k: 'pass', line: ln.line };
    if (word && UNSUPPORTED.has(word)) throw new PyError('SyntaxError', ln.line, `„${word}“ gibt es in dieser Werkstatt noch nicht. Es ist Stoff für später.`);
    // Zuweisung: name = ausdruck, name += ausdruck
    if (first && first.t === 'name' && tokens[1] && tokens[1].t === 'op' && ['=', '+=', '-=', '*=', '/='].includes(tokens[1].v) && !KEYWORDS.has(first.v)) {
      const p = new Parser(tokens.slice(2), ln.line);
      if (p.atEnd()) p.fail('Rechts vom Gleichheitszeichen fehlt ein Wert.');
      const e = p.expr();
      p.expectEnd();
      return { k: 'assign', name: first.v, op: tokens[1].v, e, line: ln.line };
    }
    const p = new Parser(tokens, ln.line);
    const e = p.expr();
    p.expectEnd();
    return { k: 'expr', e, line: ln.line };
  }

  function forStatement(ln, tokens) {
    const t = endsWithColon(tokens, ln.line, 'for');
    if (!t[1] || t[1].t !== 'name' || KEYWORDS.has(t[1].v) || !t[2] || t[2].v !== 'in') throw new PyError('SyntaxError', ln.line, 'Eine for-Zeile sieht so aus: for i in range(5):');
    const p = new Parser(t.slice(3), ln.line);
    if (p.atEnd()) p.fail('Nach „in“ fehlt, wie oft oder worüber die Schleife läuft, zum Beispiel range(5).');
    const iter = p.expr();
    p.expectEnd();
    return { k: 'for', v: t[1].v, iter, body: subBlock(ln), line: ln.line };
  }

  function ifStatement(ln, tokens) {
    const branches = [];
    let orelse = null;
    let head = ln;
    let headTokens = tokens;
    for (;;) {
      const t = endsWithColon(headTokens, head.line, headTokens[0].v);
      const p = new Parser(t.slice(1), head.line);
      if (p.atEnd()) p.fail(`Nach „${headTokens[0].v}“ fehlt die Bedingung.`);
      const cond = p.expr();
      p.expectEnd();
      branches.push({ cond, body: subBlock(head) });
      const nx = lines[i];
      if (!nx || nx.indent !== ln.indent) break;
      const nt = tokenize(nx.text, nx.line);
      if (nt[0].t === 'name' && nt[0].v === 'elif') { i++; head = nx; headTokens = nt; continue; }
      if (nt[0].t === 'name' && nt[0].v === 'else') {
        i++;
        const e = endsWithColon(nt, nx.line, 'else');
        if (e.length !== 1) throw new PyError('SyntaxError', nx.line, 'Hinter else steht nur ein Doppelpunkt: else:');
        orelse = subBlock(nx);
      }
      break;
    }
    return { k: 'if', branches, orelse, line: ln.line };
  }

  const first = lines[0];
  if (first && first.indent > 0) throw new PyError('IndentationError', first.line, 'Das Programm darf nicht eingerückt beginnen. Die erste Zeile steht ganz links.');
  const body = block(0);
  return body;
}

// ---------- Ausführen ----------
const TURTLE_FUNCS = {
  forward: ['Schritte'], fd: ['Schritte'], backward: ['Schritte'], back: ['Schritte'], bk: ['Schritte'],
  left: ['Grad'], lt: ['Grad'], right: ['Grad'], rt: ['Grad'],
  penup: [], pu: [], up: [], pendown: [], pd: [], down: [],
  color: ['Farbe'], pencolor: ['Farbe'], pensize: ['Dicke'], width: ['Dicke'],
  goto: ['x', 'y'], setpos: ['x', 'y'], setposition: ['x', 'y'], setheading: ['Grad'], seth: ['Grad'], home: [],
  circle: ['Radius'], dot: ['Größe'], speed: ['Tempo'], hideturtle: [], ht: [], showturtle: [], st: []
};
const BUILTINS = { print: null, str: ['x'], int: ['x'], float: ['x'], len: ['text'], abs: ['x'], round: ['x'], min: ['a', 'b'], max: ['a', 'b'], range: null };
const KNOWN_CALLS = [...Object.keys(TURTLE_FUNCS), ...Object.keys(BUILTINS)];
export const TURTLE_COMMANDS = Object.keys(TURTLE_FUNCS);

function arith(op, a, b, line) {
  if (op === '+' && typeof a === 'string' && typeof b === 'string') return a + b;
  if (op === '*' && typeof a === 'string' && typeof b === 'number') return b > 0 ? a.repeat(Math.min(b, 1000)) : '';
  if (op === '*' && typeof a === 'number' && typeof b === 'string') return a > 0 ? b.repeat(Math.min(a, 1000)) : '';
  if (!isNum(a) || !isNum(b)) {
    const hint = op === '+' && (typeof a === 'string' || typeof b === 'string') ? ' Tipp: Mit str(zahl) wird eine Zahl zu Text.' : '';
    throw new PyError('TypeError', line, `Mit „${op}“ lassen sich ${typeName(a)} und ${typeName(b)} nicht verrechnen.${hint}`);
  }
  const x = num(a);
  const y = num(b);
  const float = isFlt(a) || isFlt(b);
  const wrap = (v) => (float ? new Flt(v) : v);
  switch (op) {
    case '+': return wrap(x + y);
    case '-': return wrap(x - y);
    case '*': return wrap(x * y);
    case '/':
      if (y === 0) throw new PyError('ZeroDivisionError', line, 'Durch 0 kann man nicht teilen.');
      return new Flt(x / y);
    case '//':
      if (y === 0) throw new PyError('ZeroDivisionError', line, 'Durch 0 kann man nicht teilen.');
      return wrap(Math.floor(x / y));
    case '%':
      if (y === 0) throw new PyError('ZeroDivisionError', line, 'Durch 0 kann man nicht teilen.');
      return wrap(x - y * Math.floor(x / y));
    case '**': return float || y < 0 ? new Flt(x ** y) : x ** y;
    default: throw new PyError('SyntaxError', line, `Unbekannter Operator ${op}.`);
  }
}

function compare(op, a, b, line) {
  const eq = (isNum(a) && isNum(b) ? num(a) === num(b) : a === b);
  if (op === '==') return eq;
  if (op === '!=') return !eq;
  const ok = (isNum(a) && isNum(b)) || (typeof a === 'string' && typeof b === 'string');
  if (!ok) throw new PyError('TypeError', line, `${typeName(a)} und ${typeName(b)} lassen sich nicht mit „${op}“ vergleichen.`);
  const x = isNum(a) ? num(a) : a;
  const y = isNum(b) ? num(b) : b;
  return op === '<' ? x < y : op === '>' ? x > y : op === '<=' ? x <= y : x >= y;
}

const truthy = (v) => (isFlt(v) ? v.v !== 0 : v === null ? false : typeof v === 'string' ? v.length > 0 : Boolean(v));

/**
 * Führt ein Programm aus.
 * @param {string} code Python-Quelltext
 * @returns {{ segments: object[], dots: object[], output: string[], error: ?{type:string,line:number,message:string}, turtle: object, steps: number, vars: object }}
 */
export function runProgram(code) {
  const state = { x: 0, y: 0, heading: 0, pen: true, color: COLORS.black, width: 2 };
  const segments = [];
  const dots = [];
  const output = [];
  const vars = new Map();
  const aliases = new Set(['turtle']);
  let steps = 0;
  let error = null;

  const tick = (line) => {
    steps++;
    if (steps > LIMITS.steps) throw new PyError('RuntimeError', line, 'Das Programm läuft sehr lange. Vielleicht wiederholt sich etwas zu oft?');
  };

  const move = (dist, line) => {
    const r = (state.heading * Math.PI) / 180;
    const nx = state.x + Math.cos(r) * dist;
    const ny = state.y + Math.sin(r) * dist;
    if (state.pen) {
      if (segments.length >= LIMITS.segments) throw new PyError('RuntimeError', line, 'Das sind zu viele Linien für das Zeichenblatt.');
      segments.push({ x1: state.x, y1: state.y, x2: nx, y2: ny, color: state.color, width: state.width });
    }
    state.x = nx;
    state.y = ny;
    if (Math.abs(nx) > 1e6 || Math.abs(ny) > 1e6) throw new PyError('ValueError', line, 'Die Schildkröte ist viel zu weit weggelaufen.');
  };
  const turn = (deg) => { state.heading = (((state.heading + deg) % 360) + 360) % 360; };

  const numArg = (v, fname, label, line) => {
    if (!isNum(v)) throw new PyError('TypeError', line, `${fname}() erwartet bei „${label}“ eine Zahl, aber bekam ${typeName(v)}.`);
    return num(v);
  };

  function callTurtle(name, args, line) {
    const spec = TURTLE_FUNCS[name];
    if (args.length !== spec.length) {
      const want = spec.length === 0 ? 'keine Angabe' : spec.length === 1 ? `1 Angabe (${spec[0]})` : `${spec.length} Angaben (${spec.join(', ')})`;
      throw new PyError('TypeError', line, `${name}() braucht ${want}, aber du hast ${args.length} gegeben.`);
    }
    const n = (i) => numArg(args[i], name, spec[i], line);
    switch (name) {
      case 'forward': case 'fd': move(n(0), line); break;
      case 'backward': case 'back': case 'bk': move(-n(0), line); break;
      case 'left': case 'lt': turn(n(0)); break;
      case 'right': case 'rt': turn(-n(0)); break;
      case 'penup': case 'pu': case 'up': state.pen = false; break;
      case 'pendown': case 'pd': case 'down': state.pen = true; break;
      case 'color': case 'pencolor': {
        const c = args[0];
        const hex = typeof c === 'string' ? (COLORS[c.toLowerCase()] || (/^#[0-9A-Fa-f]{6}$/.test(c) ? c : null)) : null;
        if (!hex) throw new PyError('ValueError', line, `Die Farbe „${show(c)}“ kennt die Werkstatt nicht. Probiere zum Beispiel "red", "blue", "green", "orange" oder "purple".`);
        state.color = hex;
        break;
      }
      case 'pensize': case 'width': state.width = Math.max(1, Math.min(20, n(0))); break;
      case 'goto': case 'setpos': case 'setposition': {
        const nx = n(0);
        const ny = n(1);
        if (state.pen) segments.push({ x1: state.x, y1: state.y, x2: nx, y2: ny, color: state.color, width: state.width });
        state.x = nx;
        state.y = ny;
        break;
      }
      case 'setheading': case 'seth': turn(n(0) - state.heading); break;
      case 'home': {
        if (state.pen) segments.push({ x1: state.x, y1: state.y, x2: 0, y2: 0, color: state.color, width: state.width });
        state.x = 0; state.y = 0; state.heading = 0;
        break;
      }
      case 'circle': {
        const r = n(0);
        const sides = 48;
        const step = 360 / sides;
        const len = 2 * Math.abs(r) * Math.sin(Math.PI / sides);
        const dir = r >= 0 ? 1 : -1;
        turn((dir * step) / 2);
        for (let k = 0; k < sides; k++) { move(len, line); turn(dir * step); }
        turn((-dir * step) / 2);
        break;
      }
      case 'dot': dots.push({ x: state.x, y: state.y, r: Math.max(1, n(0)) / 2, color: state.color }); break;
      default: break; // speed, hideturtle, showturtle ändern die Zeichnung nicht
    }
    return null;
  }

  function callBuiltin(name, args, line) {
    const need = (n, text) => { if (args.length !== n) throw new PyError('TypeError', line, `${name}() braucht ${text}, aber du hast ${args.length} gegeben.`); };
    switch (name) {
      case 'print':
        output.push(args.map(show).join(' '));
        if (output.length > LIMITS.output) throw new PyError('RuntimeError', line, 'Das sind zu viele Ausgabezeilen.');
        return null;
      case 'str': need(1, '1 Angabe'); return show(args[0]);
      case 'int': {
        need(1, '1 Angabe');
        const v = args[0];
        if (typeof v === 'string') {
          if (!/^\s*-?\d+\s*$/.test(v)) throw new PyError('ValueError', line, `Aus dem Text „${v}“ lässt sich keine ganze Zahl machen.`);
          return Number(v.trim());
        }
        if (typeof v === 'boolean') return v ? 1 : 0;
        if (isNum(v)) return Math.trunc(num(v));
        throw new PyError('TypeError', line, 'int() erwartet eine Zahl oder einen Text mit Ziffern.');
      }
      case 'float': {
        need(1, '1 Angabe');
        const v = args[0];
        if (typeof v === 'string') {
          if (!/^\s*-?\d+(\.\d+)?\s*$/.test(v)) throw new PyError('ValueError', line, `Aus dem Text „${v}“ lässt sich keine Kommazahl machen.`);
          return new Flt(Number(v));
        }
        if (isNum(v)) return new Flt(num(v));
        throw new PyError('TypeError', line, 'float() erwartet eine Zahl oder einen Text mit Ziffern.');
      }
      case 'len': need(1, '1 Angabe'); if (typeof args[0] !== 'string') throw new PyError('TypeError', line, 'len() zählt hier nur die Zeichen eines Textes.'); return args[0].length;
      case 'abs': need(1, '1 Angabe'); if (!isNum(args[0])) throw new PyError('TypeError', line, 'abs() erwartet eine Zahl.'); return isFlt(args[0]) ? new Flt(Math.abs(args[0].v)) : Math.abs(args[0]);
      case 'round': need(1, '1 Angabe'); if (!isNum(args[0])) throw new PyError('TypeError', line, 'round() erwartet eine Zahl.'); return Math.round(num(args[0]));
      case 'min': case 'max': {
        need(2, '2 Angaben');
        if (!args.every(isNum)) throw new PyError('TypeError', line, `${name}() vergleicht hier nur Zahlen.`);
        const pick = name === 'min' ? Math.min(num(args[0]), num(args[1])) : Math.max(num(args[0]), num(args[1]));
        return args.some(isFlt) ? new Flt(pick) : pick;
      }
      case 'range': throw new PyError('TypeError', line, 'range(…) steht in einer for-Zeile: for i in range(5):');
      default: throw new PyError('NameError', line, `„${name}“ ist nicht bekannt.`);
    }
  }

  function evalExpr(e) {
    switch (e.k) {
      case 'lit': return e.v;
      case 'name': {
        if (vars.has(e.n)) return vars.get(e.n);
        if (aliases.has(e.n)) return null;
        if (Object.hasOwn(TURTLE_FUNCS, e.n) || Object.hasOwn(BUILTINS, e.n)) throw new PyError('NameError', e.line, `„${e.n}“ ist ein Befehl und braucht Klammern: ${e.n}(…).`);
        const guess = closest(e.n, [...vars.keys(), ...KNOWN_CALLS]);
        throw new PyError('NameError', e.line, `„${e.n}“ ist nicht definiert. Hast du ihm vorher einen Wert gegeben?${guess ? ` Meintest du „${guess}“?` : ''}`);
      }
      case 'neg': {
        const v = evalExpr(e.e);
        if (!isNum(v)) throw new PyError('TypeError', e.line, 'Ein Minus davor geht nur bei Zahlen.');
        return isFlt(v) ? new Flt(-v.v) : -v;
      }
      case 'bin': return arith(e.op, evalExpr(e.l), evalExpr(e.r), e.line);
      case 'cmp': return compare(e.op, evalExpr(e.l), evalExpr(e.r), e.line);
      case 'and': { const l = evalExpr(e.l); return truthy(l) ? evalExpr(e.r) : l; }
      case 'or': { const l = evalExpr(e.l); return truthy(l) ? l : evalExpr(e.r); }
      case 'not': return !truthy(evalExpr(e.e));
      case 'call': return evalCall(e);
      default: throw new PyError('SyntaxError', e.line || 0, 'Das verstehe ich nicht.');
    }
  }

  function evalCall(e) {
    const { name, line } = e;
    if (e.obj !== null && !aliases.has(e.obj) && !vars.has(e.obj)) {
      const guess = closest(e.obj, [...aliases, ...vars.keys()]);
      throw new PyError('NameError', line, `„${e.obj}“ ist nicht definiert.${guess ? ` Meintest du „${guess}“?` : ''}`);
    }
    if (e.obj !== null && vars.has(e.obj) && !aliases.has(e.obj)) throw new PyError('AttributeError', line, `„${e.obj}“ ist keine Schildkröte und hat keinen Befehl ${name}.`);
    const args = e.args.map(evalExpr);
    if (e.obj === null && name === 'input') throw new PyError('NotImplementedError', line, 'input() gibt es in dieser Werkstatt noch nicht. Du kannst Werte stattdessen in Variablen speichern.');
    if (e.obj !== null && name === 'Turtle') return null;
    if (e.obj !== null && name === 'Screen') return null;
    if (Object.hasOwn(TURTLE_FUNCS, name) && (e.obj !== null || !vars.has(name))) return callTurtle(name, args, line);
    if (e.obj !== null) {
      const guess = closest(name, Object.keys(TURTLE_FUNCS));
      throw new PyError('AttributeError', line, `Die Schildkröte kennt „${name}“ nicht.${guess ? ` Meintest du „${guess}“?` : ''}`);
    }
    if (Object.hasOwn(BUILTINS, name)) return callBuiltin(name, args, line);
    const guess = closest(name, KNOWN_CALLS);
    throw new PyError('NameError', line, `„${name}“ kennt Python nicht.${guess ? ` Meintest du „${guess}“?` : ' Schreibweise prüfen: Groß- und Kleinschreibung zählt.'}`);
  }

  function rangeOf(call) {
    const a = call.args.map(evalExpr);
    if (a.length < 1 || a.length > 3) throw new PyError('TypeError', call.line, 'range() braucht 1, 2 oder 3 Zahlen, zum Beispiel range(5) oder range(1, 6).');
    if (!a.every((v) => typeof v === 'number')) throw new PyError('TypeError', call.line, 'range() braucht ganze Zahlen, keine Kommazahlen oder Texte.');
    const [start, stop, step] = a.length === 1 ? [0, a[0], 1] : [a[0], a[1], a[2] ?? 1];
    if (step === 0) throw new PyError('ValueError', call.line, 'Der Schritt von range() darf nicht 0 sein.');
    const out = [];
    for (let v = start; step > 0 ? v < stop : v > stop; v += step) {
      out.push(v);
      if (out.length > 5000) throw new PyError('RuntimeError', call.line, 'Diese Schleife hat sehr viele Durchläufe. Nimm eine kleinere Zahl.');
    }
    return out;
  }

  function execBlock(body) { body.forEach(execStatement); }

  function execStatement(s) {
    tick(s.line);
    switch (s.k) {
      case 'import': case 'pass': break;
      case 'expr': evalExpr(s.e); break;
      case 'assign': {
        if (s.e.k === 'call' && s.e.obj !== null && s.e.name === 'Turtle' && s.op === '=') { aliases.add(s.name); vars.delete(s.name); break; }
        if (s.op === '=' && s.e.k === 'call' && s.e.obj !== null && s.e.name === 'Screen') break;
        const value = evalExpr(s.e);
        if (s.op === '=') vars.set(s.name, value);
        else {
          if (!vars.has(s.name)) throw new PyError('NameError', s.line, `„${s.name}“ hat noch keinen Wert, deshalb geht ${s.op} nicht.`);
          vars.set(s.name, arith(s.op[0], vars.get(s.name), value, s.line));
        }
        aliases.delete(s.name);
        break;
      }
      case 'for': {
        const items = s.iter.k === 'call' && s.iter.obj === null && s.iter.name === 'range' ? rangeOf(s.iter) : (() => {
          const v = evalExpr(s.iter);
          if (typeof v === 'string') return [...v];
          throw new PyError('TypeError', s.line, 'Hinter „in“ muss range(…) oder ein Text stehen.');
        })();
        for (const item of items) { vars.set(s.v, item); execBlock(s.body); }
        break;
      }
      case 'if': {
        for (const b of s.branches) { if (truthy(evalExpr(b.cond))) { execBlock(b.body); return; } }
        if (s.orelse) execBlock(s.orelse);
        break;
      }
      default: break;
    }
  }

  try {
    execBlock(parseProgram(code));
  } catch (e) {
    if (!(e instanceof PyError)) throw e;
    error = { type: e.type, line: e.line, message: e.message };
  }
  const plainVars = {};
  vars.forEach((v, k) => { plainVars[k] = show(v); });
  return { segments, dots, output, error, turtle: { ...state }, steps, vars: plainVars };
}
