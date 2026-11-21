# Outil « Infertilité du couple : où en sommes-nous ? » : fiche à valider

**Statut : en attente de validation médicale par Gilbert DOGBAN.** Page `infertilite-test.html` (adresse `/infertilite-test`), `noindex, nofollow`, hors menu et hors sitemap, bandeau « Version en attente de validation médicale. Ne pas diffuser. » La page renvoie vers `/infertilite` (dans le texte et par un bouton).
Outil d'**orientation**, pas de diagnostic. Tout le calcul se fait dans le navigateur : aucune donnée n'est enregistrée ni envoyée. Le message WhatsApp pré-rempli n'est envoyé que si le couple appuie sur « Prendre rendez-vous ».

## 1. Parcours et saisies (4 étapes, barre de progression)

| Étape | Question | Valeurs acceptées |
|---|---|---|
| 1 Le couple | Âge de la femme | 15 à 55 ans |
| | Âge de l'homme | 15 à 90 ans |
| | Mois de rapports sans contraception | 0 à 360 |
| | Fréquence des rapports | 2-3 fois par semaine ou plus / environ 1 fois / moins d'une fois / irrégulière (voyages, couple séparé) |
| 2 Grossesses et enfants | La femme a-t-elle déjà été enceinte (même fausse couche ou GEU) ? | non / oui |
| | L'homme a-t-il déjà eu un enfant ou une grossesse avec une partenaire ? | non / oui / je ne sais pas |
| 3 La femme | Cases : règles irrégulières ou très espacées (> 38 j) ; absence de règles depuis plusieurs mois ; SOPK connu ou suspecté ; règles très douloureuses, douleurs aux rapports ou endométriose ; infection génitale ou du bas-ventre (salpingite, IST) ; grossesse extra-utérine ; opération du ventre ou du bassin (trompes, ovaires, césarienne, appendicite compliquée) ; curetage ou avortement compliqué ; fibrome ; 2 fausses couches ou plus ; traitement d'un cancer | |
| 4 L'homme | Cases : oreillons après la puberté avec gonflement des testicules ; infection génitale (écoulement, brûlures, IST) ; testicule non descendu ou opéré ; varicocèle ou hernie opérée ; troubles de l'érection ou de l'éjaculation ; traitement d'un cancer | |

Saisies refusées (message, curseur sur le champ, étape suivante bloquée) : âges ou nombre de mois manquants ou hors limites.

## 2. Règles de décision

| Situation | Repère du bilan | Affichage |
|---|---|---|
| Femme < 35 ans, aucun antécédent | 12 mois | « dès 12 mois » |
| Femme de 35 à 39 ans, aucun antécédent | 6 mois | « dès 6 mois » |
| Femme ≥ 40 ans | sans attendre | « sans attendre » |
| Au moins une case cochée (femme ou homme) | sans attendre | « sans attendre » |

| Durée des essais | Niveau |
|---|---|
| ≥ 12 mois | « Orange · infertilité selon l'OMS : bilan dans les prochaines semaines », infertilité primaire (jamais enceinte) ou secondaire (déjà enceinte) |
| ≥ repère mais < 12 mois | « Orange · bilan conseillé dans les prochaines semaines » |
| < repère | « Vert · délai habituel, continuez », avec le nombre de mois restant avant le repère et le rappel qu'on peut consulter plus tôt |

