// Compteur d'utilisation anonyme : règles pures (testables sans Netlify).
// Aucune donnée personnelle ni de santé : seulement un nom d'événement, la page d'origine et la date.

// Événements acceptés. Pour un nouvel outil, ajouter une ligne ici (et l'appel hosannaCompte('...') dans la page).
export const EVENEMENTS = [
  "imc_calcul",          // calcul fait dans l'outil IMC
  "grossesse_calcul",    // calcul fait dans l'outil date d'accouchement
  "sein_test_fini",      // test du cancer du sein terminé
  "regles_resultat",     // résultat affiché dans l'outil « Mes règles sont-elles normales ? »
  "infertilite_resultat", // résultat affiché dans l'outil « Infertilité du couple »
  "imprimer_clic",       // bouton « imprimer / PDF » d'un outil
  "rdv_whatsapp_clic",   // clic sur un lien WhatsApp du centre
  "rdv_formulaire",      // envoi du formulaire de rendez-vous (page Contact)
] as const;

export type Evenement = (typeof EVENEMENTS)[number];

export function evenementValide(e: unknown): e is Evenement {
  return typeof e === "string" && (EVENEMENTS as readonly string[]).includes(e);
}

// Page d'origine réduite à un chemin simple ; tout le reste devient « autre ».
export function nettoyerPage(p: unknown): string {
  if (typeof p !== "string") return "autre";
  let c = p.split("?")[0].split("#")[0].toLowerCase().replace(/\.html$/, "");
  if (c.length > 1) c = c.replace(/\/+$/, "");
  if (!/^\/[a-z0-9\/_-]{0,80}$/.test(c)) return "autre";
  return c;
}

// Jour au format AAAA-MM-JJ (UTC = heure de Lomé).
export const jour = (d: Date) => d.toISOString().slice(0, 10);

export type Compteurs = Record<string, number>; // « evenement|page » -> nombre

export function ajouter(c: Compteurs, e: Evenement, page: string): Compteurs {
  const k = e + "|" + page;
  return { ...c, [k]: (c[k] || 0) + 1 };
}

// Résumé lisible : totaux par jour, sur 1, 7 et 30 jours, et détail par page.
export function resumer(parJour: Record<string, Compteurs>, aujourdhui: string) {
  const t = (d: string) => Date.parse(d + "T00:00:00Z");
  const ref = t(aujourdhui);
  const fenetre = (j: number) => (d: string) => ref - t(d) < j * 86400000 && t(d) <= ref;
  const totaux = (filtre: (d: string) => boolean) => {
    const r: Record<string, number> = {};
    for (const [d, c] of Object.entries(parJour)) if (filtre(d))
      for (const [k, n] of Object.entries(c)) { const e = k.split("|")[0]; r[e] = (r[e] || 0) + n; }
    return r;
  };
  const jours: Record<string, Record<string, number>> = {};
  const pages: Record<string, Record<string, number>> = {};
  for (const [d, c] of Object.entries(parJour)) {
    for (const [k, n] of Object.entries(c)) {
      const [e, p] = k.split("|");
      (jours[d] ||= {})[e] = (jours[d][e] || 0) + n;
      if (fenetre(30)(d)) (pages[e] ||= {})[p] = (pages[e][p] || 0) + n;
    }
  }
  return {
    aujourdhui: totaux(fenetre(1)),
    sept_jours: totaux(fenetre(7)),
    trente_jours: totaux(fenetre(30)),
    pages_30_jours: pages,
    par_jour: Object.fromEntries(Object.entries(jours).sort(([a], [b]) => (a < b ? 1 : -1))),
  };
}
