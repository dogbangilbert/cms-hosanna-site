// Rédaction HOSANNA — contrat de données éditoriales
// ---------------------------------------------------
// Chaque contenu est un fichier Markdown : un en-tête YAML (front matter)
// contenant tous les champs, puis le texte de l'article en Markdown.
// Ce format est lisible par Decap CMS, Hugo, Eleventy, Astro, et convertible
// vers WordPress (voir versWordPress). Rien d'essentiel n'est stocké ailleurs.
// Documentation complète : docs/REDACTION-HOSANNA.md

import { parse as yamlParse, stringify as yamlStringify } from "yaml";

export const VERSION_CONTRAT = 1;

// Circuit éditorial (cahier des charges §4)
export const STATUTS = [
  "brouillon_ia",   // produit par une IA, jamais relu
  "brouillon",      // en cours d'écriture
  "a_relire",       // envoyé en relecture
  "valide",         // validé médicalement
  "pret",           // prêt à publier
  "publie",         // en ligne
  "depublie",       // retiré du site, conservé
] as const;
export type Statut = (typeof STATUTS)[number];

export const STATUTS_RELECTURE = ["non_relu", "en_relecture", "valide"] as const;
export type StatutRelecture = (typeof STATUTS_RELECTURE)[number];

export interface Image { src: string; alt: string; caption?: string; credit?: string }
export interface Faq { question: string; answer: string }
export interface Source { title: string; url?: string; verified: boolean }
export interface Pdf { src: string; title: string; description?: string; size?: number }
export interface Relecteur { name: string; profession: string; date?: string }

export interface Contenu {
  // Identité
  id: string;
  type: "article";
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  // Médias
  featured_image?: Image;
  pdf?: Pdf;
  // Texte (Markdown)
  content: string;
  // Responsabilité éditoriale et médicale
  author: string;
  medical_reviewer?: Relecteur;
  medical_review_status: StatutRelecture;
  status: Statut;
  // Dates (ISO 8601)
  created_at: string;
  updated_at: string;
  published_at?: string;
  // Référencement
  seo_title: string;
  seo_description: string;
  canonical_url?: string;
  og_image?: string;
  // Compléments
  faq: Faq[];
  sources: Source[];
  cta: { text: string; whatsapp_message: string };
  social: { facebook: string; tiktok: string; whatsapp: string };
  // Traçabilité IA (jamais une validation)
  ai?: { provider: string; model: string; generated_at: string; brief?: string };
  contract_version: number;
}

export const SITE = "https://cmshosanna.com";
export const CHEMIN_PUBLIC = "/conseils/"; // adresse publique des articles

export const CATEGORIES = [
  "Grossesse & maternité", "Fertilité", "Santé de la femme", "Dépistage", "Prévention",
  "Maladies chroniques", "Nutrition", "Plantes médicinales", "Santé de l'homme", "Enfants", "Actualités du centre",
];

export const PROFESSIONS = [
  "Assistant médical, clinicien", "Médecin gynécologue", "Sage-femme", "Échographiste",
  "Infirmier ou infirmière", "Technicien de laboratoire", "Équipe médicale du CMS Hosanna",
];

const texte = (v: unknown, max = 20000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const lignes = (v: unknown, max = 600) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : "");