Tableau des étapes (ligne surlignée « ◀ vous » selon la durée) : moins de 6 mois / 6 à 11 mois / 12 mois ou plus.
Remarques ajoutées selon les réponses : rapports rares ou irréguliers ; femme de 35 à 39 ans ; homme ≥ 45 ans ; homme ayant déjà eu un enfant (le spermogramme reste utile) ; 0 mois (retour de la fertilité après une contraception, surtout l'injection).
Pas de niveau rouge : l'infertilité n'est pas une urgence. Les urgences gynécologiques sont traitées par l'outil `/regles`.

## 3. Seuils et sources

| Élément | Règle | Source |
|---|---|---|
| Définition | absence de grossesse après 12 mois ou plus de rapports réguliers non protégés ; maladie de l'appareil reproducteur masculin ou féminin | OMS, CIM-11 ; fiche OMS « Infertilité » [1] ; page OMS *Multiple definitions of infertility* [2] |
| Primaire ou secondaire | primaire : aucune grossesse auparavant ; secondaire : au moins une grossesse auparavant | Glossaire international de l'infertilité (ICMART/OMS) [3] |
| Bilan à 6 mois dès 35 ans | évaluation à 12 mois avant 35 ans, à 6 mois à partir de 35 ans | ASRM 2021, reconduit en 2026 [4] ; ACOG/ASRM n° 781 [5] |
| ≥ 40 ans | évaluation et traitement plus immédiats | ASRM 2021/2026 [4] |
| Antécédent connu | évaluation sans attendre | ACOG/ASRM n° 781 [5] ; NICE CG156 [6] |
| « Plus de 8 couples sur 10 en un an » | environ 84 % des couples conçoivent en 1 an avec des rapports réguliers (femme < 40 ans) | NICE CG156 [6] |
| Rapports tous les 2 à 3 jours | conseil d'optimisation | NICE CG156 [6] |
| « 1 personne sur 6 » | prévalence de l'infertilité au cours de la vie | OMS [1] |
| Spermogramme après 2 à 7 jours d'abstinence | conditions de recueil | OMS, manuel d'analyse du sperme, 6e éd., 2021 [7] |
| Bilan des deux partenaires | évaluation simultanée de la femme et de l'homme | OMS, ligne directrice 2025 [8] ; ASRM [4] |
| « Environ la moitié des couples : cause masculine qui participe » | ordre de grandeur classique | à confirmer (voir questions) |

## 4. Sources

1. OMS. *Infertilité*, aide-mémoire (version du 28 novembre 2025). https://www.who.int/news-room/fact-sheets/detail/infertility
2. OMS. *Multiple definitions of infertility*. https://www.who.int/teams/sexual-and-reproductive-health-and-research-(srh)/areas-of-work/fertility-care/multiple-definitions-of-infertility
3. Zegers-Hochschild F et al. *The International Glossary on Infertility and Fertility Care, 2017.* Hum Reprod 2017;32:1786-1801 (*référence citée de mémoire, à vérifier*).
4. ASRM Practice Committee. *Fertility evaluation of infertile women: a committee opinion*, 2021, https://www.asrm.org/practice-guidance/practice-committee-documents/fertility-evaluation-of-infertile-women-a-committee-opinion-2021/ ; version 2026 : https://www.asrm.org/practice-guidance/practice-committee-documents/fertility-evaluation-of-infertile-women-a-committee-opinion-2026/
5. ACOG/ASRM. Committee Opinion n° 781, *Infertility Workup for the Women's Health Specialist*, 2019 (*année à vérifier*).
6. NICE. *Fertility problems: assessment and treatment* (CG156), 2013, mise à jour 2017. https://www.nice.org.uk/guidance/cg156 (*chiffres cités de mémoire, à vérifier*)
7. OMS. *WHO laboratory manual for the examination and processing of human semen*, 6e édition, 2021.
8. OMS. *Guideline for the prevention, diagnosis and treatment of infertility*, 28 novembre 2025. https://www.who.int/publications/i/item/B09599 ; communiqué : https://www.who.int/news/item/28-11-2025-who-issues-first-global-guideline-on-infertility

Note : la définition OMS (CIM-11) est **uniquement** celle des 12 mois. Le délai de 6 mois à partir de 35 ans vient des sociétés savantes (ASRM, ACOG), pas de la CIM-11 : la page le présente ainsi.

## 5. Textes affichés (mot à mot)

**Cartes** : « Durée des essais [X mois / X an(s) et X mois] de rapports sans contraception » ; « Bilan conseillé [dès 12 mois / dès 6 mois / sans attendre] » avec la raison (femme de moins de 35 ans, de 35 à 39 ans, de 40 ans ou plus, ou un facteur de risque est connu).

**≥ 12 mois** :
- « Après [durée] de rapports sans contraception sans grossesse, votre couple entre dans la définition de l'infertilité de l'OMS (12 mois ou plus). C'est une situation fréquente (environ 1 personne sur 6 dans le monde au cours de sa vie) et souvent traitable. Ce n'est pas un diagnostic : seul le bilan dira s'il existe une cause, et laquelle. »
- « Chez la femme, on parle d'infertilité primaire (aucune grossesse auparavant). » / « … secondaire (au moins une grossesse auparavant, même sans enfant né vivant). »

**Repère atteint avant 12 mois** : « Ce n'est pas encore une infertilité au sens de l'OMS (12 mois), mais un bilan est conseillé dès maintenant : [un antécédent qui peut gêner la fertilité est connu ([liste]). / à partir de 40 ans, la fertilité de la femme baisse vite et il ne faut pas perdre de temps. / à partir de 35 ans, le bilan est conseillé après 6 mois d'essais.] »

**Avant le repère** :
- « Ce n'est pas une infertilité : plus de 8 couples sur 10 obtiennent une grossesse en moins d'un an de rapports réguliers. Le repère pour un bilan est de [12 ou 6] mois [avant 35 ans / à partir de 35 ans] : encore [X] mois. C'est un repère, pas une obligation d'attendre : vous pouvez consulter plus tôt si vous êtes inquiets. »
- « Conseil : des rapports tous les 2 à 3 jours tout au long du cycle donnent les meilleures chances, sans avoir besoin de calculer l'ovulation. »

**Toujours** : « La fertilité concerne les deux partenaires. Dans environ la moitié des couples, une cause masculine participe à la difficulté : le bilan se fait donc chez la femme et chez l'homme, en même temps. »

**Selon les réponses** :
- « Avec des rapports moins d'une fois par semaine ou irréguliers, les chances à chaque cycle sont plus faibles et le repère de 12 mois s'applique mal : des rapports tous les 2 à 3 jours sont conseillés. Parlez-en au médecin. »
- « À partir de 35 ans, la fertilité de la femme diminue plus vite : c'est pourquoi le bilan est conseillé dès 6 mois. »
- « La fertilité de l'homme diminue aussi avec l'âge, plus lentement que celle de la femme. » (homme ≥ 45 ans)
- « Le fait que l'homme ait déjà eu un enfant ne dispense pas du spermogramme : la fertilité peut changer avec le temps. »
- « Si vous venez d'arrêter une contraception, le retour de la fertilité peut prendre quelques mois (surtout après l'injection) : ce délai compte dans les mois d'essai. » (0 mois)

**Tableau** : « Moins de 6 mois : Délai habituel : la plupart des couples conçoivent dans l'année. Bilan sans attendre si la femme a 40 ans ou plus, ou si un antécédent est connu. » ; « 6 à 11 mois : Femme de 35 ans ou plus : bilan des deux partenaires conseillé. Femme de moins de 35 ans : continuer, rapports tous les 2 à 3 jours. » ; « 12 mois ou plus : Infertilité selon la définition de l'OMS : bilan des deux partenaires, quel que soit l'âge. »

**« Ce que le bilan peut comprendre »** : « Le médecin choisit les examens selon votre situation : cette liste n'est pas une ordonnance. » ; « Pour les deux : consultation, antécédents, examen clinique, et souvent des analyses de sang (sérologies). » ; « Chez la femme : vérification de l'ovulation (cycles, prise de sang), échographie pelvienne, et selon le cas, examen des trompes (hystérosalpingographie). » ; « Chez l'homme : spermogramme et spermocytogramme (analyse du sperme, après 2 à 7 jours sans éjaculation). »

**Fiche pour la consultation** : tableau des réponses et de l'orientation ; questions toujours posées : « Quels examens pour chacun de nous, et dans quel ordre ? », « Où et comment faire le spermogramme ? », « Que pouvons-nous faire dès maintenant pour augmenter nos chances (poids, tabac, alcool, acide folique) ? » ; selon les cases : ovulation (cycles irréguliers, absence de règles, SOPK), trompes (infection, GEU, chirurgie, curetage), endométriose, fausses couches à répétition, réserve ovarienne (femme ≥ 38 ans). « À apporter » : dates des règles des 3 à 6 derniers mois, examens déjà faits par chacun, médicaments.

**Mention** : « **Information générale. Ne remplace pas une consultation.** Définition de l'OMS : l'infertilité est l'absence de grossesse après 12 mois ou plus de rapports sexuels réguliers sans contraception. Les délais indiqués sont des repères : vous pouvez consulter plus tôt si vous êtes inquiets. En savoir plus : notre consultation infertilité. »

**Message WhatsApp** : « Bonjour CMS HOSANNA, nous souhaitons prendre rendez-vous pour une consultation infertilité du couple. Nous essayons depuis [durée] (femme [X] ans, homme [X] ans). Antécédents connus : [liste]. »

## 6. Exemples de contrôle (vérifiés par test automatique)

| Saisie | Résultat attendu |
|---|---|
| Femme 28 ans, homme 30 ans, 5 mois | Vert, repère 12 mois, « encore 7 mois », ligne « Moins de 6 mois » |
| 28 ans, 11 mois | Vert, « encore 1 mois », ligne « 6 à 11 mois » |
| 28 ans, 12 mois | Orange, infertilité OMS primaire, « 1 an » |
| 30 ans, 26 mois, déjà enceinte | infertilité secondaire, « 2 ans et 2 mois » |
| 35 ans, 5 mois | Vert, repère 6 mois |
| 37 ans, 7 mois | Orange, bilan conseillé, question sur le spermogramme |
| 41 ans, homme 45 ans, 2 mois | Orange, sans attendre, remarque âge de l'homme, question réserve ovarienne |
| 29 ans, SOPK, 3 mois | Orange, sans attendre, question sur l'ovulation, SOPK dans le message WhatsApp |
| GEU | question sur les trompes |
| Homme : varicocèle, 4 mois | Orange, sans attendre |
| 14 mois, rapports moins d'une fois par semaine | remarque sur la fréquence |
| 0 mois | remarque sur l'arrêt de la contraception |

## 7. Questions pour Gilbert

1. **Liste des antécédents** : faut-il ajouter ou retirer des cases (par exemple drépanocytose, diabète, tuberculose génitale, excision, prise de poids importante, tabac ou alcool) ?
2. Toute case cochée déclenche « bilan sans attendre ». Certaines (fibrome, curetage simple) doivent-elles plutôt raccourcir le délai à 6 mois ?
3. Phrase « Dans environ la moitié des couples, une cause masculine participe à la difficulté » : la garder telle quelle ?
4. L'âge de l'homme n'agit pas sur le délai (pas de seuil reconnu). Un seuil, par exemple 50 ans, vous semble-t-il utile ?
5. La liste « Ce que le bilan peut comprendre » est-elle conforme à votre pratique au CMS HOSANNA (examens disponibles sur place, laboratoire partenaire pour le spermogramme) ?
6. **Mesure d'audience** : la page charge, comme tout le site, la mesure d'audience Cloudflare (visite de la page, sans les réponses). La retirer de cette page ?
7. Les textes conviennent-ils (ton, sensibilité culturelle, place de l'homme dans le bilan) ?

Après validation : retirer le bandeau, passer la page en `index, follow`, l'ajouter au sitemap, au menu « Outils » et sur la page `/infertilite` (bouton « Faire le point »).
