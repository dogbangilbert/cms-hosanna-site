// Rédaction HOSANNA — API privée de l'interface éditoriale (/api/redaction/*)
// Toutes les routes exigent une clé personnelle (en-tête x-cle-redaction).

import type { Config } from "@netlify/functions";
import { normaliser, vierge, controlesPublication, STATUTS, CATEGORIES, PROFESSIONS, urlPublique, versWordPress, type Contenu } from "../redaction/modele.ts";
import { depot, mediatheque, divers } from "../redaction/stockage.ts";
import { publier, depublier, reconstruireIndex, CANAUX } from "../redaction/publication.ts";
import { fournisseurIA, type Consigne } from "../redaction/ia.ts";
import { identifier, peut } from "../redaction/auth.ts";
import { pageArticle } from "../redaction/rendu.ts";

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const refus = (m = "Accès refusé.") => json({ erreur: m }, 403);

const TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE = 3 * 1024 * 1024, MAX_PDF = 4 * 1024 * 1024;

export default async (req: Request) => {
  const u = await identifier(req);
  if (!u) return json({ erreur: "Clé incorrecte." }, 401);
  const chemin = new URL(req.url).pathname.replace(/^\/api\/redaction\/?/, "");
  const [route, param] = chemin.split("/");
  const corps = async () => { try { return await req.json(); } catch { return {}; } };
  const auteur = `${u.nom} (${u.role})`;

  try {
    // Session et paramètres de l'interface
    if (route === "moi") return json({
      nom: u.nom, role: u.role, statuts: STATUTS, categories: CATEGORIES, professions: PROFESSIONS,
      ia: (() => { const p = fournisseurIA(); return p ? { active: true, fournisseur: p.nom, modele: p.modele } : { active: false }; })(),
      canaux: CANAUX.map((c) => ({ nom: c.nom, actif: c.actif() })),
    });

    if (route === "contenus" && req.method === "GET") {
      if (!peut(u, "lire")) return refus();
      const tous = await depot().lister();
      const compte: Record<string, number> = {};
      for (const s of STATUTS) compte[s] = 0;
      tous.forEach((c) => compte[c.status]++);
      return json({ compte, contenus: tous.map((c) => ({ id: c.id, title: c.title || "(sans titre)", status: c.status, category: c.category, updated_at: c.updated_at, slug: c.slug, medical_review_status: c.medical_review_status, image: c.featured_image?.src, ai: !!c.ai })) });
    }

    if (route === "contenu" && req.method === "GET") {
      if (!peut(u, "lire")) return refus();
      const c = param ? await depot().lire(param) : vierge(u.nom);
      return c ? json({ contenu: c, controles: controlesPublication(c), url: urlPublique(c) }) : json({ erreur: "Introuvable." }, 404);
    }

    if (route === "contenu" && req.method === "POST") {
      if (!peut(u, "ecrire") && !peut(u, "relire")) return refus();
      let e = await corps();
      const ancien = e.id ? await depot().lire(e.id) : null;
      if (!peut(u, "ecrire")) {
        // Rôle réviseur : ne touche qu'à la relecture médicale, pas au texte
        if (!ancien) return refus("Votre rôle permet de relire, pas de créer un article.");
        if (ancien.status === "publie") return refus("Cet article est déjà en ligne.");
        e = { id: ancien.id, medical_reviewer: e.medical_reviewer, medical_review_status: e.medical_review_status, status: ["a_relire", "valide"].includes(e.status) ? e.status : ancien.status };
      }
      const c = normaliser(e, ancien || vierge(u.nom));
      // Seul un rôle « relire » peut valider médicalement ; seule la publication met « publie »
      if (!peut(u, "relire") && c.medical_review_status === "valide" && ancien?.medical_review_status !== "valide") c.medical_review_status = ancien?.medical_review_status || "non_relu";
      if (c.status === "publie" && ancien?.status !== "publie") c.status = ancien?.status || "brouillon";
      if (ancien?.status === "publie" && !peut(u, "publier")) return refus("Cet article est en ligne : seule une personne autorisée à publier peut le modifier.");
      // La date de relecture est posée au moment de la validation
      if (c.medical_review_status === "valide" && c.medical_reviewer && !c.medical_reviewer.date) c.medical_reviewer.date = new Date().toISOString().slice(0, 10);
      if (c.status === "publie") {
        // Article en ligne modifié : il doit rester conforme, sinon on refuse l'enregistrement
        const manque = controlesPublication(c);
        if (manque.length) return json({ erreur: "Cet article est en ligne. Pour l'enregistrer ainsi il manque : " + manque.join(", ") + ". Dépubliez-le d'abord si vous voulez le retravailler.", manque }, 400);
        await publier(c, auteur);
      } else {
        await depot().enregistrer(c, auteur);
        if (ancien?.status === "publie") await reconstruireIndex(); // retiré du site
      }
      return json({ ok: true, contenu: c, controles: controlesPublication(c), url: urlPublique(c) });
    }

    if (route === "publier" && req.method === "POST") {
      if (!peut(u, "publier")) return refus("Votre rôle ne permet pas de publier.");
      const c = await depot().lire(param); if (!c) return json({ erreur: "Introuvable." }, 404);
      const r = await publier(c, auteur);
      return r.ok ? json(r) : json({ erreur: "Avant de publier, il manque : " + r.manque!.join(", ") + ".", manque: r.manque }, 400);
    }

    if (route === "depublier" && req.method === "POST") {
      if (!peut(u, "publier")) return refus();
      const c = await depot().lire(param); if (!c) return json({ erreur: "Introuvable." }, 404);
      return json(await depublier(c, auteur));
    }

    if (route === "supprimer" && req.method === "POST") {
      if (!peut(u, "supprimer")) return refus();
      const c = await depot().lire(param);
      if (c?.status === "publie") return json({ erreur: "Dépubliez d'abord l'article." }, 400);
      await depot().supprimer(param);
      return json({ ok: true });
    }

    if (route === "versions" && req.method === "GET") {
      if (!peut(u, "lire")) return refus();
      return json({ versions: await depot().versions(param) });
    }

    if (route === "restaurer" && req.method === "POST") {
      if (!peut(u, "ecrire")) return refus();
      const { cle } = await corps();
      const v = await depot().lireVersion(String(cle || ""));
      const actuel = await depot().lire(param);
      if (!v || !actuel || v.id !== actuel.id) return json({ erreur: "Version introuvable." }, 404);
      // La version restaurée redevient un brouillon : elle doit être relue avant de repartir en ligne
      const c = normaliser({ ...v, status: actuel.status === "publie" ? "a_relire" : v.status, medical_review_status: "en_relecture" }, actuel);
      await depot().enregistrer(c, auteur);
      if (actuel.status === "publie") await reconstruireIndex();
      return json({ ok: true, contenu: c });
    }

    if (route === "media" && req.method === "POST") {
      if (!peut(u, "ecrire")) return refus();
      const { nom, type, base64 } = await corps();
      const donnees = Uint8Array.from(atob(String(base64 || "")), (ch) => ch.charCodeAt(0));
      const estPdf = type === "application/pdf";
      if (!estPdf && !TYPES_IMAGE.includes(type)) return json({ erreur: "Format non accepté (images JPEG, PNG, WebP ou PDF)." }, 400);
      if (donnees.byteLength > (estPdf ? MAX_PDF : MAX_IMAGE)) return json({ erreur: estPdf ? "PDF trop lourd (4 Mo maximum)." : "Image trop lourde (3 Mo maximum)." }, 400);
      const ext = estPdf ? "pdf" : type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
      const base = String(nom || "fichier").replace(/\.[a-z0-9]+$/i, "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) || "fichier";
      const fichier = `${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 7)}-${base}.${ext}`;
      const src = await mediatheque().deposer(fichier, donnees.buffer, type);
      return json({ ok: true, src, taille: donnees.byteLength });
    }

    if (route === "apercu" && req.method === "POST") {
      if (!peut(u, "lire")) return refus();
      const e = await corps();
      const base = e.id ? await depot().lire(e.id) : null;
      const c = normaliser(e, base || undefined);
      const jeton = crypto.randomUUID();
      await divers().set(`apercus/${jeton}`, pageArticle(c, { apercu: true }), { metadata: { expire: Date.now() + 2 * 3600e3 } });
      return json({ ok: true, url: `/conseils/apercu/${jeton}` });
    }

    // IA : lancement en tâche de fond (la rédaction peut prendre plus d'une minute)
    if (route === "ia" && req.method === "POST") {
      if (!peut(u, "ia")) return refus();
      if (!fournisseurIA()) return json({ erreur: "L'IA n'est pas encore activée sur le site. En attendant, demandez l'article à Claude dans la conversation : il le déposera ici comme brouillon." }, 400);
      const consigne = (await corps()) as Consigne;
      if (!consigne?.sujet) return json({ erreur: "Indiquez au moins le sujet." }, 400);
      const tache = crypto.randomUUID();
      await divers().setJSON(`ia/${tache}`, { etat: "en_cours", debut: new Date().toISOString(), auteur });
      await fetch(new URL("/.netlify/functions/redaction-ia-background", req.url), {
        method: "POST", headers: { "content-type": "application/json", "x-cle-redaction": req.headers.get("x-cle-redaction")! },
        body: JSON.stringify({ tache, consigne, auteur: u.nom }),
      });
      return json({ ok: true, tache });
    }

    if (route === "ia" && req.method === "GET") {
      if (!peut(u, "ia")) return refus();
      return json((await divers().get(`ia/${param}`, { type: "json" })) || { etat: "inconnue" });
    }

    // Export complet et portable (cahier §9) : Markdown + JSON + correspondance WordPress
    if (route === "export" && req.method === "GET") {
      if (!peut(u, "exporter")) return refus();
      const tous = await depot().lister();
      return json({
        format: "Rédaction HOSANNA, contrat v1 (Markdown + YAML)", genere_le: new Date().toISOString(),
        fichiers: await depot().exporterMarkdown(),
        json: tous,
        wordpress: tous.map(versWordPress),
      });
    }

    return json({ erreur: "Route inconnue." }, 404);
  } catch (e: any) {
    console.error(e);
    return json({ erreur: "Erreur du serveur : " + (e?.message || "inconnue") }, 500);
  }
};

export const config: Config = { path: ["/api/redaction", "/api/redaction/*"] };
