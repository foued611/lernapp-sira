// Logik der Python-Werkstatt: Fragen aus content/info-python/data.json, Diagramme und die Theorie mit dem Code-Labor.
// Die Fragen kommen aus dem Pool (runde/src/pool.js). Das Labor führt Siras Python im Browser mit python-mini.js aus.
import { poolApp } from '../../runde/index.js';
import * as diagrams from './diagrams.js';
import { Theory } from './theory.js';

export default poolApp({ diagrams, Theory, typedLabel: 'Ergänze das Fehlende' });
