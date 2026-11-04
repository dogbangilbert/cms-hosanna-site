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

  // Bandeau Octobre rose (jusqu'au 30 octobre 2026), avec places restantes en direct
  if (aujourdhui <= '2026-10-30' && header && !/octobre-rose|test-sein/.test(location.pathname)) {
    var b = document.createElement('a'); b.className = 'vie-bandeau'; b.href = '/octobre-rose';
    function texte(long, court){ return '<span class="vie-long">' + long + '</span><span class="vie-court">' + court + '</span> <span class="vie-fleche">→</span>'; }
    b.innerHTML = texte('🎀 Octobre rose : bilan des seins + échographie, <b>10 000 F CFA</b>, du 15 au 30 octobre. Réserver', '🎀 Octobre rose · <b>10 000 F</b> · Réserver');
    header.insertBefore(b, header.firstChild);
    fetch('/api/octobre-rose/places', {cache:'no-store'}).then(function(r){ return r.ok ? r.json() : null; }).then(function(d){
      if (!d) return;
      var reste = d.jours.reduce(function(s, j){ return s + (j.passe ? 0 : j.restantes); }, 0);
      b.innerHTML = reste > 0
        ? texte('🎀 Octobre rose : bilan des seins + échographie, <b>10 000 F CFA</b>. Plus que <b>' + reste + ' places</b> du 15 au 30 octobre. Réserver', '🎀 Octobre rose · <b>10 000 F</b> · plus que <b>' + reste + ' places</b>')
        : texte('🎀 Octobre rose : toutes les places sont prises. Écrivez-nous pour la liste d\'attente', '🎀 Octobre rose : complet, liste d\'attente');
      placerMenu();
    }).catch(function(){});
  }

  // Barre d'actions fixe sur téléphone (pas sur les pages campagne, qui ont leurs propres boutons)
  if (!/octobre-rose|test-sein/.test(location.pathname)) {
    var barreBas = document.createElement('div'); barreBas.setAttribute('role', 'navigation'); barreBas.className = 'vie-barre'; barreBas.setAttribute('aria-label', 'Actions rapides');
    barreBas.innerHTML = '<a href="tel:+22890038313"><span>📞</span>Appeler</a>'
      + '<a href="https://wa.me/22890038313?text=' + encodeURIComponent('Bonjour CMS HOSANNA, ') + '" target="_blank" rel="noopener"><span><svg class="ico-wa" viewBox="0 0 24 24" width="20" height="20" fill="#25D366" aria-hidden="true" style="flex:none; vertical-align:-0.25em;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.017 22h-.005c-1.94 0-3.844-.522-5.512-1.51l-.395-.234-4.099 1.075 1.094-3.996-.257-.41A9.923 9.923 0 0 1 2.02 12C2.017 6.478 6.494 2 12.019 2c2.65 0 5.14 1.033 7.011 2.906A9.86 9.86 0 0 1 22 12.024c-.003 5.522-4.48 10-9.983 10zm8.413-18.413A11.815 11.815 0 0 0 12.02 0C5.463 0 .132 5.33.135 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.86 11.86 0 0 0 5.71 1.455h.005c6.557 0 11.89-5.331 11.893-11.893a11.82 11.82 0 0 0-3.482-8.421z"/></svg></span>WhatsApp</a>'
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
