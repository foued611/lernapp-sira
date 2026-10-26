// Vorlage für Diagramme (Herkunft: legacy/modulare/apps/_template/diagrams.js). Jedes Diagramm braucht einen Alternativtext.
import { diagram, rect, text } from '../../komponenten/svg.js';

/** Ein Kasten mit Beschriftung. Name und Argumente stehen in content/<id>/lessons.json (figure.diagram). */
export function boxDiagram(label = 'Kasten') {
  return diagram(520, 100, `Kasten mit der Beschriftung ${label}`, [
    rect(10, 20, 500, 60, 'hi', 10),
    text(260, 56, label, 'md')
  ]);
}
