# Outil « Période de fécondité et ovulation » : fiche à valider

**Statut (25/11) :** relu et validé par l'Orchestrateur, sur délégation de Gilbert DOGBAN. Mention « en attente » retirée. Reste en `noindex`, comme les autres outils, jusqu'à la relecture finale de Gilbert.

**Statut : en attente de validation médicale par Gilbert DOGBAN.** Page `fecondite.html` (adresse `/fecondite`), `noindex`, mention « Version en attente de validation médicale ». Présente sur la branche `feature/site-vivant` uniquement (pas dans `main`).
Mention affichée : « Information générale. Ne remplace pas une consultation. » et « Ce n'est pas une méthode de contraception fiable. »
Vos réponses ne quittent pas le téléphone ; seul le compteur anonyme `fecondite_calcul` est envoyé.

## Décisions de Gilbert (22/11/2026)

1. **Appel neutre** : « Pour un avis adapté à votre situation, faites-vous consulter par un professionnel de santé. Si vous le souhaitez, l'équipe du CMS HOSANNA peut aussi vous répondre. » Bouton « Demander un avis (WhatsApp) », message « j'ai une question sur ma période de fécondité » (plus de « prendre rendez-vous »).
2. **Cycles irréguliers** : plus aucun calcul ni date. Message : « Avec des cycles irréguliers, il est très difficile de calculer la période fertile […] L'outil ne donne donc pas de dates, pour ne pas vous induire en erreur. Des cycles irréguliers peuvent avoir une cause qui se soigne. Demandez l'avis d'un professionnel de santé. » La règle d'Ogino est retirée.
3. **Lendemain de l'ovulation inclus** : fenêtre J−5 à J+1 (l'ovule survit 12 à 24 h ; Wilcox 1995 retient J−5 à J0, le J+1 est ajouté par prudence).
4. **Éviter une grossesse** : choix « Votre objectif ». Fiche de conseil SANS aucune date (pas de « jours sans risque ») : le calcul ne protège pas de façon fiable ; méthodes efficaces à choisir avec un professionnel (préservatif, pilule, injection, implant, DIU) ; contraception d'urgence au plus tôt après un rapport non protégé.

## 1. Saisies

- Premier jour des dernières règles (pas de date future ; moins de 4 mois, sinon : « Sans règles depuis plus longtemps, consultez un professionnel de santé »).
- Durée habituelle du cycle : 21 à 45 jours (28 par défaut).
- Objectif : « Avoir un enfant » (par défaut) ou « Éviter une grossesse ».
- Case « Mes cycles sont irréguliers (plus de 7 jours d'écart d'un mois à l'autre) » : affiche seulement le conseil de consulter.

## 2. Formules

| Élément | Calcul | Source |
|---|---|---|
| Ovulation | jour (durée du cycle − 14) du cycle ; 28 jours → 14e jour | Phase lutéale d'environ 14 jours (physiologie du cycle) |
| Fenêtre fertile | J−5 à J+1 : les 6 jours qui se terminent le jour de l'ovulation, plus le lendemain par prudence | Wilcox AJ, Weinberg CR, Baird DD. *Timing of sexual intercourse in relation to ovulation.* N Engl J Med 1995;333:1517-21 ; survie de l'ovule 12 à 24 h |
| Jours les plus fertiles | les 2 jours avant l'ovulation et le jour de l'ovulation | Wilcox 1995 |
| Prochaines règles | dernières règles + durée du cycle | |
| Alerte retard | règles attendues dépassées de 7 jours ou plus : « faites un test de grossesse, ou consultez » | À valider |
| Cycles irréguliers | > 7 jours d'écart (repère FIGO : variation normale ≤ 7 à 9 jours) : aucun calcul, conseil de consulter | Décision de Gilbert |

## 3. Affichage

- Cartes : « Période fertile » (dates) et « Ovulation probable ».
- Message : jour d'ovulation dans le cycle, jours les plus fertiles, date des prochaines règles.
- Tableau des 3 prochains cycles : jours fertiles, ovulation, règles suivantes ; le cycle en cours est surligné avec « vous êtes en période fertile » si c'est le cas. Sur téléphone, chaque cycle est présenté en fiche.
- Conseil : glaire cervicale, tests d'ovulation, courbe de température ; sans grossesse après 12 mois (6 mois à partir de 35 ans) : lien vers le bilan de fertilité du couple (/infertilite).
- Bouton « Prendre rendez-vous (WhatsApp) » pour une consultation fertilité ; impression sur une page A4.

## 4. Exemples de contrôle (test automatique, calcul du 21/11/2026)

| Saisie | Résultat |
|---|---|
| Règles 10/11/2026, cycle 28 | Ovulation 23 nov., fenêtre 18 → 24 nov., plus fertiles 21 → 23 nov., règles 8 déc. ; « vous êtes en période fertile » |
| Règles 10/11/2026, cycle 32 | Ovulation 27 nov., fenêtre 22 → 28 nov. |
| Case « cycles irréguliers » cochée | Aucune date ; conseil de consulter |
| Objectif « éviter une grossesse » | Fiche contraception, aucune date |
| Règles 10/10/2026, cycle 28 | Alerte : 14 jours de retard, test de grossesse |

## 5. Questions pour Gilbert

Toutes tranchées le 22/11 (voir « Décisions »). Reste : validation finale du texte de la fiche contraception.

Après validation : retirer la mention « en attente », puis avancer `main` pour le déploiement (la page reste en `noindex` jusqu'à la relecture finale, comme les autres outils).

**Indexation (25/11) :** accord de Gilbert DOGBAN transmis par l'Orchestrateur. Page passée en `index, follow` et ajoutée au sitemap, pour la mise en ligne du 5/12.
