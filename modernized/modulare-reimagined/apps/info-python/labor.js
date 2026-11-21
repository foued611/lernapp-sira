// Code-Labor der Python-Werkstatt: ein Editor, ein Zeichenblatt für die Schildkröte und kleine Missionen von leicht nach schwer.
// Siras Code läuft in python-mini.js (kein eval, kein Netz). Das Labor merkt sich den Stand nur, solange die Seite offen ist.
// Das Zeichenblatt bleibt in beiden Farbschemata weiß, damit gewählte Stiftfarben gut lesbar sind (siehe app.css).
import { createElement, useId, useMemo, useState } from 'react';
import { Button } from '../../komponenten/ui.js';
import { runProgram } from './python-mini.js';
import { boundsOf } from './zeichnung.js';
import { checkMission, missionsOf, targetOf } from './mission.js';

const h = createElement;
const FREE = 'frei';
const ATTEMPTS_FOR_SOLUTION = 2;

/** Zeichenblatt: Siras Linien, das Ziel gestrichelt, die Schildkröte als Pfeil. Mathematische y-Achse nach oben. */
export function Zeichenblatt({ result, target, accent }) {
  const b = boundsOf(result, target || { segments: [], dots: [] });
  const k = b.size / 260;
  const p = (x, y) => [Math.round(x * 100) / 100, Math.round(-y * 100) / 100];
  const lines = (list, props) => list.map((s, i) => {
    const [x1, y1] = p(s.x1, s.y1);
    const [x2, y2] = p(s.x2, s.y2);
    return h('line', { key: i, x1, y1, x2, y2, ...props(s) });
  });
  const t = result.turtle;
  const [tx, ty] = p(t.x, t.y);
  const label = `Zeichenblatt mit ${result.segments.length} Linien${target ? ' und dem gestrichelten Ziel' : ''}`;
  return h(
    'svg',
    { className: 'pw-sheet', viewBox: `${b.x} ${-(b.y + b.size)} ${b.size} ${b.size}`, role: 'img', 'aria-label': label },
    h('line', { className: 'pw-axis', x1: b.x, y1: 0, x2: b.x + b.size, y2: 0, strokeWidth: k }),
    h('line', { className: 'pw-axis', x1: 0, y1: -(b.y + b.size), x2: 0, y2: -b.y, strokeWidth: k }),
    target ? lines(target.segments, () => ({ className: 'pw-ghost', strokeWidth: 3 * k, strokeDasharray: `${6 * k} ${6 * k}` })) : null,
    target ? target.dots.map((d, i) => h('circle', { key: `gd${i}`, className: 'pw-ghost-dot', cx: d.x, cy: -d.y, r: d.r })) : null,
    lines(result.segments, (s) => ({ stroke: s.color, strokeWidth: s.width * k * 1.6, strokeLinecap: 'round' })),
    result.dots.map((d, i) => h('circle', { key: `d${i}`, cx: d.x, cy: -d.y, r: d.r, fill: d.color })),
    h('polygon', {
      className: 'pw-turtle', style: accent ? { '--lc': accent } : undefined, points: '12,0 -8,7 -8,-7',
      transform: `translate(${tx} ${ty}) rotate(${-t.heading}) scale(${k * 1.1})`
    })
  );
}

function Feedback({ result, code, check }) {
  if (!result) return null;
  if (result.error) {
    const text = code.split('\n')[result.error.line - 1];
    return h(
      'div',
      { className: 'pw-msg pw-bad', role: 'alert' },
      h('b', null, `Zeile ${result.error.line} · ${result.error.type}`),
      h('span', null, result.error.message),
      text !== undefined ? h('code', { className: 'pw-line' }, text.trim() || '(leere Zeile)') : null
    );
  }
  if (!check) return null;
  return h('div', { className: `pw-msg ${check.ok ? 'pw-good' : 'pw-warn'}`, role: 'status' }, check.ok ? h('b', null, check.text) : check.text);
}

/**
 * @param {{ unit: object, accent?: string, data: object }} props
 * data.labor[unit.id] = { start, canvas }, data.missions = Missionen aller Seiten.
 */
