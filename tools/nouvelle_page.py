#!/usr/bin/env python3
"""Crée une page du site à partir du gabarit de apropos.html (en-tête, pied, styles).

Usage : python3 tools/nouvelle_page.py contenu.html
Le fichier contenu commence par un en-tête de métadonnées :
  fichier: mentions-legales.html
  titre: ...
  description: ...
  menu: (lien du menu à marquer actif, facultatif)
  ---
puis le HTML des sections (hero compris), inséré entre </header> et <footer>.
"""
import html
import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SITE = "https://cmshosanna.com"


def main(source):
    brut = Path(source).read_text(encoding="utf-8")
    entete, corps = brut.split("\n---\n", 1)
    meta = dict(l.split(": ", 1) for l in entete.strip().splitlines())
    fichier = meta["fichier"]
    titre, desc = meta["titre"], meta["description"]
    url = f"{SITE}/{fichier.removesuffix('.html')}"

    s = (RACINE / "apropos.html").read_text(encoding="utf-8")
    t, d = html.escape(titre, quote=True), html.escape(desc, quote=True)
    s = re.sub(r"<title>.*?</title>", f"<title>{t}</title>", s, count=1, flags=re.S)
    s = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?title" content=")[^"]*', rf"\g<1>{t}", s)
    s = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*', rf"\g<1>{d}", s)
    s = re.sub(r'(<link rel="canonical" href=")[^"]*', rf"\g<1>{url}", s)
    s = re.sub(r'(<meta property="og:url" content=")[^"]*', rf"\g<1>{url}", s)
    s = s.replace(' class="active"', "")
    if meta.get("menu"):
        s = s.replace(f'<a href="{meta["menu"]}">', f'<a href="{meta["menu"]}" class="active">', 1)
    debut = s.index("</header>") + len("</header>")
    fin = s.index("<footer>")
    s = s[:debut] + "\n\n" + corps.strip() + "\n\n" + s[fin:]
    (RACINE / fichier).write_text(s, encoding="utf-8")
    print("écrit :", fichier)


if __name__ == "__main__":
    main(sys.argv[1])
