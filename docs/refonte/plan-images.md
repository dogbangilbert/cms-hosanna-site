# Refonte visuelle : remplacer les emojis par du vrai (plan du 25/11/2026)

Demande de Gilbert DOGBAN : « le site ressemble toujours à l'IA ». Les emojis doivent laisser place à de vraies images. Le site doit montrer des humains et du vrai matériel, par exemple le microscope du laboratoire. Les images doivent être légères et optimisées.

## Point de départ

- **338 emojis** sur 38 pages publiques. Ce compte exclut les étoiles des avis, le ☰ du menu et les ✓.
  - Pages les plus chargées : accueil (44), services (26), PVVIH (15), infertilité (14), le centre (13), outils (13), contact (12), test du sein (11).
  - Les 3 plus fréquents viennent de l'en-tête et du pied de page, présents sur chaque page : 📞 (117), 📱 (75), 🧮 (37). À eux trois, ils font **68 % du total**.
- **Déjà fait (25/11) :** le 💬 a disparu partout, remplacé par le vrai logo WhatsApp vert (`img/whatsapp.svg`), sur 33 boutons.
- **Photos réelles déjà présentes :** bâtiment, équipe (2), collage de soins, maternité, téléconsultation, consultation Octobre rose. Elles sont à réutiliser.

## Principes

1. **Ordre de préférence :** vraie photo du centre, puis illustration cohérente, puis icône dessinée. Plus aucun emoji dans les pages.
2. **Images légères :**
   - format WebP (avec JPG de secours) ;
   - 1 200 px de large au plus pour une grande photo, 600 px pour une carte ;
   - **moins de 80 Ko par image** ;
   - chargement différé, et texte de remplacement (alt) en français.
3. **Respect des patients :** aucun visage de patient sans **accord écrit**. Pour les gestes de soins, on privilégie les mains, le matériel et le personnel.
4. **Cohérence :** une seule famille d'icônes (trait fin, bleu HOSANNA #003399), un seul style d'illustration, des personnages togolais.

## Phase 1 — Icônes dessinées (je m'en charge seul, aucune photo nécessaire)

Jeu d'icônes libre **Lucide** (licence ISC, usage commercial autorisé), hébergé sur le site lui-même, sans service extérieur.

| Emoji | Nb | Icône | Où |
|---|---|---|---|
| 📞 | 117 | phone | en-tête, pied de page, boutons Appeler |
| 📱 | 75 | smartphone | menu « App », pied de page |
| 🧮 | 37 | calculator | menu « Outils santé » |
| 📍 🕒 ✉ 🌐 | 8 | map-pin, clock, mail, globe | contact, accueil |
| 🩺 🔬 🧪 💉 💊 | 19 | stethoscope, microscope, flask-conical, syringe, pill | services, accueil |
| ❤ 💓 🧠 🦴 🩸 | 9 | heart-pulse, brain, bone, droplet | services, outils |
| 🤝 🏛 🛡 🏥 🩹 🏅 | 13 | handshake, landmark, shield-check, hospital, bandage, award | le centre (partenaires) |
| 🔒 🔐 ⚠ 📄 📅 | 8 | lock, triangle-alert, file-text, calendar | PVVIH, test du sein, services |
| 🎀 🎗 💙 | 10 | ribbon | campagnes, PVVIH |
| autres (🏠 🗣 ⚖ 👫 🍲 🏃 🥗 🚶 🍶 🍎…) | ~20 | house, message-circle, scale, users, soup, activity, salad, footprints, wine-off, apple | au cas par cas |

Résultat : **plus aucun emoji dans l'en-tête ni le pied de page**, soit plus des deux tiers du total traités d'un coup. C'est le changement le plus visible pour le moindre coût.

## Phase 2 — Vraies photos du centre (à prendre par l'équipe, liste ci-dessous)

Avec un téléphone récent, en lumière du jour, à l'horizontale, l'appareil tenu droit. Je recadre, retouche légèrement et compresse.

| # | Photo | Pour remplacer | Page |
|---|---|---|---|
| 1 | Façade + enseigne, de jour | — (renforce l'accueil) | accueil, contact |
| 2 | Accueil avec une personne de l'équipe souriante | 🤝 « on vous écoute » | accueil, le centre |
| 3 | Salle de consultation (table, tensiomètre) | 🩺 médecine générale | accueil, services |
| 4 | **Microscope du laboratoire**, technicien de dos ou de profil | 🔬 🧪 laboratoire | laboratoire, accueil |
| 5 | Automate ou paillasse avec tubes étiquetés (sans nom de patient) | 🧪 bilans | laboratoire |
| 6 | **Échographe** (écran + sonde), sans patiente identifiable | 🖥 📡 échographie | échographie, grossesse |
| 7 | ECG : appareil et tracé | 💓 cardiologie | services |
| 8 | Réfrigérateur à vaccins et thermomètre | 💉 vaccination | accueil, services |
| 9 | Pharmacie communautaire (étagères) | 💊 | services, PVVIH |
| 10 | Sage-femme avec mètre ruban ou Doppler (mains) | 🤰 suivi de grossesse | grossesse |
| 11 | Mains de soignant qui prennent la tension à domicile | 🏠 soins à domicile | services |
| 12 | Bureau de téléconsultation (téléphone, ordinateur) | téléconsultation | téléconsultation |
| 13 | Portrait du Dr DOGBAN en blouse | — (confiance, E-E-A-T) | le centre, articles |
| 14 | Portraits individuels de l'équipe, fond neutre | — | le centre |
| 15 | Salle d'attente propre et lumineuse | — | accueil |

## Phase 3 — Illustrations (style des dessins déjà commandés)

Pour ce qui ne se photographie pas : l'infertilité du couple, la santé mentale, la prévention.

- **11 articles du blog :** une illustration d'en-tête chacun.
- **7 outils santé :** une vignette chacun pour la page /outils, au lieu de ⚖ 🤰 🌸 🩸 👫 🎀 💙.
- **Parcours de l'accueil** (« Je suis enceinte », « Nous voulons un enfant »…) : 6 vignettes.
- Personnages togolais, palette HOSANNA (bleu #003399, vert #2E7D32, jaune #F9A825). Les fichiers seront produits avec les outils de création connectés, puis validés par Gilbert avant intégration.

## Calendrier proposé (un déploiement par phase, pour ménager les crédits Netlify)

| Lot | Contenu | Qui | Mise en ligne |
|---|---|---|---|
| 1 | Icônes (phase 1) + logo WhatsApp | Claude | 1er déploiement du nouveau cycle |
| 2 | Photos réelles (phase 2) | équipe (prises de vue) + Claude (retouche, intégration) | dès réception des photos |
| 3 | Illustrations (phase 3) | Claude (production) + Gilbert (validation) | cycle suivant si besoin |

## Ce qu'il faut de Gilbert

- Faire prendre les photos 1 à 15. Une demi-journée suffit. Les envoyer en taille originale, par Drive ou WhatsApp.
- Obtenir l'accord écrit de toute personne reconnaissable sur une photo, membre de l'équipe compris.
- Valider le style des illustrations, à partir des premiers dessins commandés.
