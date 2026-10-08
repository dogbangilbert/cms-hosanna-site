// Rédaction HOSANNA — assistance IA interchangeable (cahier §7 et §25)
// L'éditorial ne connaît que l'interface AIProvider. Le fournisseur est choisi
// par la variable d'environnement AI_PROVIDER (claude, openai, gemini).
// Sans AI_PROVIDER ni clé, l'IA est simplement désactivée : tout le reste fonctionne.
// Les clés restent côté serveur (variables Netlify), jamais dans le navigateur ni dans GitHub.

export interface Consigne {
  sujet: string; public: string; objectif: string;
  longueur: "court" | "moyen" | "long" | "personnalise"; mots?: number;
  ton: string; instructions?: string;
}

export interface Brouillon {
  title: string; excerpt: string; category: string; tags: string[];
  content: string; faq: { question: string; answer: string }[];
  seo_title: string; seo_description: string; slug: string;
  cta: { text: string; whatsapp_message: string };
  sources: { title: string; url?: string; verified: false }[];
  image_suggestions: string[]; image_alt: string;
  social: { facebook: string; tiktok: string; whatsapp: string };
}

export interface AIProvider {
  nom: string; modele: string;
  generer(consigne: Consigne): Promise<Brouillon>;
}

const MOTS = { court: 500, moyen: 900, long: 1400, personnalise: 900 };

export function construireInstructions(c: Consigne): { systeme: string; utilisateur: string } {
  const mots = c.longueur === "personnalise" && c.mots ? c.mots : MOTS[c.longueur] || 900;
  const systeme = `Tu es l'assistant éditorial du Centre Médico-Social HOSANNA (CMS HOSANNA), à Attiégou, Lomé, Togo.
Tu rédiges en français des articles de santé pour le grand public d'Afrique de l'Ouest francophone.
Règles impératives :
- Information générale, jamais de diagnostic individuel ni de posologie personnalisée. Inviter à consulter.
- Ne jamais inventer de source, d'étude, de chiffre ou de citation. Si tu proposes une référence, c'est une piste à vérifier par un humain (OMS, HAS, sociétés savantes, publications précises si tu en es sûr).
- Les résultats d'études s'écrivent au passé et sont attribués à leurs auteurs.
- Ne jamais écrire « Dr » pour l'équipe du centre. Contacts : 90 03 83 13 / 96 65 89 89, WhatsApp 90 03 83 13.
- Style humain, clair, chaleureux ; pas de tirets cadratins répétés, pas de formules creuses.
- Tenir compte du contexte local (Togo, Lomé, ressources limitées, croyances fréquentes).
Réponds UNIQUEMENT par un objet JSON valide, sans texte autour.`;
  const utilisateur = `Rédige un article.
Sujet : ${c.sujet}
Public : ${c.public}
Objectif : ${c.objectif}
Longueur visée : environ ${mots} mots pour le corps de l'article
Ton : ${c.ton}
${c.instructions ? "Instructions complémentaires : " + c.instructions : ""}

Format JSON attendu :
{
 "title": "titre accrocheur et exact (60 caractères environ)",
 "excerpt": "résumé de 2 phrases",
 "category": "une catégorie courte",
 "tags": ["3 à 6 mots-clés"],
 "content": "article en Markdown : introduction, intertitres ## , listes si utile, conclusion avec invitation à consulter",
 "faq": [{"question": "...", "answer": "..."}],
 "seo_title": "max 60 caractères, inclure Lomé si pertinent",
 "seo_description": "max 155 caractères",
 "slug": "adresse-courte-en-minuscules",
 "cta": {"text": "phrase d'appel à l'action", "whatsapp_message": "message prérempli pour WhatsApp"},
 "sources": [{"title": "référence à vérifier", "url": "adresse si connue avec certitude"}],
 "image_suggestions": ["idée d'image 1", "idée d'image 2"],
 "image_alt": "description courte de l'image idéale, pour les personnes malvoyantes",
 "social": {"facebook": "publication Facebook détaillée mais pas trop longue", "tiktok": "script vidéo TikTok de 45 secondes", "whatsapp": "message court pour statut ou diffusion WhatsApp"}
}
Mets 4 à 6 questions dans la FAQ.`;
  return { systeme, utilisateur };
}

function extraireJson(t: string): any {
  const debut = t.indexOf("{"), fin = t.lastIndexOf("}");
  if (debut < 0 || fin < debut) throw new Error("Réponse IA illisible (pas de JSON). Réessayez.");
  try { return JSON.parse(t.slice(debut, fin + 1)); }
  catch { throw new Error("Réponse IA illisible (JSON incomplet ou coupé). Réessayez, éventuellement avec une longueur plus courte."); }
}

// Délai maximal d'un appel au fournisseur : au-delà, on abandonne avec un message clair
const DELAI_MS = 150000;
const appel = async (nom: string, url: string, init: RequestInit) => {
  try { return await fetch(url, { ...init, signal: AbortSignal.timeout(DELAI_MS) }); }
  catch (e: any) { throw new Error(e?.name === "TimeoutError" ? `${nom} n'a pas répondu en ${DELAI_MS / 1000} secondes. Réessayez.` : `${nom} injoignable : ${e?.message || "erreur réseau"}`); }
};

