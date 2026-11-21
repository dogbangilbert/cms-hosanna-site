# Outil « IMC et poids santé » : fiche à valider

**Statut : en attente de validation médicale par Gilbert DOGBAN.** Page `imc.html` (adresse `/imc`), non indexée, absente du menu.
Mention affichée : « Information générale. Ne remplace pas une consultation. »
Aucune donnée n'est enregistrée ni envoyée : le calcul se fait dans le navigateur du visiteur.

## 1. Saisies

Sexe (femme / homme), âge (18 à 120 ans), taille (120 à 220 cm), poids (30 à 250 kg), tour de taille facultatif (50 à 200 cm).
Moins de 18 ans : refusé, avec le message « Cet outil est prévu pour les adultes de 18 ans et plus. »

## 2. Formules et seuils

| Élément | Formule ou seuil | Source |
|---|---|---|
| IMC | poids (kg) / taille (m)², arrondi au dixième | OMS, *Obesity: preventing and managing the global epidemic*, Technical Report Series 894, 2000 |
| Insuffisance pondérale très sévère / sévère / simple | < 15,0 / 15,0 à 15,9 / 16,0 à 18,4 | Présentation du modèle de Gilbert. L'OMS retient : maigreur sévère < 16, modérée 16 à 16,9, légère 17 à 18,4 |
| Corpulence normale | 18,5 à 24,9 | OMS, TRS 894 |
| Surpoids | 25,0 à 29,9 | OMS, TRS 894 |
| Obésité modérée / sévère / très sévère | 30,0 à 34,9 / 35,0 à 39,9 / ≥ 40,0 | OMS, TRS 894 (classes I, II, III) |
| Fourchette de poids santé | 18,5 × taille² à 24,9 × taille² | Déduite des seuils OMS |
| IMC idéal et poids idéal | IMC 21 à 24, soit 21 × taille² à 24 × taille² | Modèle de calculateur fourni par Gilbert (capture du 21/11). Pas de référence OMS pour cette fourchette : à confirmer |
| Tour de taille, risque accru | ≥ 94 cm (homme), ≥ 80 cm (femme) | OMS, *Waist circumference and waist–hip ratio*, rapport de consultation d'experts, 2008 |
| Tour de taille, risque nettement accru | ≥ 102 cm (homme), ≥ 88 cm (femme) | OMS 2008 |

Note : la Fédération internationale du diabète (IDF) recommande les seuils européens (94 / 80 cm) pour les populations d'Afrique subsaharienne, en attendant des données propres.

## 3. Textes affichés (à relire mot à mot)

- **Insuffisance pondérale** : « Votre poids est inférieur à la fourchette santé. Un poids trop bas peut cacher une carence ou une maladie : parlez-en à un médecin, surtout si vous avez perdu du poids sans le vouloir. »
- **Corpulence normale** : « Votre poids est dans la fourchette santé. Gardez une alimentation variée et une activité physique régulière. »
- **Surpoids** : « Une perte de poids modérée, même de quelques kilos, peut améliorer la tension artérielle, la glycémie et le cholestérol. Un professionnel de santé peut vous accompagner. »
- **Obésité** : « Un bilan est conseillé : tension artérielle, glycémie et cholestérol. Prenez rendez-vous pour en parler avec un professionnel de santé. »
- **Présentation** : valeur de l'IMC en grand ; « IMC idéal 21 à 24 » et « Poids idéal X à Y kg » côte à côte ; tableau des 8 classes, la ligne de la personne surlignée en jaune avec « ◀ vous » ; « Votre classe : … » ; rappel « Poids normal pour votre taille (IMC 18,5 à 24,9) : X à Y kg ».
- **Tour de taille** : « risque nettement accru (graisse abdominale). Un bilan est conseillé. » / « risque accru. Surveillez votre tour de taille. » / « pas de risque accru lié au tour de taille. »
- **Limites** : « L'IMC ne s'applique pas pendant la grossesse, avant 18 ans, ni chez les personnes très musclées. Chez les personnes âgées, il s'interprète avec prudence. »
- **Impression / PDF** : date, sexe, âge, taille, poids, résultat, et « Prenez rendez-vous au CMS HOSANNA (Attiégou, Lomé, ouvert 24h/24) : 90 03 83 13, appel ou WhatsApp · cmshosanna.com ».

## 4. Exemples de contrôle (vérifiés par test automatique)

| Saisie | Résultat attendu |
|---|---|
| Homme, 66 ans, 170 cm, 102 kg (capture de Gilbert) | IMC 35,3, obésité sévère surlignée, poids idéal 61 à 69 kg |
| Homme, 170 cm, 70 kg, tour 95 cm | IMC 24,2, poids normal, poids normal OMS 53 à 72 kg, risque accru |
| Femme, 170 cm, 70 kg, tour 90 cm | risque nettement accru |
| Femme, 160 cm, 80 kg | IMC 31,3, obésité modérée |
| Femme, 160 cm, 47 kg | Insuffisance pondérale |
| Homme, 180 cm, 85 kg | IMC 26,2, surpoids |

## 5. Questions pour Gilbert

1. L'IMC idéal 21 à 24 (votre modèle) n'a pas de référence OMS directe : le garder tel quel, ou afficher le poids normal OMS 18,5 à 24,9 comme valeur principale ?
4. Les intitulés d'insuffisance pondérale (très sévère < 15, sévère 15 à 16) suivent votre modèle ; l'OMS découpe autrement (< 16, 16 à 17, 17 à 18,5). Lequel retenir ?
5. Le calcul du pourcentage de graisse (tour de cou) de votre modèle n'est pas repris : l'ajouter ?
2. Garder les seuils de tour de taille OMS / IDF (94 / 80 cm), ou retenir d'autres seuils ?
3. Les textes ci-dessus conviennent-ils, ou faut-il les adapter (langue, ton) ?

Après validation : retirer le bandeau « Version en attente de validation médicale », passer la page en `index, follow`, l'ajouter au sitemap et au menu « Outils ».
