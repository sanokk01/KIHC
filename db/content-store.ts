/**
 * External database handoff boundary.
 *
 * The previous Cloudflare D1/R2 implementation has been disconnected on purpose.
 * Antigravity (or another follow-up agent) should implement this contract with the
 * team's database and object storage, then inject it into app/lib/content.ts and
 * app/lib/admin-data.ts. No runtime code imports this file while storage is pending.
 */

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

export interface ContentStore {
  listContent(section: StoredSection, includeDrafts?: boolean): Promise<StoredContentRow[]>;
  getContentBySlug(section: "news" | "research", slug: string): Promise<StoredContentRow | null>;
  upsertContent(rows: StoredContentRow[]): Promise<void>;
  deleteContent(section: StoredSection, id: string): Promise<void>;
  getSingleton(key: string): Promise<string | null>;
  upsertSingleton(key: string, payload: string): Promise<void>;
  saveMedia(file: File): Promise<{ media: StoredMediaRow; url: string }>;
  getMedia(id: string): Promise<{ media: StoredMediaRow; body: BodyInit } | null>;
}

export const contentStore: ContentStore | null = null;
