/* Sección de hornos Valoriani: cifras animadas, comparador y calculadora de tamaño. */
(()=>{
/* ---- Datos editables (confirmar modelos y cifras con la distribuidora) ---- */
const WHATSAPP='50377357081';
const SHOW_LA_CLASICA_PROOF=false; /* pasar a true cuando La Clásica confirme que hornea con Valoriani */
const CYCLES_PER_HOUR=15; /* horneadas por hora con ritmo conservador (~4 min entre horneadas) */
const MODELS=[ /* ordenados por capacidad; min/max = pizzas de 28-30 cm por horneada; se usa el promedio */
 {name:'Baby 75',min:2,max:2,cap:'2 pizzas por horneada',heat:'Calentamiento a 300 °C: unos 50-60 min'},
 {name:'Igloo 100',min:4,max:4,cap:'4 pizzas por horneada',heat:'Calentamiento: consulta la ficha técnica'},
 {name:'Igloo 120',min:5,max:6,cap:'5-6 pizzas por horneada',heat:'Calentamiento a 300 °C: unos 90 min'},
 {name:'Rotativo 120',min:8,max:9,cap:'8-9 pizzas por horneada, con piso giratorio',heat:'Calentamiento: consulta la ficha técnica'},
 {name:'Igloo 180',min:17,max:19,cap:'17-19 pizzas por horneada',heat:'Calentamiento: consulta la ficha técnica'}
];
const COMPARE={
 wood:{label:'Horno de leña',rows:[
  ['Fuego y sabor','Llama real a gas sobre piso y cúpula refractarios.','Llama real de leña, con su aroma característico.'],
  ['Control','Quemador a gas: calor constante y fácil de regular.','Manual: depende de alimentar y leer el fuego.'],
  ['Oficio necesario','Medio: el gas simplifica el manejo del fuego.','Alto: requiere un pizzaiolo con experiencia.'],
  ['Instalación','Conexión de gas, chimenea y ventilación según ficha técnica.','Chimenea, espacio y almacenaje de leña seca.'],
  ['Día a día','Encendido práctico y sin leña que acopiar.','Acarreo de leña, cenizas y más limpieza.'],
  ['En sala','Cúpula de mosaico a la vista: el horno es parte del espectáculo.','También de cúpula visible, con el humo como reto.'],
  ['Mejor para','Pizza napolitana y artesanal, y platos al horno.','Pizza napolitana clásica con servicio muy tradicional.']]},
 electric:{label:'Eléctrico de platos',rows:[
  ['Fuego y sabor','Llama real a gas sobre piso y cúpula refractarios.','Calor eléctrico sobre piso refractario; sin llama.'],
  ['Control','Quemador a gas: calor constante y fácil de regular.','Electrónico por cámara, programable.'],
  ['Oficio necesario','Medio: el gas simplifica el manejo del fuego.','Bajo a medio: temperatura estable y repetible.'],
  ['Instalación','Conexión de gas, chimenea y ventilación según ficha técnica.','Potencia eléctrica adecuada; consulta la ventilación local.'],
  ['Producción','Una bóveda; la capacidad depende del tamaño del horno.','Cámaras modulares apilables: más superficie en menos espacio.'],
  ['En sala','Cúpula de mosaico a la vista: el horno es parte del espectáculo.','Acero inoxidable, funcional y discreto.'],
  ['Mejor para','Pizza napolitana y artesanal, y platos al horno.','Pizza al corte, romana y en bandeja con alta uniformidad.']]},
 belt:{label:'De cinta',rows:[
  ['Fuego y sabor','Llama real a gas sobre piso y cúpula refractarios.','Aire caliente sobre banda; sin llama ni piso de piedra.'],
  ['Control','Quemador a gas: calor constante y fácil de regular.','Tiempo y temperatura fijos: resultados repetibles.'],
  ['Oficio necesario','Medio: el gas simplifica el manejo del fuego.','Bajo: casi cualquier operario obtiene el mismo resultado.'],
  ['Instalación','Conexión de gas, chimenea y ventilación según ficha técnica.','Gas o electricidad, y extracción según el modelo.'],
  ['Producción','Una bóveda; la capacidad depende del tamaño del horno.','Cocción continua: el mayor volumen sostenido.'],
  ['En sala','Cúpula de mosaico a la vista: el horno es parte del espectáculo.','Equipo de cocina, pensado para trabajar fuera de la vista.'],
  ['Mejor para','Pizza napolitana y artesanal, y platos al horno.','Alto volumen, cadenas y servicio a domicilio.']]}
};

const $=s=>document.querySelector(s),paused=()=>document.body.classList.contains('motion-paused');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---- Cifras con conteo animado al entrar en pantalla ---- */
const counters=[...document.querySelectorAll('[data-count]')];
function countUp(el){const end=+el.dataset.count,pre=el.dataset.prefix||'',suf=el.dataset.suffix||'';if(paused()){el.textContent=pre+end+suf;return}const t0=performance.now(),dur=1300;(function tick(t){const p=Math.min(1,(t-t0)/dur),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=pre+v+suf;if(p<1)requestAnimationFrame(tick)})(t0)}
if(counters.length&&'IntersectionObserver' in window){counters.forEach(el=>{el.textContent=(el.dataset.prefix||'')+'0'+(el.dataset.suffix||'')});const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){countUp(e.target);io.unobserve(e.target)}}),{threshold:.6});counters.forEach(el=>io.observe(el))}

