// Rédaction HOSANNA — couche de publication
// publier(contenu) ne connaît pas les détails techniques : elle appelle chaque
// « canal » activé. Le site est le seul canal actif aujourd'hui. Facebook, TikTok,
// WhatsApp ou un export vers WordPress/Decap s'ajoutent comme de nouveaux canaux.

import { type Contenu, controlesPublication, urlPublique } from "./modele.ts";
import { depot, divers } from "./stockage.ts";

export interface Canal {
  nom: string;
  actif(): boolean;
  publier(c: Contenu): Promise<string | void>;   // renvoie éventuellement une adresse
  depublier(c: Contenu): Promise<void>;
}

// Résumé public d'un article (carte du blog, plan du site)
export interface Carte { slug: string; title: string; excerpt: string; category: string; image?: string; published_at: string; updated_at: string }

async function reconstruireIndex() {
  const tous = await depot().lister();
  const cartes: Carte[] = tous.filter((c) => c.status === "publie").map((c) => ({
    slug: c.slug, title: c.title, excerpt: c.excerpt, category: c.category,
    image: c.featured_image?.src, published_at: c.published_at || c.updated_at, updated_at: c.updated_at,
  })).sort((a, b) => b.published_at.localeCompare(a.published_at));
  await divers().setJSON("index-publie", cartes);
  return cartes;
}

export async function indexPublic(): Promise<Carte[]> {
  const i = await divers().get("index-publie", { type: "json" });
  return (i as Carte[]) || reconstruireIndex();
}

// Canal 1 : le site cmshosanna.com (pages servies par la fonction redaction-public)
const canalSite: Canal = {
  nom: "site",
  actif: () => true,
  publier: async (c) => { await reconstruireIndex(); return urlPublique(c); },
  depublier: async () => { await reconstruireIndex(); },
};

// Canaux prévus (cahier §27) : désactivés tant qu'aucun accès n'est configuré.
// Pour les activer : variables d'environnement côté serveur, jamais dans le code.
const canalPrevu = (nom: string, variable: string): Canal => ({
  nom,
  actif: () => Boolean(Netlify.env.get(variable)),
  publier: async () => { throw new Error(`Canal ${nom} prévu mais pas encore construit`); },
  depublier: async () => {},
});

export const CANAUX: Canal[] = [
  canalSite,
  canalPrevu("facebook", "FACEBOOK_PAGE_TOKEN"),
  canalPrevu("tiktok", "TIKTOK_ACCESS_TOKEN"),
];

export async function publier(c: Contenu, auteur: string) {
  const manque = controlesPublication(c);
  if (manque.length) return { ok: false, manque };
  c.status = "publie";
  if (!c.published_at) c.published_at = new Date().toISOString();
  c.updated_at = new Date().toISOString();
  await depot().enregistrer(c, auteur);
  const resultats: Record<string, string> = {};
  for (const canal of CANAUX.filter((k) => k.actif())) {
    try { resultats[canal.nom] = (await canal.publier(c)) || "ok"; }
    catch (e: any) { resultats[canal.nom] = "erreur : " + e.message; }
  }
  return { ok: true, url: urlPublique(c), canaux: resultats };
}

export async function depublier(c: Contenu, auteur: string) {
  c.status = "depublie";
  c.updated_at = new Date().toISOString();
  await depot().enregistrer(c, auteur);
  for (const canal of CANAUX.filter((k) => k.actif())) { try { await canal.depublier(c); } catch {} }
  return { ok: true };
}

export { reconstruireIndex };
