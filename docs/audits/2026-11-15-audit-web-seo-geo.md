# Audit du site cmshosanna.com : 15 novembre 2026

Audit réalisé après les corrections du commit `b309799` (CGU, bandeau cookies, anti-spam, contraste, image de partage) et `c96ac83` (archive Octobre rose, retrait de la fiche 404).

## 1. Ce qui a été vérifié (dépôt, reproductible)

| Contrôle | Méthode | Résultat |
|---|---|---|
| Liens internes | Navigateur headless, toutes les pages | Aucun lien cassé. Les 404 relevés sont des appels `/api/...` (fonctions Netlify, absentes du serveur de test) |
| Images | Chargement de chaque image | 0 image cassée, 72 images avec texte alternatif |
| Mobile (375 px) | Largeur de défilement | 0 page avec défilement horizontal |
| Accessibilité WCAG 2.1 AA | axe-core, pages après fin des animations | 0 violation sur les pages testées |
| Erreurs JavaScript | Console du navigateur | Aucune erreur hors ressources externes bloquées |
| Données structurées | Analyse de chaque bloc JSON-LD (33 pages) | JSON valide sur toutes les pages ; questions de FAQ visibles sur la page ; `@id` cohérents |
| Sitemap | Comparaison pages publiques / `sitemap.xml` | 29 URL dans le sitemap, aucune manquante ni en trop |
| Robots et IA | Lecture de `robots.txt` et `llms.txt` | Moteurs et assistants IA autorisés ; espaces internes exclus |
| En-têtes de sécurité | Lecture de `_headers` | CSP, X-Frame-Options, nosniff, Referrer-Policy, HSTS présents |
| Secrets côté front | Recherche de clés dans le HTML/JS | Aucune clé secrète ; seul le jeton public Cloudflare |
| Test fonctionnel | Bandeau cookies, formulaire de contact, CGU | Tous les tests passent (voir le commit `b309799`) |

Résultats bruts : `docs/audits/audit-2026-11-15-resultats-bruts.json`.

## 2. Ce qui n'a PAS pu être vérifié

Ces contrôles demandent un accès externe que cet environnement n'a pas :

- **Google Search Console** : indexation, erreurs d'exploration, requêtes, impressions, clics. Aucun outil connecté.
- **Bing Webmaster Tools** : idem.
- **Site en ligne** : `cmshosanna.com` ne répond pas depuis ce sandbox (le proxy bloque les connexions sortantes). Le contrôle porte donc sur le dépôt, pas sur le site déployé.
- **Vitesse réelle** : mesurée en local uniquement ; les polices Google et Cloudflare sont bloquées.
- **Citations dans les assistants IA** : non mesurables sans interroger les assistants eux-mêmes.
- **Présence dans les moteurs** : une recherche web sur « CMS HOSANNA Lomé Attiégou » ne retourne aucune page du site. Ce résultat ne prouve pas l'absence d'indexation (l'outil est limité aux États-Unis), mais il confirme que la visibilité publique reste à établir.

## 3. Constats et corrections

- **Aucune erreur bloquante dans le dépôt** au moment de l'audit.
- Le message « lien cassé » sur `download/cms-hosanna.apk` est un artefact du test : le fichier répond en HTTP 200.
- Corrigé auparavant : balisage Event périmé (Octobre rose), fiche structurée sur la 404.

## 4. Actions à faire côté Google et Bing (non faisables depuis le dépôt)

1. Vérifier que la propriété `cmshosanna.com` est bien validée dans la Search Console et dans Bing Webmaster Tools.
2. Soumettre `https://cmshosanna.com/sitemap.xml` dans les deux outils.
3. Consulter le rapport « Couverture » et « Données structurées » de la Search Console, puis noter ici les erreurs éventuelles.
4. Vérifier que `https://cmshosanna.com/` redirige bien vers HTTPS (réglage « Force HTTPS » de Netlify).
5. Noter dans un nouvel audit, daté, les impressions et clics des 28 derniers jours.
