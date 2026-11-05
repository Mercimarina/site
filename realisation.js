/* ═══════════════════════════════════════════════════════════════
   realisation.js : script COMMUN à toutes les pages « réalisation »
   1. menu   2. frise de logos   3. carrousel   4. avant/après   5. « à découvrir aussi »
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ── 1. Menu burger ── */
  (function () {
    var b = $('.burger'), n = $('#nav');
    if (!b || !n) return;
    var set = function (open) { b.setAttribute('aria-expanded', open); n.classList.toggle('open', open); };
    b.addEventListener('click', function (e) { e.stopPropagation(); set(b.getAttribute('aria-expanded') !== 'true'); });
    n.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('click', function (e) { if (!n.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  })();

  /* ── 2. Frise de logos du pied de page : on duplique la liste pour une boucle sans fin ── */
  (function () {
    var rail = $('.flogos .rail');
    if (!rail) return;
    var base = [].slice.call(rail.children);
    for (var k = 0; k < 3; k++) base.forEach(function (el) { rail.appendChild(el.cloneNode(true)); });
  })();

  /* ── 3. Carrousel « cohérence visuelle » : parallaxe au scroll + glisser + inertie + survol ── */
  (function () {
    var wall = $('#wall');
    if (!wall) return;
    var rows = [].slice.call(wall.querySelectorAll('.rz-wrow'));
    if (!rows.length) return;

    // Chaque rangée est répétée 3 fois (boucle infinie) et centrée automatiquement, quel que soit son nombre de slides
    rows.forEach(function (row) {
      var base = [].slice.call(row.children);
      row._n = base.length;
      for (var k = 0; k < 2; k++) base.forEach(function (el) { var c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); row.appendChild(c); });
      row.style.marginLeft = 'calc(' + (2012 - 36 * row._n) + 'px - ' + (1.5 * row._n) + ' * var(--iw, 440px))';
    });

    var scrollPos = 0, cur = null, tgt = 0, raf = 0, drag = 0;
    // position d'une rangée, ramenée dans [-c/2, c/2[ (boucle sans fin)
    var wrap = function (x, n) {
      var im = rows[0].querySelector('img'), c = n * ((im && im.offsetWidth ? im.offsetWidth : 440) + 24);
      return ((x + c / 2) % c + c) % c - c / 2;
    };
    var paint = function () {
      var w = scrollPos * 0.35;
      rows.forEach(function (row, i) { row.style.transform = 'translateX(' + wrap((i % 2 ? 1 : -1) * w + drag, row._n) + 'px)'; });
    };

    // Parallaxe : la cible suit le scroll, lissée par requestAnimationFrame
    var calc = function () {
      var r = wall.getBoundingClientRect();
      tgt = (window.innerHeight - r.top) - (window.innerHeight + r.height) / 2;
    };
    var loop = function () {
      if (cur === null) cur = tgt;
      cur += (tgt - cur) * 0.08; scrollPos = cur; paint();
      raf = Math.abs(tgt - cur) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    var onScroll = function () { calc(); if (!reduced && !raf) raf = requestAnimationFrame(loop); };
    calc(); cur = tgt; scrollPos = cur; paint();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', function () { onScroll(); paint(); });

    // Glisser (souris / doigt), inertie, et défilement au survol des bords
    var hv = 0, hraf = 0, down = false, sx = 0, sd = 0, lastX = 0, lastT = 0, vel = 0, raf2 = 0;
    var inertia = function () { vel *= 0.975; if (Math.abs(vel) < 0.3) { raf2 = 0; return; } drag += vel; paint(); raf2 = requestAnimationFrame(inertia); };
    var hover = function () { if (down || !hv) { hraf = 0; return; } drag -= hv * 4; paint(); hraf = requestAnimationFrame(hover); };
    wall.style.touchAction = 'pan-y'; wall.style.cursor = 'grab';
    wall.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      down = true; sx = e.clientX; sd = drag; lastX = e.clientX; lastT = performance.now(); vel = 0;
      if (raf2) { cancelAnimationFrame(raf2); raf2 = 0; }
      try { wall.setPointerCapture(e.pointerId); } catch (err) {}
      wall.style.cursor = 'grabbing';
    });
    wall.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'mouse' || reduced) return; if (!hraf) hraf = requestAnimationFrame(hover); });
    wall.addEventListener('pointerleave', function () { hv = 0; });
    wall.addEventListener('pointermove', function (e) {
      if (!down) {
        if (e.pointerType === 'mouse' && !reduced) {
          var r = wall.getBoundingClientRect(), k = ((e.clientX - r.left) / r.width - 0.5) * 2;
          hv = Math.abs(k) < 0.15 ? 0 : (k - Math.sign(k) * 0.15) / 0.85;
          if (hv && !hraf) hraf = requestAnimationFrame(hover);
        }
        return;
      }
      var now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT) * 16; lastX = e.clientX; lastT = now;
      drag = sd + (e.clientX - sx); paint();
    });
    var up = function (e) {
      if (!down) return;
      down = false; wall.style.cursor = 'grab';
      try { wall.releasePointerCapture(e.pointerId); } catch (err) {}
      if (!reduced && Math.abs(vel) > 0.5) raf2 = requestAnimationFrame(inertia);
    };
    wall.addEventListener('pointerup', up);
    wall.addEventListener('pointercancel', up);
  })();

  /* ── 4. Grille avant / après : retournement en damier, déclenché à l'arrivée sur la section ── */
  (function () {
    var grid = $('#bagrid'), sA = $('#baA'), sB = $('#baB');
    if (!grid || !sA || !sB) return;
    var tiles = [].slice.call(grid.children), started = false, timer = 0;
    var cols = function () { return getComputedStyle(grid).gridTemplateColumns.split(' ').length; };
    var refresh = function () {                     // état des boutons Avant / Après
      var n = tiles.filter(function (t) { return t.classList.contains('flip'); }).length;
      sA.classList.toggle('on', n === 0);
      sB.classList.toggle('on', n === tiles.length);
    };
    // Retourne uniquement les tuiles qui ne sont pas déjà dans l'état voulu
    var wave = function (target) {
      var c = cols(), changed = [], min = 1e9, maxd = 0;
      tiles.forEach(function (t, i) {
        if (t.classList.contains('flip') === target) return;
        var r = Math.floor(i / c), q = i % c, d = reduced ? 0 : (((r + q) % 2) * 380 + (r + q) * 70);
        changed.push([t, d]); if (d < min) min = d;
      });
      changed.forEach(function (x) {
        var d = x[1] - min; if (d > maxd) maxd = d;
        x[0].style.setProperty('--d', d + 'ms'); x[0].classList.toggle('flip', target);
      });
      clearTimeout(timer);
      timer = setTimeout(function () { tiles.forEach(function (t) { t.style.setProperty('--d', '0ms'); }); refresh(); }, reduced ? 0 : maxd + 900);
      refresh();
    };
    // Premier affichage : passage sur « Après » quand la grille entre à l'écran
    var check = function () {
      if (started) return;
      var r = grid.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.height > 0 && r.top < vh * 0.78 && r.bottom > vh * 0.1) {
        started = true;
        window.removeEventListener('scroll', check, true); window.removeEventListener('resize', check);
        wave(true);
      }
    };
    window.addEventListener('scroll', check, { passive: true, capture: true });
    window.addEventListener('resize', check);
    if ('IntersectionObserver' in window) new IntersectionObserver(check, { rootMargin: '0px 0px -20% 0px', threshold: [0, 0.05, 0.2] }).observe(grid);
    setTimeout(check, 400); setTimeout(check, 1500);   // filet de sécurité (mobile)
    sA.addEventListener('click', function () { if (started) wave(false); });
    sB.addEventListener('click', function () { if (started) wave(true); });
    grid.addEventListener('click', function (e) {
      var t = e.target.closest('.rz-batile');
      if (!t || !started) return;
      t.style.setProperty('--d', '0ms'); t.classList.toggle('flip'); refresh();
    });
  })();

  /* ── 5. « À découvrir aussi » : flèches précédent / suivant ── */
  (function () {
    var list = $('#vwks');
    if (!list || !list.firstElementChild) return;
    var go = function (dir) { return function () { list.scrollBy({ left: dir * (list.firstElementChild.offsetWidth + 22) }); }; };
    var p = $('.rz-varr--prev'), n = $('.rz-varr--next');
    if (p) p.addEventListener('click', go(-1));
    if (n) n.addEventListener('click', go(1));
  })();
})();
