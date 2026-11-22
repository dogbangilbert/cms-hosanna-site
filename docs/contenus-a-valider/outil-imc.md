# Outil « IMC et poids santé » : fiche à valider

**Statut : VALIDÉ par Gilbert DOGBAN le 21/11/2026** (relecture de la fiche, « ça peut passer »). Mis en ligne avec le reste de la branche, après son accord de déploiement. Décision du 21/11/2026 : classes et poids normal de l'OMS. Page `imc.html` (adresse `/imc`), non indexée, absente du menu.
Mention affichée : « Information générale. Ne remplace pas une consultation. »
Aucune donnée n'est enregistrée ni envoyée : le calcul se fait dans le navigateur du visiteur.

> **Indexation à activer après relecture finale de Gilbert** (demande du 21/11/2026) : la page est en ligne et accessible par le pied de page et /outils, mais en `noindex`, hors sitemap et hors llms.txt. Pour l'activer : `<meta name="robots" content="index, follow">` sur /imc, /date-accouchement et /outils, puis les ajouter au sitemap et à llms.txt.

## 1. Saisies

Sexe (femme ou fille / homme ou garçon), âge (ans, et mois facultatifs pour l'enfant), taille (70 à 220 cm), poids (8 à 250 kg), tour de taille facultatif.
Décision de Gilbert (21/11) : **ouvert aux moins de 18 ans** (un parent peut calculer pour son enfant). Avant 2 ans : « Avant 2 ans, la croissance se suit sur le carnet de santé de l'enfant, avec le médecin ou la sage-femme. »

## 2. Formules et seuils

| Élément | Formule ou seuil | Source |
|---|---|---|
| IMC | poids (kg) / taille (m)², arrondi au dixième | OMS, *Obesity: preventing and managing the global epidemic*, Technical Report Series 894, 2000 |
| Maigreur sévère / modérée / légère | < 16,0 / 16,0 à 16,9 / 17,0 à 18,4 | OMS (décision de Gilbert, 21/11) |
| Corpulence normale | 18,5 à 24,9 | OMS, TRS 894 |
| Surpoids (préobésité) | 25,0 à 29,9 | OMS, TRS 894 |
| Obésité de classe I (modérée) / II (sévère) / III (très sévère) | 30,0 à 34,9 / 35,0 à 39,9 / ≥ 40,0 | OMS, TRS 894 |
| Fourchette de poids santé | 18,5 × taille² à 24,9 × taille² | Déduite des seuils OMS |
| Poids normal (carte en haut du résultat) | 18,5 × taille² à 24,9 × taille² | OMS (décision de Gilbert, 21/11 : remplace l'« IMC idéal 21 à 24 »)|
| Tour de taille, risque accru | ≥ 94 cm (homme), ≥ 80 cm (femme) | OMS, *Waist circumference and waist–hip ratio*, rapport de consultation d'experts, 2008 |
| Tour de taille, risque nettement accru | ≥ 102 cm (homme), ≥ 88 cm (femme) | OMS 2008 |

Note : la Fédération internationale du diabète (IDF) recommande les seuils européens (94 / 80 cm) pour les populations d'Afrique subsaharienne, en attendant des données propres.

## 3. Textes affichés (à relire mot à mot)

- **Insuffisance pondérale** : « Votre poids est inférieur à la fourchette santé. Un poids trop bas peut cacher une carence ou une maladie : parlez-en à un médecin, surtout si vous avez perdu du poids sans le vouloir. »
- **Corpulence normale** : « Votre poids est dans la fourchette santé. Gardez une alimentation variée et une activité physique régulière. »
- **Surpoids** : « Une perte de poids modérée, même de quelques kilos, peut améliorer la tension artérielle, la glycémie et le cholestérol. Un professionnel de santé peut vous accompagner. »
- **Obésité** : « Un bilan est conseillé : tension artérielle, glycémie et cholestérol. Prenez rendez-vous pour en parler avec un professionnel de santé. »
- **Présentation** : valeur de l'IMC en grand ; « IMC normal (OMS) 18,5 à 24,9 » et « Poids normal pour votre taille X à Y kg » côte à côte ; tableau des 8 classes OMS, la ligne de la personne surlignée en jaune avec « ◀ vous » ; « Votre classe : … ».
- **Tour de taille** : « risque nettement accru (graisse abdominale). Un bilan est conseillé. » / « risque accru. Surveillez votre tour de taille. » / « pas de risque accru lié au tour de taille. »
- **Limites** : « L'IMC ne s'applique pas pendant la grossesse, avant 18 ans, ni chez les personnes très musclées. Chez les personnes âgées, il s'interprète avec prudence. »
- **Impression / PDF** : date, sexe, âge, taille, poids, résultat, et « Prenez rendez-vous au CMS HOSANNA (Attiégou, Lomé, ouvert 24h/24) : 90 03 83 13, appel ou WhatsApp · cmshosanna.com ».

## 4. Exemples de contrôle (vérifiés par test automatique)

| Saisie | Résultat attendu |
|---|---|
| Homme, 66 ans, 170 cm, 102 kg (capture de Gilbert) | IMC 35,3, obésité de classe II (sévère) surlignée, poids normal 53 à 72 kg |
| Homme, 170 cm, 70 kg, tour 95 cm | IMC 24,2, poids normal, poids normal OMS 53 à 72 kg, risque accru |
| Femme, 170 cm, 70 kg, tour 90 cm | risque nettement accru |
| Femme, 160 cm, 80 kg | IMC 31,3, obésité de classe I (modérée) |
| 165 cm, 45 kg / 170 cm, 44 kg | IMC 16,5 maigreur modérée / IMC 15,2 maigreur sévère |
| Femme, 160 cm, 47 kg | Insuffisance pondérale |
| Homme, 180 cm, 85 kg | IMC 26,2, surpoids |

## 5. Questions pour Gilbert

1. ~~IMC idéal 21 à 24 ou poids normal OMS~~ : **tranché le 21/11, valeurs OMS.**
4. ~~Intitulés de maigreur~~ : **tranché le 21/11, découpage OMS.**
5. Le calcul du pourcentage de graisse (tour de cou) de votre modèle n'est pas repris : l'ajouter ?
2. Garder les seuils de tour de taille OMS / IDF (94 / 80 cm), ou retenir d'autres seuils ?
3. Les textes ci-dessus conviennent-ils, ou faut-il les adapter (langue, ton) ?

Après validation : retirer le bandeau « Version en attente de validation médicale », passer la page en `index, follow`, l'ajouter au sitemap et au menu « Outils ».

## 6. Enfants et adolescents (2 à 17 ans) — ajouté le 21/11/2026

L'IMC est lu sur les courbes de croissance de l'OMS (IMC pour l'âge, selon le sexe), par la méthode LMS : z = ((IMC / M)^L − 1) / (L × S), au mois près.

| Âge | Données | Classes affichées (OMS) |
|---|---|---|
| 2 à 5 ans | Normes de croissance OMS 2006 | Émaciation sévère (< −3 ET), émaciation (−3 à −2), poids normal (−2 à +1), risque de surpoids (+1 à +2), surpoids (+2 à +3), obésité (> +3) |
| 5 à 17 ans | Référence de croissance OMS 2007 (5-19 ans) | Maigreur sévère (< −3 ET), maigreur (−3 à −2), poids normal (−2 à +1), surpoids (+1 à +2), obésité (> +2) |

- Le tableau affiche les valeurs d'IMC qui correspondent à ces seuils pour l'âge et le sexe saisis ; la ligne de l'enfant est surlignée.
- Cartes : « IMC normal à cet âge (OMS) » (−2 à +1 ET) et « Poids normal pour cet âge et cette taille ».
- Percentile affiché (« au-dessus du 99e », « en dessous du 1er » aux extrêmes).
- Pas de pourcentage de graisse ni de seuils de tour de taille adultes avant 18 ans.
- Tables : `assets/oms-imc-enfant.json` (chargé seulement si l'âge est inférieur à 18 ans). Contrôles : garçon de 10 ans, normal 13,7 à 18,5, obésité > 21,4 ; fille de 19 ans, +1 ET = 25,0 et +2 ET = 29,7 (concordance avec les seuils adultes, comme prévu par l'OMS).

Textes : maigreur « Le poids est bas pour l'âge. Faites examiner l'enfant ou l'adolescent par un professionnel de santé : croissance, alimentation, recherche d'une maladie. » ; normal « Le poids est dans la norme de l'OMS pour l'âge et le sexe. » ; surpoids « Chez l'enfant, pas de régime strict : repas équilibrés, moins de boissons et de produits sucrés, plus d'activité. » ; obésité « Un avis médical est conseillé : bilan et accompagnement adaptés à la croissance. »

## 7. Pourcentage de graisse (adultes) — ajouté le 21/11/2026

- Formule de Deurenberg (1991) : graisse (%) = 1,20 × IMC + 0,23 × âge − 10,8 × sexe (1 = homme, 0 = femme) − 5,4. Sans saisie supplémentaire.
- Niveaux (American Council on Exercise ; l'OMS n'a pas de classement du pourcentage de graisse) :
  - Homme : < 2 % trop faible ; 2 à 5 % graisse essentielle ; 6 à 13 % athlétique ; 14 à 17 % bonne forme ; 18 à 24 % moyen ; ≥ 25 % excès de graisse (obésité).
  - Femme : < 10 % trop faible ; 10 à 13 % graisse essentielle ; 14 à 20 % athlétique ; 21 à 24 % bonne forme ; 25 à 31 % moyen ; ≥ 32 % excès de graisse (obésité).
- Mention : « Estimation à partir de l'IMC, de l'âge et du sexe (formule de Deurenberg). Seule une mesure en cabinet est précise. »
- Exemple : homme de 66 ans, IMC 35,3 → 41 %, excès de graisse.
- Question : votre calculateur utilise le tour de cou et le tour de taille (formule de l'US Navy), plus précise mais avec une saisie de plus. Garder Deurenberg (simple) ou ajouter le tour de cou ?

## Ton neutre (décision de Gilbert, 22/11/2026, pour tous les outils)

Plus de « Prendre rendez-vous » dans les résultats : « Pour un avis adapté à votre situation, faites-vous consulter par un professionnel de santé. Si vous le souhaitez, l'équipe du CMS HOSANNA peut aussi vous répondre. » Bouton « Demander un avis (WhatsApp) », messages pré-remplis neutres (« j'ai une question… »). Le texte imprimé dit « consultez un professionnel de santé », suivi des coordonnées du centre. Les boutons « Prendre RDV » de l'en-tête du site ne changent pas.
