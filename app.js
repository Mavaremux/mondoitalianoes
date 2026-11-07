/* Catálogo Mondo Italiano — revisión del 3 de noviembre de 2026. */
(()=>{
'use strict';
const products=Array.isArray(window.MONDO_PRODUCTS)?window.MONDO_PRODUCTS:[];
const brands=Array.isArray(window.MONDO_BRANDS)?window.MONDO_BRANDS:[];
const byId=new Map(products.map(p=>[p.id,p]));
const grid=document.querySelector('#grid');
const drawer=document.querySelector('#drawer');
const pd=document.querySelector('#product-dialog');
const bd=document.querySelector('#brand-dialog');
const search=document.querySelector('#search');
const filters=[...document.querySelectorAll('[data-filter]')];
const STORAGE='mondo-selection-v2';
let filter='Todos';let selection=[];let activeProduct=null;let activeBrand=null;
try{selection=JSON.parse(localStorage.getItem(STORAGE)||'[]').filter(id=>byId.has(id))}catch{selection=[]}
selection=[...new Set(selection)];
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const path=p=>'assets/'+encodeURIComponent(p);
const phone='50377357081';
function getMatches(){
 const q=search.value.trim().toLocaleLowerCase('es');
 return products.filter(p=>(filter==='Todos'||p.category===filter)&&(!q||[p.name,p.brand,p.category,p.presentation,p.description].join(' ').toLocaleLowerCase('es').includes(q)));
}
function render(){
 const entries=getMatches();
 grid.innerHTML=entries.map((p,i)=>{
  const picked=selection.includes(p.id);
  return `<article class="product-card" style="animation-delay:${Math.min(i,7)*.04}s">
  <div class="product-image">
   <button class="image-open" type="button" data-details="${safe(p.id)}" aria-label="Ver descripción de ${safe(p.name)}"><img src="${path(p.image)}" alt="${safe(p.name)} de ${safe(p.brand)}" loading="lazy" decoding="async"></button>
   <button type="button" data-add="${safe(p.id)}" class="${picked?'added':''}" aria-label="${picked?'Quitar':'Añadir'} ${safe(p.name)} ${picked?'de':'a'} mi selección" aria-pressed="${picked}">${picked?'✓':'+'}</button>
  </div>
  <small>${safe(p.brand.toUpperCase())}</small>
  <h3>${safe(p.name)}</h3><p>${safe(p.presentation)}</p>
  <button type="button" class="product-more" data-details="${safe(p.id)}">Ver descripción <span aria-hidden="true">↗</span></button>
  </article>`
 }).join('')||'<p class="no-results">No encontramos productos con esos filtros. Prueba con otra categoría o búsqueda.</p>';
 document.querySelector('#count').textContent=selection.length;
 document.querySelector('#count').setAttribute('aria-label',`${selection.length} productos seleccionados`);
}
function renderSelected(){
 const selected=document.querySelector('#selected');
 selected.innerHTML=selection.length?selection.map(id=>{
  const p=byId.get(id);
  return `<div class="selected-row"><span>${safe(p.name)}<br><small>${safe(p.brand)} · ${safe(p.presentation)}</small></span><button type="button" data-remove="${safe(id)}" aria-label="Quitar ${safe(p.name)}">×</button></div>`;
 }).join(''):'<p>Aún no has añadido productos. Puedes seleccionarlos con el botón + de cada producto.</p>';
}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(selection))}catch{}render();renderSelected();if(activeProduct)updateProductAdd()}
function toggle(id){if(!byId.has(id))return;selection=selection.includes(id)?selection.filter(x=>x!==id):[...selection,id];save()}
function setFilter(name){
 filter=name;filters.forEach(b=>{const match=b.dataset.filter===name;b.classList.toggle('active',match);b.setAttribute('aria-pressed',String(match))});
 render();
}
filters.forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
search.addEventListener('input',render);
function updateProductAdd(){
 if(!activeProduct)return;
 const button=document.querySelector('#product-dialog-add');
 const picked=selection.includes(activeProduct.id);
 button.innerHTML=picked?'Quitar de mi selección <span>✓</span>':'Añadir a mi selección <span>+</span>';
 button.setAttribute('aria-pressed',String(picked));
}
function openProduct(id){
 const p=byId.get(id);if(!p)return;activeProduct=p;
 document.querySelector('#product-dialog-img').src=path(p.image);
 document.querySelector('#product-dialog-img').alt=p.name;
 document.querySelector('#product-dialog-brand').textContent=`${p.brand.toUpperCase()} / ${p.category.toUpperCase()}`;
 document.querySelector('#product-dialog-title').textContent=p.name;
 document.querySelector('#product-dialog-presentation').textContent=p.presentation;
 document.querySelector('#product-dialog-description').textContent=p.description;
 const official=document.querySelector('#product-official');official.hidden=p.id!=='horno';
 updateProductAdd();pd.showModal();
}
function openBrand(id){
 const b=brands.find(x=>x.id===id);if(!b)return;activeBrand=b;
 document.querySelector('#brand-dialog-img').src=path(b.image);
 document.querySelector('#brand-dialog-img').alt=b.name;
 document.querySelector('#brand-dialog-title').textContent=b.name;
 document.querySelector('#brand-dialog-category').textContent=b.subtitle.toUpperCase();
 document.querySelector('#brand-dialog-description').textContent=b.description;
 const ext=document.querySelector('#brand-external');ext.hidden=!b.url;
 if(b.url)ext.href=b.url;
 bd.showModal();
}
// El cliente puede abrir toda la descripción pulsando la fotografía o «Ver descripción».
grid.addEventListener('click',e=>{
 const plus=e.target.closest('[data-add]');if(plus){toggle(plus.dataset.add);return}
 const more=e.target.closest('[data-details]');if(more)openProduct(more.dataset.details);
});
document.querySelectorAll('[data-open-brand]').forEach(button=>button.addEventListener('click',()=>openBrand(button.dataset.openBrand)));
document.querySelector('#product-dialog-add').addEventListener('click',()=>{if(activeProduct)toggle(activeProduct.id)});
document.querySelector('#brand-see-products').addEventListener('click',()=>{
 if(!activeBrand)return;
 bd.close();
 search.value=activeBrand.id==='cajas'?'':activeBrand.name;
 setFilter(activeBrand.id==='cajas'?'Cajas fermentadoras':'Todos');
 document.querySelector('#productos').scrollIntoView({behavior:'smooth',block:'start'});
});
for(const dialog of [pd,bd]){
 dialog.querySelector('[data-close-dialog]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
}
// Shortcuts to relevant category.
document.querySelectorAll('[data-go-cat]').forEach(a=>a.addEventListener('click',()=>{search.value='';setFilter(a.dataset.goCat)}));
// Preserve the original selection > consult via WhatsApp workflow.
document.querySelectorAll('.bag').forEach(b=>b.addEventListener('click',()=>{renderSelected();drawer.showModal()}));
document.querySelector('#close').addEventListener('click',()=>drawer.close());
drawer.addEventListener('click',e=>{
 if(e.target===drawer)drawer.close();
 const del=e.target.closest('[data-remove]');if(del)toggle(del.dataset.remove);
});
function consultText(){
 return ['Hola, Mondo Italiano. Me gustaría consultar productos y disponibilidad en El Salvador.',
 document.querySelector('#customer').value.trim(),
 ...selection.map(id=>{const p=byId.get(id);return `• ${p.name} — ${p.brand} (${p.presentation})`}),
 document.querySelector('#notes').value.trim()].filter(Boolean).join('\n');
}
document.querySelector('#copy').addEventListener('click',async()=>{
 const text=consultText(),status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText(text);status.textContent='Consulta copiada. Puedes pegarla en WhatsApp o en tu correo.'}
 catch{status.textContent='Copia manualmente la consulta:';const area=document.createElement('textarea');area.readOnly=true;area.value=text;area.rows=5;status.append(area);area.select()}
});
document.querySelector('#whatsapp').addEventListener('click',function(){this.href='https://wa.me/'+phone+'?text='+encodeURIComponent(consultText())});
// Progressive animation: supports motion.js without making content inaccessible.
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.essence-grid,.process,.catalog-head,.craft-copy,.brands h2,.brand-grid,.contact h2').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
}
render();renderSelected();
})();