export function Labor({ unit, accent, data }) {
  const id = useId();
  const missions = useMemo(() => missionsOf(data, unit.id), [data, unit.id]);
  const labor = data?.labor?.[unit.id] || { start: '', canvas: true };
  const [tab, setTab] = useState(FREE);
  const [codes, setCodes] = useState({});
  const [runs, setRuns] = useState({});
  const [solved, setSolved] = useState(() => new Set());
  const [attempts, setAttempts] = useState({});
  const [hints, setHints] = useState({});
  const [solutions, setSolutions] = useState({});

  const mission = missions.find((m) => m.id === tab) || null;
  const startOf = (m) => (m ? m.start ?? '' : labor.start);
  const code = codes[tab] ?? startOf(mission);
  const run = runs[tab];
  const target = useMemo(() => (mission && mission.kind !== 'print' ? targetOf(mission) : null), [mission]);

  const setCode = (value) => setCodes((c) => ({ ...c, [tab]: value }));
  const execute = () => {
    const result = runProgram(code);
    const check = mission ? checkMission(mission, code, result) : null;
    setRuns((r) => ({ ...r, [tab]: { result, check } }));
    if (mission) {
      if (check.ok) setSolved((s) => new Set(s).add(mission.id));
      else setAttempts((a) => ({ ...a, [tab]: (a[tab] || 0) + 1 }));
    }
  };
  const reset = () => {
    setCodes((c) => { const next = { ...c }; delete next[tab]; return next; });
    setRuns((r) => { const next = { ...r }; delete next[tab]; return next; });
  };
  const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); execute(); } };

  const showCanvas = labor.canvas || Boolean(mission && mission.kind !== 'print') || Boolean(run && run.result.segments.length);
  const canSolution = mission && !solved.has(mission.id) && (attempts[tab] || 0) >= ATTEMPTS_FOR_SOLUTION;

  return h(
    'section',
    { className: 'card pw-toy', style: accent ? { '--lc': accent } : undefined },
    h('span', { className: 'pw-label' }, 'Code-Labor'),
    missions.length
      ? h(
        'div',
        { className: 'pw-tabs', role: 'group', 'aria-label': 'Missionen dieser Seite' },
        h('button', { type: 'button', className: 'pw-tab', 'aria-pressed': tab === FREE, onClick: () => setTab(FREE) }, 'Freies Probieren'),
        ...missions.map((m, i) => h(
          'button',
          {
            key: m.id, type: 'button', className: `pw-tab${solved.has(m.id) ? ' done' : ''}`, 'aria-pressed': tab === m.id,
            'aria-label': `Mission ${i + 1}: ${m.title}, Stufe ${m.level}${solved.has(m.id) ? ', geschafft' : ''}`, onClick: () => setTab(m.id)
          },
          `${i + 1}`, solved.has(m.id) ? ' ✓' : ''
        ))
      )
      : null,
    missions.length ? h('p', { className: 'pw-count', 'aria-live': 'polite' }, `${solved.size} von ${missions.length} Missionen geschafft`) : null,
    mission
      ? h(
        'div',
        { className: 'pw-task' },
        h('h3', null, mission.title, h('span', { className: 'pw-level' }, `Stufe ${mission.level} von 3`)),
        h('p', null, mission.task),
        mission.kind === 'print' ? h('p', { className: 'pw-want' }, 'Ziel-Ausgabe: ', h('code', null, mission.expect.join(' / '))) : null
      )
      : h('p', { className: 'pw-task' }, 'Probiere frei aus. Ändere den Code und drücke auf Ausführen.'),
    h('label', { htmlFor: `${id}-code`, className: 'pw-sr' }, 'Dein Python-Code'),
    h('textarea', {
      id: `${id}-code`, className: 'pw-code', value: code, rows: Math.max(6, code.split('\n').length + 1), spellCheck: false,
      autoCapitalize: 'off', autoCorrect: 'off', autoComplete: 'off', onChange: (e) => setCode(e.target.value), onKeyDown: onKey
    }),
    h(
      'div',
      { className: 'pw-actions' },
      h(Button, { onClick: execute }, 'Ausführen'),
      h(Button, { variant: 'ghost', small: true, onClick: reset }, 'Zurücksetzen'),
      mission ? h(Button, { variant: 'ghost', small: true, onClick: () => setHints((s) => ({ ...s, [tab]: true })) }, 'Tipp') : null,
      mission ? h(Button, { variant: 'ghost', small: true, disabled: !canSolution, onClick: () => setSolutions((s) => ({ ...s, [tab]: true })) }, 'Lösung ansehen') : null
    ),
    h('p', { className: 'pw-muted' }, 'Tastenkürzel: Strg + Enter (Mac: Cmd + Enter) führt den Code aus.'),
    mission && hints[tab] ? h('p', { className: 'pw-hint' }, h('b', null, 'Tipp: '), mission.hint) : null,
    mission && !canSolution && !solved.has(mission.id) ? h('p', { className: 'pw-muted' }, `Die Lösung kannst du nach ${ATTEMPTS_FOR_SOLUTION} Versuchen ansehen.`) : null,
    mission && solutions[tab] && canSolution ? h('pre', { className: 'pw-solution', 'aria-label': 'Eine mögliche Lösung' }, mission.solution) : null,
    h(Feedback, { result: run && run.result, code, check: run && run.check }),
    showCanvas && run ? h(Zeichenblatt, { result: run.result, target, accent }) : null,
    showCanvas && !run ? h(Zeichenblatt, { result: runProgram(''), target, accent }) : null,
    run && !run.result.error
      ? h('pre', { className: 'pw-out', 'aria-live': 'polite', 'aria-label': 'Ausgabe' }, run.result.output.length ? run.result.output.join('\n') : 'Keine Ausgabe. Mit print(…) erscheint hier etwas.')
      : null
  );
}
