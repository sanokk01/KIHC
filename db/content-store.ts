export type StoredSection = "news" | "research" | "popup";

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

async function getRuntimeEnv() {
  return (await import("cloudflare:workers")).env;
}

export async function getD1(): Promise<D1Database> {
  const env = await getRuntimeEnv();
  if (!env.DB) throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  return env.DB;
}

export async function getMediaBucket(): Promise<R2Bucket> {
  const env = await getRuntimeEnv();
  if (!env.MEDIA) throw new Error("Cloudflare R2 binding `MEDIA` is unavailable.");
  return env.MEDIA;
}

export async function listContentRows(section: StoredSection, includeDrafts = false): Promise<StoredContentRow[]> {
  const db = await getD1();
  const statement = includeDrafts
    ? db.prepare("SELECT id, section, slug, title, status, published_at AS publishedAt, image_url AS imageUrl, payload, created_at AS createdAt, updated_at AS updatedAt FROM content_records WHERE section = ? ORDER BY COALESCE(published_at, updated_at) DESC, updated_at DESC")
    : db.prepare("SELECT id, section, slug, title, status, published_at AS publishedAt, image_url AS imageUrl, payload, created_at AS createdAt, updated_at AS updatedAt FROM content_records WHERE section = ? AND status = 'published' ORDER BY COALESCE(published_at, updated_at) DESC, updated_at DESC");
  const { results } = await statement.bind(section).all<StoredContentRow>();
  return results;
}

export async function getContentRowBySlug(section: "news" | "research", slug: string): Promise<StoredContentRow | null> {
  const db = await getD1();
  return db.prepare("SELECT id, section, slug, title, status, published_at AS publishedAt, image_url AS imageUrl, payload, created_at AS createdAt, updated_at AS updatedAt FROM content_records WHERE section = ? AND slug = ? AND status = 'published' LIMIT 1").bind(section, slug).first<StoredContentRow>();
}

export async function upsertContentRows(rows: StoredContentRow[]): Promise<void> {
  if (!rows.length) return;
  const db = await getD1();
  const statements = rows.map((row) => db.prepare(`INSERT INTO content_records (id, section, slug, title, status, published_at, image_url, payload, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET section = excluded.section, slug = excluded.slug, title = excluded.title, status = excluded.status, published_at = excluded.published_at, image_url = excluded.image_url, payload = excluded.payload, updated_at = excluded.updated_at`).bind(
      row.id, row.section, row.slug, row.title, row.status, row.publishedAt, row.imageUrl, row.payload, row.createdAt, row.updatedAt,
    ));
  await db.batch(statements);
}

export async function deleteContentRow(section: StoredSection, id: string): Promise<void> {
  const db = await getD1();
  await db.prepare("DELETE FROM content_records WHERE section = ? AND id = ?").bind(section, id).run();
}

export async function getSingletonPayload(key: string): Promise<string | null> {
  const db = await getD1();
  const row = await db.prepare("SELECT payload FROM site_singletons WHERE key = ? LIMIT 1").bind(key).first<{ payload: string }>();
  return row?.payload ?? null;
}

export async function upsertSingletonPayload(key: string, payload: string): Promise<void> {
  const db = await getD1();
  await db.prepare(`INSERT INTO site_singletons (key, payload, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`).bind(key, payload, new Date().toISOString()).run();
}

export async function insertMediaRow(row: Omit<StoredMediaRow, "createdAt">): Promise<void> {
  const db = await getD1();
  await db.prepare("INSERT INTO media_assets (id, object_key, filename, content_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(
    row.id, row.objectKey, row.filename, row.contentType, row.size, new Date().toISOString(),
  ).run();
}

export async function getMediaRow(id: string): Promise<StoredMediaRow | null> {
  const db = await getD1();
  return db.prepare("SELECT id, object_key AS objectKey, filename, content_type AS contentType, size, created_at AS createdAt FROM media_assets WHERE id = ? LIMIT 1").bind(id).first<StoredMediaRow>();
}
