// CMS HOSANNA — bandeau de consentement aux cookies et mesure d'audience conditionnée.
// Autonome : chargé sur toutes les pages publiques, y compris les campagnes.
// Le site n'utilise aucun cookie publicitaire. La mesure d'audience (Cloudflare Web Analytics)
// n'est chargée qu'après un « Accepter ». Le choix est mémorisé dans le navigateur.
(function () {
  var CLE = 'hosanna-consentement';

  function lire() { try { return localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (e) { /* stockage bloqué : le bandeau reviendra */ } }

  var mesureActive = false;
  function activerMesure() {
    if (mesureActive) return;
    mesureActive = true;
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', '{"token": "49ef6eb473ba42779b00cfac15d8ef0d"}');
    document.head.appendChild(s);
  }

  var css = '' +
    '.hz-cookies{position:fixed;left:0;right:0;bottom:0;z-index:2000;background:#fff;color:#1d2433;' +
    'border-top:3px solid #003399;box-shadow:0 -8px 24px rgba(0,0,0,.15);padding:16px 20px;display:flex;' +
    'flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;font:15px/1.5 "Open Sans",system-ui,sans-serif}' +
    '.hz-cookies p{margin:0;max-width:760px}' +
    '.hz-cookies a{color:#003399;font-weight:600}' +
    '.hz-cookies-btns{display:flex;gap:10px;flex-wrap:wrap}' +
    '.hz-cookies button{font:700 15px "Poppins",system-ui,sans-serif;border-radius:999px;padding:10px 20px;min-height:44px;cursor:pointer;border:2px solid #003399}' +
    '.hz-cookies .hz-accord{background:#003399;color:#fff}' +
    '.hz-cookies .hz-refus{background:#fff;color:#003399}' +
    '.hz-cookies button:focus-visible,.hz-cookies a:focus-visible{outline:3px solid #F9A825;outline-offset:2px}' +
    '@media (max-width:760px){body.vie-avec-barre .hz-cookies{bottom:70px}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var banniere = null;
  function fermer() { if (banniere) { banniere.remove(); banniere = null; } }

  function afficher() {
    if (banniere) return;
    banniere = document.createElement('div');
    banniere.className = 'hz-cookies';
    banniere.setAttribute('role', 'region');
    banniere.setAttribute('aria-label', 'Gestion des cookies');
    banniere.innerHTML =
      '<p>Ce site n\'utilise <b>aucun cookie publicitaire</b>. Avec votre accord, nous mesurons anonymement le nombre de visites. ' +
      '<a href="/confidentialite">En savoir plus</a></p>' +
      '<div class="hz-cookies-btns"><button type="button" class="hz-refus">Refuser</button>' +
      '<button type="button" class="hz-accord">Accepter</button></div>';
    document.body.appendChild(banniere);
    banniere.querySelector('.hz-accord').addEventListener('click', function () {
      ecrire('oui'); fermer(); activerMesure();
    });
    banniere.querySelector('.hz-refus').addEventListener('click', function () {
      var deja = mesureActive;
      ecrire('non'); fermer();
      // Le script de mesure ne peut pas être retiré à chaud : on recharge pour l'arrêter
      if (deja) location.reload();
    });
  }

  var choix = lire();
  if (choix === 'oui') activerMesure();
  else if (choix !== 'non') afficher();

  document.addEventListener('click', function (e) {
    var lien = e.target.closest && e.target.closest('[data-cookies]');
    if (!lien) return;
    e.preventDefault();
    afficher();
  });
})();
