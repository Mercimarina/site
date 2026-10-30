const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* En-tête : menu mobile + section active */
(()=>{
 const nav=$('#nav'),burger=$('.burger'),links=$$('a',nav);
 const close=()=>{nav.classList.remove('open');burger.setAttribute('aria-expanded','false')};
 burger.addEventListener('click',()=>burger.setAttribute('aria-expanded',nav.classList.toggle('open')));
 links.forEach(a=>a.addEventListener('click',close));
 document.addEventListener('click',e=>{if(!e.target.closest('.hbar'))close()});
 const head=$('header.site'),hero=$('.hero');
 const upd=()=>head.classList.toggle('solid',scrollY>hero.offsetHeight-70);
 addEventListener('scroll',upd,{passive:true});
 const sv=$('#services'),sc=()=>head.classList.toggle('past',scrollY>=sv.offsetTop-90);addEventListener('scroll',sc,{passive:true});addEventListener('resize',sc);sc();addEventListener('resize',upd);upd();
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
 links.forEach(a=>{const s=$(a.getAttribute('href'));if(s)io.observe(s)});
})();

/* Frises de logos (continues, quelle que soit la largeur d’écran) */
(()=>{
 const LG=[["images/logo-client-01.svg",106,23],["images/logo-client-02.svg",112,25],["images/logo-client-03.svg",124,19],["images/logo-client-04.svg",84,29],["images/logo-client-05.svg",88,27],["images/logo-client-06.svg",75,36],["images/logo-client-07.svg",95,24],["images/logo-client-08.svg",128,24]];
 const gap=52,setW=LG.reduce((a,l)=>a+l[1]+gap,0),K=Math.ceil(Math.max(innerWidth,screen.width||0,1920)/setW)+1;
 ['rail','rail2'].forEach(id=>{const r=document.getElementById(id);
  for(let c=0;c<2*K;c++)LG.forEach(l=>{const im=new Image();im.alt='';im.src=l[0];im.style.width=l[1]+'px';im.style.height=l[2]+'px';r.appendChild(im)});
  r.style.animationDuration=(K*setW/55)+'s'});
})();

/* Services (accordéon : un seul ouvert à la fois) */
(()=>{
 const list=$('#list');
 list.addEventListener('click',e=>{
  const a=e.target.closest('a[data-svc]');
  if(a){const f=$('#tf');$$('input[name=svc]',f).forEach(c=>{c.checked=c.value===a.dataset.svc;c.dispatchEvent(new Event('change'))});f.dispatchEvent(new CustomEvent('prefill'));return}
  const b=e.target.closest('.item>button');if(!b)return;
  const it=b.parentElement,was=it.classList.contains('open');
  $$('.item.open',list).forEach(x=>{x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')});
  if(!was){it.classList.add('open');b.setAttribute('aria-expanded','true')}
 });
})();

/* Carrousel en biais : défilement lissé au scroll */
(()=>{
 const IM=[["images/carrousel-01.webp","images/carrousel-02.webp","images/carrousel-03.webp","images/carrousel-04.webp","images/carrousel-05.webp"],["images/carrousel-06.webp","images/carrousel-07.webp","images/carrousel-08.webp","images/carrousel-09.webp"],["images/carrousel-10.webp","images/carrousel-11.webp","images/carrousel-12.webp","images/carrousel-13.webp","images/carrousel-14.webp"],["images/carrousel-15.webp","images/carrousel-16.webp","images/carrousel-17.webp","images/carrousel-18.webp","images/carrousel-19.webp"]];
 const reel=$('#reel'),box=reel.parentNode;
 IM.forEach((imgs,r)=>{
  const row=document.createElement('div');row.className='row';row.dataset.d=r%2?1:-1;
  for(let i=0;i<28;i++){const t=document.createElement('div');t.className='tile';const im=new Image();im.alt='';im.decoding='async';im.src=imgs[i%imgs.length];t.appendChild(im);row.appendChild(t)}
  reel.appendChild(row);
 });
 const rows=[...reel.children];let cur=0,tgt=0,raf=0,base=0;
 const measure=()=>{base=(rows[0].scrollWidth-reel.offsetWidth)/2};
 const calc=()=>{tgt=innerHeight-box.getBoundingClientRect().top};
 function loop(){cur+=(tgt-cur)*.08;rows.forEach(r=>{const d=+r.dataset.d;r.style.transform='translate3d('+((d<0?0:-base)+d*cur*.35)+'px,0,0)'});raf=Math.abs(tgt-cur)>.2?requestAnimationFrame(loop):0}
 measure();calc();cur=tgt;loop();
 addEventListener('resize',()=>{measure();calc();loop()});
 if(!reduced)addEventListener('scroll',()=>{calc();if(!raf)raf=requestAnimationFrame(loop)},{passive:true});
})();

/* Réalisations : flèches et retournement au toucher */
(()=>{
 const wk=$('.wks'),cards=$$('.wk',wk);
 wk.addEventListener('click',e=>{
  const c=e.target.closest('.wk');if(!c)return;e.preventDefault();
  if(matchMedia('(hover:hover)').matches)return;
  const on=c.classList.contains('on');cards.forEach(x=>x.classList.remove('on'));if(!on)c.classList.add('on');
 });
 $$('#realisations .wnav .arrow').forEach(b=>b.addEventListener('click',()=>wk.scrollBy({left:(b.classList.contains('prev')?-1:1)*(wk.firstElementChild.offsetWidth+22)})));
})();

/* Méthode : flèches de défilement */
(()=>{const st=$('.steps');$$('.snav .arrow').forEach(b=>b.addEventListener('click',()=>st.scrollBy({left:(b.classList.contains('prev')?-1:1)*(st.firstElementChild.offsetWidth+22),behavior:'smooth'})))})();

/* Témoignages : carrousel circulaire */
(()=>{
 const car=$('.tcar');
 const cs=[...car.children],n=cs.length;let cur=cs.findIndex(c=>c.classList.contains('malt'));
 function render(){
  cs.forEach((c,i)=>{let d=((i-cur)%n+n)%n;if(d>n/2)d-=n;c.dataset.o=Math.abs(d)>2?'h':d;c.setAttribute('aria-hidden',d===0?'false':'true')});
 }
 const go=k=>{cur=(cur+k+n)%n;render()};
 $('.tb.next').addEventListener('click',()=>go(1));
 $('.tb.prev').addEventListener('click',()=>go(-1));
 cs.forEach(c=>c.addEventListener('click',()=>{if(matchMedia('(pointer:coarse)').matches||Date.now()-sw<500)return;if(c.dataset.o==='1')go(1);else if(c.dataset.o==='-1')go(-1)}));
 render();
 let x0=null,y0=0,sw=0;
 car.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
 car.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;const dy=e.changedTouches[0].clientY-y0;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){go(dx<0?1:-1);sw=Date.now()}},{passive:true});
})();

