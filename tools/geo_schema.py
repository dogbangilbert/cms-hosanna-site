#!/usr/bin/env python3
"""Génère et réinjecte les données structurées (JSON-LD) de toutes les pages.

Une seule source de vérité pour l'identité du centre : modifier CENTRE ci-dessous,
puis lancer `python3 tools/geo_schema.py` depuis la racine du dépôt.
Le script remplace le premier bloc JSON-LD de chaque page (ou l'ajoute avant </head>),
répare les liens légaux du pied de page et ajoute la ligne de date des articles.
"""
import html
import json
import re
import subprocess
from datetime import date
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SITE = "https://cmshosanna.com"
MAPS = "https://www.google.com/maps/place/?q=place_id:ChIJYcQs0OrjIxAR3Bw_aQrvbj4"

DIRECTEUR = {
    "@type": "Person",
    "@id": f"{SITE}/#directeur",
    "name": "Gilbert Dogban",
    "jobTitle": "Assistant médical, clinicien, responsable médical du CMS HOSANNA",
    "worksFor": {"@id": f"{SITE}/#centre"},
    "sameAs": ["https://twitter.com/gilbert_dogban"],
}

SERVICES = [
    ("MedicalTherapy", "Consultation de médecine générale"),
    ("MedicalTherapy", "Suivi des maladies chroniques"),
    ("MedicalTherapy", "Consultation gynécologique"),
    ("MedicalTherapy", "Suivi de grossesse et consultations prénatales et postnatales"),
    ("MedicalTherapy", "Accouchement"),
    ("MedicalTherapy", "Planification familiale"),
    ("MedicalTest", "Bilan d'infertilité du couple (femme et homme)"),
    ("MedicalTest", "Dépistage du VIH et des IST, conseil confidentiel"),
    ("MedicalTherapy", "Prise en charge globale des personnes vivant avec le VIH (PVVIH)"),
    ("MedicalTest", "Analyses de laboratoire et bilans de santé complets"),
    ("MedicalTest", "Échographie obstétricale, gynécologique, pelvienne, abdominale, rénale, prostatique et mammaire"),
    ("MedicalTest", "Électrocardiogramme (ECG) avec interprétation"),
    ("MedicalTherapy", "Consultation de cardiologie sur rendez-vous"),
    ("MedicalTherapy", "Consultation de rhumatologie sur rendez-vous"),
    ("MedicalTherapy", "Consultation en santé mentale sur rendez-vous"),
    ("MedicalTherapy", "Orthophonie sur rendez-vous"),
    ("MedicalTherapy", "Kinésithérapie et rééducation fonctionnelle"),
    ("MedicalTherapy", "Vaccination"),
    ("MedicalTherapy", "Téléconsultation 7j/7"),
    ("MedicalTherapy", "Soins et suivi à domicile"),
    ("MedicalTest", "Dépistage du cancer du sein"),
    ("MedicalTherapy", "Pharmacie communautaire : médicaments essentiels génériques"),
]

