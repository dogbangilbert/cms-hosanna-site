# FICHE ORCHESTRATEUR — Site : passation du 27/11/2026

Session sortante : « Site vivant » (Claude Code, dépôt `dogbangilbert/cms-hosanna-site`).
Destinataire : la nouvelle session Site, qui reprend le relais, y compris le déploiement du 3/12.

## 1. État du code

| Élément | Valeur |
|---|---|
| Branche de travail | `feature/site-vivant` |
| Tête actuelle | `995f68e` (poussée sur GitHub ; ce dernier commit ajoute seulement cette fiche) |
| `main` (= production) | `3bfb68a` (déploiement Netlify `6b042a9c41bdd5c1ce383782`, 23/11) |
| Fusion | avance rapide possible : `main` est ancêtre de la branche, sans conflit |
| Site Netlify | ID `26111be2-f0dc-4450-934c-1066a36fc904`. `main` ne se déploie pas tout seul : c'est l'Orchestrateur qui déclenche. |

## 2. Déploiement prévu : JEUDI 3/12 à 8h47 (Lomé)

Il a lieu avant le renouvellement des crédits Netlify du 4/12, pour utiliser les 25 % restants. Il n'y a qu'**un seul** déploiement.

Procédure :
1. `git fetch origin && git checkout main && git merge --ff-only origin/feature/site-vivant && git push origin main`
2. L'Orchestrateur déclenche le déploiement de production.
3. Contrôles en ligne :
   - /outils (8 cartes, en `index`) ;
   - /prostate, /fecondite, /imc, /date-accouchement, /regles, /infertilite-test (200, `index, follow`, sans mention « en attente ») ;
   - /campagnes ;
   - /redaction → 📊 Statistiques avec la clé ;
   - `GET /api/compteur/stats` sans clé → 401 ;
   - bandeau Novembre Bleu : il s'arrête seul le 30/11 ;
   - logo WhatsApp visible sur /contact.
4. Soumettre `https://cmshosanna.com/sitemap.xml` dans Search Console.

Contenu du lot, du plus ancien au plus récent, au-dessus de `3bfb68a` :

| Commit | Contenu |
|---|---|
| `85819b4` … `86dc560` | Outil **prostate** (/prostate) : IPSS en 7 questions + qualité de vie, alertes, bloc dépistage, mention « questions simplifiées, adaptées de l'IPSS et de l'AFU » |
| `d8061e9` | Décision dépistage : PSA dès 45 ans (40 si père ou frère touché), tous les 2 ans si normal, **au cas par cas après 70 ans** (décision de l'Orchestrateur du 25/11, après l'étude de la Branche Études) |
| `4f2fa01` | **« Pour aller plus loin »** (`assets/liens.js`) : articles et outils d'un même domaine se répondent ; articles /conseils/ rattachés automatiquement ; événement `lien_lire_aussi` |
| `9a2d68b` | Corrections de la relecture médicale de l'Orchestrateur : alerte prostate « dans la semaine » ; fécondité (mention complète seulement pour « Avoir un enfant », message au-delà de 4 mois, alerte FIGO si cycle < 24 ou > 38 j) ; retrait de la mention « en attente » |
| `03d045c` | **Indexation** de tous les outils et de /outils (accord de Gilbert du 25/11) ; sitemap + llms.txt mis à jour |
| `3c857ae` | **Vrai logo WhatsApp** (`img/whatsapp.svg`) à la place de 💬, sur 33 boutons, y compris `assets/vie.js` et `netlify/redaction/rendu.ts` |
| `0077c49` | Documentation : `docs/refonte/plan-images.md` |

## 3. Règles en vigueur

- **Décisions :** l'Orchestrateur décide et autorise. Gilbert garde l'argent, les publications et les grosses validations médicales.
- **Rien en ligne avant le 3/12**, sauf urgence.
- **Ton neutre** dans tous les outils : « faites-vous consulter par un professionnel de santé », bouton « Demander un avis (WhatsApp) ». Pas de prix dans les outils ni dans l'historique des campagnes.
- **Phrase de confidentialité** à reprendre partout : « Vos réponses sont uniquement avec vous et ne vont nulle part ailleurs. Nous comptons seulement le nombre d'utilisations, de façon anonyme. »
- **Indexation :** depuis le 25/11, toutes les pages publiques sont en `index`. Un nouvel outil reste en `noindex`, avec la mention « en attente de validation médicale », jusqu'à sa validation.
- **Compteur anonyme :** seuls les événements de la liste blanche (`netlify/compteur/regles.ts`) sont acceptés. Pour un nouvel événement, l'ajouter à `EVENEMENTS` et à l'écran Statistiques (`redaction.html`, `OUTILS`).
- Écrire « HOSANNA », jamais « Osana ». Ne jamais demander ni saisir de clé ou de mot de passe.
- Commits : pas d'identifiant de modèle ; se terminer par la ligne `Claude-Session`.

## 4. Tests (dossier de travail de la session sortante, à recréer si besoin)

- `python3 tools/verifier-site.py` : contrôles sans dépendance (meta, JSON-LD, sitemap, redirections, campagne.json, événements du compteur). Résultat attendu : **0 échec**.
- Playwright (Chromium préinstallé) + axe-core 4.10.2. Serveur local qui reproduit les URL propres de Netlify (`/page` → `page.html`).
- Suites passées le 25/11, toutes à 0 échec : prostate 21, fécondité 14 + ancienne, IMC, grossesse, sein, compteur 11, campagnes 21, statistiques 14, liens 27, tests unitaires du compteur 5/5 (`node --experimental-strip-types --experimental-test-module-mocks`).
- Audit des 39 pages : 0 débordement mobile, 0 image cassée, 0 problème de contraste ni d'accessibilité.

## 5. Ce qui reste (prochain cycle Netlify)

1. **Refonte visuelle** (`docs/refonte/plan-images.md`) : 338 emojis à remplacer.
   - Étape 1 : icônes Lucide, auto-hébergées, en bleu HOSANNA. C'est faisable sans attendre personne, et l'en-tête plus le pied de page représentent 68 % des emojis.
   - Étape 2 : 15 photos réelles à prendre au centre (microscope, échographe, frigo à vaccins, ECG, équipe…), avec l'accord écrit des personnes.
   - Étape 3 : illustrations dans le style des dessins commandés.
   - Un déploiement par étape.
2. Espace « Téléchargements » et emplacements des vidéos « Minute santé » (YouTube au clic) : pas commencés.
3. **DeepSeek** : non branché (voir la réponse ci-dessous).

## 6. Réponse à la question DeepSeek

**Non.** La Rédaction (`netlify/redaction/ia.ts`, `fournisseurIA()`) ne connaît que Claude, OpenAI et Gemini, choisis par `AI_PROVIDER` + `*_API_KEY`. Une clé DeepSeek est donc ignorée.

Comme l'API DeepSeek suit le format OpenAI, il suffit d'un petit ajout :
- un fournisseur `deepseek` (adresse `https://api.deepseek.com`, modèle `deepseek-chat`, variable `DEEPSEEK_API_KEY`) ;
- puis `AI_PROVIDER=deepseek` dans les variables Netlify.

Cela fait environ 10 lignes, à faire dans le prochain lot. La clé doit être saisie par Gilbert dans Netlify, jamais dans une conversation.
