# Rédaction HOSANNA

Espace de rédaction du site cmshosanna.com, pensé pour le téléphone.
Adresse : https://cmshosanna.com/redaction (non indexée, accès par clé personnelle).

## Ce que fait la version 1

- Créer, modifier, relire, publier et dépublier des articles de conseil santé.
- Image principale et images dans le texte (compressées sur le téléphone avant envoi), PDF à télécharger (4 Mo max).
- FAQ, sources avec case « vérifiée », relecture médicale obligatoire avant publication.
- Référencement : titre et description Google, adresse de page, données structurées (MedicalWebPage, FAQPage), plan du site `/sitemap-conseils.xml`.
- Textes Facebook, WhatsApp et TikTok préparés par article, avec copie et partage en un geste.
- Historique de toutes les versions, avec restauration.
- Export complet (Markdown + JSON + correspondance WordPress).
- Les articles publiés sont servis à `/conseils/<adresse>` et apparaissent en tête de la page Blog.

## Le contrat de contenu (ce qui rend le système ouvert)

Chaque article est un fichier **Markdown avec en-tête YAML**, le format lu par Decap CMS, Hugo, Astro, Eleventy, et importable dans WordPress.
La définition unique est dans `netlify/redaction/modele.ts` (`Contenu`, version de contrat 1).

Champs : `id, type, title, slug, excerpt, category, tags, featured_image{src,alt,caption,credit}, pdf{src,title,description,size}, author, medical_reviewer{name,profession,date}, medical_review_status, status, created_at, updated_at, published_at, seo_title, seo_description, canonical_url, og_image, faq[], sources[], cta{text,whatsapp_message}, social{facebook,tiktok,whatsapp}, ai{provider,model,generated_at,brief}, contract_version`, puis le texte en Markdown.

États : `brouillon_ia → brouillon → a_relire → valide → pret → publie → depublie`.
Règles de publication (`controlesPublication`) : titre, résumé, texte, validation médicale, nom du relecteur, toutes les sources vérifiées.

## Architecture (une couche = un fichier, chacune remplaçable)

| Couche | Fichier | Aujourd'hui | Demain |
|---|---|---|---|
| Contrat | `netlify/redaction/modele.ts` | Markdown + YAML | inchangé |
| Stockage | `stockage.ts` (`ContentRepository`, `MediaStore`) | Netlify Blobs | Git/Decap, WordPress, base de données : écrire une nouvelle classe et changer `depot()` |
| Publication | `publication.ts` (`Canal`) | site | Facebook, TikTok : ajouter un canal |
| IA | `ia.ts` (`AIProvider`) | éteinte | Claude, OpenAI ou Gemini par variable d'environnement |
| Accès | `auth.ts` | clés personnelles + rôles | autre système d'identité |
| Rendu | `rendu.ts` + `gabarit.ts` | page aux couleurs du site | — |
| API privée | `netlify/functions/redaction-api.mts` | `/api/redaction/*` | — |
| Public | `netlify/functions/redaction-public.mts` | `/conseils/*`, `/media/*`, `/api/conseils`, `/sitemap-conseils.xml` | — |
| Interface | `redaction.html` | une page, sans dépendance | — |

`gabarit.ts` est généré : après un changement d'en-tête ou de pied de page du site, relancer `python3 tools/generer-gabarit.py`.

## Rôles et ajout d'une personne

| Rôle | Peut |
|---|---|
| administrateur | tout |
| editeur | écrire, publier, IA |
| redacteur | écrire, IA (ne publie pas, ne valide pas) |
| reviseur | relire et valider médicalement (ne modifie pas le texte) |

1. Générer une clé : `node -e "const c=require('crypto');const k='redaction-'+c.randomBytes(8).toString('hex').match(/.{4}/g).join('-');console.log(k, c.createHash('sha256').update(k).digest('hex'))"`
2. Donner la clé à la personne (jamais dans le dépôt).
3. Ajouter `{ nom, role, empreinte }` dans `UTILISATEURS` de `auth.ts`, ou dans la variable Netlify `REDACTION_UTILISATEURS` (tableau JSON).
Pour retirer un accès : supprimer la ligne.

### Clé administrateur (sans toucher au code)

Dans Netlify, définir `REDACTION_CLE_ADMIN` avec une clé de votre choix (12 caractères minimum, de préférence une longue phrase sans rapport avec le centre). Dès qu'elle existe, la clé d'origine inscrite dans `auth.ts` ne fonctionne plus. Pour la changer : modifier la variable puis relancer un déploiement. `REDACTION_NOM_ADMIN` (facultatif) change le nom affiché.

## Règle de validation médicale

Si un article validé est modifié sur le titre, le résumé, le texte, la FAQ, les sources ou le PDF, la validation retombe à « pas encore relu » et la date est effacée. L'image, le référencement, le bouton WhatsApp et les textes pour les réseaux ne déclenchent pas cette règle. Pour un article en ligne, l'enregistrement demande de reconfirmer la relecture dans le même geste ; l'ancienne validation reste lisible dans l'historique.

## Sécurité des pages d'articles

Même politique CSP que le reste du site. Dans le texte, seuls les liens `http(s)`, internes (`/…`), ancres, `tel:` et `mailto:` sont conservés ; tout autre lien est neutralisé. Les images doivent être déposées dans la Rédaction (une image hébergée ailleurs ne s'affiche pas).

## Activer l'IA plus tard (interrupteur)

Dans Netlify > Site configuration > Environment variables :

- `AI_PROVIDER` = `claude` (ou `openai`, `gemini`)
- `CLAUDE_API_KEY` (ou `OPENAI_API_KEY`, `GEMINI_API_KEY`)
- `AI_MODEL` (facultatif)

Sans clé, le bouton « Créer avec l'IA » explique simplement que l'IA est éteinte. Pour l'éteindre de nouveau : supprimer la clé.
Coût indicatif avec Claude Sonnet : environ 25 à 40 F CFA par article long.
Un texte généré arrive toujours en « Brouillon IA », sources marquées non vérifiées : il ne peut pas être publié sans relecture humaine. Les idées d'images et le texte ALT proposés par l'IA sont gardés dans le bloc interne `ai` (jamais affichés au public). Délai maximal d'un appel : 150 secondes.

En attendant, un brouillon se dépose de l'extérieur : `REDACTION_CLE=... node tools/deposer-brouillon.mjs article.json`.

## Réseaux sociaux (phase 2)

Les textes par réseau sont déjà stockés dans chaque article (`social`). Pour automatiser : écrire `publier()` des canaux `facebook` et `tiktok` dans `publication.ts` et définir `FACEBOOK_PAGE_TOKEN` / `TIKTOK_ACCESS_TOKEN`. Rien d'autre ne change.

## Migrer vers un autre CMS

- **Decap CMS** : bouton « Tout exporter », déposer chaque `fichiers[].markdown` dans `content/articles/`, utiliser `docs/decap-config.example.yml`.
- **WordPress** : la clé `wordpress` de l'export suit la forme de l'API REST (`title, slug, excerpt, content, status, date, meta`).
- Les médias sont à `/media/<fichier>` : les télécharger et les replacer au même chemin évite de toucher aux contenus.

## Reste à faire (phase 2)

Médiathèque, programmation d'une date de publication, publication automatique sur les réseaux, import des 12 anciens articles de `blog/`, écran de gestion des accès.
