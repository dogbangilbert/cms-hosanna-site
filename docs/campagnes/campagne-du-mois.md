# Campagne du mois : mode d'emploi

Le bandeau en haut du site est piloté par un seul fichier : `assets/campagne.json`.
Il s'affiche sur toutes les pages (sauf les pages Octobre rose et test du sein) du jour `debut` au jour `fin` inclus, puis disparaît tout seul.

## Changer de campagne

Modifier uniquement les valeurs, sans toucher aux noms des champs :

| Champ | Exemple | Rôle |
|---|---|---|
| `actif` | `true` | `false` masque le bandeau immédiatement |
| `nom` | `Novembre Bleu` | Nom de la campagne |
| `emoji` | `💙` | Petit symbole devant le nom (peut rester vide `""`) |
| `offre` | `bilan prostate : consultation, PSA, …` | Texte complet (ordinateur) |
| `offre_courte` | `bilan prostate` | Texte court (téléphone) |
| `prix` | `19 500 F CFA` | Prix de la campagne |
| `prix_barre` | `30 000 F CFA` | Prix habituel, affiché barré (peut rester vide `""`) |
| `debut`, `fin` | `2026-11-16`, `2026-11-30` | Dates au format AAAA-MM-JJ |
| `lien` | `/contact` | Page ouverte au clic |
| `action` | `Prendre rendez-vous` | Appel à l'action |
| `couleurs` | `["#0B3D91", "#1565C0"]` | Deux couleurs foncées (le texte est blanc : garder un bon contraste) |

Vérifier ensuite avec `python3 tools/verifier-site.py`, puis déployer.

## Exemples de couleurs

- Octobre rose : `["#B5135C", "#C2185B"]`
- Novembre bleu : `["#0B3D91", "#1565C0"]`
- Journée du diabète, vaccination : `["#0D5C2E", "#1E7D40"]`

## Garder la trace : historique des campagnes (/campagnes)

Chaque campagne reste visible sur la page `/campagnes` (fichier `campagnes.html`), de la plus récente à la plus ancienne. **Aucun prix n'y figure.**

1. Au lancement, copier un bloc `<article class="legal-box campagne" … data-debut="AAAA-MM-JJ" data-fin="AAAA-MM-JJ">` en haut de la liste. Y mettre le mois, les dates, le titre, une phrase qui décrit l'offre (sans prix) et les liens utiles.
2. La mention « en cours » ou « terminée » se met à jour toute seule selon les dates. Le lien `class="camp-encours"` (prise de rendez-vous) disparaît une fois la campagne finie.
3. Si la campagne avait sa propre page (ex. `/octobre-rose`), la garder en archive : bandeau « campagne terminée », formulaire et prix retirés, lien vers `/campagnes`. La page Octobre rose 2026 sert de modèle.
