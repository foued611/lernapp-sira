// Zusätzliche Prüfungen nur für die Zahlenwerkstatt (wird von scripts/smoke.mjs geladen).
export default {
  async theory({ w, unit, click, $, $$ }) {
    const out = [];
    if (unit.id === 'binaer') {
      const before = $(w, '[data-sum]').textContent;
      click(w, $(w, '.bit[data-i="0"]'));
      out.push(['Lampe schaltet die Summe', $(w, '[data-sum]').textContent !== before && $(w, '[data-sum]').textContent.includes('139')]);
    }
    if (unit.id === 'binhex') {
      click(w, $(w, '.bit[data-i="7"]'));
      out.push(['Vierergruppen werden angezeigt', $$(w, '.nib').length === 2]);
    }
    if (unit.id === 'hex') {
      const slider = $(w, '#slide');
      slider.value = '47';
      slider.dispatchEvent(new w.Event('input', { bubbles: true }));
      out.push(['Schieberegler zeigt 2F', $(w, '[data-hex]').textContent === '2F']);
    }
    return out;
  }
};