export function slugifier(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/['’]/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "article";
}

export function nouvelId(): string {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${d}-${Math.random().toString(36).slice(2, 8)}`;
}

// Valeurs par défaut d'un nouvel article
export function vierge(auteur: string): Contenu {
  const maintenant = new Date().toISOString();
  return {
    id: nouvelId(), type: "article", title: "", slug: "", excerpt: "", category: "", tags: [],
    content: "", author: auteur || "CMS HOSANNA",
    medical_reviewer: { name: "Assistant médical Gilbert Dogban", profession: "Assistant médical, clinicien" },
    medical_review_status: "non_relu", status: "brouillon",
    created_at: maintenant, updated_at: maintenant,
    seo_title: "", seo_description: "", faq: [], sources: [],
    cta: { text: "Une question après cette lecture ? Écrivez-nous sur WhatsApp.", whatsapp_message: "Bonjour CMS HOSANNA, je viens de lire votre article et j'aimerais en savoir plus." },
    social: { facebook: "", tiktok: "", whatsapp: "" },
    contract_version: VERSION_CONTRAT,
  };
}

// Nettoie et complète n'importe quelle entrée (formulaire, IA, import) selon le contrat
export function normaliser(e: any, base?: Contenu): Contenu {
  const b = base || vierge(texte(e?.author, 120));
  const img = (i: any): Image | undefined => i && texte(i.src, 500) ? { src: texte(i.src, 500), alt: texte(i.alt, 300), caption: texte(i.caption, 300) || undefined, credit: texte(i.credit, 200) || undefined } : undefined;
  const title = texte(e?.title ?? b.title, 200);
  const c: Contenu = {
    ...b,
    id: texte(e?.id, 60) || b.id,
    title,
    slug: slugifier(texte(e?.slug, 120) || title || b.slug),
    excerpt: lignes(e?.excerpt ?? b.excerpt, 600),
    category: texte(e?.category ?? b.category, 80),
    tags: (Array.isArray(e?.tags) ? e.tags : typeof e?.tags === "string" ? e.tags.split(",") : b.tags)
      .map((t: any) => texte(t, 60)).filter(Boolean).slice(0, 20),
    featured_image: "featured_image" in (e || {}) ? img(e.featured_image) : b.featured_image,
    pdf: "pdf" in (e || {}) ? (e.pdf && texte(e.pdf.src, 500) ? { src: texte(e.pdf.src, 500), title: texte(e.pdf.title, 200) || "Document", description: texte(e.pdf.description, 500) || undefined, size: Number(e.pdf.size) || undefined } : undefined) : b.pdf,
    content: typeof e?.content === "string" ? e.content.replace(/\r\n/g, "\n").slice(0, 100000) : b.content,
    author: texte(e?.author, 120) || b.author,
    medical_reviewer: e?.medical_reviewer ? { name: texte(e.medical_reviewer.name, 120), profession: texte(e.medical_reviewer.profession, 120), date: texte(e.medical_reviewer.date, 30) || undefined } : b.medical_reviewer,
    medical_review_status: (STATUTS_RELECTURE as readonly string[]).includes(e?.medical_review_status) ? e.medical_review_status : b.medical_review_status,
    status: (STATUTS as readonly string[]).includes(e?.status) ? e.status : b.status,
    seo_title: texte(e?.seo_title ?? b.seo_title, 120),
    seo_description: lignes(e?.seo_description ?? b.seo_description, 320),
    canonical_url: texte(e?.canonical_url, 300) || undefined,
    og_image: texte(e?.og_image, 500) || undefined,
    faq: (Array.isArray(e?.faq) ? e.faq : b.faq).map((f: any) => ({ question: texte(f?.question, 300), answer: lignes(f?.answer, 3000) })).filter((f: Faq) => f.question && f.answer).slice(0, 30),
    sources: (Array.isArray(e?.sources) ? e.sources : b.sources).map((s: any) => ({ title: texte(s?.title, 400), url: texte(s?.url, 500) || undefined, verified: s?.verified === true })).filter((s: Source) => s.title).slice(0, 40),
    cta: { text: texte(e?.cta?.text ?? b.cta.text, 300), whatsapp_message: texte(e?.cta?.whatsapp_message ?? b.cta.whatsapp_message, 500) },
    social: { facebook: lignes(e?.social?.facebook ?? b.social.facebook, 5000), tiktok: lignes(e?.social?.tiktok ?? b.social.tiktok, 5000), whatsapp: lignes(e?.social?.whatsapp ?? b.social.whatsapp, 3000) },
    ai: e?.ai ? { provider: texte(e.ai.provider, 40), model: texte(e.ai.model, 80), generated_at: texte(e.ai.generated_at, 40), brief: texte(e.ai.brief, 2000) || undefined } : b.ai,
    created_at: b.created_at,
    updated_at: new Date().toISOString(),
    published_at: b.published_at,
    contract_version: VERSION_CONTRAT,
  };
  if (!c.seo_title) c.seo_title = c.title.slice(0, 70);
  if (!c.seo_description) c.seo_description = c.excerpt.slice(0, 160);
  return c;
}

// Règles avant publication (cahier §29 : validation humaine obligatoire)
export function controlesPublication(c: Contenu): string[] {
  const manque: string[] = [];
  if (!c.title) manque.push("le titre");
  if (!c.excerpt) manque.push("le résumé");
  if (c.content.trim().length < 200) manque.push("un texte d'au moins quelques paragraphes");
  if (c.medical_review_status !== "valide") manque.push("la validation médicale");
  if (!c.medical_reviewer?.name) manque.push("le nom de la personne qui a relu");
  if (c.sources.some((s) => !s.verified)) manque.push("la vérification de toutes les sources (ou leur retrait)");
  return manque;
}

// ---------- Format de stockage : Markdown + front matter YAML ----------
export function versMarkdown(c: Contenu): string {
  const { content, ...meta } = c;
  const propre = JSON.parse(JSON.stringify(meta)); // retire les undefined
  return `---\n${yamlStringify(propre, { lineWidth: 0 })}---\n\n${content.trim()}\n`;
}

export function depuisMarkdown(md: string): Contenu {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(md.replace(/\r\n/g, "\n"));
  if (!m) throw new Error("Fichier sans en-tête YAML");
  const meta = yamlParse(m[1]) || {};
  return { ...meta, content: m[2].replace(/^\n/, "") } as Contenu;
}

// ---------- Correspondance future vers WordPress (cahier §11) ----------
export function versWordPress(c: Contenu) {
  return {
    post_title: c.title, post_name: c.slug, post_content: c.content, post_excerpt: c.excerpt,
    post_status: c.status === "publie" ? "publish" : "draft", post_date: c.published_at || c.created_at,
    categories: c.category ? [c.category] : [], tags: c.tags, featured_media: c.featured_image?.src,
    meta: { seo_title: c.seo_title, seo_description: c.seo_description, faq: c.faq, sources: c.sources, medical_reviewer: c.medical_reviewer, medical_review_status: c.medical_review_status },
  };
}

export const urlPublique = (c: Pick<Contenu, "slug">) => `${SITE}${CHEMIN_PUBLIC}${c.slug}`;
