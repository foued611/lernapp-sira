const COLORS = ['#FF6B88', '#FFC933', '#3DD6B0', '#4CC3F5', '#9B7BFF', '#FF8AD0'];

/** Konfetti über die ganze Seite. Wird per CSS bei "reduzierte Bewegung" ausgeblendet. */
export function confetti(count = 46) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'cf';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = COLORS[i % COLORS.length];
    piece.style.animationDuration = 2 + Math.random() * 2 + 's';
    piece.style.animationDelay = Math.random() * 0.6 + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5200);
  }
}
