import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../registry.js';
import { assertValidConfig } from './helpers.js';

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
