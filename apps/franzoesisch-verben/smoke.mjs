// Zusätzliche Prüfungen nur für das Cahier de Verbes (wird von scripts/smoke.mjs geladen).
export default {
  async theory({ w, unit, click, $, $$ }) {
    const out = [['Konjugationstabelle hat 6 Zeilen', !!$(w, '.conj') && $$(w, '.conj tr').length === 6]];
    if (unit.id === 'er') {
      click(w, $(w, '[data-act="verb"][data-v="aimer"]'));
      out.push(['Verbwechsel ändert den Stamm', $(w, '.conj .stem').textContent === 'aim']);
      out.push(['Lektion bleibt beim Verbwechsel erhalten', !!$(w, '.lsn-fb') && !$(w, '.lsn-fb').hidden]);
      click(w, $(w, '[data-act="cover"]'));
      out.push(['Selbsttest deckt Formen ab', $$(w, '.fm.hid').length === 6]);
    }
    return out;
  }
};