/* Formulaire pas à pas */
(()=>{
 const f=$('#tf'),steps=$$('.st',f),bar=$('.bar i',f),cnt=$('.cnt',f),nx=$('.nx',f),pv=$('.back',f),em=$('#em'),err=$('.err',f);
 let i=0,ready=false;
 function show(k,d){
  steps[i].classList.remove('on');i=k;const s=steps[i];
  s.style.setProperty('--d',d>=0?'30px':'-30px');s.classList.add('on');
  bar.style.width=((i+1)/steps.length*100)+'%';cnt.textContent=(i+1)+' / '+steps.length;
  pv.hidden=i===0;
  const last=i===steps.length-1;
  nx.classList.toggle('icon',!last);$('span',nx).textContent=last?'Envoyer':'';nx.setAttribute('aria-label',last?'Envoyer':'Suivant');
  err.textContent='';
  const t=$('input:not([type=checkbox]):not([hidden]):not([name=_gotcha]):not([type=hidden]),textarea',s);if(t&&ready)t.focus({preventScroll:true});
 }
 async function send(){
  if(nx.disabled)return;nx.disabled=true;err.textContent='';
  const d=new FormData(f);const svc=d.getAll('svc').join(', ');d.delete('svc');d.set('besoin',svc);
  try{const r=await fetch(f.action,{method:'POST',body:d,headers:{Accept:'application/json'}});
   if(r.ok){f.classList.add('done')}else{throw 0}}
  catch(_){err.textContent='L’envoi a échoué. Réessayez ou écrivez-moi directement par e-mail.'}
  nx.disabled=false;
 }
 function next(){
  if(i===steps.length-1){if(!em.value||!em.checkValidity()){err.textContent='Merci d’indiquer une adresse e-mail valide.';em.focus();return}send();return}
  show(i+1,1);
 }
 nx.addEventListener('click',next);pv.addEventListener('click',()=>show(i-1,-1));
 f.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.target.closest('button'))return;
  if(e.target.tagName==='TEXTAREA'){if(e.ctrlKey||e.metaKey){e.preventDefault();next()}return}
  e.preventDefault();next();
 });
 f.addEventListener('submit',e=>e.preventDefault());
 const o=$('#oth'),ot=$('#othtxt');o.addEventListener('change',()=>{ot.hidden=!o.checked;if(o.checked)ot.focus()});
  f.addEventListener('prefill',()=>{f.classList.remove('done');if(i!==0)show(0,-1)});
 show(0,1);ready=true;
})();

/* Icône flèche des boutons */
$$('.pill').forEach(b=>b.insertAdjacentHTML('beforeend','<i class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#arr"/></svg></i>'));
