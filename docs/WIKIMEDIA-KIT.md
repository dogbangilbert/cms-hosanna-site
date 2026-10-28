# Kit Wikimedia du CMS HOSANNA

Préparé le 28 octobre 2026, après le message de Wikimedia du jour : le compte « CMS HOSANNA » est renommé **« Ananivi Dogban »**. Pour se connecter, on utilise ce nouveau nom avec le même mot de passe.

Toutes les données ci-dessous viennent de la fiche d'identité officielle du site (`tools/geo_schema.py`, `mentions-legales.html`). Si une information change, corriger d'abord le site, puis ce kit.

---

## Étape 1 : déclarer le lien d'intérêt (à faire avant tout le reste)

Wikimedia autorise un responsable à contribuer sur son propre établissement, **à condition de le déclarer**. Sans cette déclaration, une fiche peut être supprimée et le compte bloqué.

**Où la publier :** sur Meta-Wiki, https://meta.wikimedia.org/wiki/User:Ananivi_Dogban

Une page utilisateur créée sur Meta s'affiche automatiquement sur tous les wikis (Wikidata, Wikipédia, Commons) où vous n'avez pas de page locale. Une seule déclaration suffit donc partout.

**Texte à coller** (cliquer sur « Créer », coller, puis « Publier ») :

```
Je suis Gilbert Ananivi Dogban, responsable médical du Centre Médico-Social HOSANNA
(Attiégou, Lomé, Togo).

'''Déclaration de conflit d'intérêts''' : je suis lié professionnellement au
Centre Médico-Social HOSANNA. Toute contribution que je fais au sujet de ce centre
est faite en mon nom propre, en tant que personne liée à l'établissement. Je
m'engage à respecter les règles de neutralité et de vérifiabilité, à citer des
sources, et à proposer sur les pages de discussion plutôt qu'à modifier
directement les articles de Wikipédia qui concernent le centre.

Je ne suis pas rémunéré pour contribuer à Wikimedia.
```

Si quelqu'un vous paie un jour pour contribuer (une agence par exemple), il faudra remplacer la dernière phrase par une déclaration de contribution rémunérée. C'est obligatoire.

---

## Étape 2 : vérifier qu'aucune fiche Wikidata n'existe déjà

1. Ouvrir https://www.wikidata.org et chercher **HOSANNA**, puis **CMS HOSANNA**, puis **Hosanna Lomé**.
2. Si une fiche sur le centre existe déjà, ne pas en créer une seconde : compléter celle-là (étape 3, mode manuel).
3. S'il n'y en a pas, passer à l'étape 3.

---

## Étape 3 : créer la fiche Wikidata

### Méthode rapide (QuickStatements, environ 2 minutes)

1. Se connecter sur https://quickstatements.toolforge.org avec le compte **Ananivi Dogban**.
2. Cliquer sur « Nouveau lot », coller le bloc ci-dessous, puis cliquer sur « Importer des commandes V1 ».
3. **Avant de lancer**, vérifier l'aperçu. Chaque ligne doit afficher un libellé lisible :
   - Q1774898 → *clinique*
   - Q945 → *Togo*
   - Q3792 → *Lomé*

   Si un libellé ne correspond pas, ne pas lancer, et me signaler la ligne.
4. Cliquer sur « Lancer ».

```
CREATE
LAST|Lfr|"Centre Médico-Social HOSANNA"
LAST|Len|"HOSANNA Medical and Social Centre"
LAST|Dfr|"centre médico-social privé à Lomé, Togo"
LAST|Den|"private health centre in Lomé, Togo"
LAST|Afr|"CMS HOSANNA"
LAST|Afr|"CMSH"
LAST|Aen|"CMS HOSANNA"
LAST|P31|Q1774898|S854|"https://cmshosanna.com/mentions-legales"
LAST|P17|Q945
LAST|P131|Q3792
LAST|P625|@6.1718877/1.2716474
LAST|P6375|fr:"Attiégou, non loin de la Gendarmerie d'Adidomé, Lomé"
LAST|P1448|fr:"Centre Médico-Social HOSANNA"
LAST|P856|"https://cmshosanna.com/"
LAST|P968|"mailto:cmshosanna@gmail.com"
LAST|P1329|"+228 90 03 83 13"
LAST|P2013|"cmshosanna"
LAST|P7085|"cmshosanna2"
LAST|P4264|"cms-hosanna"
```

### Méthode manuelle (si QuickStatements pose problème)

Sur Wikidata, menu de gauche « Créer un nouvel élément » :

| Champ | Valeur |
|---|---|
| Libellé (fr) | Centre Médico-Social HOSANNA |
| Description (fr) | centre médico-social privé à Lomé, Togo |
| Alias | CMS HOSANNA, CMSH |

Ajouter ensuite chaque déclaration avec « + ajouter une déclaration ». Il suffit de taper le nom de la propriété, Wikidata la propose :

| Propriété | Valeur |
|---|---|
| nature de l'élément | clinique |
| pays | Togo |
| localisation administrative | Lomé |
| coordonnées géographiques | 6.1718877, 1.2716474 |
| adresse | Attiégou, non loin de la Gendarmerie d'Adidomé, Lomé (langue : fr) |
| nom officiel | Centre Médico-Social HOSANNA (langue : fr) |
| site officiel | https://cmshosanna.com/ |
| adresse électronique | mailto:cmshosanna@gmail.com |
| numéro de téléphone | +228 90 03 83 13 |
| identifiant Facebook | cmshosanna |
| nom d'utilisateur TikTok | cmshosanna2 |
| identifiant d'une organisation sur LinkedIn | cms-hosanna |

---

## Étape 4 : renforcer la fiche avec des sources indépendantes (important)

Wikidata conserve les fiches d'organisations qui sont **décrites par des sources sérieuses et publiques**. Une fiche qui ne cite que le site du centre risque d'être proposée à la suppression.

Pour la protéger, il faut ajouter 1 ou 2 références externes, par exemple :
- une liste officielle des établissements agréés du Ministère de la Santé où figure l'agrément 257/2022 ;
- un article de presse togolaise (République Togolaise, Togo First, iciLomé…) ;
- une page d'un partenaire (INAM, AMU, Transvie) qui cite le centre.

Envoyez-moi les liens que vous connaissez : je préparerai les références au bon format.

---

## Ensuite

- **Logo sur Wikimedia Commons** : seulement si vous acceptez de le publier sous licence libre (CC BY-SA). Sinon, on n'en met pas.
- **Lien Wikidata sur le site** : une fois la fiche créée, envoyez-moi son numéro (Q…). Je l'ajouterai à `sameAs` dans `tools/geo_schema.py`. Google et les assistants IA pourront alors relier le site à la fiche, ce qui sert directement le GEO.
- **Wikipédia** : pas d'article pour le moment. Avec le lien d'intérêt, il faudrait passer par une demande d'article et par des sources de presse indépendantes. On y reviendra quand il y aura de la couverture médiatique.
