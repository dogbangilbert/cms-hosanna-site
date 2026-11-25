// CMS HOSANNA — animations et éléments vivants, partagés par toutes les pages
(function(){
  var calme = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('header');
  var aujourdhui = new Date().toISOString().slice(0, 10);

  // Barre de progression de lecture
  var barre = document.createElement('div'); barre.className = 'vie-progress'; document.body.appendChild(barre);
  // Bouton retour en haut
  var haut = document.createElement('button'); haut.className = 'vie-haut'; haut.setAttribute('aria-label', 'Revenir en haut'); haut.textContent = '↑';
  haut.onclick = function(){ window.scrollTo({top:0, behavior: calme ? 'auto' : 'smooth'}); };
  document.body.appendChild(haut);
  function surDefilement(){
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    barre.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    if (header) header.classList.toggle('vie-scrolled', h.scrollTop > 20);
    haut.classList.toggle('on', h.scrollTop > 600);
  }
  window.addEventListener('scroll', surDefilement, {passive:true}); surDefilement();
  // Le menu mobile s'ouvre juste sous l'en-tête, quelle que soit sa hauteur
  var nav = document.getElementById('nav');
  function placerMenu(){ if (nav && header && window.innerWidth <= 960) nav.style.top = header.offsetHeight + 'px'; else if (nav) nav.style.top = ''; }
  window.addEventListener('resize', placerMenu); window.addEventListener('scroll', placerMenu, {passive:true});
  setTimeout(placerMenu, 50);

  // Bandeau « Campagne du mois » : réglages dans /assets/campagne.json (texte, prix, dates, lien).
  // Il s'affiche du jour « debut » au jour « fin » inclus, puis disparaît tout seul.
  if (header && !/octobre-rose|test-sein/.test(location.pathname)) {
    fetch('/assets/campagne.json', {cache:'no-cache'}).then(function(r){ return r.ok ? r.json() : null; }).then(function(c){
      if (!c || c.actif === false || !c.debut || !c.fin || aujourdhui < c.debut || aujourdhui > c.fin) return;
      var mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      var f = c.fin.split('-'), jusqua = 'jusqu\'au ' + (+f[2]) + ' ' + mois[+f[1] - 1];
      var b = document.createElement('a'); b.className = 'vie-bandeau'; b.href = c.lien || '/contact';
      if (c.couleurs && c.couleurs.length === 2) b.style.backgroundImage = 'linear-gradient(90deg,' + c.couleurs[0] + ',' + c.couleurs[1] + ',' + c.couleurs[0] + ')';
      if (c.couleur_texte) { b.style.color = c.couleur_texte; b.classList.add('vie-bandeau-clair'); }
      if (c.couleur_prix) b.style.setProperty('--vie-prix', c.couleur_prix);
      function morceau(classe, parties){
        var s = document.createElement('span'); s.className = classe;
        parties.forEach(function(p){
          var el = document.createElement(p[0]); el.textContent = p[1]; s.appendChild(el);
        });
        return s;
      }
      var prix = c.prix_barre ? [['s', c.prix_barre], ['span', ' ']] : [];
      b.appendChild(morceau('vie-long', [['span', (c.emoji ? c.emoji + ' ' : '') + c.nom + ' : ' + c.offre + ', ']].concat(prix, [['b', c.prix], ['span', ', ' + jusqua + '. ' + (c.action || 'Prendre rendez-vous')]])));
      b.appendChild(morceau('vie-court', [['span', (c.emoji ? c.emoji + ' ' : '') + c.nom + ' · ' + (c.offre_courte || c.offre) + ' · '], ['b', c.prix]]));
      var fleche = document.createElement('span'); fleche.className = 'vie-fleche'; fleche.textContent = '→';
      b.appendChild(document.createTextNode(' ')); b.appendChild(fleche);
      b.setAttribute('aria-label', c.nom + ' : ' + c.offre + ', ' + c.prix + (c.prix_barre ? ' au lieu de ' + c.prix_barre : '') + ', ' + jusqua + '. ' + (c.action || 'Prendre rendez-vous'));
      // Phrases qui s'écrivent lettre par lettre, puis restent affichées, puis la suivante (texte fixe si animations désactivées)
      if (c.phrases && c.phrases.length && !calme) {
        var zone = document.createElement('span'); zone.className = 'vie-machine'; zone.setAttribute('aria-hidden', 'true');
        b.insertBefore(zone, b.firstChild); b.classList.add('vie-anime');
        var ph = 0, n = 0;
        (function tape(){
          var t = Array.from(c.phrases[ph]);
          zone.textContent = t.slice(0, n).join('');
          if (n < t.length) { n++; setTimeout(tape, 55); }
          else setTimeout(function(){ ph = (ph + 1) % c.phrases.length; n = 0; tape(); }, 2200);
        })();
      }
      header.insertBefore(b, header.firstChild);
      placerMenu();
    }).catch(function(){});
  }

  // Barre d'actions fixe sur téléphone (pas sur les pages campagne, qui ont leurs propres boutons)
  if (!/octobre-rose|test-sein/.test(location.pathname)) {
    var barreBas = document.createElement('div'); barreBas.setAttribute('role', 'navigation'); barreBas.className = 'vie-barre'; barreBas.setAttribute('aria-label', 'Actions rapides');
    barreBas.innerHTML = '<a href="tel:+22890038313"><span>📞</span>Appeler</a>'
      + '<a href="https://wa.me/22890038313?text=' + encodeURIComponent('Bonjour CMS HOSANNA, ') + '" target="_blank" rel="noopener"><span><img src="/img/whatsapp.svg" alt="" width="22" height="22"></span>WhatsApp</a>'
      + '<a href="https://www.google.com/maps/place/?q=place_id:ChIJYcQs0OrjIxAR3Bw_aQrvbj4" target="_blank" rel="noopener"><span>📍</span>Itinéraire</a>'
      + '<a href="/contact" class="rdv"><span>📅</span>Rendez-vous</a>';
    document.body.appendChild(barreBas); document.body.classList.add('vie-avec-barre');
  }

  // Onde au toucher sur les boutons
  document.addEventListener('pointerdown', function(e){
    var btn = e.target.closest && e.target.closest('.btn'); if (!btn || calme) return;
    var r = btn.getBoundingClientRect(), o = document.createElement('span'), t = Math.max(r.width, r.height) / 2;
    o.className = 'vie-onde'; o.style.width = o.style.height = t + 'px';
    o.style.left = (e.clientX - r.left - t / 2) + 'px'; o.style.top = (e.clientY - r.top - t / 2) + 'px';
    btn.appendChild(o); setTimeout(function(){ o.remove(); }, 650);
  });

  // Apparition en cascade des cartes d'une même grille
  document.querySelectorAll('.grid-3, .grid-4, .grid-2').forEach(function(g){
    Array.prototype.forEach.call(g.querySelectorAll(':scope > .reveal'), function(el, i){ el.classList.add('vie-d' + (i % 3 + 1)); });
  });

  // Chiffres qui comptent
  var compteurs = document.querySelectorAll('[data-compte]');
  if (compteurs.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var el = e.target, fin = parseFloat(el.dataset.compte), dec = (el.dataset.compte.split('.')[1] || '').length, t0 = null;
        if (calme) { el.textContent = fin.toFixed(dec).replace('.', ','); return; }
        function pas(t){ if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1600), v = fin * (1 - Math.pow(1 - p, 3));
          el.textContent = v.toFixed(dec).replace('.', ','); if (p < 1) requestAnimationFrame(pas); }
        requestAnimationFrame(pas);
      });
    }, {threshold:.5});
    compteurs.forEach(function(c){ c.textContent = '0'; io.observe(c); });
  }

  // Héros : bulles flottantes et texte qui défile
  var hero = document.querySelector('.hero');
  if (hero && !calme) {
    [[90,8,70,18],[150,72,12,26],[60,58,62,15],[110,20,85,22],[40,85,40,12]].forEach(function(c){
      var s = document.createElement('span'); s.className = 'vie-bulle';
      s.style.width = s.style.height = c[0] + 'px'; s.style.left = c[1] + '%'; s.style.top = c[2] + '%'; s.style.animationDuration = c[3] + 's';
      hero.appendChild(s);
    });
  }
  var defile = document.querySelector('[data-defile]');
  if (defile) {
    var mots = defile.dataset.defile.split('|'), cible = defile.querySelector('span'), i = 0, n = 0, efface = false;
    if (calme) cible.textContent = mots[0];
    else (function tape(){
      var m = mots[i];
      cible.textContent = m.slice(0, n);
      if (!efface && n < m.length) { n++; setTimeout(tape, 70); }
      else if (!efface) { efface = true; setTimeout(tape, 1800); }
      else if (n > 0) { n--; setTimeout(tape, 35); }
      else { efface = false; i = (i + 1) % mots.length; setTimeout(tape, 300); }
    })();
  }

  // Témoignages en carrousel sur téléphone
  var temo = document.querySelector('.testimonials .grid-3');
  if (temo) {
    temo.classList.add('vie-carrousel');
    var cartes = temo.children, points = document.createElement('div'); points.className = 'vie-points';
    for (var k = 0; k < cartes.length; k++) points.appendChild(document.createElement('i'));
    temo.parentNode.insertBefore(points, temo.nextSibling);
    var actif = 0;
    function marquer(){ var w = cartes[0].getBoundingClientRect().width + 14; actif = Math.round(temo.scrollLeft / w);
      Array.prototype.forEach.call(points.children, function(p, j){ p.classList.toggle('on', j === actif); }); }
    temo.addEventListener('scroll', marquer, {passive:true}); marquer();
    if (!calme) setInterval(function(){
      if (window.innerWidth > 760 || document.hidden) return;
      var w = cartes[0].getBoundingClientRect().width + 14;
      temo.scrollTo({left: ((actif + 1) % cartes.length) * w, behavior:'smooth'});
    }, 5000);
  }
})();
