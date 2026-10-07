// Rédaction HOSANNA — couche de stockage
// L'interface ContentRepository ne connaît que le contrat (Contenu).
// Implémentation actuelle : Netlify Blobs, fichiers Markdown + YAML.
// Une autre implémentation (GitRepository pour Decap, WordPressRepository…)
// peut la remplacer sans toucher à l'interface ni aux contenus.

import { getStore } from "@netlify/blobs";
import { type Contenu, versMarkdown, depuisMarkdown } from "./modele.ts";

export interface Version { cle: string; date: string; auteur: string; statut: string; titre: string }

export interface ContentRepository {
  lister(): Promise<Contenu[]>;
  lire(id: string): Promise<Contenu | null>;
  lireParSlug(slug: string): Promise<Contenu | null>;
  enregistrer(c: Contenu, auteur: string): Promise<void>;
  supprimer(id: string): Promise<void>;
  versions(id: string): Promise<Version[]>;
  lireVersion(cle: string): Promise<Contenu | null>;
  exporterMarkdown(): Promise<{ fichier: string; markdown: string }[]>;
}

export interface MediaStore {
  deposer(nom: string, donnees: ArrayBuffer, type: string): Promise<string>; // renvoie l'adresse publique
  lire(nom: string): Promise<{ donnees: ArrayBuffer; type: string } | null>;
}

const contenus = () => getStore({ name: "redaction-contenus", consistency: "strong" });
const medias = () => getStore({ name: "redaction-medias", consistency: "strong" });

export class BlobsRepository implements ContentRepository {
  async lister() {
    const s = contenus();
    const { blobs } = await s.list({ prefix: "contenus/" });
    const docs = await Promise.all(blobs.map(async (b) => {
      const md = await s.get(b.key, { type: "text" });
      try { return md ? depuisMarkdown(md) : null; } catch { return null; }
    }));
    return (docs.filter(Boolean) as Contenu[]).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }

  async lire(id: string) {
    const md = await contenus().get(`contenus/${id}.md`, { type: "text" });
    return md ? depuisMarkdown(md) : null;
  }

  async lireParSlug(slug: string) {
    const id = await contenus().get(`slugs/${slug}`, { type: "text" });
    return id ? this.lire(id) : null;
  }

  async enregistrer(c: Contenu, auteur: string) {
    const s = contenus();
    const ancien = await this.lire(c.id);
    // Historique : chaque version précédente est conservée (cahier §22)
    if (ancien) {
      const cle = `versions/${c.id}/${ancien.updated_at.replace(/[:.]/g, "-")}.md`;
      await s.set(cle, versMarkdown(ancien), { metadata: { auteur, statut: ancien.status, titre: ancien.title, date: ancien.updated_at } });
      if (ancien.slug !== c.slug) await s.delete(`slugs/${ancien.slug}`);
    }
    // Un slug ne peut appartenir qu'à un seul contenu
    const proprietaire = await s.get(`slugs/${c.slug}`, { type: "text" });
    if (proprietaire && proprietaire !== c.id) c.slug = `${c.slug}-${c.id.slice(-4)}`;
    await s.set(`contenus/${c.id}.md`, versMarkdown(c));
    await s.set(`slugs/${c.slug}`, c.id);
  }

  async supprimer(id: string) {
    const s = contenus(); const c = await this.lire(id);
    if (c) await s.delete(`slugs/${c.slug}`);
    await s.delete(`contenus/${id}.md`);
  }

  async versions(id: string) {
    const s = contenus();
    const { blobs } = await s.list({ prefix: `versions/${id}/` });
    const v = await Promise.all(blobs.map(async (b) => {
      const m = await s.getMetadata(b.key);
      const meta: any = m?.metadata || {};
      return { cle: b.key, date: meta.date || "", auteur: meta.auteur || "", statut: meta.statut || "", titre: meta.titre || "" };
    }));
    return v.sort((a, b) => b.date.localeCompare(a.date));
  }

  async lireVersion(cle: string) {
    if (!cle.startsWith("versions/")) return null;
    const md = await contenus().get(cle, { type: "text" });
    return md ? depuisMarkdown(md) : null;
  }

  async exporterMarkdown() {
    return (await this.lister()).map((c) => ({ fichier: `content/articles/${c.slug}.md`, markdown: versMarkdown(c) }));
  }
}

export class BlobsMediaStore implements MediaStore {
  async deposer(nom: string, donnees: ArrayBuffer, type: string) {
    await medias().set(nom, donnees, { metadata: { type } });
    return `/media/${nom}`;
  }
  async lire(nom: string) {
    const r = await medias().getWithMetadata(nom, { type: "arrayBuffer" });
    if (!r) return null;
    return { donnees: r.data as ArrayBuffer, type: String((r.metadata as any)?.type || "application/octet-stream") };
  }
}

// Petit magasin clé/valeur pour l'index public, les aperçus et les tâches IA
export const divers = () => getStore({ name: "redaction-divers", consistency: "strong" });

// Point unique de choix des implémentations (configuration)
export const depot = (): ContentRepository => new BlobsRepository();
export const mediatheque = (): MediaStore => new BlobsMediaStore();
