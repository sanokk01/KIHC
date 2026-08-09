import { eq, and } from "drizzle-orm";
import { getDb } from "./index";
import { contentRecords, siteSingletons, mediaAssets } from "./schema";

export type StoredSection = "news" | "research" | "popup" | "events" | "promotions";

export interface StoredContentRow {
  id: string;
  section: StoredSection;
  slug: string | null;
  title: string;
  status: "published" | "draft";
  publishedAt: string | null;
  imageUrl: string | null;
  payload: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredMediaRow {
  id: string;
  objectKey: string;
  filename: string;
  contentType: string;
  size: string;
  createdAt: string;
}

export interface ContentStore {
  listContent(section: StoredSection, includeDrafts?: boolean): Promise<StoredContentRow[]>;
  getContentBySlug(section: "news" | "research" | "events", slug: string): Promise<StoredContentRow | null>;
  upsertContent(rows: StoredContentRow[]): Promise<void>;
  deleteContent(section: StoredSection, id: string): Promise<void>;
  getSingleton(key: string): Promise<string | null>;
  upsertSingleton(key: string, payload: string): Promise<void>;
  saveMedia(file: File): Promise<{ media: StoredMediaRow; url: string }>;
  getMedia(id: string): Promise<{ media: StoredMediaRow; body: BodyInit } | null>;
}

export class PostgresContentStore implements ContentStore {
  async listContent(section: StoredSection, includeDrafts = false): Promise<StoredContentRow[]> {
    const db = getDb();
    let query;
    if (includeDrafts) {
      query = db.select().from(contentRecords).where(eq(contentRecords.section, section));
    } else {
      query = db.select().from(contentRecords).where(
        and(
          eq(contentRecords.section, section),
          eq(contentRecords.status, "published")
        )
      );
    }
    const rows = await query;
    return rows.map((r) => ({
      id: r.id,
      section: r.section as StoredSection,
      slug: r.slug,
      title: r.title,
      status: r.status as "published" | "draft",
      publishedAt: r.publishedAt,
      imageUrl: r.imageUrl,
      payload: r.payload,
      createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date(r.createdAt).toISOString(),
      updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : new Date(r.updatedAt).toISOString(),
    }));
  }

  async getContentBySlug(section: "news" | "research" | "events", slug: string): Promise<StoredContentRow | null> {
    const db = getDb();
    const [row] = await db
      .select()
      .from(contentRecords)
      .where(and(eq(contentRecords.section, section), eq(contentRecords.slug, slug)))
      .limit(1);
    if (!row) return null;
    return {
      id: row.id,
      section: row.section as StoredSection,
      slug: row.slug,
      title: row.title,
      status: row.status as "published" | "draft",
      publishedAt: row.publishedAt,
      imageUrl: row.imageUrl,
      payload: row.payload,
      createdAt: typeof row.createdAt === "string" ? row.createdAt : new Date(row.createdAt).toISOString(),
      updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : new Date(row.updatedAt).toISOString(),
    };
  }

  async upsertContent(rows: StoredContentRow[]): Promise<void> {
    const db = getDb();
    for (const row of rows) {
      await db
        .insert(contentRecords)
        .values({
          id: row.id,
          section: row.section,
          slug: row.slug,
          title: row.title,
          status: row.status,
          publishedAt: row.publishedAt,
          imageUrl: row.imageUrl,
          payload: row.payload,
        })
        .onConflictDoUpdate({
          target: contentRecords.id,
          set: {
            slug: row.slug,
            title: row.title,
            status: row.status,
            publishedAt: row.publishedAt,
            imageUrl: row.imageUrl,
            payload: row.payload,
            updatedAt: new Date().toISOString(),
          },
        });
    }
  }

  async deleteContent(section: StoredSection, id: string): Promise<void> {
    const db = getDb();
    await db.delete(contentRecords).where(and(eq(contentRecords.section, section), eq(contentRecords.id, id)));
  }

  async getSingleton(key: string): Promise<string | null> {
    const db = getDb();
    const [row] = await db.select().from(siteSingletons).where(eq(siteSingletons.key, key)).limit(1);
    return row ? row.payload : null;
  }

  async upsertSingleton(key: string, payload: string): Promise<void> {
    const db = getDb();
    await db
      .insert(siteSingletons)
      .values({ key, payload })
      .onConflictDoUpdate({
        target: siteSingletons.key,
        set: { payload, updatedAt: new Date().toISOString() },
      });
  }

  async saveMedia(file: File): Promise<{ media: StoredMediaRow; url: string }> {
    const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const media: StoredMediaRow = {
      id,
      objectKey: id,
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: String(file.size),
      createdAt: new Date().toISOString(),
    };
    const db = getDb();
    await db.insert(mediaAssets).values({
      id: media.id,
      objectKey: media.objectKey,
      filename: media.filename,
      contentType: media.contentType,
      size: media.size,
    });
    return { media, url: `/api/media/${id}` };
  }

  async getMedia(id: string): Promise<{ media: StoredMediaRow; body: BodyInit } | null> {
    const db = getDb();
    const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
    if (!row) return null;
    return {
      media: {
        id: row.id,
        objectKey: row.objectKey,
        filename: row.filename,
        contentType: row.contentType,
        size: row.size,
        createdAt: typeof row.createdAt === "string" ? row.createdAt : new Date(row.createdAt).toISOString(),
      },
      body: new Uint8Array(0),
    };
  }
}

export const contentStore: ContentStore = new PostgresContentStore();

