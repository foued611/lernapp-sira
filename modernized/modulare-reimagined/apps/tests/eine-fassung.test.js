// Eine Aufgabe kommt in einer Lektionsrunde nur in einer Fassung. Stünde sie als Auswahl und als Eingabe darin, verriete
// die Auswahl die getippte Antwort. Geprüft über startRound mit gefülltem known, denn erst mehrere Runden bringen beide Fassungen zusammen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../helfer/index.js';
import { buildConfig } from '../../inhalte/index.js';
import { skillOf } from '../../runde/index.js';
import { appDefaults, knownOf, profileDefaults, rememberRight, startRound } from '../../seiten/ablauf.js';
import { LIVE } from '../../seiten/registry.js';
import { APPS, logicFor, paketVon } from './laden.js';

const RUNDEN = 10;
const SEEDS = 3;

const klartext = (html = '') => String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// Bewusst unabhängig vom Schlüssel im Code: der Satz mit Antwort, sonst der Fragetext. Satz-Fragen der Verbseiten haben nur reveal.
const aufgabe = (q) => (q.prompt && !q.prompt.includes('{{blank}}') ? klartext(q.prompt) : klartext(q.reveal));

// Spielt die Runde richtig durch und liefert ihre Fragen. Zuordnungen beendet die Ansicht noch nicht, also endet hier die Runde.
function spiele(round, app) {
  const fragen = [];
  for (let guard = 0; guard < 60 && round.current(); guard += 1) {
    const q = round.current().question;
    if (!q.retry) fragen.push(q);
    if (q.kind === 'match') break;
    rememberRight(app, q);
    round.submit(q.kind === 'type' ? { text: q.answer } : { pick: q.answer });
    round.next();
  }
  return fragen;
}

function doppelte(fragen) {
  const getippt = new Map(fragen.filter((q) => q.kind === 'type').map((q) => [aufgabe(q), q]));
  return fragen.filter((q) => q.kind === 'choice' && getippt.get(aufgabe(q))?.answer === q.answer).map(aufgabe);
}

function zehnRunden(config, unit, seed) {
  const app = appDefaults();
  const rng = createRng(seed);
  return Array.from({ length: RUNDEN }, () => {
    const started = startRound({ config, mode: 'lesson', unit, app, profile: profileDefaults(), rng, known: knownOf(app) });
    assert.equal(started.ok, true, unit.id);
    return spiele(started.round, app);
  });
}

for (const entry of APPS.filter((e) => e.status === LIVE)) {
  const paket = paketVon(entry.id);
  const config = buildConfig(paket, logicFor(entry.id));
  if (!config.rounds?.lesson) continue;

  test(`EINE FASSUNG: ${entry.id} zeigt keine Aufgabe als Auswahl und als Eingabe`, () => {
    for (const unit of config.units) {
      for (let seed = 1; seed <= SEEDS; seed += 1) {
        zehnRunden(config, unit, seed).forEach((fragen, runde) => {
          assert.deepEqual(doppelte(fragen), [], `${unit.id}, Seed ${seed}, Runde ${runde + 1}`);
        });
      }
    }
  });

  test(`EINE FASSUNG: ${entry.id} bleibt mit gleichem Seed gleich`, () => {
    const unit = config.units[0];
    const folge = () => zehnRunden(config, unit, 7).map((fragen) => fragen.map(aufgabe));
    assert.deepEqual(folge(), folge());
  });

  // Der Fehler-Abruf bringt seine Frage als Auswahl. Dieselbe Aufgabe darf nicht zusätzlich zum Eintippen dastehen.
  const items = paket.data.items;
  if (items) {
    test(`EINE FASSUNG: ${entry.id} holt im Fehler-Abruf keine zweite Fassung dazu`, () => {
      for (const unit of config.units.filter((u) => items[u.id]?.length)) {
        const app = { ...appDefaults(), missed: { [unit.id]: items[unit.id].map(skillOf) } };
        for (let seed = 1; seed <= SEEDS; seed += 1) {
          const started = startRound({ config, mode: 'lesson', unit, app, profile: profileDefaults(), rng: createRng(seed) });
          assert.deepEqual(doppelte(spiele(started.round, appDefaults())), [], `${unit.id}, Seed ${seed}`);
        }
      }
    });
  }
}
