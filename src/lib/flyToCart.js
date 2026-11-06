/**
 * Animates a small copy of a book cover from `fromEl` to the cart icon in the navbar.
 * Pure DOM + Web Animations API, so it works from any click handler. Skipped for reduced motion.
 */
export function flyToCart(fromEl, color = '#0f62fe') {
  const target = document.getElementById('cart-button');
  if (!fromEl || !target) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const a = fromEl.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dot = document.createElement('div');
  Object.assign(dot.style, {
    position: 'fixed',
    zIndex: 100,
    left: `${a.left + a.width / 2 - 18}px`,
    top: `${a.top + a.height / 2 - 24}px`,
    width: '36px',
    height: '48px',
    background: color,
    borderRadius: '3px',
    boxShadow: '0 10px 30px rgba(0,0,0,.45)',
    pointerEvents: 'none',
  });
  document.body.appendChild(dot);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = dot.animate(
    [
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 70}px) scale(0.8) rotate(-14deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.18) rotate(20deg)`, opacity: 0.2 },
    ],
    { duration: 700, easing: 'cubic-bezier(.5,0,.3,1)' },
  );
  anim.onfinish = () => {
    dot.remove();
    target.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }],
      { duration: 350, easing: 'ease-out' },
    );
  };
}
