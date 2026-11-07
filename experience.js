/* Dynamic scroll progress, section entrances and mobile navigation — Mondo Italiano v20261104b */
(()=>{
  'use strict';

  // Barra de progreso de lectura (un solo listener passive con RAF)
  const bar = document.querySelector('.progress');
  let scrollQueued = false;
  function updateProgress(){
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? Math.max(0, Math.min(100, window.scrollY / total * 100)) : 0) + '%';
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  // Entradas cinematográficas por sección (IntersectionObserver con unobserve)
  const scenes = document.querySelectorAll(
    '.valoriani-compacto-inner>*,.como-pedir-section .ovens-layout>div,.essence-grid>*,.catalog-head>*,.faq-intro,.faq-item,.contact-bottom>*'
  );
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('scene-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    scenes.forEach((el, i) => {
      el.classList.add('scene-pending');
      el.style.setProperty('--scene-delay', `${(i % 3) * 85}ms`);
      observer.observe(el);
    });
  }

  // Navegación móvil (teclado accesible)
  const header = document.querySelector('header');
  const menuButton = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (menuButton && nav) {
    const setMenu = open => {
      header.classList.toggle('nav-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    };
    menuButton.addEventListener('click', () => setMenu(!header.classList.contains('nav-open')));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('pointerdown', e => { if (!header.contains(e.target)) setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 700) setMenu(false); }, { passive: true });
  }
})();
