// Sicherung: den gesamten Lernstand als JSON-Datei sichern und wieder einspielen (RULE-256).
// Herkunft: legacy/modulare/core/js/views/backup.js. Die Prüfung der Datei macht der Speicher (speicher/validate.js).
import { createElement, useState } from 'react';
import { PROFILE_KEY } from '../speicher/index.js';
import { Button } from '../komponenten/ui.js';

const h = createElement;

export const NAME_IN_FILE = 'Die Datei enthält deinen Namen.';
export const NO_NAME_IN_FILE = 'Die Datei enthält keinen Namen.';
export const NO_STORAGE = 'Ohne Speicher gibt es nichts zu sichern.';

export const exportFileName = (day) => `lernwerkstatt-sicherung-${day}.json`;

/** Kopie des Exports ohne Namen. Das Original bleibt unverändert. Der Namensfeld bleibt, leer. */
export function withoutName(exported) {
  const docs = { ...exported.docs };
  if (docs[PROFILE_KEY]) docs[PROFILE_KEY] = { ...docs[PROFILE_KEY], name: '' };
  return { ...exported, docs };
}

/**
 * Der Inhalt der Datei. includeName steht im Aufruf, nicht hier: SEC-007 ist offen und wird nicht
 * von diesem Modul entschieden. Der Standard bleibt true, wie der Legacy-Stand (shell.js:122).
 */
export function exportPayload(exported, { includeName = true } = {}) {
  return includeName ? exported : withoutName(exported);
}

/** Baut den Dateiinhalt. Schreibt nichts außer dem Aufruf von exportAll. */
export async function buildExport(handle, { includeName = true, day }) {
  if (!handle) return { ok: false, error: NO_STORAGE };
  try {
    const exported = await handle.exportAll();
    return {
      ok: true,
      fileName: exportFileName(day),
      text: JSON.stringify(exportPayload(exported, { includeName }), null, 2)
    };
  } catch (error) {
    return { ok: false, error: 'Die Sicherung konnte nicht erstellt werden.', cause: error };
  }
}

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** Ein Satz über den Plan einer Einspielung. Die Zahlen stammen vom Speicher (planImport). Einzahl und Mehrzahl stimmen. */
export function planSentence(plan) {
  const replaced = plan.docs.filter((doc) => doc.status === 'replaced').length;
  const stands = `Die Sicherung enthält ${count(plan.docs.length, 'Speicherstand', 'Speicherstände')}.`;
  let replacing = `${replaced} vorhandene Speicherstände werden ersetzt.`;
  if (replaced === 0) replacing = 'Kein vorhandener Speicherstand wird ersetzt.';
  if (replaced === 1) replacing = 'Ein vorhandener Speicherstand wird ersetzt.';
  const events = `${count(plan.logNew, 'Ereignis ist neu', 'Ereignisse sind neu')}, `
    + `${plan.logDuplicates} ${plan.logDuplicates === 1 ? 'ist' : 'sind'} schon vorhanden.`;
  return [stands, replacing, events].join(' ');
}

// Die Browser-Aufrufe (Datei speichern, Seite neu laden) kommen von main.js über setBrowserPorts.
// So greift dieses Modul nie selbst auf document oder window zu. Ohne Port tut der Aufruf nichts.
const ports = { saveFile: () => {}, reloadPage: () => {} };

export function setBrowserPorts(next) {
  Object.assign(ports, next);
}

/**
 * Sicherung-Bereich. Einspielen ist zweistufig: erst den Plan zeigen, dann bestätigen. Legacy spielte
 * sofort ein und lud neu (backup.js:14-16, shell.js:157-159). Der Speicher verlangt confirm: true (RULE-126).
 */
export function Sicherung({ handle, day, includeName = true }) {
  const [note, setNote] = useState(null);
  const [chosen, setChosen] = useState(null);

  async function download() {
    const built = await buildExport(handle, { includeName, day });
    if (!built.ok) {
      setNote(built.error);
      return;
    }
    ports.saveFile(built.text, built.fileName);
  }

  async function choose(event) {
    const file = event.target.files && event.target.files[0];
    if (!file || !handle) return;
    const planned = await handle.planImport(file);
    if (!planned.ok) {
      setChosen(null);
      setNote(planned.error);
      return;
    }
    setNote(null);
    setChosen({ file, plan: planned.plan });
  }

  async function restore() {
    if (!chosen || !handle) return;
    const done = await handle.importAll(chosen.file, { confirm: true });
    if (!done.ok) {
      setNote(done.error);
      return;
    }
    setNote('Sicherung eingespielt. Die Seite wird neu geladen.');
    ports.reloadPage();
  }

  // Die Sicherung als Zeile unter der Seite, wie legacy views/home.js (Links in der Fußzeile).
  return h(
    'div',
    { className: 'sicherung', 'aria-label': 'Sicherung' },
    h(
      'p',
      { className: 'muted', style: { fontSize: '13px' } },
      h('button', { type: 'button', className: 'link', disabled: !handle, onClick: download, 'aria-describedby': 'export-hint' }, 'Fortschritt sichern (Datei)'),
      ' · ',
      h(
        'label',
        { className: 'link', style: { cursor: 'pointer' } },
        'Sicherung einspielen',
        h('input', { type: 'file', accept: 'application/json,.json', hidden: true, disabled: !handle, onChange: choose })
      ),
      note ? h('span', { role: 'status' }, ` ${note}`) : null
    ),
    // Der Hinweis steht als Text neben dem Knopf (SEC-007, offen), nicht nur als Farbe.
    h('p', { id: 'export-hint', className: 'muted', style: { fontSize: '13px' } }, includeName ? NAME_IN_FILE : NO_NAME_IN_FILE),
    chosen
      ? h('div', { className: 'confirm' }, h('p', null, planSentence(chosen.plan)), h(Button, { onClick: restore }, 'Einspielen'))
      : null
  );
}
