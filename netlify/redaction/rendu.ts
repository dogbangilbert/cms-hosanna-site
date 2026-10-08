// Rédaction HOSANNA — rendu public d'un article et données structurées (cahier §13-14)
// Tout est calculé à partir du contrat de données : rien n'est écrit à la main par article.

import { Marked } from "marked";
import { type Contenu, SITE, urlPublique } from "./modele.ts";
import { CSS, ENTETE, PIED, SCRIPTS } from "./gabarit.ts";

const echap = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

// Markdown → HTML, sans laisser passer de HTML brut (texte issu d'une IA ou d'un copier-coller)
const md = new Marked({ gfm: true, breaks: false });
md.use({ renderer: { html: (t: any) => echap(typeof t === "string" ? t : t.text) } });
// Seuls les liens http(s), internes au site, ancres, téléphone et courriel sont admis (jamais javascript:, data:…)
export const lienSur = (u?: string) => { const v = String(u || "").trim(); return /^(https?:\/\/|\/(?!\/)|#|tel:|mailto:)/i.test(v) ? v : ""; };
md.use({ walkTokens: (t: any) => { if ((t.type === "link" || t.type === "image") && !lienSur(t.href)) t.href = "#"; } });
export const markdownVersHtml = (t: string) => md.parse(t || "") as string;

const absolu = (src?: string) => (!src ? "" : src.startsWith("http") ? src : SITE + src);

export function donneesStructurees(c: Contenu) {
  const url = c.canonical_url || urlPublique(c);
  const graph: any[] = [
    {
      "@type": ["MedicalWebPage", "Article"],
      "@id": url + "#article", url, headline: c.title, description: c.seo_description || c.excerpt,
      inLanguage: "fr", datePublished: c.published_at || c.created_at, dateModified: c.updated_at,
      image: c.featured_image ? absolu(c.featured_image.src) : `${SITE}/img/logo-3d-clair.jpg`,
      author: { "@type": "Organization", name: "CMS HOSANNA", url: SITE },
      publisher: { "@id": `${SITE}/#centre` },
      about: c.category || undefined, keywords: c.tags.join(", ") || undefined,
      ...(c.medical_review_status === "valide" && c.medical_reviewer?.name ? {
        reviewedBy: { "@type": "Person", name: c.medical_reviewer.name, jobTitle: c.medical_reviewer.profession },
        lastReviewed: c.medical_reviewer.date || c.updated_at.slice(0, 10),
      } : {}),
      citation: c.sources.filter((s) => s.verified).map((s) => s.url || s.title),
    },
    {
      "@type": "MedicalClinic", "@id": `${SITE}/#centre`, name: "Centre Médico-Social HOSANNA (CMS HOSANNA)", url: SITE,
      telephone: ["+22890038313", "+22896658989"],
      address: { "@type": "PostalAddress", streetAddress: "Attiégou", addressLocality: "Lomé", addressCountry: "TG" },
    },
  ];
  if (c.faq.length) graph.push({
    "@type": "FAQPage", "@id": url + "#faq",
    mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  });
  return { "@context": "https://schema.org", "@graph": graph };
}

const STYLE_ARTICLE = `
.art-wrap{max-width:760px; margin:0 auto;}
.art-meta{display:flex; flex-wrap:wrap; gap:8px 16px; color:rgba(255,255,255,.85); font-size:.88rem; margin-top:14px;}
.art-image{margin:-40px auto 28px; max-width:860px; padding:0 16px;}
.art-image img{width:100%; max-height:460px; object-fit:cover; border-radius:18px; box-shadow:0 18px 40px rgba(0,51,153,.15);}
.art-image figcaption{font-size:.82rem; color:#6b7385; margin-top:8px; text-align:center;}
.art-corps{color:#2f3644; line-height:1.75; font-size:1.04rem;}
.art-corps h2{font-size:1.45rem; margin:34px 0 12px;} .art-corps h3{font-size:1.15rem; margin:26px 0 10px;}
.art-corps p{margin-bottom:16px;} .art-corps ul,.art-corps ol{margin:0 0 18px 22px;} .art-corps li{margin-bottom:6px;}
.art-corps blockquote{border-left:4px solid #4A90D9; background:#EAF3FC; padding:12px 16px; border-radius:8px; margin:0 0 18px;}
.art-corps a{color:#003399; font-weight:600;} .art-corps img{max-width:100%; border-radius:12px;}
.art-corps table{width:100%; border-collapse:collapse; margin-bottom:18px;} .art-corps td,.art-corps th{border:1px solid #dfe6f1; padding:8px;}
.art-bloc{background:#F5F8FC; border-radius:16px; padding:22px; margin-top:28px;}
.art-bloc h2{font-size:1.2rem; margin-bottom:12px;}
.art-faq details{background:#fff; border:1px solid #e2eaf5; border-radius:12px; padding:12px 16px; margin-bottom:10px;}
.art-faq summary{font-weight:700; color:#003399; cursor:pointer;}
.art-faq details p{margin-top:8px; color:#3d4555;}
.art-sources li{margin-bottom:6px; font-size:.92rem;} .art-sources a{color:#003399; word-break:break-word;}
.art-relu{display:flex; gap:12px; align-items:center; background:#E6F3E7; border-radius:14px; padding:14px 16px; margin-top:28px; color:#1f4d22; font-size:.95rem;}
.art-relu b{color:#2E7D32;}
.art-pdf{display:flex; gap:14px; align-items:center; border:1.5px solid #4A90D9; border-radius:14px; padding:14px 16px; margin-top:24px; text-decoration:none; color:#003399;}
.art-pdf span{font-size:1.8rem;} .art-pdf small{display:block; color:#5b6474;}
.art-partage{display:flex; flex-wrap:wrap; gap:8px; margin-top:28px; align-items:center;}
.art-partage a{display:inline-flex; align-items:center; gap:6px; padding:9px 14px; border-radius:999px; text-decoration:none; font-weight:700; font-size:.88rem; color:#fff;}
.art-partage .wa{background:#25D366;} .art-partage .fb{background:#1877F2;} .art-partage .cp{background:#003399; border:none; color:#fff; padding:9px 14px; border-radius:999px; font-weight:700; cursor:pointer; font:inherit; font-size:.88rem;}
.art-avert{font-size:.85rem; color:#6b7385; margin-top:24px;}
.art-apercu{position:sticky; top:0; z-index:500; background:#F9A825; color:#1a1200; text-align:center; font-weight:700; padding:8px; font-family:Poppins,sans-serif;}
`;

export function pageArticle(c: Contenu, opts: { apercu?: boolean } = {}): string {
  const url = c.canonical_url || urlPublique(c);
  const titreSeo = c.seo_title || c.title;
  const desc = c.seo_description || c.excerpt;
  const image = absolu(c.og_image || c.featured_image?.src) || `${SITE}/img/logo-3d-clair.jpg`;
  const date = (d?: string) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
  const relu = c.medical_review_status === "valide" && c.medical_reviewer?.name;
  const wa = `https://wa.me/22890038313?text=${encodeURIComponent(c.cta.whatsapp_message || "Bonjour CMS HOSANNA")}`;
  const partageWa = `https://wa.me/?text=${encodeURIComponent(c.title + " " + url)}`;
  const partageFb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${echap(titreSeo)} — CMS HOSANNA</title>
<meta name="description" content="${echap(desc)}">
<link rel="canonical" href="${echap(url)}">
<meta name="robots" content="${opts.apercu ? "noindex, nofollow" : "index, follow"}">
<meta property="og:type" content="article">
<meta property="og:title" content="${echap(titreSeo)}">
<meta property="og:description" content="${echap(desc)}">
<meta property="og:url" content="${echap(url)}">
<meta property="og:site_name" content="CMS HOSANNA">
<meta property="og:image" content="${echap(image)}">
<meta property="og:locale" content="fr_FR">
${c.published_at ? `<meta property="article:published_time" content="${echap(c.published_at)}">` : ""}
<meta property="article:modified_time" content="${echap(c.updated_at)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${echap(titreSeo)}">
<meta name="twitter:description" content="${echap(desc)}">
<meta name="twitter:image" content="${echap(image)}">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png">
<link rel="apple-touch-icon" href="/img/favicon-180.png">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#003399">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(donneesStructurees(c)).replace(/</g, "\\u003c")}</script>
<style>${CSS}${STYLE_ARTICLE}</style>
<link rel="stylesheet" href="/assets/vie.css">
</head>
<body>
${opts.apercu ? `<div class="art-apercu">Aperçu : cet article n'est pas encore publié</div>` : ""}
${ENTETE}

<section class="page-hero">
  <div class="container art-wrap">
    ${c.category ? `<span class="eyebrow">${echap(c.category)}</span>` : ""}
    <h1>${echap(c.title)}</h1>
    ${c.excerpt ? `<p>${echap(c.excerpt)}</p>` : ""}
    <div class="art-meta">
      ${c.published_at ? `<span>Publié le ${date(c.published_at)}</span>` : ""}
      ${c.published_at && c.updated_at.slice(0, 10) !== c.published_at.slice(0, 10) ? `<span>Mis à jour le ${date(c.updated_at)}</span>` : ""}
      ${relu ? `<span>✓ Relu par l'équipe médicale</span>` : ""}
    </div>
  </div>
</section>

${c.featured_image ? `<figure class="art-image"><img src="${echap(c.featured_image.src)}" alt="${echap(c.featured_image.alt || c.title)}" loading="eager">${c.featured_image.caption || c.featured_image.credit ? `<figcaption>${echap(c.featured_image.caption || "")}${c.featured_image.credit ? ` · ${echap(c.featured_image.credit)}` : ""}</figcaption>` : ""}</figure>` : ""}

<section>
  <div class="container art-wrap">
    <article class="art-corps">${markdownVersHtml(c.content)}</article>

    ${c.pdf && lienSur(c.pdf.src) ? `<a class="art-pdf" href="${echap(c.pdf.src)}" target="_blank" rel="noopener" download><span>📄</span><div><b>${echap(c.pdf.title)}</b><small>${echap(c.pdf.description || "Télécharger le document (PDF)")}${c.pdf.size ? ` · ${Math.max(1, Math.round(c.pdf.size / 1024))} Ko` : ""}</small></div></a>` : ""}

    ${c.faq.length ? `<div class="art-bloc art-faq"><h2>Questions fréquentes</h2>${c.faq.map((f) => `<details><summary>${echap(f.question)}</summary><p>${echap(f.answer)}</p></details>`).join("")}</div>` : ""}

    ${relu ? `<div class="art-relu"><span style="font-size:1.6rem">🩺</span><div>Relu par <b>${echap(c.medical_reviewer!.name)}</b>${c.medical_reviewer!.profession ? `, ${echap(c.medical_reviewer!.profession)}` : ""}${c.medical_reviewer!.date ? `, le ${date(c.medical_reviewer!.date)}` : ""}.</div></div>` : ""}

    ${c.sources.filter((s) => s.verified).length ? `<div class="art-bloc art-sources"><h2>Sources</h2><ol>${c.sources.filter((s) => s.verified).map((s) => `<li>${lienSur(s.url) ? `<a href="${echap(s.url)}" target="_blank" rel="noopener nofollow">${echap(s.title)}</a>` : echap(s.title)}</li>`).join("")}</ol></div>` : ""}

    <div class="art-partage"><b style="color:#003399; margin-right:4px;">Partager :</b>
      <a class="wa" href="${partageWa}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="fb" href="${partageFb}" target="_blank" rel="noopener">Facebook</a>
      <button class="cp" type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText('${echap(url)}').then(()=>{this.textContent='Lien copié ✓'})">Copier le lien</button>
    </div>

    <p class="art-avert">Information générale. Ne remplace pas une consultation. En cas de symptômes, consultez un professionnel de santé.</p>
  </div>
</section>

<section style="text-align:center;">
  <div class="container reveal">
    <div class="panel-dark" style="max-width:640px; margin:0 auto; padding:32px;">
      <h3 style="margin-bottom:12px;">${echap(c.cta.text || "Une question après cette lecture ?")}</h3>
      <p style="margin-bottom:20px;">Écrivez-nous directement sur WhatsApp, nous répondons personnellement.</p>
      <a href="${wa}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">💬 Écrire sur WhatsApp</a>
    </div>
  </div>
</section>

${PIED}
${SCRIPTS}
</body>
</html>`;
}
