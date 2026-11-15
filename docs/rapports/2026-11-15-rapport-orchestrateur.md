# Rapport d'avancement : site cmshosanna.com

**Date :** 15 novembre 2026 · **Branche :** `ccr-7b64b689-gjirth` (non fusionnée, non déployée)
**Destinataire :** orchestrateur (clone numérique de Gilbert Dogban)

---

## 1. Ce qui est fait (dépôt, commits poussés)

| Commit | Contenu |
|---|---|
| `b309799` | Conditions générales (page dédiée), bandeau cookies (refuser / accepter à égalité), mesure d'audience conditionnée à l'accord, anti-spam et validation du formulaire de contact, HSTS, image de partage 1200×630, contrastes corrigés, chargement différé des images, un seul bouton primaire sur l'accueil, descriptions méta des pages internes |
| `c96ac83` | Archive de l'événement Octobre rose 2026 (`docs/campagnes/octobre-rose.md`), retrait du balisage Event périmé, retrait de la fiche structurée sur la page 404 |
| `8edece1` | Audit daté du 15 novembre 2026 (`docs/audits/`) |
| `293f974` | Redirections 301 des anciennes pages WordPress (`/produit/*`, `/categorie-produit/*`, `/category/*`), titre et description de l'accueil, de la page spiruline, du laboratoire et du contact |
| `405b220` | Proposition de section « limites et précautions » pour la spiruline, non publiée (`docs/contenus-a-valider/`) |

### Tests et contrôles (reproductibles)
- 22 tests fonctionnels passent (bandeau cookies, formulaire, CGU, redirections simulées).
- Audit automatisé : 0 lien interne cassé, 0 image cassée, 0 débordement mobile, 0 violation WCAG AA sur les pages testées, 0 erreur JavaScript.
- JSON-LD valide sur les pages modifiées ; questions de FAQ visibles.

## 2. Ce qui est vérifié en ligne (Search Console, 15 nov. 2026)
- Propriété `cmshosanna.com` validée. 29 pages indexées sur 29 du sitemap (lu le 10 nov., sans erreur).
- 90 jours : 37 clics, 1 660 impressions, CTR 2,2 %, position 10,3.
- HTTPS correct, données structurées sans erreur (1 événement Octobre rose, 18 extraits d'avis).
- Non indexées : 3 redirections normales, 2 pages 404 et 2 flux RSS WordPress. Traitées dans `_redirects`, en attente de déploiement.

**Important :** les corrections ne sont **pas encore en production**. Le site affiche toujours les anciens titres et ne redirige pas les anciennes adresses.

## 3. Fiche Google Business Profile
- Note 4,5 (43 avis). Validée à 100 %.
- **À corriger par Gilbert dans Google** : la ligne « Service en ligne : 09:00–17:00 ». Le centre est ouvert 24h/24, 7j/7 ; cet horaire est à supprimer ou remplacer.
- Décisions prises et à respecter : adresse inchangée (une modification a déjà déclenché une vérification de Google), catégorie principale « Hôpital » conservée, zones desservies inchangées.
- Photos : Gilbert les ajoute directement dans Google, puis les transmet pour le site (optimisation WebP, poids, texte alternatif).

## 4. Ce qui reste à faire

| # | Action | Qui | Dépendance |
|---|---|---|---|
| 1 | Fusionner `ccr-7b64b689-gjirth` et déployer sur Netlify | Claude Code | **Accord explicite de Gilbert** |
| 2 | Vérifier en ligne les 4 anciennes adresses (redirections 301) et les nouveaux titres | Claude Code | Après 1 |
| 3 | « Valider la correction » dans Search Console (404 et « explorée non indexée ») | Gilbert | Après 2 |
| 4 | Corriger l'horaire « 9h–17h » sur la fiche Google | Gilbert | Aucune |
| 5 | Valider les corrections de l'article spiruline (voir section 5) | Gilbert (médecin) | Validation médicale |
| 6 | Ajouter les photos du centre à Google, puis les optimiser pour le site | Gilbert, puis Claude Code | Envoi des photos |
| 7 | Lire les 6 messages non lus de Search Console | Gilbert | Aucune |
| 8 | Ajouter le sitemap `sitemap-conseils.xml` à Search Console quand des articles sont publiés | Gilbert | Publication d'articles |
| 9 | Nouvel audit daté (impressions et clics des pages modifiées), environ 4 semaines après déploiement | Claude Code | Après 1 |

## 5. Article spiruline : corrections à valider

**Déjà modifié dans la branche** : titre, H1, description et titre du blog (« bienfaits, limites et précautions » à la place de « 6 bienfaits validés par la science »).

**À valider avant modification du corps de l'article** :

1. Remplacer les effets présentés comme acquis par une formulation prudente, car ils viennent surtout d'études in vitro ou animales :
   - « Elle active les macrophages et les lymphocytes NK, réduit le stress oxydatif et améliore la vitalité générale. » → « Des études en laboratoire suggèrent un effet sur certaines cellules de l'immunité ; ces résultats ne sont pas transposables tels quels à l'humain. »
   - « réduit les marqueurs inflammatoires (CRP, IL-6, TNF-alpha) — intéressant en cas de maladies inflammatoires chroniques » → supprimer « intéressant en cas de maladies inflammatoires chroniques », et préciser que l'effet est observé dans des études limitées.
   - « Effet hypoglycémiant doux », « réduction du LDL et des triglycérides » → « Certaines études rapportent un effet sur la glycémie et le cholestérol ; les données sont variables et ne remplacent pas le traitement prescrit. »
   - « elle a un effet préventif contre la DMLA » → « Elle contient des caroténoïdes (zéaxanthine, bêta-carotène) qui font partie de l'alimentation protectrice de la vue ; aucun effet préventif n'est démontré. »
2. Ajouter la section « limites et précautions » : texte complet dans `docs/contenus-a-valider/spiruline-precautions.md`.
3. Vérifier la formulation sur la grossesse (« données insuffisantes ») et sur les maladies auto-immunes.

Si vous validez ces points, je les applique dans le corps de l'article et je publie dans la branche.

## 6. Décisions de Gilbert à respecter
- Pas de déploiement sans accord explicite.
- Pas de contenu médical publié sans validation.
- Adresse Google et catégorie principale inchangées.
- Les horaires du centre sont 24h/24, 7j/7.

---

## Mise à jour du 15 novembre 2026 (fin de session)

**Fiche Google** : « Service en ligne » passé à 24h/24, 7j/7 (en attente de validation Google, en général moins de 10 minutes). Les jours encore affichés 09:00–17:00 sont des restes du premier enregistrement : à vérifier jour par jour une fois la validation faite.

**Search Console, relevé par Gilbert** :
- 29 pages indexées, 7 non indexées. Aucune validation de correction lancée.
- Les 3 redirections http et www sont normales.
- Les 2 erreurs 404 (`/produit/souffle-de-liberte/`, `/produit/cocon-de-serenite/`) et les 2 flux `/feed/` sont traités dans `_redirects`, en attente de déploiement.
- Avertissements « Événements » du 8 octobre (champs `performer` et `validFrom`) : sans objet, le balisage Event a été retiré de la page (commit `c96ac83`). Ils disparaîtront à la prochaine exploration.
- Aucune page bloquée par robots.txt.
- 37 clics sur environ deux mois. Pas de données Core Web Vitals, faute de trafic.

**Spiruline** : la page en ligne n'a pas la version du 15 novembre (pas de section « Quand l'éviter »). La mise en ligne attend : (1) l'adresse exacte de l'article publié dans la Rédaction, (2) votre accord pour fusionner et déployer la branche.
