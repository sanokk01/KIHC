import { sql } from "drizzle-orm";
import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const contentRecords = sqliteTable("content_records", {
  id: text("id").primaryKey(),
  section: text("section").notNull(),
  slug: text("slug"),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  publishedAt: text("published_at"),
  imageUrl: text("image_url"),
  payload: text("payload").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_content_section_status_date").on(table.section, table.status, table.publishedAt),
  uniqueIndex("idx_content_section_slug").on(table.section, table.slug),
]);

export const siteSingletons = sqliteTable("site_singletons", {
  key: text("key").primaryKey(),
  payload: text("payload").notNull().default("{}"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const mediaAssets = sqliteTable("media_assets", {
  id: text("id").primaryKey(),
  objectKey: text("object_key").notNull().unique(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: text("size").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
