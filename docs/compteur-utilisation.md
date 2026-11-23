# Compteur d'utilisation anonyme

Mis en place le 22/11/2026 (mission validée par Gilbert : « go compteur »).

## Ce qui est compté

| Événement | Quand |
|---|---|
| `imc_calcul` | un calcul est fait dans l'outil IMC (/imc) |
| `grossesse_calcul` | un calcul est fait dans l'outil date d'accouchement (/date-accouchement) |
| `sein_test_fini` | le test du cancer du sein est terminé (/test-sein) |
| `regles_resultat` | un résultat est affiché dans l'outil « Mes règles sont-elles normales ? » (/regles) |
| `infertilite_resultat` | un résultat est affiché dans l'outil « Infertilité du couple » (/infertilite-test) |
| `imprimer_clic` | bouton « imprimer / PDF » d'un outil |
| `rdv_whatsapp_clic` | clic sur un lien WhatsApp du centre, sur n'importe quelle page (articles /conseils compris) |
| `rdv_formulaire` | envoi du formulaire de rendez-vous (/contact) |

Pour chaque événement : la page d'origine (ex. `/imc`, `/conseils/spiruline-bienfaits`) et le jour. Un total par jour, rien d'autre.

**Jamais enregistré** : valeur saisie (poids, dates, réponses), adresse IP, cookie, identifiant, appareil.
Envoi par `navigator.sendBeacon` ; si l'envoi échoue, l'outil fonctionne normalement.

## Message WhatsApp avec origine

Au clic sur un lien WhatsApp du centre, le message pré-rempli commence par l'origine, par exemple :
« Bonjour CMS HOSANNA, je viens de l'outil grossesse du site HOSANNA. Je souhaite prendre rendez-vous pour la 3e échographie… »
Origines : page d'accueil, outil IMC, outil grossesse, test du cancer du sein, outil « Mes règles sont-elles normales ? », outil infertilité du couple, page Outils santé, page Contact, « l'article « titre » », « la page « titre » ».
Le formulaire de contact envoie : « Bonjour CMS HOSANNA, je viens du formulaire de rendez-vous du site HOSANNA. … »

## Lire les chiffres (points du matin)

Adresse protégée par une clé de la Rédaction (tout rôle qui peut « lire » : administrateur, rédacteur, réviseur, éditeur) :

```
curl -s -H "x-cle-redaction: VOTRE_CLÉ" "https://cmshosanna.com/api/compteur/stats?jours=30"
```

Réponse (JSON) : `aujourdhui`, `sept_jours`, `trente_jours` (totaux par événement), `pages_30_jours` (détail par page), `par_jour` (du plus récent au plus ancien). `jours` va de 1 à 400 (60 par défaut).
Sans clé ou avec une mauvaise clé : réponse 401.

## Ajouter un outil

1. Ajouter le nom de l'événement dans `netlify/compteur/regles.ts` (liste `EVENEMENTS`).
2. Dans la page de l'outil : `(window.hosannaCompte && hosannaCompte('nom_evenement'));` au moment voulu, et inclure `<script src="/assets/compteur.js" defer></script>`.
3. `python3 tools/verifier-site.py` vérifie que chaque événement appelé est bien autorisé.

## Fichiers

- `netlify/compteur/regles.ts` : liste des événements, nettoyage de la page, résumé (logique pure, testée)
- `netlify/functions/compteur.mts` : réception (`POST /api/compteur`) et lecture (`GET /api/compteur/stats`), stockage Netlify Blobs `compteur-site`, une clé par jour
- `assets/compteur.js` : envoi depuis le site et message WhatsApp avec origine

## Lire les chiffres sans ligne de commande : onglet « Statistiques »

Dans `/redaction`, après connexion avec votre clé habituelle, touchez **📊 Statistiques**. L'écran affiche, sur 30 jours :
- les utilisations des outils (aujourd'hui, 7 jours, 30 jours), outil par outil ;
- les clics « Demander un avis (WhatsApp) », avec la page d'où ils viennent, et les demandes du formulaire de rendez-vous ;
- un graphique des utilisations par jour.

Tous les rôles de la Rédaction y ont accès. Aucune nouvelle donnée n'est collectée : l'écran lit le même compteur anonyme.
