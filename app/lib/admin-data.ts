import { deleteContentRow, getSingletonPayload, listContentRows, upsertContentRows, upsertSingletonPayload, type StoredContentRow, type StoredSection } from "../../db/content-store";
import type { AdminContentRecord, AdminSection } from "./admin-types";
import { defaultAbout, defaultNewsPosts, defaultPopup, defaultResearchMaterials, defaultSettings } from "./content";

function defaultRecords(section: StoredSection): AdminContentRecord[] {
  if (section === "news") return defaultNewsPosts.map((item) => ({ id: item.id, slug: item.slug, title: item.title, publishedAt: item.publishedAt, status: item.status, imageUrl: item.imageUrl, excerpt: item.excerpt, content: item.content.join("\n\n") }));
  if (section === "research") return defaultResearchMaterials.map((item) => ({ id: item.id, slug: item.slug, title: item.title, publishedAt: item.publishedAt, status: item.status, imageUrl: item.imageUrl, author: item.author, summary: item.summary, tableOfContents: item.tableOfContents.join("\n"), keywords: item.keywords.join(", ") }));
  return [{ id: defaultPopup.id, title: defaultPopup.title, content: defaultPopup.content, imageUrl: defaultPopup.imageUrl, link: defaultPopup.link, active: defaultPopup.active, startsAt: defaultPopup.startsAt, endsAt: defaultPopup.endsAt }];
}

function parseJson<T>(payload: string, fallback: T): T {
  try { return { ...fallback, ...JSON.parse(payload) } as T; } catch { return fallback; }
}

function rowToAdmin(row: StoredContentRow): AdminContentRecord {
  if (row.section === "news") {
    const payload = parseJson(row.payload, { excerpt: "", content: [] as string[] });
    return { id: row.id, slug: row.slug ?? row.id, title: row.title, publishedAt: row.publishedAt ?? "", status: row.status, imageUrl: row.imageUrl ?? undefined, excerpt: payload.excerpt, content: payload.content.join("\n\n") };
  }
  if (row.section === "research") {
    const payload = parseJson(row.payload, { author: "", summary: "", tableOfContents: [] as string[], keywords: [] as string[] });
    return { id: row.id, slug: row.slug ?? row.id, title: row.title, publishedAt: row.publishedAt ?? "", status: row.status, imageUrl: row.imageUrl ?? undefined, author: payload.author, summary: payload.summary, tableOfContents: payload.tableOfContents.join("\n"), keywords: payload.keywords.join(", ") };
  }
  const payload = parseJson(row.payload, { content: "", link: "", active: false, startsAt: "", endsAt: "" });
  return { id: row.id, title: row.title, imageUrl: row.imageUrl ?? undefined, content: payload.content, link: payload.link, active: payload.active, startsAt: payload.startsAt, endsAt: payload.endsAt };
}

function safeSlug(record: AdminContentRecord) {
  const requested = record.slug?.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return requested || record.id;
}

function adminToRow(section: StoredSection, record: AdminContentRecord): StoredContentRow {
  const now = new Date().toISOString();
  let payload: Record<string, unknown>;
  if (section === "news") payload = { excerpt: record.excerpt ?? "", content: (record.content ?? "").split(/\n\s*\n/).filter(Boolean) };
  else if (section === "research") payload = { author: record.author ?? "", summary: record.summary ?? "", tableOfContents: (record.tableOfContents ?? "").split("\n").map((item) => item.trim()).filter(Boolean), keywords: (record.keywords ?? "").split(",").map((item) => item.trim()).filter(Boolean) };
  else payload = { content: record.content ?? "", link: record.link || undefined, active: Boolean(record.active), startsAt: record.startsAt || undefined, endsAt: record.endsAt || undefined };
  return { id: record.id, section, slug: section === "popup" ? null : safeSlug(record), title: record.title.trim(), status: section === "popup" ? (record.active ? "published" : "draft") : (record.status ?? "draft"), publishedAt: section === "popup" ? null : (record.publishedAt || null), imageUrl: record.imageUrl || null, payload: JSON.stringify(payload), createdAt: now, updatedAt: now };
}

export async function ensureSectionSeeded(section: StoredSection) {
  const marker = `content:${section}:initialized`;
  if (await getSingletonPayload(marker) === "true") return;
  const existing = await listContentRows(section, true);
  if (!existing.length) await upsertContentRows(defaultRecords(section).map((record) => adminToRow(section, record)));
  await upsertSingletonPayload(marker, "true");
}

export async function getAdminRecords(section: StoredSection): Promise<AdminContentRecord[]> {
  try {
    const rows = await listContentRows(section, true);
    if (rows.length || await getSingletonPayload(`content:${section}:initialized`) === "true") return rows.map(rowToAdmin);
  } catch { /* local/test fallback */ }
  return defaultRecords(section);
}

export async function saveAdminRecord(section: StoredSection, record: AdminContentRecord) {
  await ensureSectionSeeded(section);
  const id = record.id || `${section}-${crypto.randomUUID()}`;
  const normalized = { ...record, id };
  const row = adminToRow(section, normalized);
  await upsertContentRows([row]);
  return rowToAdmin(row);
}

export async function removeAdminRecord(section: StoredSection, id: string) {
  await ensureSectionSeeded(section);
  await deleteContentRow(section, id);
}

export async function getAdminSingleton(section: "about" | "settings"): Promise<AdminContentRecord> {
  try {
    const payload = await getSingletonPayload(section);
    if (payload) return { id: section, title: section === "about" ? "KIHC 소개" : "사이트 설정", ...JSON.parse(payload) };
  } catch { /* local/test fallback */ }
  if (section === "about") return { id: "about", title: "KIHC 소개", chairmanMessage: defaultAbout.chairmanMessage.join("\n\n"), chairmanImageUrl: defaultAbout.chairmanImageUrl, organizationIntroduction: defaultAbout.organizationIntroduction.join("\n\n"), organizationImageUrl: defaultAbout.organizationImageUrl, purpose: defaultAbout.purpose, vision: defaultAbout.vision };
  return { id: "settings", title: "사이트 설정", siteName: defaultSettings.siteName, footerInformation: defaultSettings.footerInformation, email: defaultSettings.email };
}

export async function saveAdminSingleton(section: "about" | "settings", record: AdminContentRecord) {
  const payload = section === "about"
    ? { chairmanMessage: (record.chairmanMessage ?? "").split(/\n\s*\n/).filter(Boolean), chairmanImageUrl: record.chairmanImageUrl || undefined, organizationIntroduction: (record.organizationIntroduction ?? "").split(/\n\s*\n/).filter(Boolean), organizationImageUrl: record.organizationImageUrl || undefined, purpose: record.purpose ?? "", vision: record.vision ?? "" }
    : { siteName: record.siteName ?? "", footerInformation: record.footerInformation ?? "", email: record.email ?? "" };
  await upsertSingletonPayload(section, JSON.stringify(payload));
  return { ...record, ...payload };
}

export function isContentSection(section: string): section is StoredSection {
  return section === "news" || section === "research" || section === "popup";
}

export function isAdminSection(section: string): section is AdminSection {
  return isContentSection(section) || section === "about" || section === "settings";
}
