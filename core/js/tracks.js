// Lernstränge: Seiten und Material können einem Strang zugeordnet sein (z. B. "lrs" = LRS-Förderung),
// damit man sie vom Standardprogramm unterscheiden kann. Definition im Manifest unter "tracks".
import { esc } from './ui.js';

/** Der Strang einer Seite oder Ressource, oder null (= Standardprogramm). */
export const trackOf = (tracks, item) => (item && item.track && tracks && tracks[item.track] ? { id: item.track, ...tracks[item.track] } : null);

/** Kleines Etikett, z. B. "LRS-Förderung". */
export const trackBadge = (track) => (track ? `<span class="trk trk-${esc(track.id)}" title="${esc(track.desc || '')}">${esc(track.label)}</span>` : '');
