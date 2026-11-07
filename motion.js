/* Motion layer — Mondo Italiano v20261104b
   El botón "Animaciones" se reemplaza por @media(prefers-reduced-motion) en CSS.
   Anima solo transform y opacity. IntersectionObserver con unobserve tras animar.
   RAF único para listeners de scroll. will-change solo durante la animación.      */
(()=>{
  'use strict';

  // Respeta la preferencia del sistema operativo
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Marcar body como motion-enabled (para el CSS de reveals)
  document.body.classList.add('motion-enabled');

  // Revelar tarjetas de producto, de marca y de proceso
  const reveal = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('motion-in');
      reveal.unobserve(e.target);
    }
  }), { threshold: 0.06 });

  function enroll(root) {
    root.querySelectorAll(
      '#grid .product-card:not(.motion-ready),.process>div:not(.motion-ready)'
    ).forEach((el, i) => {
      el.classList.add('motion-ready');
      el.style.setProperty('--delay', `${i % 4 * 100}ms`);
      reveal.observe(el);
    });
  }
  enroll(document);
  const grid = document.querySelector('#grid');
  if (grid) {
    new MutationObserver(() => enroll(grid)).observe(grid, { childList: true });
  }

  // Pausar la flotación del collage cuando el hero no está visible
  const heroSection = document.querySelector('#inicio');
  const collage = document.querySelector('.hero-collage');
  if (heroSection && collage) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      collage.classList.toggle('is-paused', !entry.isIntersecting);
    }, { threshold: 0 });
    heroObserver.observe(heroSection);
  }

  // Subrayado animado en títulos em (h1 y h2)
  const headingObserver = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('heading-in'); headingObserver.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('h2 em,h1 em').forEach(el => {
    el.classList.add('animated-em');
    headingObserver.observe(el);
  });

  // Paralaje sutil en la foto del craft (solo transform, sin layout reads dentro del RAF)
  if (!prefersReduced) {
    const craftImg = document.querySelector('.craft-photo img');
    if (craftImg) {
      let rafPending = false;
      const updateCraft = () => {
        rafPending = false;
        const rect = craftImg.parentElement.getBoundingClientRect();
        if (rect.top < innerHeight && rect.bottom > 0) {
          const offset = (innerHeight / 2 - (rect.top + rect.height / 2)) * 0.09;
          craftImg.style.transform = `scale(1.16) translateY(${Math.max(-35, Math.min(35, offset))}px)`;
        }
      };
      window.addEventListener('scroll', () => {
        if (!rafPending) { rafPending = true; requestAnimationFrame(updateCraft); }
      }, { passive: true });
    }
  }

  // Tilt 3D en tarjetas de producto (solo transform)
  if (!prefersReduced && grid) {
    grid.addEventListener('pointermove', e => {
      const card = e.target.closest('.product-image');
      if (!card || e.pointerType === 'touch') return;
      const r = card.getBoundingClientRect();
      card.style.transform = `perspective(700px) rotateX(${-(e.clientY - r.top - r.height / 2) / 30}deg) rotateY(${(e.clientX - r.left - r.width / 2) / 25}deg)`;
    });
    grid.addEventListener('pointerout', e => {
      const card = e.target.closest('.product-image');
      if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });
  }

  // Micro-movimiento en botones (solo transform)
  if (!prefersReduced) {
    document.querySelectorAll('.button').forEach(el => {
      el.addEventListener('pointermove', e => {
        if (e.pointerType === 'touch') return;
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.08}px,${(e.clientY - r.top - r.height / 2) * 0.13}px)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
  }

  // Pop del contador de selección (en el click del grid)
  if (grid) {
    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-add]');
      if (!b) return;
      const badge = document.querySelector('#count');
      if (!badge) return;
      badge.classList.remove('count-pop');
      void badge.offsetWidth;
      badge.classList.add('count-pop');
    });
  }

  // Header con sombra al hacer scroll
  window.addEventListener('scroll', () => {
    const h = document.querySelector('header');
    if (h) h.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();
