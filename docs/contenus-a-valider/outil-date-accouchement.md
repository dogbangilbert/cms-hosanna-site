# Outil « Date d'accouchement et âge de la grossesse » : fiche à valider

**Statut : en attente de validation médicale par Gilbert DOGBAN.** Page `date-accouchement.html` (adresse `/date-accouchement`), non indexée, absente du menu.
Mention affichée : « Information générale. Ne remplace pas une consultation. »
Aucune donnée n'est enregistrée ni envoyée : le calcul se fait dans le navigateur.

## 1. Saisies

- Premier jour des dernières règles (DDR) : pas de date future, pas plus de 44 semaines en arrière.
- Durée habituelle du cycle : 21 à 45 jours (28 par défaut).

## 2. Formules

| Élément | Calcul | Source |
|---|---|---|
| DDR corrigée | DDR + (durée du cycle − 28) jours | Correction usuelle de la règle de Naegele pour les cycles longs ou courts |
| Âge de la grossesse | (aujourd'hui − DDR corrigée), en semaines d'aménorrhée (SA) + jours | Usage obstétrical |
| Âge depuis la conception | SA − 2 | Usage obstétrical |
| Date probable d'accouchement | DDR corrigée + 280 jours (40 SA = « 9 mois + 7 jours ») | Règle de Naegele ; MSF, *Guide obstétrique en situation précaire*, 1.2 Consultations prénatales (40 ou 41 SA) |
| Fenêtre d'accouchement | 37 SA (DDR + 259 j) à 41 SA (DDR + 287 j) ; au-delà : « consultez sans attendre » | MSF ; 41 SA = terme retenu en France (Santé.fr) |
| Trimestres | 1er : < 14 SA ; 2e : 14 à 27 SA ; 3e : ≥ 28 SA | Découpage usuel |
| Alerte « terme dépassé » | à partir de 41 SA | À valider |

## 3. Repères affichés (tableau, période en cours surlignée)

| Période | Repère | Source |
|---|---|---|
| Avant 12 SA | Première consultation prénatale (OMS : avant 12 semaines) | OMS, *Recommandations sur les soins prénatals pour que la grossesse soit une expérience positive*, 2016 |
| 11 à 13 SA + 6 j | Échographie du premier trimestre : elle précise la date du terme | Usage ; OMS 2016 (échographie avant 24 SA) |
| 14 à 27 SA | 2e trimestre : consultations régulières, échographie avant 24 SA (OMS) | OMS 2016 |
| 28 à 36 SA | 3e trimestre : consultations rapprochées, préparation à l'accouchement | OMS 2016 (8 contacts) |
| 37 à 41 SA | Grossesse à terme : l'accouchement peut arriver à tout moment | Usage |

## 3 bis. Gestogramme : échographies essentielles (demande de Gilbert, 21/11/2026)

À partir des dernières règles, l'outil donne les dates de chaque échographie et leur état (« À venir », « Maintenant » surlignée, « Passée »).

| Échographie | Fenêtre retenue | Objet affiché | À valider |
|---|---|---|---|
| 1re (1er trimestre) | 11 SA à 13 SA + 6 j | Datation de la grossesse, nombre de bébés, clarté nucale | Fenêtre usuelle de la clarté nucale |
| 2e (morphologique) | 20 SA à 25 SA + 6 j | Examen détaillé des organes du bébé, placenta, liquide | Usage francophone (souvent 22 SA) |
| 3e (3e trimestre) | 30 SA à 35 SA + 6 j | Croissance du bébé, position, placenta | Usage francophone (souvent 32 SA) |

L'OMS (2016) recommande au moins une échographie avant 24 SA ; le schéma à trois échographies suit l'usage francophone.

Exemple vérifié (DDR 01/05/2026) : 1re du 17 juillet au 6 août 2026, 2e du 18 septembre au 29 octobre 2026, 3e du 27 novembre 2026 au 7 janvier 2027.

## 4. Textes affichés (à relire mot à mot)

- Résultat : « Vous êtes au [trimestre], soit environ [SA − 2] semaines depuis la conception. Date prévue d'accouchement : [date]. »
- Grossesse trop récente (avant 2 SA) : « La grossesse est trop récente pour être confirmée par le calcul. Un test de grossesse ou une prise de sang peut la confirmer. »
- Terme dépassé (≥ 41 SA) : « Le terme prévu est dépassé ou proche de l'être : consultez sans attendre. »
- Mention : « La date calculée est une estimation : l'échographie du premier trimestre permet de la préciser. Consultez sans attendre en cas de saignement, de perte de liquide, de fièvre, de maux de tête violents, de troubles de la vue ou si le bébé bouge moins. »
- Impression / PDF : date du calcul, DDR, durée du cycle, résultat, repères, et « Suivi de grossesse au CMS HOSANNA (Attiégou, Lomé, ouvert 24h/24) : 90 03 83 13, appel ou WhatsApp · cmshosanna.com ».

## 5. Exemples de contrôle (vérifiés par test automatique, calcul du 21/11/2026)

| DDR, cycle | Résultat |
|---|---|
| 01/05/2026, 28 j | 29 SA + 1 j, terme 5 février 2027, 3e trimestre |
| 01/05/2026, 35 j | 28 SA + 1 j, terme 12 février 2027 |
| 01/09/2026, 28 j | 11 SA + 4 j, ligne « Avant 12 SA » |
| 20/01/2026, 28 j | 43 SA + 4 j, alerte terme dépassé |

## 6. Questions pour Gilbert

1. ~~Terme à 40 ou 41 SA~~ : **retenu le 21/11, selon la consigne de Gilbert (« ce qu'utilisent la plupart des gens ») : date probable à 40 SA (9 mois + 7 jours), fenêtre 37 à 41 SA, consulter au-delà de 41 SA.** Aucun protocole national togolais publié n'a été trouvé ; référence MSF (utilisée en Afrique francophone). À confirmer avec le carnet de maternité togolais si possible.
2. L'alerte « terme dépassé » à partir de 41 SA vous convient-elle ?
3. La liste des signes d'alerte est-elle complète et bien formulée pour vos patientes ?
5. Les trois fenêtres d'échographie (11-13, 20-25, 30-35 SA) correspondent-elles à votre pratique ?
4. Faut-il ajouter les repères du suivi au Togo (nombre de CPN, vaccins, supplémentation en fer et acide folique, TPI) ?

Après validation : retirer le bandeau « en attente de validation médicale », passer la page en `index, follow`, l'ajouter au sitemap et au menu « Outils ».

## 8. Rendez-vous d'échographie par WhatsApp (demande de Gilbert, 21/11/2026)

Sous chaque échographie, un bouton « 💬 Prendre rendez-vous (WhatsApp) » ouvre WhatsApp vers le 90 03 83 13 avec un message pré-rempli : « Bonjour CMS HOSANNA, je souhaite prendre rendez-vous pour la [1re/2e/3e] échographie ([période]). Ma grossesse : [X] SA, à faire entre le [date] et le [date]. »
Pour une échographie dont la période est passée : « 💬 Pas encore faite ? Rendez-vous ». Rien n'est envoyé tant que la personne n'appuie pas sur « Envoyer » dans WhatsApp. Les boutons n'apparaissent pas à l'impression.

Sources consultées :
- MSF, 1.2 Consultations prénatales : https://medicalguidelines.msf.org/fr/viewport/ONC/francais/1-2-consultations-prenatales-51415994.html
- Santé.fr, âge de la grossesse et date d'accouchement : https://www.sante.fr/node/1068443
