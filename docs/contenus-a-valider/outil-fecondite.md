# Outil « Période de fécondité et ovulation » : fiche à valider

**Statut : en attente de validation médicale par Gilbert DOGBAN.** Page `fecondite.html` (adresse `/fecondite`), `noindex`, mention « Version en attente de validation médicale ». Présente sur la branche `feature/site-vivant` uniquement (pas dans `main`).
Mention affichée : « Information générale. Ne remplace pas une consultation. » et « Ce n'est pas une méthode de contraception fiable. »
Vos réponses ne quittent pas le téléphone ; seul le compteur anonyme `fecondite_calcul` est envoyé.

## 1. Saisies

- Premier jour des dernières règles (pas de date future ; moins de 4 mois, sinon : « Sans règles depuis plus longtemps, consultez un professionnel de santé »).
- Durée habituelle du cycle : 21 à 45 jours (28 par défaut).
- Facultatif, « Mes cycles sont irréguliers » : cycle le plus court et le plus long des 6 à 12 derniers mois.

## 2. Formules

| Élément | Calcul | Source |
|---|---|---|
| Ovulation | jour (durée du cycle − 14) du cycle ; 28 jours → 14e jour | Phase lutéale d'environ 14 jours (physiologie du cycle) |
| Fenêtre fertile (cycles réguliers) | les 6 jours qui se terminent le jour de l'ovulation (J−5 à J0) | Wilcox AJ, Weinberg CR, Baird DD. *Timing of sexual intercourse in relation to ovulation.* N Engl J Med 1995;333:1517-21 |
| Jours les plus fertiles | les 2 jours avant l'ovulation et le jour de l'ovulation | Wilcox 1995 |
| Fenêtre fertile (cycles irréguliers) | du jour (plus court − 18) au jour (plus long − 11) | Règle du calendrier d'Ogino-Knaus |
| Prochaines règles | dernières règles + durée du cycle | |
| Alerte retard | règles attendues dépassées de 7 jours ou plus : « faites un test de grossesse, ou consultez » | À valider |
| Alerte irrégularité | écart entre cycle le plus court et le plus long > 7 jours : « le calcul est moins fiable » | Repère FIGO (variation normale ≤ 7 à 9 jours) |

## 3. Affichage

- Cartes : « Période fertile » (dates) et « Ovulation probable ».
- Message : jour d'ovulation dans le cycle, jours les plus fertiles, date des prochaines règles.
- Tableau des 3 prochains cycles : jours fertiles, ovulation, règles suivantes ; le cycle en cours est surligné avec « vous êtes en période fertile » si c'est le cas. Sur téléphone, chaque cycle est présenté en fiche.
- Conseil : glaire cervicale, tests d'ovulation, courbe de température ; sans grossesse après 12 mois (6 mois à partir de 35 ans) : lien vers le bilan de fertilité du couple (/infertilite).
- Bouton « Prendre rendez-vous (WhatsApp) » pour une consultation fertilité ; impression sur une page A4.

## 4. Exemples de contrôle (test automatique, calcul du 21/11/2026)

| Saisie | Résultat |
|---|---|
| Règles 10/11/2026, cycle 28 | Ovulation 23 nov., fenêtre 18 → 23 nov., plus fertiles 21 → 23 nov., règles 8 déc. ; « vous êtes en période fertile » |
| Règles 10/11/2026, cycle 32 | Ovulation 27 nov., fenêtre 22 → 27 nov. |
| Cycles de 26 à 32 jours | Fenêtre du 8e au 21e jour : 17 → 30 nov. |
| Règles 10/10/2026, cycle 28 | Alerte : 14 jours de retard, test de grossesse |

## 5. Questions pour Gilbert

1. Fenêtre de 6 jours (J−5 à J0, Wilcox) ou ajouter le lendemain de l'ovulation (J+1), comme certains calculateurs ?
2. Règle d'Ogino pour les cycles irréguliers : à garder, ou remplacer par un simple avertissement ?
3. Seuil d'alerte du retard de règles : 7 jours vous convient-il ?
4. Faut-il un texte différent pour les couples qui veulent éviter une grossesse (orientation vers la planification familiale) ?

Après validation : retirer la mention « en attente », puis avancer `main` pour le déploiement (la page reste en `noindex` jusqu'à la relecture finale, comme les autres outils).
