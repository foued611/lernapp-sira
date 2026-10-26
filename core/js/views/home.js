// Startseite: reine Funktion von Zustand zu HTML. Kein Zugriff auf DOM oder Speicher, deshalb leicht testbar.
import { esc, pick } from '../ui.js';
import { icon } from '../icons.js';
import { mascot } from '../mascot.js';
import { GOAL, dailyXP, isDue, weakestUnit } from '../profile.js';

export const starsHTML = (n) =>
  `<span class="stars" aria-label="${n} von 3 Sternen">${[1, 2, 3].map((i) => `<span class="${i <= n ? 'on' : ''}">${icon('star')}</span>`).join('')}</span>`;

export function minouSays(profile) {
  const x = dailyXP(profile);
  if (x >= GOAL) return 'Tagesziel geschafft. Alles ab jetzt ist Bonus.';
  if (x === 0) return pick(['Nur 2 Minuten, dann bist du schon im Spiel.', 'Eine kurze Runde reicht für heute.', 'Klein anfangen zählt. Fünf Aufgaben, mehr nicht.']);
  return `Noch ${GOAL - x} XP bis zum Tagesziel. Das ist ungefähr eine Runde.`;
}

/**
 * @param {{config:object, profile:object, app:object, bossOpen:boolean, resetAsk:boolean}} s
 */