/* ---- Comparador ---- */
const table=$('#cmp-table');let current='wood';
function renderCompare(){const c=COMPARE[current];table.innerHTML=`<div class="cmp-row cmp-head"><span></span><b>Valoriani a gas</b><b>${esc(c.label)}</b></div>`+c.rows.map(r=>`<div class="cmp-row"><span>${esc(r[0])}</span><p class="cmp-us">${esc(r[1])}</p><p>${esc(r[2])}</p></div>`).join('')}
document.querySelectorAll('[data-cmp]').forEach(b=>b.addEventListener('click',()=>{current=b.dataset.cmp;document.querySelectorAll('[data-cmp]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderCompare()}));
renderCompare();

/* ---- Calculadora de tamaño ---- */
const peak=$('#calc-peak'),out=$('#calc-peak-out');
function calc(){const p=+peak.value,mid=x=>(x.min+x.max)/2,m=MODELS.find(x=>mid(x)*CYCLES_PER_HOUR>=p)||MODELS[MODELS.length-1],use=Math.min(100,Math.round(p/(mid(m)*CYCLES_PER_HOUR)*100)),gas=(document.querySelector('input[name="gas"]:checked')||{}).value||'';
out.textContent=p;peak.setAttribute('aria-valuetext',`${p} pizzas por hora`);
$('#calc-model').textContent=m.name;$('#calc-cap').textContent=m.cap;$('#calc-heat').textContent=m.heat;
$('#calc-meter').style.width=use+'%';$('#calc-meter-label').textContent=`Uso de la capacidad en hora pico: ${use} %`;
const text=['Hola, Mondo Italiano. Quiero cotizar un horno Valoriani.',`Pizzas por hora en horario pico: ${p}`,`Tipo de gas: ${gas}`,`Tamaño de referencia: ${m.name}`,'Mi local está en: '].join('\n');
$('#calc-cta').href=`https://wa.me/${WHATSAPP}?text=`+encodeURIComponent(text)}
peak.addEventListener('input',calc);document.querySelectorAll('input[name="gas"]').forEach(r=>r.addEventListener('change',calc));calc();

/* ---- Prueba social (oculta hasta confirmar con el cliente) ---- */
if(SHOW_LA_CLASICA_PROOF){const p=document.querySelector('[data-la-clasica-proof]');if(p)p.hidden=false}
})();
