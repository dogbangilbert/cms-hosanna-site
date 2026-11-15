# Octobre rose : archive de la campagne 2026

**Statut : terminée.** Campagne du 15 au 30 octobre 2026 (réservations ouvertes dès le 7 octobre).
Page : `octobre-rose.html` · Réservations : `netlify/functions/octobre-rose.mts` · Équipe : `octobre-rose-equipe.html`.

## Ce qui a été retiré du site

Le balisage Google `Event` (données structurées) a été retiré de la page publique le 15 novembre 2026,
car il annonçait encore un événement « planifié » alors que la campagne est close.
Le bloc archivé est ci-dessous, tel qu'il était en ligne.

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Octobre rose 2026 : dépistage du cancer du sein au CMS HOSANNA",
  "startDate": "2026-10-15",
  "endDate": "2026-10-30",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "description": "Consultation, examen clinique des seins et échographie mammaire. Forfait 10 000 F CFA. Places limitées, sur réservation.",
  "image": "https://cmshosanna.com/img/octobre-rose-consultation.jpg",
  "location": {
    "@type": "MedicalClinic",
    "name": "Centre Médico-Social HOSANNA",
    "address": {"@type": "PostalAddress", "streetAddress": "Attiégou, non loin de la Gendarmerie d'Adidomé", "addressLocality": "Lomé", "addressCountry": "TG"}
  },
  "offers": {"@type": "Offer", "price": "10000", "priceCurrency": "XOF", "url": "https://cmshosanna.com/octobre-rose", "availability": "https://schema.org/LimitedAvailability", "validFrom": "2026-10-07T00:00:00+00:00"},
  "organizer": {"@type": "MedicalClinic", "name": "CMS HOSANNA", "url": "https://cmshosanna.com/"},
  "performer": {"@type": "MedicalClinic", "name": "CMS HOSANNA, équipe médicale (sages-femmes et médecin gynécologue)", "url": "https://cmshosanna.com/"}
}
```

## Pour l'édition suivante (Octobre rose 2027)

1. Copier le bloc ci-dessus dans la page de campagne, avec les nouvelles dates (`startDate`, `endDate`, `validFrom`), le prix et la description.
2. Mettre `"eventStatus": "https://schema.org/EventScheduled"` seulement pendant la campagne.
3. Après la campagne, repasser le statut à `https://schema.org/EventCancelled` ou retirer le bloc, comme ici.
4. Vérifier le bandeau du site (`assets/vie.js`, dates de fin) et les places (`netlify/functions/octobre-rose.mts`).
5. Ajouter la nouvelle édition au sitemap uniquement pendant la campagne, si la page est remplacée.
