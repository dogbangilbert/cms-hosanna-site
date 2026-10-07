#!/usr/bin/env node
// Dépose un article dans la Rédaction HOSANNA comme brouillon à relire.
// Usage : REDACTION_CLE=<clé> node tools/deposer-brouillon.mjs article.json [https://cmshosanna.com]
// article.json suit le contrat (title, excerpt, category, tags, content en Markdown, faq, sources, social…).
import { readFileSync } from "node:fs";
const [fichier, site = "https://cmshosanna.com"] = process.argv.slice(2);
const cle = process.env.REDACTION_CLE;
if (!fichier || !cle) { console.error("Usage : REDACTION_CLE=<clé> node tools/deposer-brouillon.mjs article.json"); process.exit(1); }
const a = JSON.parse(readFileSync(fichier, "utf8"));
// Garde-fous : jamais publié ni validé depuis l'extérieur, sources à vérifier par un humain
a.status = "brouillon_ia"; a.medical_review_status = "non_relu";
a.sources = (a.sources || []).map((s) => ({ ...s, verified: false }));
a.ai = a.ai || { provider: "claude", model: "conversation", generated_at: new Date().toISOString() };
delete a.id;
const r = await fetch(site + "/api/redaction/contenu", { method: "POST", headers: { "content-type": "application/json", "x-cle-redaction": cle }, body: JSON.stringify(a) });
const d = await r.json();
if (!r.ok) { console.error("Échec :", d.erreur); process.exit(1); }
console.log("Brouillon déposé :", d.contenu.title, "→", site + "/redaction", "(id " + d.contenu.id + ")");
