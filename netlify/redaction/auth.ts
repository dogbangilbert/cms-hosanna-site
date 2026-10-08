// Rédaction HOSANNA — accès et rôles (cahier §20)
// Chaque personne a sa propre clé. Seule l'empreinte SHA-256 de la clé figure ici
// (le dépôt peut être public). Pour ajouter quelqu'un : générer une clé, calculer
// son empreinte (voir docs/REDACTION-HOSANNA.md) et l'ajouter à la liste,
// ou définir la variable d'environnement REDACTION_UTILISATEURS (même format JSON).

export type Role = "administrateur" | "redacteur" | "reviseur" | "editeur";

export interface Utilisateur { nom: string; role: Role; empreinte: string }

const UTILISATEURS: Utilisateur[] = [
  { nom: "Gilbert Dogban", role: "administrateur", empreinte: "1d33f5c94599a4f73128a334d285b6b65502b93612c6956f33b02cc90de97855" },
];

// Ce que chaque rôle peut faire
const DROITS: Record<Role, string[]> = {
  administrateur: ["lire", "ecrire", "relire", "publier", "supprimer", "ia", "exporter"],
  editeur: ["lire", "ecrire", "publier", "ia"],
  reviseur: ["lire", "relire"],
  redacteur: ["lire", "ecrire", "ia"],
};

async function sha256(t: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Clé administrateur définie dans Netlify (variable REDACTION_CLE_ADMIN, 12 caractères minimum).
// Dès qu'elle existe, la clé d'origine inscrite ci-dessus cesse de fonctionner.
function cleAdmin(): string { try { const k = (Netlify.env.get("REDACTION_CLE_ADMIN") || "").trim(); return k.length >= 12 ? k : ""; } catch { return ""; } }
const NOM_ADMIN = () => { try { return Netlify.env.get("REDACTION_NOM_ADMIN") || "Gilbert Dogban"; } catch { return "Gilbert Dogban"; } };

function liste(): Utilisateur[] {
  try {
    const env = Netlify.env.get("REDACTION_UTILISATEURS");
    if (env) return [...UTILISATEURS, ...JSON.parse(env)];
  } catch {}
  return UTILISATEURS;
}

export async function identifier(req: Request): Promise<Utilisateur | null> {
  const cle = (req.headers.get("x-cle-redaction") || "").trim();
  if (cle.length < 10) return null;
  const e = await sha256(cle);
  const admin = cleAdmin();
  if (admin) {
    if (e === (await sha256(admin))) return { nom: NOM_ADMIN(), role: "administrateur", empreinte: e };
    return liste().filter((u) => !UTILISATEURS.includes(u)).find((u) => u.empreinte === e) || null;
  }
  return liste().find((u) => u.empreinte === e) || null;
}

export const peut = (u: Utilisateur | null, action: string) => !!u && DROITS[u.role].includes(action);
