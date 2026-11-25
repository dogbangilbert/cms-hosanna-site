/* « Pour aller plus loin » : relie les articles et les outils santé d'un même domaine.
   - Sur un article (blog ou /conseils/), le bloc s'affiche avant le pied de page.
   - Sur un outil, il s'affiche dans le résultat, une fois le calcul fait.
   Les articles publiés depuis la Rédaction (/api/conseils) sont ajoutés automatiquement
   selon leurs mots-clés : aucun réglage à faire quand un nouvel article paraît.
   Pour ajouter un domaine ou un article fixe : compléter THEMES ci-dessous. */
(function () {
  'use strict';
  var THEMES = {
    prostate: {
      mots: ['prostate', 'urin', 'novembre bleu', 'psa'],
      articles: [['/blog/prevenir-problemes-prostate', 'Rétention urinaire : les bons réflexes pour protéger sa prostate']],
      outils: [['/prostate', 'Prostate : évaluez vos symptômes urinaires']]
    },
    sein: {
      mots: ['sein', 'mammaire', 'octobre rose', 'mammographie'],
      articles: [],
      outils: [['/test-sein', 'Test : votre risque de cancer du sein']]
    },
    grossesse: {
      mots: ['grossesse', 'enceinte', 'accouch', 'prénata', 'prenata', 'cordon', 'fausse couche', 'bébé', 'échographie'],
      articles: [['/blog/cours-prenataux', 'Cours prénataux : préparer sereinement l\'accouchement'],
                 ['/blog/circulaire-cordon-ombilical', 'Le circulaire du cordon ombilical, expliqué simplement'],
                 ['/blog/fausse-couche-mots-a-eviter', '3 choses à ne pas dire à une femme qui a eu une fausse couche']],
      outils: [['/date-accouchement', 'Calculer la date d\'accouchement']]
    },
    fertilite: {
      mots: ['fertil', 'infertil', 'ovulation', 'concevoir', 'avoir un enfant', 'tarde à venir', 'endométriose'],
      articles: [['/blog/quand-la-grossesse-tarde-a-venir', 'Quand la grossesse tarde à venir'],
                 ['/blog/fertilite-et-age', 'Fertilité et âge : pourquoi ne pas attendre'],
                 ['/blog/endometriose-diagnostic-tardif', 'Endométriose : la maladie qu\'on découvre trop tard']],
      outils: [['/infertilite-test', 'Infertilité du couple : où en sommes-nous ?'], ['/fecondite', 'Période de fécondité et ovulation']]
    },
    femme: {
      mots: ['règles', 'cycle', 'endométriose', 'ist', 'infection', 'vaginal', 'gynéco', 'contracept'],
      articles: [['/blog/endometriose-diagnostic-tardif', 'Endométriose : la maladie qu\'on découvre trop tard'],
                 ['/blog/ist-depistage-femme', 'IST chez la femme : symptômes, risques et dépistage précoce']],
      outils: [['/regles', 'Mes règles sont-elles normales ?']]
    },
    metabolisme: {
      mots: ['diabète', 'diabete', 'sucre', 'sel', 'tension', 'hypertension', 'poids', 'obésité', 'imc', 'alimentation', 'cholestérol'],
      articles: [['/blog/signes-diabete', 'Les premiers signes du diabète'],
                 ['/blog/sucre-sale-poisons-lents', 'Sucré, salé : nos deux poisons lents']],
      outils: [['/imc', 'IMC et poids normal']]
    },
    plantes: {
      mots: ['curcuma', 'spiruline', 'plante', 'phyto', 'tisane', 'naturel'],
      articles: [['/blog/curcuma-epice-qui-soigne', 'Curcuma : une épice qui soigne'],
                 ['/conseils/spiruline-bienfaits', 'Spiruline : bienfaits et précautions']],
      outils: [['/imc', 'IMC et poids normal']]
    }
  };
  // Pages dont le domaine est connu d'avance (les autres sont classées par leurs mots-clés)
  var PAGES = {
    '/prostate': 'prostate', '/blog/prevenir-problemes-prostate': 'prostate',
    '/test-sein': 'sein',
    '/date-accouchement': 'grossesse', '/blog/cours-prenataux': 'grossesse', '/blog/circulaire-cordon-ombilical': 'grossesse', '/blog/fausse-couche-mots-a-eviter': 'grossesse',
    '/fecondite': 'fertilite', '/infertilite-test': 'fertilite', '/blog/quand-la-grossesse-tarde-a-venir': 'fertilite', '/blog/fertilite-et-age': 'fertilite',
    '/regles': 'femme', '/blog/endometriose-diagnostic-tardif': 'femme', '/blog/ist-depistage-femme': 'femme',
    '/imc': 'metabolisme', '/blog/signes-diabete': 'metabolisme', '/blog/sucre-sale-poisons-lents': 'metabolisme',
    '/blog/curcuma-epice-qui-soigne': 'plantes', '/conseils/spiruline-bienfaits': 'plantes'
  };
  // Domaine voisin, utilisé quand un domaine a moins de 2 articles (ex. : diabète et troubles urinaires)
  var VOISINS = { prostate: 'metabolisme', sein: 'femme', grossesse: 'fertilite', fertilite: 'femme', femme: 'fertilite', metabolisme: 'plantes', plantes: 'metabolisme' };
  var OUTILS = { '/prostate': 1, '/test-sein': 1, '/date-accouchement': 1, '/fecondite': 1, '/infertilite-test': 1, '/regles': 1, '/imc': 1 };

  var ici = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  var estArticle = /^\/(blog|conseils)\//.test(ici), estOutil = !!OUTILS[ici];
  if (!estArticle && !estOutil) return;

  function minus(t) { return String(t || '').toLowerCase(); }
  function themeDe(texte) {
    var t = minus(texte), meilleur = null, max = 0;
    Object.keys(THEMES).forEach(function (k) {
      var n = THEMES[k].mots.filter(function (m) {
        return m.length <= 4 ? new RegExp('(^|[^a-zà-ÿ])' + m + '([^a-zà-ÿ]|$)').test(t) : t.indexOf(m) > -1;
      }).length;
      if (n > max) { max = n; meilleur = k; }
    });
    return meilleur;
  }
  var h1 = document.querySelector('h1');
  var theme = PAGES[ici] || themeDe((h1 ? h1.textContent : '') + ' ' + document.title);
  if (!theme) return;

  function construire(articles) {
    var T = THEMES[theme], vus = {}, liste = [];
    vus[ici] = 1;
    var ajouter = function (a) { if (!vus[a[0]] && liste.length < 3) { vus[a[0]] = 1; liste.push(a); } };
    articles.concat(T.articles).forEach(ajouter);
    if (liste.length < 2 && VOISINS[theme]) THEMES[VOISINS[theme]].articles.slice(0, 2 - liste.length).forEach(ajouter);
    var outils = T.outils.filter(function (o) { return !vus[o[0]]; });
    if (!liste.length && !outils.length) return;

    var bloc = document.createElement('aside');
    bloc.className = 'lire-aussi';
    bloc.setAttribute('aria-labelledby', 'lire-aussi-titre');
    var h = document.createElement('h2'); h.id = 'lire-aussi-titre'; h.textContent = 'Pour aller plus loin'; bloc.appendChild(h);
    function groupe(titre, items, ico) {
      if (!items.length) return;
      var p = document.createElement('p'); p.className = 'la-groupe'; p.textContent = titre; bloc.appendChild(p);
      var ul = document.createElement('ul');
      items.forEach(function (it) {
        var li = document.createElement('li'), a = document.createElement('a');
        a.href = it[0]; a.textContent = ico + ' ' + it[1];
        a.addEventListener('click', function () { if (window.hosannaCompte) window.hosannaCompte('lien_lire_aussi'); });
        li.appendChild(a); ul.appendChild(li);
      });
      bloc.appendChild(ul);
    }
    groupe('À lire aussi', liste, '📖');
    groupe(estOutil ? 'Autre outil utile' : 'Faites le point avec notre outil gratuit', outils, '🧮');

    var st = document.createElement('style');
    st.textContent = '.lire-aussi{max-width:760px;margin:28px auto;padding:20px 22px;background:#F5F8FD;border:1px solid #D6E2F5;border-left:5px solid #003399;border-radius:14px}' +
      '.lire-aussi h2{font-size:1.2rem;margin:0 0 6px;color:#003399}.lire-aussi .la-groupe{font-weight:700;color:#3A4250;margin:12px 0 4px;font-size:.92rem}' +
      '.lire-aussi ul{list-style:none;margin:0;padding:0}.lire-aussi li{margin:0}.lire-aussi a{display:block;padding:10px 0;min-height:44px;color:#002a80;font-weight:600;text-decoration:underline;text-underline-offset:3px;border-bottom:1px solid #E2EAF5}' +
      '.lire-aussi li:last-child a{border-bottom:0}.resultat .lire-aussi{margin:18px 0 0;background:#fff}@media print{.lire-aussi{display:none!important}}' +
      '@media (max-width:560px){.lire-aussi{margin:20px 16px}.resultat .lire-aussi{margin:16px 0 0}}';
    document.head.appendChild(st);

    var res = estOutil && document.querySelector('.resultat');
    if (res) { res.appendChild(bloc); return; }
    var pied = document.querySelector('footer');
    if (pied) pied.parentNode.insertBefore(bloc, pied); else document.body.appendChild(bloc);
  }

  // Articles publiés depuis la Rédaction, classés dans le même domaine (titre + catégorie)
  var fini = false;
  function sans(liste) { if (!fini) { fini = true; construire(liste || []); } }
  setTimeout(function () { sans([]); }, 2500);
  if (window.fetch) {
    fetch('/api/conseils').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (cartes) {
      sans((Array.isArray(cartes) ? cartes : []).filter(function (c) {
        return c && c.slug && themeDe(c.title + ' ' + c.category + ' ' + c.excerpt) === theme;
      }).map(function (c) { return ['/conseils/' + c.slug, c.title]; }));
    }).catch(function () { sans([]); });
  } else sans([]);
})();
