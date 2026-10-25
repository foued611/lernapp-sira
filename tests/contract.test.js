import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../registry.js';
import { assertValidConfig, assertValidLesson, loadAppConfig } from './helpers.js';

const folderOf = (href) => href.replace(/index\.html$/, '');

for (const app of APPS.filter((a) => a.status === 'live')) {
  test(`App-Vertrag: ${app.id}`, async () => {
    const config = await loadAppConfig(app.id, folderOf(app.href));
    assert.equal(config.id, app.id, 'config.id muss zur Registry passen');
    assert.equal(config.units.length, app.units, 'registry.units muss zur Zahl der Seiten passen');
    assertValidConfig(config);
  });
}

test('App-Vorlage erfüllt den Vertrag', async () => {
  const config = await loadAppConfig('vorlage', 'apps/_template/');
  assertValidConfig(config);
});

for (const app of APPS.filter((a) => a.status === 'live')) {
  test(`Lektionen: ${app.id}`, async () => {
    const config = await loadAppConfig(app.id, folderOf(app.href));
    for (const unit of config.units) {
      await assertValidLesson(config.lessons[unit.id], `${app.id}/${unit.id}`);
      assert.ok(unit.card && unit.card.name && unit.card.fact, `Sammelkarte fehlt bei ${unit.id}`);
    }
  });
}

for (const app of APPS.filter((a) => a.status === 'live')) {
  test(`Registry und Konfiguration stimmen überein: ${app.id}`, async () => {
    const config = await loadAppConfig(app.id, folderOf(app.href));
    assert.equal(config.title, app.title, 'Titel in registry.js und content/<id>/manifest.json muss gleich sein');
  });
}
