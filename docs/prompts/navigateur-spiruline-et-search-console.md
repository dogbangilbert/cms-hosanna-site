# Prompt pour une session Claude Code avec accès navigateur (Claude in Chrome)

Objet : finaliser l'article spiruline, vérifier la mise en ligne, valider les corrections dans Search Console et mettre à jour la fiche Google.
Dépôt : `dogbangilbert/cms-hosanna-site`, branche `ccr-7b64b689-gjirth`. Ne rien fusionner ni déployer sans l'accord écrit de Gilbert Dogban.

## Contexte
- Le site est statique (`*.html`) avec des fonctions Netlify. Les redirections sont dans `_redirects`.
- L'article spiruline existe en deux versions : la page statique `blog/spiruline-bienfaits.html` du dépôt, et l'article publié dans la Rédaction (adresse `/conseils/<slug>`).
- Le texte publié est édité par Gilbert dans l'éditeur de la Rédaction (https://cmshosanna.com/redaction, accès par clé personnelle). Ne jamais demander ni saisir la clé : c'est à Gilbert de la saisir.
- Le contenu médical doit rester conforme à `docs/contenus-a-valider/spiruline-precautions.md` et à la section 5 de `docs/rapports/2026-11-15-rapport-orchestrateur.md`.

## Tâches (dans l'ordre)

### 1. Identifier la version de référence
1. Ouvrir l'article publié (adresse fournie par Gilbert) et relever : titre, H1, description, date de mise à jour, présence de la section « Quand l'éviter ».
2. Comparer au texte de `blog/spiruline-bienfaits.html`. Noter les écarts dans un fichier `docs/audits/2026-11-xx-spiruline-comparaison.md`.

### 2. Dédupliquer (après accord de Gilbert)
- Si la version Rédaction est la référence : ajouter dans `_redirects`, sous le commentaire existant, la ligne
  `/blog/spiruline-bienfaits  /conseils/<slug>  301!` et `/blog/spiruline-bienfaits.html  /conseils/<slug>  301!`,
  puis supprimer `blog/spiruline-bienfaits.html` et sa ligne dans `sitemap.xml` (ajouter à la place l'adresse `/conseils/<slug>` dans un sitemap dédié, ou laisser la Rédaction le gérer).
- Vérifier que `blog.html` et les liens internes pointent vers la bonne adresse.
- Committer avec un message décrivant la décision, sans identifiant de modèle.

### 3. Vérifier en ligne après déploiement (uniquement après accord et déploiement)
- `https://cmshosanna.com/blog/spiruline-bienfaits` et `.html` doivent renvoyer un 301 vers `/conseils/<slug>`.
- `https://www.cmshosanna.com/produit/souffle-de-liberte/` et `…/produit/cocon-de-serenite/` : 301 vers `/services`.
- `https://www.cmshosanna.com/category/prise-en-charge-du-vih-sida/feed/` et `…/categorie-produit/oils/feed/` : 301.
- Accueil : titre « CMS HOSANNA Lomé — Centre médico-social ouvert 24h/24 ».
- Consigner les résultats (code HTTP, URL finale, titre) dans un rapport daté.

### 4. Search Console (propriété `sc-domain:cmshosanna.com`)
- Ne cliquer « Valider la correction » qu'après la vérification du point 3, et seulement pour les motifs « Page introuvable (404) » et « Explorée, actuellement non indexée ».
- Ne rien modifier d'autre. Lire les 6 messages non lus et les résumer à Gilbert sans y répondre.

### 5. Fiche Google Business Profile
- Supprimer la ligne « Service en ligne : 09:00–17:00 ». Le centre est ouvert 24h/24, 7j/7.
- Ne modifier ni l'adresse, ni la catégorie principale, ni les zones desservies.
- Ajouter les photos quand Gilbert les transmet (noter leur nom et leur description).

### 6. Rendu
- Un rapport daté, dans `docs/rapports/`, avec : ce qui est fait, ce qui est vérifié en ligne, ce qui attend une décision de Gilbert.

## Règles
- Pas de déploiement, pas de fusion, pas de publication de contenu médical sans accord écrit.
- Si une étape est bloquée (connexion, permission, clé), le dire précisément et ne pas contourner.
- Ne jamais écrire d'identifiant, de clé ou de mot de passe dans le dépôt ou dans un rapport.