export function homeHTML({ config, profile, app, bossOpen: open, resetAsk }) {
  const done = config.units.filter((u) => (app.stars[u.id] || 0) > 0).length;
  const x = dailyXP(profile), ratio = Math.min(1, x / GOAL), C = 2 * Math.PI * 32;
  const nodes = config.units.map((u) => `<button class="node" style="--lc:${esc(u.color)}" data-act="open" data-id="${esc(u.id)}"><span class="circ">${esc(u.ic)}</span><span><h3>${esc(u.title)}</h3><small>${esc(u.de)}</small>${isDue(app, u.id) ? '<span class="due">Zeit zum Auffrischen</span>' : ''}</span>${starsHTML(app.stars[u.id] || 0)}</button>`).join('');
  const badges = config.badges.map((b) => `<div class="badge ${app.badges[b.id] ? 'got' : ''}"><b>${esc(b.n)}</b><span>${esc(b.d)}</span></div>`).join('');
  const greet = `${esc(config.greeting || 'Hallo')}${profile.name ? ', ' + esc(profile.name) : ''} !`;
  const nameForm = profile.name ? '' : '<div class="name"><input id="nm" placeholder="Wie heißt du?" maxlength="20" autocomplete="off" aria-label="Dein Name"><button class="btn sun" data-act="savename">Los</button></div>';
  const hasBoss = Boolean(config.rounds.boss);
  const weak = weakestUnit(app, config.units);
  const training = weak
    ? `<div class="card"><h3>Gezieltes Training</h3><p>${esc(weak.reason)}: <b>${esc(weak.unit.title)}</b>. Wer gezielt Schwächen übt, lernt am schnellsten. Auffrischen bringt außerdem 10 Bonus-XP.</p><button class="btn" data-act="weak" data-id="${esc(weak.unit.id)}">Jetzt trainieren</button></div>`
    : '';
  const cardUnits = config.units.filter((u) => u.card);
  const medal = ['', 'Bronze', 'Silber', 'Gold'];
  const album = cardUnits.length
    ? `<section><h2>Sammelalbum</h2><p class="muted" style="margin:4px 0 14px;font-size:14px">Für jede Seite gibt es eine Karte. Mit mehr Sternen wird sie wertvoller: Bronze, Silber, Gold.</p><div class="album">${cardUnits.map((u) => {
      const n = app.stars[u.id] || 0;
      return n
        ? `<article class="gcard t${n}" style="--lc:${esc(u.color)}"><span class="medal">${medal[n]}</span><h3>${esc(u.card.name)}</h3><p>${esc(u.card.fact)}</p></article>`
        : `<article class="gcard t0"><span class="medal">Gesperrt</span><h3>Geheimkarte</h3><p>Schaffe die Seite „${esc(u.title)}“, um sie freizuschalten.</p></article>`;
    }).join('')}</div></section>`
    : '';
  const modes = [
    training,
    config.blitz ? `<div class="card"><h3>Blitz</h3><p>45 Sekunden Tempo. Wie viele schaffst du? Bestwert: <b>${app.best.blitz || 0}</b></p><button class="btn" data-act="blitz">Blitz starten</button></div>` : '',
    hasBoss ? `<div class="card"><h3>${esc(config.bossTitle || 'Endgegner')}</h3><p>${open ? '12 gemischte Aufgaben mit nur 3 Herzen. Wer gewinnt, bekommt 50 Bonus-XP.' : 'Der Endgegner wartet, sobald alle Seiten mindestens einen Stern haben.'}</p><button class="btn" data-act="boss" ${open ? '' : 'disabled'}>${open ? 'Endgegner starten' : 'Noch gesperrt'}</button></div>` : ''
  ].join('');
  const resources = (config.resources || []).length
    ? `<section><h2>Zum Ausdrucken</h2><div class="modes" style="margin-top:12px">${config.resources.map((r) => `<div class="card"><h3>${esc(r.title)}</h3>${r.desc ? `<p>${esc(r.desc)}</p>` : ''}<a class="btn ghost" href="${esc(r.href)}" target="_blank" rel="noopener">Öffnen</a></div>`).join('')}</div></section>`
    : '';
  return `
    <section class="card hero">
      <div class="row1">${mascot('happy')}<div><h1>${greet}</h1><div class="bubble" style="margin-top:10px">${esc(minouSays(profile))}</div></div></div>
      ${nameForm}
      <div class="goalbox">
        <div class="ring" role="img" aria-label="Tagesziel ${Math.min(x, GOAL)} von ${GOAL} XP"><svg viewBox="0 0 76 76"><circle class="t" cx="38" cy="38" r="32" fill="none" stroke-width="8"/><circle class="p" cx="38" cy="38" r="32" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - ratio)).toFixed(1)}"/></svg><b>${Math.min(x, GOAL)}<br><small style="font-size:11px;font-weight:600">/ ${GOAL}</small></b></div>
        <p><strong>Tagesziel: ${GOAL} XP</strong>${x >= GOAL ? 'Geschafft. Du bist heute fertig.' : 'Eine kurze Runde bringt dich nah ran.'} ${done} von ${config.units.length} Seiten sind geschafft.</p>
        ${config.rounds.quick ? '<button class="btn sun" data-act="quick">2-Minuten-Runde</button>' : ''}
      </div>
    </section>
    <section><h2>Dein Lernpfad</h2><p class="muted" style="margin:4px 0 14px;font-size:14px">${esc(config.intro || 'Starte irgendwo. Die Reihenfolge ist nur ein Vorschlag.')}</p><div class="path">${nodes}</div></section>
    ${modes ? `<section><h2>Spielmodi</h2><div class="modes" style="margin-top:12px">${modes}</div></section>` : ''}
    ${resources}
    ${album}
    <section><h2>Trophäen</h2><div class="badges" style="margin-top:12px">${badges}</div></section>
    <p class="muted" style="font-size:13px">Dein Fortschritt wird in diesem Browser gespeichert. ${resetAsk ? '<button class="link" data-act="resetok">Wirklich alles löschen?</button>' : '<button class="link" data-act="reset">Fortschritt dieser App zurücksetzen</button>'}</p>
    <p class="muted" style="font-size:13px"><button class="link" data-act="backup">Fortschritt sichern (Datei)</button> · <label class="link" style="cursor:pointer">Sicherung einspielen<input type="file" accept="application/json,.json" id="restore" hidden></label><span id="bmsg" role="status"></span></p>`;
}
