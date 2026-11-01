# Épisode 1 « Minute santé : hépatite B » (« Ton foie ne crie pas »)

État au 1er novembre 2026 : version provisoire, 11 scènes, 1 min 43, format 9:16.
Palette « Site » (bleu HOSANNA, blanc, orange #F9A825). Aucun trait de progression en haut.

## Fichiers
- `voix.txt` : texte lu, une ligne par scène (scène 10 non encore enregistrée).
- `source.html` : page animée (placeholders `__W1__`, `__IMG_foie__`, `{{n:mot}}` remplacés par `build.py`).
- `build.py` : produit `minute-sante-hepatite-b-1.html`, `page-complete.html`, `timing.json` (lit `voix/vN.json`).
- `aligne.py` : minutage mot à mot depuis `voix_el/vN.mp3` (détection des pauses). `estime.py` : minutage estimé sans audio.
- `mix.py` : bande-son (agbadja composée en Python, libre de droits) + voix + bruitages.
- `rendu.py` : rendu image par image (Playwright, 360 x 640, échelle 3) puis ffmpeg.

## À fournir pour reconstruire (non versionnés)
- `logo.jpg` : copie de `img/logo-3d-clair.jpg`.
- `img/foie.jpg`, `couple.jpg`, `flacon.jpg`, `prelevement.jpg` : photos fournies par la direction (droits à confirmer).
- `voix_el/v1.mp3 … v11.mp3` : une voix par scène (voix de Moussa, ElevenLabs, offre gratuite : usage commercial interdit, à passer en offre payante avant publication).

## À valider avant publication
1. « Près de 9 sur 10 l'ignorent » : estimation OMS, chiffre exact à reconfirmer.
2. « 50 à 100 fois plus contagieux que le VIH » : formule OMS, à relire sur la fiche officielle.
3. « Ici, on t'accompagne : bilan du foie, suivi, famille protégée » : à confirmer avec la pratique du centre.
4. « La vaccination protège de plus en plus d'enfants » : pas de chiffre togolais.
5. Droits de la voix (offre ElevenLabs payante) et mention éventuelle de voix générée par IA.
6. Aucun numéro de téléphone dans cette vidéo (choix éditorial). Mention légale en scène finale.

## Reste à faire
- Voix de la scène 10 (texte ligne 10 de `voix.txt`), puis relancer `aligne.py`, `build.py`, `mix.py`, `rendu.py film`.
- Choix des transitions (cercle actuel, fondu ou glissement).
