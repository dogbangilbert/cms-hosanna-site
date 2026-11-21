# Rapport : outils d'orientation gynécologique (21/11/2026)

Branche `feature/outils-gyneco` (dérivée de `feature/site-vivant`). Rien n'est fusionné dans `main`, rien n'est déployé. **Rien ne doit être mis en ligne sans la validation de Gilbert DOGBAN.**

## Ce qui est fait

| Élément | Fichier |
|---|---|
| Outil « Mes règles sont-elles normales ? » (`/regles`) | `regles.html` |
| Outil « Infertilité du couple : où en sommes-nous ? » (`/infertilite-test`), lien vers `/infertilite` | `infertilite-test.html` |
| Questionnaire par étapes, commun aux deux outils | `assets/outil-etapes.js` |
| Fiches de validation (saisies, règles, seuils, sources, textes mot à mot, exemples, questions) | `docs/contenus-a-valider/outil-regles.md`, `docs/contenus-a-valider/outil-infertilite.md` |
| Tests dans un navigateur | `tools/test-outils-gyneco.js` |

Les deux pages reprennent le gabarit de `date-accouchement.html` : bandeau « Version en attente de validation médicale », `noindex, nofollow`, hors menu et hors sitemap, cartes de résultat, tableau avec la ligne de la personne surlignée « ◀ vous », mention « Information générale. Ne remplace pas une consultation. », bouton « Prendre rendez-vous » vers WhatsApp avec message pré-rempli, impression ou PDF. Le calcul se fait dans le navigateur : aucune donnée n'est enregistrée ni envoyée.

Après la discussion avec Gilbert (idées issues de ChatGPT), ajouts :
- **Règles** : contraception (pilule, injection, implant, stérilet hormonal ou au cuivre), allaitement, âge des premières règles (repères 21 à 45 jours chez l'adolescente), début de la douleur, douleur hors règles, explication que le nombre de garnitures est un indice et non une mesure, niveaux vert / orange (1 mois ou 2 semaines) / rouge.
- **Infertilité** : SOPK, absence de règles, grossesse extra-utérine et varicocèle en cases séparées, rappel « les délais sont des repères », liste des examens possibles présentée comme non prescriptive.
- **Les deux** : questionnaire par étapes avec barre de progression, étapes retirées quand elles ne s'appliquent pas (3 étapes si les règles sont arrêtées, 2 si elles ne sont jamais venues), fiche pour la consultation (réponses, orientation, questions à poser au médecin, documents à apporter), bouton « Modifier mes réponses ».

## Vérifications

- `python3 tools/verifier-site.py` : 0 échec.
- `tools/test-outils-gyneco.js` : **107/107 contrôles réussis** :
  - 34 cas types (règles) et 13 (infertilité) ;
  - 9 + 5 saisies invalides ;
  - parcours par étapes : blocage, touche Entrée, « Précédent », étapes conditionnelles, « Modifier » ;
  - axe-core WCAG 2.1 AA sans violation, au formulaire et au résultat ;
  - 375 px : aucun élément ne dépasse de l'écran ;
  - aucune erreur JavaScript ;
  - aucune requête autre que GET.

  Pendant les tests, les hôtes extérieurs (polices Google, mesure d'audience Cloudflare) sont bloqués.
- Défauts trouvés et corrigés en cours de route :
  - le tableau des définitions débordait sur téléphone (première colonne non coupée) ; le contrôle de largeur a été durci, car `body` masquait le débordement ;
  - une apostrophe non échappée bloquait le script de la page des règles ; les tests l'ont détectée.

## Sources principales

- **Troubles des règles :**
  - FIGO 2018 (Munro et al.) : fréquence, durée, régularité, saignement entre les règles ;
  - ACOG n° 651 : adolescentes ;
  - Higham 1990, CNGOF 2008 et 2022, NICE NG88 : abondance ;
  - ASRM 2024 : aménorrhée ;
  - OMS : ménopause, MAMA ;
  - FSRH 2015 : saignements sous contraception ;
  - SOGC 2017, ACOG n° 760, ESHRE 2022 : dysménorrhée et endométriose.
- **Infertilité :**
  - OMS : CIM-11, aide-mémoire 2025, ligne directrice 2025, manuel d'analyse du sperme 2021 ;
  - ASRM 2021 et 2026, ACOG/ASRM n° 781 ;
  - NICE CG156.

Les références exactes, avec liens, sont dans les fiches. Les références marquées « à vérifier » ont été citées de mémoire, sans ouvrir la source pendant ce travail.## Décisions de Gilbert intégrées (21/11/2026)

- Règles abondantes dès **4 garnitures par jour** ; pièce de 100 F CFA gardée ; délais gardés.
- Adolescentes : règles prolongées au-delà de **7 jours** (repère francophone).
- Saignements sous contraception hormonale : vert avec conditions (accord de Gilbert compris ainsi, à confirmer).
- Infertilité : « bilan sans attendre » nuancé (antécédents importants : sans attendre ; fibrome, infection génitale chez l'homme, varicocèle : 6 mois ; fausses couches à répétition : message à part).
- Examens au CMS HOSANNA : bilan hormonal, échographies pelvienne et testiculaire sur place ; spermogramme dans un laboratoire partenaire.
- Mesure d'audience Cloudflare retirée des deux pages.

## Reste à faire avant la mise en ligne

1. Relecture finale des deux pages par Gilbert (sur téléphone).
2. Points encore ouverts : terminologie de la polyménorrhée (FIGO < 24 j ou ancienne définition française < 21 j), âges limites, version en langue locale.
3. Vérifier les références marquées « à vérifier » dans les fiches.
4. Après accord : retirer le bandeau, passer en `index, follow`, ajouter au sitemap, au menu « Outils » et sur `/infertilite`.
