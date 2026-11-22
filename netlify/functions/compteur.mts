// Compteur d'utilisation anonyme du site CMS HOSANNA.
//   POST /api/compteur          { e: "imc_calcul", p: "/imc" }  -> +1 pour ce jour (aucune IP, aucun cookie, aucune valeur saisie)
//   GET  /api/compteur/stats    en-tête x-cle-redaction requis   -> totaux par jour, 7 et 30 jours, détail par page
import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { identifier, peut } from "../redaction/auth.ts";
import { ajouter, evenementValide, jour, nettoyerPage, resumer, type Compteurs } from "../compteur/regles.ts";

const store = () => getStore({ name: "compteur-site", consistency: "strong" });
const json = (d: unknown, status = 200) =>
  new Response(JSON.stringify(d, null, 2), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

export default async (req: Request) => {
  const chemin = new URL(req.url).pathname;

  if (chemin === "/api/compteur" && req.method === "POST") {
    try {
      const brut = await req.text();
      if (brut.length > 300) return new Response(null, { status: 413 });
      const d = JSON.parse(brut);
      if (!evenementValide(d?.e)) return new Response(null, { status: 400 });
      const cle = "jour/" + jour(new Date());
      const s = store();
      const actuel = ((await s.get(cle, { type: "json" })) as Compteurs | null) || {};
      await s.setJSON(cle, ajouter(actuel, d.e, nettoyerPage(d.p)));
      return new Response(null, { status: 204 });
    } catch {
      return new Response(null, { status: 400 });
    }
  }

  if (chemin === "/api/compteur/stats" && req.method === "GET") {
    const u = await identifier(req);
    if (!peut(u, "lire")) return json({ erreur: "Clé de la Rédaction requise (en-tête x-cle-redaction)." }, 401);
    const nb = Math.min(400, Math.max(1, parseInt(new URL(req.url).searchParams.get("jours") || "60", 10) || 60));
    const s = store(), parJour: Record<string, Compteurs> = {};
    const maintenant = new Date();
    for (let i = 0; i < nb; i++) {
      const d = jour(new Date(maintenant.getTime() - i * 86400000));
      const c = (await s.get("jour/" + d, { type: "json" })) as Compteurs | null;
      if (c) parJour[d] = c;
    }
    return json({ genere_le: maintenant.toISOString(), periode_jours: nb, ...resumer(parJour, jour(maintenant)) });
  }

  return new Response("Introuvable", { status: 404 });
};

export const config: Config = { path: ["/api/compteur", "/api/compteur/stats"] };
