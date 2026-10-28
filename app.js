const products=[
['Harina Napoletana Rossa','Le 5 Stagioni','Harinas','25 kg · 12 % proteína','074'],
['Harina Oro','Le 5 Stagioni','Harinas','25 kg · 14 % proteína','076'],
['Harina Superior','Le 5 Stagioni','Harinas','25 kg · 13 % proteína','078'],
['Harina Integral Mora','Le 5 Stagioni','Harinas','10 kg','091'],
['Salsa con albahaca','Rodolfi','Tomates y salsas','2,5 kg · Caja de 6 latas','018'],
['Pulpa fina de tomate','Rodolfi','Tomates y salsas','2,5 kg · Caja de 6 latas','017'],
['Tomate San Marzano D.O.P.','Solania','Tomates y salsas','2,5 kg · Caja de 6 unidades','037'],
['Burrata','Latteria Sorrentina','Lácteos','125 g · Caja de 12 unidades','047'],
['Fiordilatte','Latteria Sorrentina','Lácteos','Block de 1 kg','059'],
['Stracciatella','Latteria Sorrentina','Lácteos','Consultar presentación','064'],
['Aceite de oliva extra virgen','Dante','Aceites','5 litros','110'],
['Aceite con peperoncino','Dante','Aceites','250 ml','117'],
['Aceite con trufa blanca','Dante','Aceites','250 ml','119'],
['Reducción balsámica de Módena','Dante','Aceites','250 ml','120'],
['Hornos de gas','Valoriani','Equipamiento','Consultar modelos y especificaciones','154'],
['Cajas fermentadoras','Gi Metal','Equipamiento','Consultar medidas disponibles','144']
];/* Productos de la pestaña «Más pedidos» (índices de la lista de arriba). Confirmar con la distribuidora. */
const TOP_PICKS=[0,5,6,7,8,10];
let filter='Todos',selection=[];try{selection=JSON.parse(localStorage.getItem('mondo-selection')||'[]').filter(x=>Number.isInteger(x)&&products[x])}catch{}const grid=document.querySelector('#grid'),drawer=document.querySelector('#drawer');function render(){const q=document.querySelector('#search').value.toLocaleLowerCase();const list=products.map((p,i)=>({p,i})).filter(({p,i})=>(filter==='Todos'||(filter==='Más pedidos'?TOP_PICKS.includes(i):p[2]===filter))&&p.join(' ').toLocaleLowerCase().includes(q));grid.innerHTML=list.map(({p,i},k)=>`<article class="product-card" style="animation-delay:${Math.min(k,7)*.045}s"><div class="product-image"><img src="assets/${p[4]}.webp" alt="${p[0]} ${p[1]}" loading="lazy"><button data-add="${i}" class="${selection.includes(i)?'added':''}" aria-label="${selection.includes(i)?'Quitar':'Añadir'} ${p[0]}" aria-pressed="${selection.includes(i)}">${selection.includes(i)?'✓':'+'}</button></div><small>${p[1].toUpperCase()}</small><h3>${p[0]}</h3><p>${p[3]}</p></article>`).join('')||'<p>No hay productos que coincidan. Prueba otra búsqueda.</p>';document.querySelector('#count').textContent=selection.length}function save(){try{localStorage.setItem('mondo-selection',JSON.stringify(selection))}catch{}render();renderSelected();renderDock()}function renderSelected(){document.querySelector('#selected').innerHTML=selection.length?selection.map(i=>`<div class="selected-row"><span>${products[i][0]}<br><small>${products[i][1]}</small></span><button data-remove="${i}" aria-label="Quitar ${products[i][0]}">×</button></div>`).join(''):'<p>Aún no has añadido productos. Puedes seleccionarlos con el botón + del catálogo.</p>'}document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});render()}));document.querySelector('#search').addEventListener('input',render);grid.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;const i=Number(b.dataset.add),adding=!selection.includes(i),img=b.parentElement.querySelector('img'),rect=img.getBoundingClientRect();selection=adding?[...selection,i]:selection.filter(x=>x!==i);if(adding)lastAdded=i;save();if(adding)celebrateAdd(i,img,rect)});document.querySelectorAll('.bag').forEach(b=>b.addEventListener('click',()=>{renderSelected();drawer.showModal()}));document.querySelector('#close').onclick=()=>drawer.close();drawer.addEventListener('click',e=>{if(e.target===drawer&&e.clientX<drawer.getBoundingClientRect().left)drawer.close();const b=e.target.closest('[data-remove]');if(b){selection=selection.filter(i=>i!==Number(b.dataset.remove));save()}});document.querySelector('#copy').onclick=async()=>{const t=['Consulta — Mondo Italiano',document.querySelector('#customer').value,...selection.map(i=>`• ${products[i][0]} — ${products[i][1]} (${products[i][3]})`),document.querySelector('#notes').value].filter(Boolean).join('\n');try{await navigator.clipboard.writeText(t);document.querySelector('#copy-status').textContent='Consulta copiada. Puedes pegarla en tu canal de contacto habitual.'}catch{document.querySelector('#copy-status').textContent='No se pudo copiar automáticamente. Selecciona y copia el texto que aparece abajo.';let a=document.createElement('textarea');a.value=t;document.querySelector('#copy-status').appendChild(a);a.select()}};const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.essence-grid,.process,.catalog-head,.craft-copy,.brands h2,.brand-grid,.contact h2').forEach(e=>{e.classList.add('reveal');observer.observe(e)});let ticking=false;addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{document.querySelector('.progress').style.width=`${scrollY/(document.documentElement.scrollHeight-innerHeight)*100}%`;ticking=false});ticking=true}},{passive:true});render();

