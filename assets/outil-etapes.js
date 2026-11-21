/* Questionnaire par étapes des outils santé CMS HOSANNA (règles, infertilité).
   Rien n'est enregistré ni envoyé : ce script ne fait qu'afficher une étape à la fois.
   OutilEtapes(form, {
     actif(etape) -> bool : l'étape s'applique-t-elle aux réponses actuelles ?
     valider() -> null | {id, msg} : première erreur de saisie
     erreur({id, msg}), effacer() : affichage des erreurs
     fin() : calcul et affichage du résultat
   }) */
window.OutilEtapes = function (form, o) {
  var etapes = Array.prototype.slice.call(form.querySelectorAll('.etape'));
  var texte = form.querySelector('.progression-texte'), barre = form.querySelector('.barre span');
  var prec = form.querySelector('.e-prec'), suiv = form.querySelector('.e-suiv'), fin = form.querySelector('.e-fin');
  var i = 0;
  function actives() { return etapes.filter(function (e) { return o.actif(e); }); }
  function indexDe(id) { var el = document.getElementById(id), a = actives(); for (var k = 0; k < a.length; k++) if (a[k].contains(el)) return k; return -1; }
  function montrer(n, focus) {
    var a = actives(); i = Math.max(0, Math.min(n, a.length - 1));
    etapes.forEach(function (e) { e.hidden = e !== a[i]; });
    texte.textContent = 'Étape ' + (i + 1) + ' sur ' + a.length + ' · ' + a[i].getAttribute('data-titre');
    barre.style.width = Math.round((i + 1) / a.length * 100) + '%';
    prec.hidden = i === 0; suiv.hidden = i === a.length - 1; fin.hidden = !suiv.hidden;
    if (focus) { var h = a[i].querySelector('.titre-etape'); if (h) h.focus(); }
  }
  // Bloque le passage à l'étape suivante si une erreur concerne l'étape actuelle ou une étape déjà vue.
  function bloquant() { var e = o.valider(); if (!e) return null; var k = indexDe(e.id); return (k !== -1 && k <= i) ? { e: e, k: k } : null; }
  suiv.addEventListener('click', function () {
    o.effacer(); var b = bloquant();
    if (b) { montrer(b.k); o.erreur(b.e); return; }
    montrer(i + 1, true);
  });
  prec.addEventListener('click', function () { o.effacer(); montrer(i - 1, true); });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (i < actives().length - 1) { suiv.click(); return; } // touche Entrée avant la dernière étape
    o.effacer(); var e = o.valider();
    if (e) { var k = indexDe(e.id); if (k !== -1) montrer(k); o.erreur(e); return; }
    o.fin();
  });
  montrer(0);
  return { montrer: montrer, rafraichir: function () { montrer(i); } };
};
