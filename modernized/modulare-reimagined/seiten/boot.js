// Startet die Seiten: lädt den Katalog, öffnet den Speicher und sammelt beides in einen Zustand. Inhalte und Logik einer
// App kommen erst, wenn sie geöffnet wird. So bleibt der Start klein, auch mit vielen Apps.
// Fehler kommen als Meldung zurück, nicht als Abbruch (RULE-202, AGENTS.md: die App läuft auch ohne Speicher).
// Herkunft: legacy/modulare/core/js/boot.js und dashboard.js:9-16 (dort ohne Fehlerbehandlung).
import { assertAppId, buildConfig, createStaticSource } from '../inhalte/index.js';
import { openApp, openProfile, openStore } from '../speicher/index.js';
import { PROFILE_VERSION, evaluateTrophyRule, migrateProfile } from '../regeln/index.js';
import { appDefaults, dayOf, profileDefaults } from './ablauf.js';
import { LIVE, validateRegistry } from './registry.js';
import { UEBERNAHMEN, hasProgress, mergeAppState } from './uebernahme.js';

// Meldungen für die Anzeige. Keine Namen, keine Kennungen aus dem Speicher.
export const MSG = Object.freeze({
  unavailable: 'Der Speicher dieses Browsers ist nicht verfügbar. Ohne Speicher gibt es hier keinen Fortschritt. Die Apps laufen trotzdem, nur ohne Sterne und Punkte.',
  memory: 'Der Speicher dieses Browsers ist nicht nutzbar. Der Fortschritt bleibt nur, bis du diese Seite schließt.',
  catalog: 'Die Liste der Apps konnte nicht geladen werden. Prüfe die Verbindung und lade die Seite neu.',
  appLoad: 'Die Inhalte dieser App konnten nicht geladen werden. Prüfe die Verbindung und lade die Seite neu.',
  registry: 'Die Liste der Apps ist fehlerhaft. Die Startseite kann nicht gezeigt werden.'
});

/** Die App aus ?app=<id>. Ungültige Kennungen gelten als keine App (kein Fehler, nur die Startseite). */
export function parseRoute(search) {
  const id = new URLSearchParams(search || '').get('app');
  if (!id) return null;
  try {
    return assertAppId(id);
  } catch (error) {
    return null;
  }
}

/** Inhalte aus den JSON-Dateien neben der Seite. Die Quelle bekommt fetch injiziert (inhalte/source.js). */
export const defaultSource = (base = './content/') => createStaticSource(base, (url) => fetch(url));

const unavailable = (handle, message) => ({ handle: null, backend: handle ? handle.backend : null, status: 'unavailable', message });

// Öffnet den Speicher und das Profil. Gibt immer ein Ergebnis zurück. Ein Ausfall wird zum Status "unavailable".
async function openSession(openStorage) {
  let handle = null;
  try {
    handle = await openStorage();
  } catch (error) {
    handle = null;
  }
  if (!handle) return { storage: unavailable(null, MSG.unavailable), profileStore: null };
  const memory = handle.backend === 'memory';
  try {
    const profileStore = await openProfile(handle, profileDefaults(), { version: PROFILE_VERSION, migrate: migrateProfile });
    if (profileStore.blocked) return { storage: unavailable(handle, profileStore.blocked.message), profileStore: null };
    return {
      storage: { handle, backend: handle.backend, status: memory ? 'memory' : 'ok', message: memory ? MSG.memory : null },
      profileStore
    };
  } catch (error) {
    return { storage: unavailable(handle, MSG.unavailable), profileStore: null };
  }
}

// Eine App, wie die Startseite sie kennt: nur der Katalogeintrag, noch ohne Inhalte.
const shellOf = (entry) => ({ entry, config: null, units: entry.units ?? [], error: null, appStore: null, storeMessage: null });

// Lädt Inhalte und Logik einer App und baut die Konfiguration. Ein Fehler betrifft nur diese App, nicht die anderen.
async function loadEntry(entry, options) {
  const base = shellOf(entry);
  if (entry.status !== LIVE) return base;
  try {
    const [bundle, logic] = await Promise.all([options.source.load(entry.id), options.loadLogic(entry.id)]);
    const config = buildConfig(bundle, logic, { evaluateRule: options.evaluateRule });
    return { ...base, config, units: config.units };
  } catch (error) {
    return { ...base, error: MSG.appLoad, cause: error };
  }
}

