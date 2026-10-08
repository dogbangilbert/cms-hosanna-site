// Rédaction HOSANNA — côté public du site
//   /conseils/<slug>            page d'un article publié
//   /conseils/apercu/<jeton>    aperçu privé (non indexé, expire après 2 h)
//   /media/<fichier>            images et PDF déposés depuis la Rédaction
//   /api/conseils               liste publique des articles publiés (pour la page Blog)
//   /sitemap-conseils.xml       plan du site des articles, pour Google

import type { Config, Context } from "@netlify/functions";
import { depot, mediatheque, divers } from "../redaction/stockage.ts";
import { indexPublic } from "../redaction/publication.ts";
import { pageArticle } from "../redaction/rendu.ts";
import { SITE, CHEMIN_PUBLIC } from "../redaction/modele.ts";

// Identique à la politique du fichier _headers (qui ne s'applique pas aux pages servies par une fonction)
const CSP = "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; img-src 'self' data:; connect-src 'self' https://cloudflareinsights.com; frame-ancestors 'none'";
const html = (corps: string, status = 200, cache = "public, max-age=0, must-revalidate") =>
  new Response(corps, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": cache, "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "content-security-policy": CSP, "x-frame-options": "DENY", "permissions-policy": "geolocation=(), camera=(), microphone=()" } });

const introuvable = () => html(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Article introuvable — CMS HOSANNA</title></head><body style="font-family:sans-serif;text-align:center;padding:60px 20px"><h1 style="color:#003399">Article introuvable</h1><p>Cet article n'existe pas ou n'est plus en ligne.</p><p><a href="/blog.html">Voir tous les conseils santé</a></p></body></html>`, 404);

export default async (req: Request, context: Context) => {
  const chemin = new URL(req.url).pathname;
  try {
    if (chemin === "/api/conseils") {
      return new Response(JSON.stringify(await indexPublic()), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=60" } });
    }

    if (chemin === "/sitemap-conseils.xml") {
      const liste = await indexPublic();
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${liste.map((c) => `  <url><loc>${SITE}${CHEMIN_PUBLIC}${c.slug}</loc><lastmod>${c.updated_at.slice(0, 10)}</lastmod></url>`).join("\n")}\n</urlset>\n`;
      return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=300" } });
    }

    if (chemin.startsWith("/media/")) {
      const nom = decodeURIComponent(chemin.slice(7));
      if (!/^[a-z0-9.\-]+$/.test(nom)) return new Response("Introuvable", { status: 404 });
      const m = await mediatheque().lire(nom);
      if (!m) return new Response("Introuvable", { status: 404 });
      return new Response(m.donnees, { headers: { "content-type": m.type, "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    }

    if (chemin.startsWith("/conseils/apercu/")) {
      const jeton = chemin.split("/")[3] || "";
      const r = await divers().getWithMetadata(`apercus/${jeton}`, { type: "text" });
      if (!r || Number((r.metadata as any)?.expire) < Date.now()) return introuvable();
      return html(r.data as string, 200, "no-store");
    }

    if (chemin.startsWith(CHEMIN_PUBLIC)) {
      const slug = chemin.slice(CHEMIN_PUBLIC.length).replace(/\/$/, "").toLowerCase();
      if (!slug) return Response.redirect(new URL("/blog.html", req.url).toString(), 302);
      const c = await depot().lireParSlug(slug);
      if (!c || c.status !== "publie") return introuvable();
      if (c.slug !== slug) return Response.redirect(new URL(CHEMIN_PUBLIC + c.slug, req.url).toString(), 301);
      return html(pageArticle(c));
    }

    return introuvable();
  } catch (e) {
    console.error(e);
    return html("<h1>Erreur momentanée</h1><p>Merci de réessayer dans un instant.</p>", 500, "no-store");
  }
};

export const config: Config = { path: ["/conseils/*", "/media/*", "/api/conseils", "/sitemap-conseils.xml"] };
