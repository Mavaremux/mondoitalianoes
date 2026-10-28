/* Dynamic heading + scroll progress and cinematic section entrances. */
(()=>{
  'use strict';
  const words=[...document.querySelectorAll('.hero-word')];
  let current=0;
  let headingVisible=true;
  const hero=document.querySelector('.hero');
  function changeWord(){
    if(document.hidden || document.body.classList.contains('motion-paused') || !headingVisible)return;
    current=(current+1)%words.length;
    words.forEach((el,index)=>el.classList.toggle('is-active',index===current));
  }
  if(words.length===2){
    window.setInterval(changeWord,2500);
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{headingVisible=entries[0].isIntersecting},{threshold:.05});
      observer.observe(hero);
    }
  }
  const bar=document.querySelector('.progress');
  let scrollQueued=false;
  function updateProgress(){
    const total=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(total>0?Math.max(0,Math.min(100,window.scrollY/total*100)):0)+'%';
    scrollQueued=false;
  }
  window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress)}},{passive:true});
  window.addEventListener('resize',updateProgress,{passive:true});
  updateProgress();
  const scenes=document.querySelectorAll('.oven-section-head,.ovens-layout>div,.essence-grid>*,.catalog-head>*,.faq-intro,.faq-item,.contact-bottom>*');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('scene-visible');observer.unobserve(entry.target)}
    }),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    scenes.forEach((el,i)=>{el.classList.add('scene-pending');el.style.setProperty('--scene-delay',`${(i%3)*85}ms`);observer.observe(el)});
  }
  // Mobile navigation stays keyboard-accessible and closes after choosing a section.
  const header=document.querySelector('header');
  const menuButton=document.querySelector('#menu-toggle');
  const nav=document.querySelector('#primary-nav');
  if(menuButton && nav){
    const setMenu=open=>{
      header.classList.toggle('nav-open',open);
      menuButton.setAttribute('aria-expanded',String(open));
      menuButton.setAttribute('aria-label',open?'Cerrar menú de navegación':'Abrir menú de navegación');
    };
    menuButton.addEventListener('click',()=>setMenu(!header.classList.contains('nav-open')));
    nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
    document.addEventListener('pointerdown',e=>{if(!header.contains(e.target))setMenu(false)});
    window.addEventListener('resize',()=>{if(window.innerWidth>700)setMenu(false)},{passive:true});
  }
})();