// Zieht den Stand früherer Apps in diese App um, einmal je Quelle (siehe uebernahme.js). Fehler lassen den Stand unberührt.
async function uebernehmenInto(handle, appStore, appId) {
  for (const { from, into, badgeRenames } of UEBERNAHMEN.filter((u) => u.into === appId)) {
    if (appStore.state.merged && appStore.state.merged[from]) continue;
    try {
      const old = await openApp(handle, from, appDefaults());
      if (old.blocked || !hasProgress(old.state)) continue;
      appStore.state = mergeAppState(appStore.state, old.state, { badgeRenames, fromId: from });
      await appStore.save();
    } catch (error) {
      // Ohne Übernahme läuft die App weiter, der alte Stand bleibt in der alten Zeile erhalten.
    }
  }
}

// Öffnet den Stand einer App. Blockiert oder nicht erreichbar heißt: diese App zeigt keinen Fortschritt.
async function attachAppStore(app, handle) {
  if (app.entry.status !== LIVE || app.error) return app;
  if (!handle) return { ...app, storeMessage: MSG.unavailable };
  try {
    const appStore = await openApp(handle, app.entry.id, appDefaults());
    if (appStore.blocked) return { ...app, storeMessage: appStore.blocked.message };
    await uebernehmenInto(handle, appStore, app.entry.id);
    return { ...app, appStore };
  } catch (error) {
    return { ...app, storeMessage: MSG.unavailable };
  }
}

// Die Liste der Apps. Ein Fehler ist kein Abbruch, sondern eine Meldung.
async function loadEntries(o) {
  if (o.registry) return { entries: o.registry };
  try {
    return { entries: await o.source.catalog() };
  } catch (error) {
    return { failure: { ok: false, message: MSG.catalog, cause: error } };
  }
}

/**
 * Lädt alles für die Startseite oder die App aus der Adresse. Gibt { ok: true, state } oder { ok: false, message } zurück und wirft nie.
 * Optionen (alle optional, für Tests und andere Laufzeiten):
 *   registry       Liste der Apps (Standard: source.catalog())
 *   source         Inhaltsquelle mit load(appId) und catalog() (Standard: defaultSource)
 *   openStorage    liefert einen Speicher-Handle (Standard: openStore)
 *   loadLogic(id)  Logik einer App aus logic.js, auch als Promise (Standard: leer)
 *   evaluateRule   Trophäen-Auswertung (Standard: regeln)
 *   now            Uhr in Millisekunden
 *   search         Adressteil der Seite, z. B. "?app=mathe"
 */
export async function bootSeiten(options = {}) {
  const o = {
    source: defaultSource(),
    openStorage: () => openStore(),
    loadLogic: () => ({}),
    evaluateRule: evaluateTrophyRule,
    now: () => Date.now(),
    search: '',
    ...options
  };
  const { entries, failure } = await loadEntries(o);
  if (failure) return failure;
  const problems = validateRegistry(entries);
  if (problems.length) return { ok: false, message: MSG.registry, problems };

  const appId = parseRoute(o.search);
  const opened = appId ? entries.find((entry) => entry.id === appId) : null;
  const [session, loaded] = await Promise.all([
    openSession(o.openStorage),
    Promise.all(entries.map((entry) => (entry === opened ? loadEntry(entry, o) : shellOf(entry))))
  ]);
  // Die Startseite zeigt den Stand aller Apps, eine geöffnete App braucht nur ihren eigenen.
  const needsStore = (app) => !appId || app.entry === opened;
  const apps = await Promise.all(loaded.map((app) => (needsStore(app) ? attachAppStore(app, session.storage.handle) : app)));
  return {
    ok: true,
    state: {
      day: dayOf(o.now()),
      route: { appId },
      storage: session.storage,
      profileStore: session.profileStore,
      apps
    }
  };
}
