import { sql } from "drizzle-orm";
import { check, index, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const contentRecords = pgTable("content_records", {
  id: text("id").primaryKey(),
  section: text("section").notNull(),
  slug: text("slug"),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  publishedAt: text("published_at"),
  imageUrl: text("image_url"),
  payload: text("payload").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP::text`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP::text`),
}, (table) => [
  index("idx_content_section_status_date").on(table.section, table.status, table.publishedAt),
  uniqueIndex("idx_content_section_slug").on(table.section, table.slug),
]);

export const siteSingletons = pgTable("site_singletons", {
  key: text("key").primaryKey(),
  payload: text("payload").notNull().default("{}"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP::text`),
});

export const mediaAssets = pgTable("media_assets", {
  id: text("id").primaryKey(),
  objectKey: text("object_key").notNull().unique(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: text("size").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP::text`),
});

export const adminAccounts = pgTable("admin_accounts", {
  id: text("id").primaryKey(),
  loginId: text("login_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP::text`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP::text`),
}, (table) => [
  check("admin_accounts_singleton_check", sql`${table.id} = 'primary'`),
  check("admin_accounts_login_id_check", sql`${table.loginId} = 'oneteam1'`),
]);

export const adminSessions = pgTable("admin_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  accountId: text("account_id").notNull().references(() => adminAccounts.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP::text`),
}, (table) => [
  index("idx_admin_sessions_expires_at").on(table.expiresAt),
]);