document.querySelector('#whatsapp').addEventListener('click',function(e){
const status=document.querySelector('#copy-status');
if(!selection.length){e.preventDefault();status.textContent='Añade al menos un producto con el botón + del catálogo para confirmar tu pedido.';return}
status.textContent='';
const name=document.querySelector('#customer').value.trim(),notes=document.querySelector('#notes').value.trim(),n=selection.length;
const text=['Hola, Mondo Italiano. Quiero confirmar este pedido:',name?`Cliente: ${name}`:null,'',...selection.map(i=>`• ${products[i][0]} — ${products[i][1]} (${products[i][3]})`),'',`Total: ${n} ${n===1?'producto':'productos'}`,notes?`Notas: ${notes}`:null,'Quedo atento a la disponibilidad, el precio y la entrega. ¡Gracias!'].filter(x=>x!==null).join('\n');
this.href='https://wa.me/50377357081?text='+encodeURIComponent(text)});

/* Barra flotante de consulta: visible solo mientras se explora el catálogo */
let lastAdded=null,dockInView=false;
const dock=document.querySelector('#cart-dock'),dockThumbs=document.querySelector('#dock-thumbs'),dockCount=document.querySelector('#dock-count'),dockNote=document.querySelector('#dock-note');
function renderDock(){
const n=selection.length,show=n>0&&dockInView;
dockCount.textContent=`${n} ${n===1?'producto':'productos'}`;
dockNote.textContent=lastAdded!==null&&selection.includes(lastAdded)?`Añadido: ${products[lastAdded][0]}`:'Listo para confirmar';
dockThumbs.innerHTML=selection.slice(-3).map(i=>`<i><img src="assets/${products[i][4]}.webp" alt=""></i>`).join('')+(n>3?`<b>+${n-3}</b>`:'');
dock.classList.toggle('is-visible',show);
dock.toggleAttribute('inert',!show);
document.body.classList.toggle('dock-on',show);document.querySelector('#whatsapp').setAttribute('aria-disabled',n?'false':'true')}
function celebrateAdd(i,img,rect){
if(document.body.classList.contains('motion-paused'))return;
dockCount.classList.remove('pop');void dockCount.offsetWidth;dockCount.classList.add('pop');
const nb=grid.querySelector(`[data-add="${i}"]`);if(nb)nb.classList.add('just-added');
if(!dockInView||!img.animate)return;
const f=img.cloneNode();f.removeAttribute('loading');f.alt='';f.className='fly-img';
Object.assign(f.style,{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
document.body.append(f);
const tx=(innerWidth-dock.offsetWidth)/2+40-(rect.left+rect.width/2),ty=innerHeight-dock.offsetHeight/2-14-(rect.top+rect.height/2);
const end=()=>{f.remove();dock.classList.remove('dock-bump');void dock.offsetWidth;dock.classList.add('dock-bump')};
const run=f.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${tx*.5}px,${ty-70}px) scale(.55)`,opacity:.95,offset:.5},{transform:`translate(${tx}px,${ty}px) scale(.16)`,opacity:.25}],{duration:720,easing:'cubic-bezier(.45,.05,.2,1)'});
run.onfinish=end;run.oncancel=()=>f.remove()}
document.querySelector('#dock-open').addEventListener('click',()=>{renderSelected();drawer.showModal()});
if('IntersectionObserver' in window){new IntersectionObserver(es=>{dockInView=es[0].isIntersecting;renderDock()},{rootMargin:'0px 0px -80px 0px'}).observe(document.querySelector('#productos'))}else{dockInView=true}
renderDock();
