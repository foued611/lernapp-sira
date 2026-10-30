// Öffentliche Schnittstelle des Dienstes "inhalte". Andere Dienste importieren nur aus dieser Datei.
// Interne Module unter src/ bleiben frei änderbar.
export { bundleErrors, assertBundle } from './src/bundle.js';
export { materialErrors, isSafeMaterialHref } from './src/material.js';
export { markupErrors, bundleMarkupErrors } from './src/markup.js';
export { HTML_TAGS, SVG_TAGS, FORBIDDEN_TAGS } from './src/allowlist.js';
export { ruleErrors } from './src/rule.js';
export { createStaticSource, createHttpSource, assertAppId } from './src/source.js';
export { withCache, cacheKey } from './src/cache.js';
export { buildConfig, resolveFigure } from './src/appconfig.js';
export { buildCatalog, catalogEntry } from './src/katalog.js';
