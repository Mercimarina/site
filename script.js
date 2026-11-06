const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* En-tête : menu mobile + section active */
(()=>{
 const nav=$('#nav'),burger=$('.burger'),links=$$('a',nav);
 const close=()=>{nav.classList.remove('open');burger.setAttribute('aria-expanded','false')};
 burger.addEventListener('click',()=>burger.setAttribute('aria-expanded',nav.classList.toggle('open')));
 links.forEach(a=>a.addEventListener('click',close));
 document.addEventListener('click',e=>{if(!e.target.closest('.hbar'))close()});
 /* Menu ouvert : il se referme dès que l’on fait défiler la page */
 let y0=0;burger.addEventListener('click',()=>{y0=scrollY});
 addEventListener('scroll',()=>{if(nav.classList.contains('open')&&Math.abs(scrollY-y0)>30)close()},{passive:true});
 const head=$('header.site'),hero=$('.hero');
 const upd=()=>head.classList.toggle('solid',scrollY>hero.offsetHeight-70);
 addEventListener('scroll',upd,{passive:true});
 const sv=$('#services'),sc=()=>head.classList.toggle('past',scrollY>=sv.offsetTop-90);addEventListener('scroll',sc,{passive:true});addEventListener('resize',sc);sc();addEventListener('resize',upd);upd();
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
 links.forEach(a=>{const s=$(a.getAttribute('href'));if(s)io.observe(s)});
})();

/* Frises de logos (continues, quelle que soit la largeur d’écran) */
(()=>{
 const LG=[["logo-client-01.svg",106,23],["logo-client-02.svg",112,25],["logo-client-03.svg",124,19],["logo-client-04.svg",84,29],["logo-client-05.svg",88,27],["logo-client-06.svg",75,36],["logo-client-07.svg",95,24],["logo-client-08.svg",128,24]];
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

/* Carrousel « style graphique » : 2 rangées de slides en défilement continu, élan au scroll, ralenti au survol */
(() => {
  const P = {myc:'MyconnectingIA · Présentation commerciale', she:'Sherpa · Support de formation', fyd:'Fydem · Pitch deck'};
  const ROWS = [
    ['myc-03','she-07','fyd-05','myc-13','she-04','fyd-09','myc-06','she-15'],
    ['she-13','fyd-01','myc-01','she-03','fyd-13','myc-02','she-08','fyd-11']
  ];
  const SPEED = [22, 22], DIR = [-1, 1];
  const plane = document.getElementById('sg-plane'), stage = document.getElementById('sg-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rows = ROWS.map(ids => {
    const row = document.createElement('div'); row.className = 'sg-row';
    ids.concat(ids, ids).forEach(id => {
      const p = id.slice(0,3), t = document.createElement('div'); t.className = 'sg-tile';
      const im = new Image(); im.src = id + '.webp'; im.alt = ''; im.decoding = 'async';
      const lab = document.createElement('span'); lab.className = 'sg-lab'; lab.textContent = P[p];
      t.append(im, lab); row.append(t);
    });
    plane.append(row);
    return {el: row, n: ids.length, x: 0, w: 0, hover: 0};
  });
  // Chaque rangée contient 3 fois la même série. On garde son décalage entre -w/2 et +w/2 (w = largeur d'une série) :
  // l'écran est alors toujours couvert et, après la dernière slide, la première revient sans rupture.
  const wrap = r => { if (!r.w) return; while (r.x < -r.w / 2) r.x += r.w; while (r.x > r.w / 2) r.x -= r.w; };
  let started = false;
  const measure = () => rows.forEach((r, i) => {
    r.w = r.el.children[r.n].offsetLeft - r.el.children[0].offsetLeft;
    if (!started) r.x = -r.w * 0.25 * i;
    wrap(r);
  }) || (started = true);
  rows.forEach(r => { r.el.addEventListener('pointerenter', () => r.hover = 1); r.el.addEventListener('pointerleave', () => r.hover = 0); });
  let boost = 0, lastY = scrollY, visible = true, last = performance.now();
  addEventListener('scroll', () => { boost += (scrollY - lastY) * 0.8; lastY = scrollY; }, {passive:true});
  new IntersectionObserver(es => es.forEach(e => visible = e.isIntersecting)).observe(stage);
  function frame(now) {
    const dt = Math.min(64, now - last) / 1000; last = now;
    if (visible) {
      boost *= Math.pow(0.04, dt);
      rows.forEach((r, i) => {
        if (!reduced) {
          r.x += DIR[i] * (SPEED[i] * (r.hover ? 0.12 : 1) * dt + boost * dt * 3 * (1 + i * .15));
          wrap(r);
        }
        r.el.style.transform = `translate3d(${r.x}px,0,0)`;
      });
    }
    requestAnimationFrame(frame);
  }
  addEventListener('load', measure); addEventListener('resize', measure);
  measure(); requestAnimationFrame(frame);
})();

/* Réalisations : bouton flèche en bas à droite au survol (PC) + un seul clic/tap pour ouvrir la page */
(()=>{
 const wk=$('.wks');
 $$('.wk',wk).forEach(c=>{
  const fl=$('.fl',c);if(!fl)return;
  fl.insertAdjacentHTML('beforeend','<span class="voir" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#arr"/></svg></span>');
 });
 wk.addEventListener('click',e=>{
  const c=e.target.closest('.wk');if(!c)return;
  const h=c.getAttribute('href');
  if(!h||h==='#')e.preventDefault(); /* cartes sans page : on ne fait rien */
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

(()=>{const a=document.querySelector('.wt');if(!a)return;a.addEventListener('click',e=>{
 if(e.ctrlKey||e.metaKey||e.shiftKey||window.innerWidth<700)return;
 const w=520,h=760,l=Math.max(0,(screen.width-w)/2),t=Math.max(0,(screen.height-h)/2);
 const p=window.open(a.href,'wetransfer','popup=yes,width='+w+',height='+h+',left='+l+',top='+t+'');
 if(p){p.opener=null;e.preventDefault()}})})();
