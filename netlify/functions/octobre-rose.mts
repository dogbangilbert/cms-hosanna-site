// Réservations Octobre rose 2026 — CMS HOSANNA
// 5 places par jour, du 15 au 30 octobre 2026.
// Chaque place est une clé distincte créée avec onlyIfNew : deux personnes
// ne peuvent jamais obtenir la même place, sans compteur à incrémenter.
import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";

const PLACES_PAR_JOUR = 5;
const JOURS: string[] = [];
for (let d = 15; d <= 30; d++) JOURS.push(`2026-10-${String(d).padStart(2, "0")}`);

const AGES = ["moins de 25 ans", "25-39 ans", "40-49 ans", "50 ans et plus"];
const DEJA_FAIT = ["jamais", "il y a plus d'un an", "dans l'année"];
const ANTECEDENT = ["oui", "non", "je ne sais pas"];
const SIGNES = ["aucun", "une boule", "un écoulement", "un changement de la peau ou du mamelon", "autre"];

const store = () => getStore({ name: "octobre-rose-2026", consistency: "strong" });
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// Date du jour à Lomé (UTC+0)
const aujourdhui = () => new Date().toISOString().slice(0, 10);

async function placesPrises(jour: string) {
  const { blobs } = await store().list({ prefix: `places/${jour}/` });
  return blobs.length;
}

async function places() {
  const auj = aujourdhui();
  const jours = await Promise.all(
    JOURS.map(async (jour) => {
      const restantes = jour < auj ? 0 : PLACES_PAR_JOUR - (await placesPrises(jour));
      return { jour, restantes: Math.max(0, restantes), passe: jour < auj };
    })
  );
  return json({ placesParJour: PLACES_PAR_JOUR, jours });
}

const texte = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

async function reserver(req: Request, context: Context) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json({ erreur: "Requête invalide." }, 400);
  }
  if (texte(b.siteweb, 50)) return json({ erreur: "Requête invalide." }, 400); // piège à robots

  const nom = texte(b.nom, 80);
  const telBrut = texte(b.telephone, 30);
  let tel = telBrut.replace(/[^\d]/g, "");
  if (tel.length === 8) tel = "228" + tel;
  const age = texte(b.age, 30);
  const quartier = texte(b.quartier, 60);
  const jour = texte(b.jour, 10);
  const dejaFait = texte(b.dejaFait, 30);
  const antecedent = texte(b.antecedent, 20);
  const signes = Array.isArray(b.signes) ? b.signes.map((s) => texte(s, 60)).filter((s) => SIGNES.includes(s)) : [];
  const signesReels = signes.filter((s) => s !== "aucun");

  if (nom.length < 2) return json({ erreur: "Merci d'indiquer votre nom." }, 400);
  if (tel.length < 11 || tel.length > 15) return json({ erreur: "Numéro de téléphone invalide." }, 400);
  if (!AGES.includes(age)) return json({ erreur: "Merci de choisir votre tranche d'âge." }, 400);
  if (!JOURS.includes(jour)) return json({ erreur: "Merci de choisir un jour." }, 400);
  if (jour < aujourdhui()) return json({ erreur: "Ce jour est déjà passé." }, 400);
  if (!DEJA_FAIT.includes(dejaFait)) return json({ erreur: "Merci de répondre à la question sur les examens passés." }, 400);
  if (!ANTECEDENT.includes(antecedent)) return json({ erreur: "Merci de répondre à la question sur la famille." }, 400);
  if (b.consentement !== true) return json({ erreur: "Merci de cocher la case de consentement." }, 400);

  const s = store();

  // Une seule réservation par numéro
  const dejaReserve = await s.get(`telephones/${tel}`, { type: "json" });
  if (dejaReserve) return json({ dejaReserve: true, ...(dejaReserve as object) });

  const reservation = {
    nom,
    telephone: tel,
    age,
    quartier,
    jour,
    dejaFait,
    antecedent,
    signes: signesReels.length ? signesReels : ["aucun"],
    prioritaire: signesReels.length > 0,
    creeLe: new Date().toISOString(),
  };

  for (let n = 1; n <= PLACES_PAR_JOUR; n++) {
    const ref = `OR-${jour.slice(8)}-${n}`;
    const { modified } = await s.setJSON(`places/${jour}/${n}`, { ...reservation, ref }, { onlyIfNew: true });
    if (modified) {
      await s.setJSON(`telephones/${tel}`, { ref, jour });
      return json({ ok: true, ref, jour, prioritaire: reservation.prioritaire });
    }
  }
  return json({ complet: true, erreur: "Désolé, ce jour vient d'être complet. Choisissez un autre jour." }, 409);
}

// Clé de l'équipe : seule son empreinte SHA-256 figure ici (le dépôt est public).
// Pour changer de clé : variable d'environnement OCTOBRE_ROSE_CLE, ou nouvelle empreinte.
const EMPREINTE_CLE = "e38ec064091cb8bdecd330a211817827209566477a4bf0aee955950ac56b4089";
async function accesEquipe(req: Request) {
  const fournie = req.headers.get("x-cle-equipe") || "";
  if (!fournie) return false;
  const env = Netlify.env.get("OCTOBRE_ROSE_CLE");
  if (env) return fournie === env;
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fournie));
  const hex = [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
  return hex === EMPREINTE_CLE;
}

async function liste(req: Request) {
  if (!(await accesEquipe(req))) return json({ erreur: "Accès refusé." }, 401);
  const s = store();
  const { blobs } = await s.list({ prefix: "places/" });
  const reservations = await Promise.all(blobs.map((x) => s.get(x.key, { type: "json" })));
  reservations.sort((a: any, b: any) => (a.jour + a.ref).localeCompare(b.jour + b.ref));
  return json({ reservations });
}

async function annuler(req: Request) {
  if (!(await accesEquipe(req))) return json({ erreur: "Accès refusé." }, 401);
  const { ref } = await req.json().catch(() => ({ ref: "" }));
  const m = /^OR-(\d{2})-([1-5])$/.exec(String(ref));
  if (!m) return json({ erreur: "Référence invalide." }, 400);
  const s = store();
  const key = `places/2026-10-${m[1]}/${m[2]}`;
  const r = (await s.get(key, { type: "json" })) as any;
  if (!r) return json({ erreur: "Réservation introuvable." }, 404);
  await s.delete(key);
  await s.delete(`telephones/${r.telephone}`);
  return json({ ok: true });
}

export default async (req: Request, context: Context) => {
  const chemin = new URL(req.url).pathname;
  try {
    if (chemin.endsWith("/places") && req.method === "GET") return await places();
    if (chemin.endsWith("/reserver") && req.method === "POST") return await reserver(req, context);
    if (chemin.endsWith("/liste") && req.method === "GET") return await liste(req);
    if (chemin.endsWith("/annuler") && req.method === "POST") return await annuler(req);
    return json({ erreur: "Introuvable." }, 404);
  } catch (e) {
    console.error(e);
    return json({ erreur: "Erreur du serveur. Réessayez ou appelez-nous." }, 500);
  }
};

export const config: Config = {
  path: ["/api/octobre-rose/places", "/api/octobre-rose/reserver", "/api/octobre-rose/liste", "/api/octobre-rose/annuler"],
};
