#!/usr/bin/env python3
"""Vérifications rapides du site CMS HOSANNA, sans dépendance.

Usage : python3 tools/verifier-site.py   (code de sortie 1 si un contrôle échoue)
Contrôle : bandeau d'information, métadonnées, JSON-LD, sitemap, redirections, liens CGU.
"""
import glob, json, os, re, sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RACINE)
INTERNES = {'redaction.html', 'octobre-rose-equipe.html', 'google82e52ec6811742ef.html'}
echecs = []

def controle(ok, message):
    print(('PASS ' if ok else 'FAIL ') + message)
    if not ok:
        echecs.append(message)

pages = sorted(p for p in glob.glob('*.html') + glob.glob('blog/*.html') if os.path.basename(p) not in INTERNES)

# 1. Bandeau d'information : présent partout, informatif, sans chargement de mesure d'audience
bandeau = open('assets/consent.js', encoding='utf-8').read()
controle("J\\'ai compris" in bandeau or "J'ai compris" in bandeau, "bandeau : bouton « J'ai compris »")
controle('/confidentialite' in bandeau, 'bandeau : lien vers la politique de confidentialité')
controle('localStorage' in bandeau and 'try' in bandeau, 'bandeau : choix mémorisé, stockage protégé par try/catch')
controle('cloudflareinsights' not in bandeau and 'createElement(\'script\')' not in bandeau, 'bandeau : ne charge aucun script de mesure')
sans_bandeau = [p for p in pages if '/assets/consent.js' not in open(p, encoding='utf-8').read() and p != '404.html']
controle(not sans_bandeau, f'bandeau inclus sur toutes les pages publiques {sans_bandeau or ""}')

# 2. Métadonnées et données structurées
for p in pages:
    s = open(p, encoding='utf-8').read()
    titre = re.search(r'<title>([^<]+)</title>', s)
    desc = re.search(r'<meta name="description" content="([^"]+)"', s)
    if not titre or not desc:
        controle(False, f'{p} : titre ou description manquant')
        continue
    if len(desc.group(1)) > 165:
        controle(False, f'{p} : description trop longue ({len(desc.group(1))} caractères)')
    for bloc in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            json.loads(bloc)
        except ValueError as e:
            controle(False, f'{p} : JSON-LD invalide ({e})')
controle(True, f'métadonnées et JSON-LD contrôlés sur {len(pages)} pages')

# 3. Sitemap : chaque URL statique correspond à un fichier
for loc in re.findall(r'<loc>https://cmshosanna\.com(/[^<]*)</loc>', open('sitemap.xml', encoding='utf-8').read()):
    chemin = 'index.html' if loc == '/' else loc.lstrip('/') + '.html'
    if not loc.startswith('/conseils/') and not os.path.exists(chemin):
        controle(False, f'sitemap : {loc} ne correspond à aucun fichier')
controle(True, 'sitemap contrôlé')

# 4. Redirections attendues
redirections = open('_redirects', encoding='utf-8').read()
for regle in ('/produit/*', '/categorie-produit/*', '/category/*', '/blog/spiruline-bienfaits'):
    controle(regle in redirections, f'_redirects contient {regle}')
controle(not os.path.exists('blog/spiruline-bienfaits.html'), 'page statique spiruline supprimée (version de référence : /conseils/)')

# 5. CGU
controle(os.path.exists('cgu.html'), 'page cgu.html présente')
sans_cgu = [p for p in pages if 'href="/cgu"' not in open(p, encoding='utf-8').read() and os.path.basename(p) not in ('octobre-rose.html', 'test-sein.html', 'cgu.html')]
controle(not sans_cgu, f'lien /cgu dans le pied de page {sans_cgu or ""}')

# 6. Campagne du mois : fichier de réglages valide
try:
    import datetime
    camp = json.load(open('assets/campagne.json', encoding='utf-8'))
    manquants = [k for k in ('actif', 'nom', 'offre', 'prix', 'debut', 'fin', 'lien') if k not in camp]
    controle(not manquants, f'campagne.json : champs obligatoires {manquants or ""}')
    d, f = (datetime.date.fromisoformat(camp[k]) for k in ('debut', 'fin'))
    controle(d <= f, 'campagne.json : date de début avant la date de fin')
    controle(str(camp['lien']).startswith('/'), 'campagne.json : lien interne au site')
except (ValueError, KeyError, OSError) as e:
    controle(False, f'campagne.json illisible ({e})')

# 7. Compteur anonyme : événements appelés dans les pages = événements autorisés
autorises = set(re.findall(r'^\s*"([a-z_]+)",', open('netlify/compteur/regles.ts', encoding='utf-8').read(), re.M))
appeles = set()
for p in pages:
    appeles |= set(re.findall(r"hosannaCompte\('([a-z_]+)'\)", open(p, encoding='utf-8').read()))
inconnus = sorted(appeles - autorises)
controle(bool(autorises) and not inconnus, f'compteur : {len(appeles)} événements appelés, tous autorisés {inconnus or ""}')
sans_compteur = [p for p in pages if '/assets/consent.js' in open(p, encoding='utf-8').read() and '/assets/compteur.js' not in open(p, encoding='utf-8').read()]
controle(not sans_compteur, f'compteur.js inclus sur les pages publiques {sans_compteur or ""}')

print(f'\n{len(echecs)} échec(s)')
sys.exit(1 if echecs else 0)
