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
| Insuffisance pondérale | IMC < 18,5 | OMS, TRS 894 |
| Corpulence normale | 18,5 à 24,9 | OMS, TRS 894 |
| Surpoids | 25,0 à 29,9 | OMS, TRS 894 |
| Obésité classe I / II / III | 30,0 à 34,9 / 35,0 à 39,9 / ≥ 40,0 | OMS, TRS 894 |
| Fourchette de poids santé | 18,5 × taille² à 24,9 × taille² | Déduite des seuils OMS |
| Repère de poids idéal | Lorentz : homme = T − 100 − (T − 150)/4 ; femme = T − 100 − (T − 150)/2,5 (T en cm) | Formule de Lorentz, présentée comme repère indicatif |
| Tour de taille, risque accru | ≥ 94 cm (homme), ≥ 80 cm (femme) | OMS, *Waist circumference and waist–hip ratio*, rapport de consultation d'experts, 2008 |
| Tour de taille, risque nettement accru | ≥ 102 cm (homme), ≥ 88 cm (femme) | OMS 2008 |

Note : la Fédération internationale du diabète (IDF) recommande les seuils européens (94 / 80 cm) pour les populations d'Afrique subsaharienne, en attendant des données propres.

## 3. Textes affichés (à relire mot à mot)

- **Insuffisance pondérale** : « Votre poids est inférieur à la fourchette santé. Un poids trop bas peut cacher une carence ou une maladie : parlez-en à un médecin, surtout si vous avez perdu du poids sans le vouloir. »
- **Corpulence normale** : « Votre poids est dans la fourchette santé. Gardez une alimentation variée et une activité physique régulière. »
- **Surpoids** : « Une perte de poids modérée, même de quelques kilos, peut améliorer la tension artérielle, la glycémie et le cholestérol. Un professionnel de santé peut vous accompagner. »
- **Obésité** : « Un bilan est conseillé : tension artérielle, glycémie et cholestérol. Prenez rendez-vous pour en parler avec un professionnel de santé. »
- **Lorentz** : « Repère de poids idéal (formule de Lorentz) : environ X kg. C'est un repère, pas un objectif strict. »
- **Tour de taille** : « risque nettement accru (graisse abdominale). Un bilan est conseillé. » / « risque accru. Surveillez votre tour de taille. » / « pas de risque accru lié au tour de taille. »
- **Limites** : « L'IMC ne s'applique pas pendant la grossesse, avant 18 ans, ni chez les personnes très musclées. Chez les personnes âgées, il s'interprète avec prudence. »
- **Impression / PDF** : date, sexe, âge, taille, poids, résultat, et « Prenez rendez-vous au CMS HOSANNA (Attiégou, Lomé, ouvert 24h/24) : 90 03 83 13, appel ou WhatsApp · cmshosanna.com ».

## 4. Exemples de contrôle (vérifiés par test automatique)

| Saisie | Résultat attendu |
|---|---|
| Homme, 170 cm, 70 kg, tour 95 cm | IMC 24,2, corpulence normale, poids santé 53 à 72 kg, Lorentz 65 kg, risque accru |
| Femme, 170 cm, 70 kg, tour 90 cm | Lorentz 62 kg, risque nettement accru |
| Femme, 160 cm, 80 kg | IMC 31,3, obésité classe I |
| Femme, 160 cm, 47 kg | Insuffisance pondérale |
| Homme, 180 cm, 85 kg | IMC 26,2, surpoids |

## 5. Questions pour Gilbert

1. Garder le repère de Lorentz, ou n'afficher que la fourchette de poids santé ?
2. Garder les seuils de tour de taille OMS / IDF (94 / 80 cm), ou retenir d'autres seuils ?
3. Les textes ci-dessus conviennent-ils, ou faut-il les adapter (langue, ton) ?

Après validation : retirer le bandeau « Version en attente de validation médicale », passer la page en `index, follow`, l'ajouter au sitemap et au menu « Outils ».