CENTRE = {
    "@type": ["MedicalClinic", "MedicalOrganization"],
    "@id": f"{SITE}/#centre",
    "name": "Centre Médico-Social HOSANNA",
    "alternateName": ["CMS HOSANNA", "CMSH", "Centre Médico-Social Hosanna Attiégou"],
    "url": f"{SITE}/",
    "logo": f"{SITE}/img/logo-3d-clair.jpg",
    "image": [f"{SITE}/img/batiment-centre.jpg", f"{SITE}/img/equipe-1.jpg"],
    "description": (
        "Centre médico-social privé agréé par l'État togolais, situé à Attiégou (Lomé, Togo). "
        "Médecine générale, gynécologie et maternité, infertilité du couple, prise en charge du VIH, "
        "laboratoire d'analyses sur place, échographie, ECG, cardiologie, rhumatologie, santé mentale, "
        "kinésithérapie, vaccination, téléconsultation et soins à domicile."
    ),
    "telephone": "+22890038313",
    "contactPoint": [
        {"@type": "ContactPoint", "telephone": "+22890038313", "contactType": "rendez-vous",
         "availableLanguage": "fr", "areaServed": "TG"},
        {"@type": "ContactPoint", "telephone": "+22896658989", "contactType": "accueil",
         "availableLanguage": "fr", "areaServed": "TG"},
        {"@type": "ContactPoint", "url": "https://wa.me/22890038313", "contactType": "WhatsApp",
         "availableLanguage": "fr"},
    ],
    "email": "cmshosanna@gmail.com",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Attiégou, non loin de la Gendarmerie d'Adidomé et de l'Église Baptiste la Bénédiction",
        "addressLocality": "Lomé",
        "addressRegion": "Grand Lomé",
        "addressCountry": "TG",
    },
    "geo": {"@type": "GeoCoordinates", "latitude": 6.1718877, "longitude": 1.2716474},
    "hasMap": MAPS,
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59",
    },
    "areaServed": [
        {"@type": "City", "name": "Lomé"},
        {"@type": "Country", "name": "Togo"},
    ],
    "medicalSpecialty": [
        "PrimaryCare", "Gynecologic", "Obstetric", "Midwifery", "Cardiovascular",
        "Rheumatologic", "Psychiatric", "SpeechPathology", "Physiotherapy",
        "LaboratoryScience", "Radiography", "Infectious", "Nursing", "PharmacySpecialty",
        "CommunityHealth",
    ],
    "availableService": [{"@type": t, "name": n} for t, n in SERVICES],
    "identifier": [
        {"@type": "PropertyValue", "propertyID": "Agrément Ministère de la Santé (Togo)",
         "value": "257/2022/MSHP/UA/S/CAB/SG/DGAS/DESR/DREP"},
        {"@type": "PropertyValue", "propertyID": "RCCM", "value": "TG-LFW-01-2024-B13-01025"},
        {"@type": "PropertyValue", "propertyID": "NIF", "value": "1001946957"},
        {"@type": "PropertyValue", "propertyID": "CNSS", "value": "174027"},
    ],
    "employee": {"@id": f"{SITE}/#directeur"},
    "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.4", "reviewCount": "34",
                         "bestRating": "5"},
    "sameAs": [
        MAPS,
        "https://www.facebook.com/cmshosanna",
        "https://www.tiktok.com/@cmshosanna2",
        "https://www.linkedin.com/company/cms-hosanna/",
        "https://www.threads.com/@cmshosanna",
    ],
}

SITE_WEB = {
    "@type": "WebSite",
    "@id": f"{SITE}/#site",
    "url": f"{SITE}/",
    "name": "CMS HOSANNA",
    "inLanguage": "fr",
    "publisher": {"@id": f"{SITE}/#centre"},
}

# Type de page selon le fichier (les articles du blog sont traités à part).
TYPES = {
    "index.html": "WebPage",
    "services.html": "MedicalWebPage",
    "infertilite.html": "MedicalWebPage",
    "pvvih.html": "MedicalWebPage",
    "test-sein.html": "MedicalWebPage",
    "grossesse.html": "MedicalWebPage",
    "echographie.html": "MedicalWebPage",
    "laboratoire.html": "MedicalWebPage",
    "teleconsultation.html": "MedicalWebPage",
    "apropos.html": "AboutPage",
    "contact.html": "ContactPage",
    "temoignages.html": "WebPage",
    "blog.html": "CollectionPage",
    "telecharger.html": "WebPage",
    "mentions-legales.html": "WebPage",
    "confidentialite.html": "WebPage",
}
# Pages laissées telles quelles (non indexées ou schéma spécifique déjà en place).
IGNORER = {"404.html", "octobre-rose.html", "octobre-rose-equipe.html", "redaction.html",
           "google82e52ec6811742ef.html"}

MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
        "septembre", "octobre", "novembre", "décembre"]


def meta(s, nom, attr="name"):
    m = re.search(rf'<meta {attr}="{re.escape(nom)}" content="([^"]*)"', s)
    return html.unescape(m.group(1)) if m else None


def dates_git(chemin):
    def run(*args):
        r = subprocess.run(["git", "log", *args, "--", str(chemin)], cwd=RACINE,
                           capture_output=True, text=True)
        lignes = r.stdout.split()
        return lignes
    crea = run("--diff-filter=A", "--format=%cs")
    modif = run("-1", "--format=%cs")
    aujourd = date.today().isoformat()
    return (crea[-1] if crea else aujourd), (modif[0] if modif else aujourd)


def date_fr(iso):
    a, m, j = iso.split("-")
    return f"{int(j)} {MOIS[int(m) - 1]} {a}"


def bloc(graphe):
    texte = json.dumps({"@context": "https://schema.org", "@graph": graphe},
                       ensure_ascii=False, indent=2).replace("</", "<\\/")
    return f'<script type="application/ld+json">\n{texte}\n</script>'


