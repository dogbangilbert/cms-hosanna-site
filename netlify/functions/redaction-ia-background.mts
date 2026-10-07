// Rédaction HOSANNA — génération IA en tâche de fond (jusqu'à 15 minutes)
// Le résultat devient un « Brouillon IA » : jamais publié sans relecture humaine.

import type { Config } from "@netlify/functions";
import { normaliser, vierge } from "../redaction/modele.ts";
import { depot, divers } from "../redaction/stockage.ts";
import { fournisseurIA } from "../redaction/ia.ts";
import { identifier, peut } from "../redaction/auth.ts";

export default async (req: Request) => {
  const u = await identifier(req);
  const { tache, consigne } = await req.json().catch(() => ({}));
  if (!tache) return;
  const finir = (d: object) => divers().setJSON(`ia/${tache}`, d);
  if (!peut(u, "ia")) return finir({ etat: "erreur", erreur: "Accès refusé." });
  const ia = fournisseurIA();
  if (!ia) return finir({ etat: "erreur", erreur: "IA non activée." });
  try {
    const b = await ia.generer(consigne);
    const c = normaliser({
      ...b, status: "brouillon_ia", medical_review_status: "non_relu",
      ai: { provider: ia.nom, model: ia.modele, generated_at: new Date().toISOString(), brief: JSON.stringify(consigne) },
    }, vierge(u!.nom));
    if (b.image_suggestions.length) c.content += `\n\n<!-- Idées d'images : ${b.image_suggestions.join(" ; ")} -->`;
    await depot().enregistrer(c, `IA ${ia.nom} pour ${u!.nom}`);
    await finir({ etat: "termine", id: c.id, titre: c.title });
  } catch (e: any) {
    await finir({ etat: "erreur", erreur: e?.message || "Échec de la génération." });
  }
};

export const config: Config = { background: true };