function versBrouillon(j: any): Brouillon {
  // Une réponse sans titre ou sans vrai texte n'est pas un article : on refuse plutôt que de créer un brouillon vide
  if (!String(j?.title || "").trim()) throw new Error("Réponse IA incomplète : titre manquant. Réessayez.");
  if (String(j?.content || "").trim().length < 300) throw new Error("Réponse IA incomplète : texte absent ou trop court. Réessayez.");
  return {
    title: String(j.title || ""), excerpt: String(j.excerpt || ""), category: String(j.category || ""),
    tags: Array.isArray(j.tags) ? j.tags.map(String) : [], content: String(j.content || ""),
    faq: Array.isArray(j.faq) ? j.faq.map((f: any) => ({ question: String(f.question || ""), answer: String(f.answer || "") })) : [],
    seo_title: String(j.seo_title || ""), seo_description: String(j.seo_description || ""), slug: String(j.slug || ""),
    cta: { text: String(j.cta?.text || ""), whatsapp_message: String(j.cta?.whatsapp_message || "") },
    // Toute source issue de l'IA est marquée « à vérifier » (cahier §6)
    sources: Array.isArray(j.sources) ? j.sources.map((s: any) => ({ title: String(s.title || s), url: s.url ? String(s.url) : undefined, verified: false as const })) : [],
    image_suggestions: Array.isArray(j.image_suggestions) ? j.image_suggestions.map(String) : [], image_alt: String(j.image_alt || ""),
    social: { facebook: String(j.social?.facebook || ""), tiktok: String(j.social?.tiktok || ""), whatsapp: String(j.social?.whatsapp || "") },
  };
}

class ClaudeProvider implements AIProvider {
  nom = "claude";
  constructor(private cle: string, public modele: string) {}
  async generer(c: Consigne) {
    const { systeme, utilisateur } = construireInstructions(c);
    const r = await appel("Claude", "https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": this.cle, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: this.modele, max_tokens: 8000, system: systeme, messages: [{ role: "user", content: utilisateur }] }),
    });
    if (!r.ok) throw new Error(`Claude : ${r.status} ${(await r.text()).slice(0, 300)}`);
    const d = await r.json();
    if (d.stop_reason === "max_tokens") throw new Error("L'article demandé est trop long : la réponse a été coupée. Choisissez une longueur plus courte.");
    return versBrouillon(extraireJson((d.content || []).map((x: any) => x.text || "").join("")));
  }
}

class OpenAIProvider implements AIProvider {
  nom = "openai";
  constructor(private cle: string, public modele: string) {}
  async generer(c: Consigne) {
    const { systeme, utilisateur } = construireInstructions(c);
    const r = await appel("OpenAI", "https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${this.cle}`, "content-type": "application/json" },
      body: JSON.stringify({ model: this.modele, response_format: { type: "json_object" }, messages: [{ role: "system", content: systeme }, { role: "user", content: utilisateur }] }),
    });
    if (!r.ok) throw new Error(`OpenAI : ${r.status} ${(await r.text()).slice(0, 300)}`);
    const d = await r.json();
    return versBrouillon(extraireJson(d.choices?.[0]?.message?.content || ""));
  }
}

class GeminiProvider implements AIProvider {
  nom = "gemini";
  constructor(private cle: string, public modele: string) {}
  async generer(c: Consigne) {
    const { systeme, utilisateur } = construireInstructions(c);
    const r = await appel("Gemini", `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.modele)}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": this.cle, "content-type": "application/json" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: systeme }] }, contents: [{ role: "user", parts: [{ text: utilisateur }] }], generationConfig: { responseMimeType: "application/json" } }),
    });
    if (!r.ok) throw new Error(`Gemini : ${r.status} ${(await r.text()).slice(0, 300)}`);
    const d = await r.json();
    return versBrouillon(extraireJson(d.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || ""));
  }
}

// Choix du fournisseur par configuration. Renvoie null si l'IA n'est pas activée.
export function fournisseurIA(): AIProvider | null {
  const choix = (Netlify.env.get("AI_PROVIDER") || "").toLowerCase();
  const modele = Netlify.env.get("AI_MODEL") || "";
  if (choix === "claude" && Netlify.env.get("CLAUDE_API_KEY")) return new ClaudeProvider(Netlify.env.get("CLAUDE_API_KEY")!, modele || "claude-sonnet-5-5");
  if (choix === "openai" && Netlify.env.get("OPENAI_API_KEY")) return new OpenAIProvider(Netlify.env.get("OPENAI_API_KEY")!, modele || "gpt-4o-mini");
  if (choix === "gemini" && Netlify.env.get("GEMINI_API_KEY")) return new GeminiProvider(Netlify.env.get("GEMINI_API_KEY")!, modele || "gemini-2.0-flash");
  return null;
}
