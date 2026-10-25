import { bootApp } from '../../core/js/boot.js';
import logic from './logic.js';

// Die id bestimmt den Ordner in content/ und den Speicherschlüssel.
bootApp({ id: 'vorlage', logic });
