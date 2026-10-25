// Sichern und Wiederherstellen des gesamten Lernstands als JSON-Datei.
import { exportAll, importAll } from '../db.js';

export async function downloadBackup() {
  const blob = new Blob([JSON.stringify(await exportAll(), null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `lernwerkstatt-sicherung-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

/** Spielt eine ausgewählte Sicherung ein. Wirft bei unlesbarer Datei, der Aufrufer zeigt die Meldung. */
export async function restoreBackup(file) {
  await importAll(JSON.parse(await file.text()));
}
