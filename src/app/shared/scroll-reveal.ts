/**
 * Revela elementos `.reveal` (clase `.in-view`) a medida que entran/salen
 * del viewport. Con reduced-motion, los marca todos visibles de inmediato
 * y no observa nada.
 */
export function initScrollReveal(root: HTMLElement, reducedMotion: boolean): IntersectionObserver | null {
  const revealEls = root.querySelectorAll<HTMLElement>('.reveal');

  if (reducedMotion) {
    revealEls.forEach((el) => el.classList.add('in-view'));
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
  return observer;
}
