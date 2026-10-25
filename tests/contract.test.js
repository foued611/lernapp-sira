import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../registry.js';
import { assertValidConfig, assertValidLesson } from './helpers.js';

const folderOf = (href) => href.replace(/index\.html$/, '');

for (const app of APPS.filter((a) => a.status === 'live')) {
  test(`App-Vertrag: ${app.id}`, async () => {
    const { default: config } = await import(new URL(`../${folderOf(app.href)}config.js`, import.meta.url));
    assert.equal(config.id, app.id, 'config.id muss zur Registry passen');
    assert.equal(config.units.length, app.units, 'registry.units muss zur Zahl der Seiten passen');
    assertValidConfig(config);
  });
}

test('App-Vorlage erfüllt den Vertrag', async () => {
  const { default: config } = await import('../apps/_template/config.js');
  assertValidConfig(config);
});

for (const app of APPS.filter((a) => a.status === 'live')) {
  test(`Lektionen: ${app.id}`, async () => {
    const { default: config } = await import(new URL(`../${folderOf(app.href)}config.js`, import.meta.url));
    for (const unit of config.units) {
      await assertValidLesson(config.lessons[unit.id], `${app.id}/${unit.id}`);
      assert.ok(unit.card && unit.card.name && unit.card.fact, `Sammelkarte fehlt bei ${unit.id}`);
    }
  });
}

for (const app of APPS.filter((a) => a.status === 'live')) {
  test(`Registry und Konfiguration stimmen überein: ${app.id}`, async () => {
    const { default: config } = await import(new URL(`../${folderOf(app.href)}config.js`, import.meta.url));
    assert.equal(config.title, app.title, 'Titel in registry.js und config.js muss gleich sein');
  });
}
