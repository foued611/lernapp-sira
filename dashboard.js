// Dashboard: liest Profil und Fortschritt aller Apps aus dem Browser-Speicher und zeigt sie als Kacheln.
import { esc, $ } from './core/js/ui.js';
import { mascot } from './core/js/mascot.js';
import { createStore } from './core/js/store.js';
import { GOAL, openProfile, appKey, appDefaults, dailyXP, streakNow } from './core/js/profile.js';
import { APPS, SUBJECT_COLORS } from './registry.js';

// Der Browser-Speicher wird asynchron geöffnet. Erst wenn alles geladen ist, wird gezeichnet.
async function load() {
  const profile = (await openProfile()).state;
  const rows = await Promise.all(APPS.map(async (app) => ({
    app,
    state: app.status === 'live' ? (await createStore(appKey(app.id), appDefaults())).state : null
  })));
  start(profile, rows);
}

function start(profile, rows) {
  const doneUnits = (row) => Object.values(row.state.stars).filter((n) => n > 0).length;
  const colorOf = (app) => SUBJECT_COLORS[app.subject] || '#9B7BFF';
  const badgeCount = rows.reduce((sum, r) => sum + (r.state ? Object.keys(r.state.badges).length : 0), 0);

  function renderHero() {
    const x = dailyXP(profile), ratio = Math.min(1, x / GOAL), C = 2 * Math.PI * 32;
    const says = x >= GOAL ? 'Tagesziel geschafft. Alles ab jetzt ist Bonus.'
      : x === 0 ? 'Welche App heute? Fünf Minuten reichen schon.' : `Noch ${GOAL - x} XP bis zum Tagesziel.`;
    $('#hero').innerHTML = `
      <div class="row1">${mascot('happy')}<div><h1>${profile.name ? 'Hallo, ' + esc(profile.name) : 'Hallo'} !</h1><div class="bubble" style="margin-top:10px">${esc(says)}</div></div></div>
      <div class="stats" style="gap:14px 24px;flex-wrap:wrap">
        <div class="ring" role="img" aria-label="Tagesziel ${Math.min(x, GOAL)} von ${GOAL} XP"><svg viewBox="0 0 76 76"><circle class="t" cx="38" cy="38" r="32" fill="none" stroke-width="8"/><circle class="p" cx="38" cy="38" r="32" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - ratio)).toFixed(1)}"/></svg><b>${Math.min(x, GOAL)}<br><small style="font-size:11px;font-weight:600">/ ${GOAL}</small></b></div>
        <div class="stat"><b>${streakNow(profile)}</b><span>Tage in Folge</span></div>
        <div class="stat"><b>${profile.xp}</b><span>XP gesamt</span></div>
        <div class="stat"><b>${badgeCount}</b><span>Trophäen</span></div>
      </div>`;
  }

  function renderContinue() {
    const row = rows.find((r) => r.app.id === profile.lastApp && r.app.status === 'live');
    const section = $('#cont-sec');
    if (!row) { section.hidden = true; return; }
    section.hidden = false;
    section.innerHTML = `<div class="card cont" style="--c:${colorOf(row.app)}"><span class="dot"></span><div><h3>Weiter mit ${esc(row.app.title)}</h3><p class="muted">${doneUnits(row)} von ${row.app.units} Seiten · ${row.state.xp} XP</p></div><a class="btn sun" href="${esc(row.app.href)}">Weiterlernen</a></div>`;
  }

  function tile(row) {
    const { app, state } = row, color = colorOf(app);
    if (app.status !== 'live') {
      return `<div class="card tile soon" style="--c:${color}"><span class="tag">${esc(app.subject)}</span><h3>${esc(app.title)}</h3><p>${esc(app.desc)}</p><span class="pill">Demnächst</span></div>`;
    }
    const done = doneUnits(row), pct = Math.round((done / app.units) * 100);
    const info = state.xp || done ? `${done} von ${app.units} Seiten · ${state.xp} XP` : 'Noch nicht gestartet';
    return `<a class="card tile" style="--c:${color}" href="${esc(app.href)}"><span class="tag">${esc(app.subject)}</span><h3>${esc(app.title)}</h3><p>${esc(app.desc)}</p><div class="lab">${info}</div><div class="bar"><i style="width:${pct}%"></i></div></a>`;
  }

  const subjects = ['Alle', ...new Set(APPS.map((a) => a.subject))];
  let current = 'Alle';

  function renderGrid() {
    $('#chips').innerHTML = subjects.map((s) => `<button class="chip" type="button" data-s="${esc(s)}" aria-pressed="${s === current}">${esc(s)}</button>`).join('');
    const list = rows.filter((r) => current === 'Alle' || r.app.subject === current);
    $('#empty').style.display = list.length ? 'none' : 'block';
    $('#grid').innerHTML = list.map(tile).join('');
  }

  $('#chips').addEventListener('click', (e) => {
    const button = e.target.closest('[data-s]');
    if (!button) return;
    current = button.dataset.s;
    renderGrid();
  });

  renderHero();
  renderContinue();
  renderGrid();
}

load();