def injecter(s, nouveau):
    motif = re.compile(r'<script type="application/ld\+json">.*?</script>', re.S)
    if motif.search(s):
        return motif.sub(lambda _: nouveau, s, count=1)
    return s.replace("</head>", nouveau + "\n</head>", 1)


def reparer_pied(s, prefixe):
    s = s.replace('<a href="#">Mentions légales</a>',
                  f'<a href="{prefixe}mentions-legales.html">Mentions légales</a>')
    s = s.replace('<a href="#">Politique de confidentialité</a>',
                  f'<a href="{prefixe}confidentialite.html">Politique de confidentialité</a>')
    return s


def traiter_page(f):
    s = f.read_text(encoding="utf-8")
    url = re.search(r'<link rel="canonical" href="([^"]+)"', s).group(1)
    titre = html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1).strip())
    page = {
        "@type": TYPES.get(f.name, "WebPage"),
        "@id": url + "#page",
        "url": url,
        "name": titre,
        "description": meta(s, "description"),
        "inLanguage": "fr",
        "isPartOf": {"@id": f"{SITE}/#site"},
        "about": {"@id": f"{SITE}/#centre"},
    }
    s = injecter(s, bloc([CENTRE, DIRECTEUR, SITE_WEB, page]))
    f.write_text(reparer_pied(s, ""), encoding="utf-8")


def traiter_article(f):
    s = f.read_text(encoding="utf-8")
    url = re.search(r'<link rel="canonical" href="([^"]+)"', s).group(1)
    h1 = re.sub(r"<[^>]+>", "", re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S).group(1)).strip()
    rubrique = re.search(r'<span class="eyebrow">(.*?)</span>', s)
    publie, modifie = dates_git(f.relative_to(RACINE))
    image = meta(s, "og:image", "property") or f"{SITE}/img/logo-3d-clair.jpg"
    article = {
        "@type": ["MedicalWebPage", "Article"],
        "@id": url + "#article",
        "url": url,
        "headline": html.unescape(h1),
        "description": meta(s, "description"),
        "inLanguage": "fr",
        "image": image,
        "datePublished": publie,
        "dateModified": modifie,
        "author": {"@type": "Organization", "@id": f"{SITE}/#centre", "name": "CMS HOSANNA"},
        "publisher": {"@id": f"{SITE}/#centre"},
        "isPartOf": {"@id": f"{SITE}/#site"},
        "mainEntityOfPage": url,
        "audience": {"@type": "PeopleAudience", "geographicArea": {"@type": "Country", "name": "Togo"}},
    }
    if rubrique:
        article["articleSection"] = html.unescape(rubrique.group(1))
    s = injecter(s, bloc([CENTRE, DIRECTEUR, SITE_WEB, article]))

    # Open Graph : un article est un article.
    s = s.replace('<meta property="og:type" content="website">',
                  '<meta property="og:type" content="article">')
    s = re.sub(r'\n<meta property="article:(published|modified)_time"[^>]*>', "", s)
    s = s.replace('<meta property="og:type" content="article">',
                  '<meta property="og:type" content="article">\n'
                  f'<meta property="article:published_time" content="{publie}">\n'
                  f'<meta property="article:modified_time" content="{modifie}">', 1)

    # Ligne visible : date et éditeur, sous le chapô de l'article.
    ligne = (f'<p class="article-meta" style="font-size:.9rem; opacity:.85; margin-top:10px;">'
             f'Par l\'équipe médicale du CMS HOSANNA · Publié le <time datetime="{publie}">{date_fr(publie)}</time>'
             f' · Mis à jour le <time datetime="{modifie}">{date_fr(modifie)}</time></p>')
    s = re.sub(r'\n?\s*<p class="article-meta"[^\n]*</p>', "", s)
    hero = re.search(r'(<section class="page-hero">.*?)(\n\s*</div>\s*\n</section>)', s, re.S)
    s = s[:hero.end(1)] + "\n    " + ligne + s[hero.end(1):]
    f.write_text(reparer_pied(s, "../"), encoding="utf-8")


def main():
    for f in sorted(RACINE.glob("*.html")):
        if f.name not in IGNORER:
            traiter_page(f)
    for f in sorted((RACINE / "blog").glob("*.html")):
        traiter_article(f)
    for f in ("404.html", "octobre-rose.html"):
        p = RACINE / f
        p.write_text(reparer_pied(p.read_text(encoding="utf-8"), ""), encoding="utf-8")


if __name__ == "__main__":
    main()
