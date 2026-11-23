// CMS HOSANNA — compteur d'utilisation anonyme.
// Envoie seulement un nom d'événement et la page (ex. « imc_calcul », « /imc ») : aucune valeur saisie,
// aucun cookie, aucun identifiant. L'envoi ne bloque jamais la page, même s'il échoue.
(function () {
  function compte(evenement) {
    try {
      var d = JSON.stringify({ e: evenement, p: location.pathname });
      if (navigator.sendBeacon) navigator.sendBeacon('/api/compteur', new Blob([d], { type: 'text/plain' }));
      else fetch('/api/compteur', { method: 'POST', body: d, keepalive: true }).catch(function () {});
    } catch (e) { /* jamais bloquant */ }
  }
  window.hosannaCompte = compte;

  // Origine de la demande, pour le message WhatsApp pré-rempli
  function origine() {
    var p = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    var noms = { '/': 'la page d\'accueil', '/imc': 'l\'outil IMC', '/date-accouchement': 'l\'outil grossesse', '/fecondite': 'l\'outil période de fécondité', '/prostate': 'l\'outil prostate',
      '/test-sein': 'le test du cancer du sein', '/outils': 'la page Outils santé',
      '/regles': 'l\'outil « Mes règles sont-elles normales ? »', '/infertilite-test': 'l\'outil infertilité du couple', '/contact': 'la page Contact' };
    if (noms[p]) return noms[p];
    var h1 = document.querySelector('h1'), titre = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : document.title;
    return (/^\/(conseils|blog)\//.test(p) ? 'l\'article « ' : 'la page « ') + titre + ' »';
  }

  // Clic sur un lien WhatsApp du centre : compté, et le message dit d'où vient la demande
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('a[href*="wa.me/22890038313"]');
    if (!a) return;
    compte('rdv_whatsapp_clic');
    try {
      var t = new URL(a.href).searchParams.get('text') || '';
      if (t.indexOf('je viens de ') === -1) {
        t = t.replace(/^Bonjour\s+CMS\s+HOSANNA\s*,?\s*/i, '').trim();
        if (t) t = ' ' + t.charAt(0).toUpperCase() + t.slice(1);
        a.href = 'https://wa.me/22890038313?text=' + encodeURIComponent('Bonjour CMS HOSANNA, je viens de ' + origine() + ' du site HOSANNA.' + t);
      }
    } catch (e) { /* lien laissé tel quel */ }
  }, true);
})();
