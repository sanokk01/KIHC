import { contentStore, type StoredContentRow, type StoredSection } from "../../db/content-store";
import type { AdminContentRecord, AdminSection } from "./admin-types";
import { defaultAbout, defaultNewsPosts, defaultPopup, defaultResearchMaterials, defaultSettings, defaultPromotionalMaterials } from "./content";

export { databaseConnected, databasePendingMessage } from "./storage-status";

function defaultRecords(section: StoredSection): AdminContentRecord[] {
  if (section === "news") return defaultNewsPosts.map((item) => ({ id: item.id, slug: item.slug, title: item.title, publishedAt: item.publishedAt, status: item.status, imageUrl: item.imageUrl, excerpt: item.excerpt, content: item.content.join("\n\n"), category1: item.category1 || "공지사항", category2: item.category2 || "", heldAt: item.heldAt || "", attachmentUrl: item.attachmentUrl || "", views: item.views || 0 }));
  if (section === "research") return defaultResearchMaterials.map((item) => ({ id: item.id, slug: item.slug, title: item.title, publishedAt: item.publishedAt, status: item.status, imageUrl: item.imageUrl, author: item.author, summary: item.summary, tableOfContents: item.tableOfContents.join("\n"), keywords: item.keywords.join(", "), researchType: item.researchType, category1: item.category1, category2: item.category2, views: item.views || 0 }));
  if (section === "promotions") return defaultPromotionalMaterials.map((item) => ({ id: item.id, slug: item.slug, title: item.title, publishedAt: item.publishedAt, status: item.status, imageUrl: item.imageUrl, thumbnailLabel: item.thumbnailLabel, category1: item.category, protectedDetails: item.protectedDetails }));

  return [{ id: defaultPopup.id, title: defaultPopup.title, content: defaultPopup.content, imageUrl: defaultPopup.imageUrl, imageDisplay: defaultPopup.imageDisplay, link: defaultPopup.link, active: defaultPopup.active, startsAt: defaultPopup.startsAt, endsAt: defaultPopup.endsAt }];
}

function recordToRow(section: StoredSection, record: AdminContentRecord): StoredContentRow {
  const { id, slug, title, status, publishedAt, imageUrl, ...rest } = record;
  return {
    id: id || `${section}-${Date.now()}`,
    section,
    slug: slug || null,
    title: title || "제목 없음",
    status: (status as "published" | "draft") || "published",
    publishedAt: publishedAt || new Date().toISOString().substring(0, 10).replace(/-/g, ". "),
    imageUrl: imageUrl || null,
    payload: JSON.stringify(rest),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function rowToRecord(row: StoredContentRow): AdminContentRecord {
  let rest = {};
  try {
    rest = JSON.parse(row.payload);
  } catch {
    rest = {};
  }
  return {
    id: row.id,
    slug: row.slug || undefined,
    title: row.title,
    status: row.status,
    publishedAt: row.publishedAt || undefined,
    imageUrl: row.imageUrl || undefined,
    ...rest,
  };
}

export async function getAdminRecords(section: StoredSection): Promise<AdminContentRecord[]> {
  try {
    const rows = await contentStore.listContent(section, true);
    if (rows.length === 0) {
      const defaults = defaultRecords(section);
      const rowsToUpsert = defaults.map((rec) => recordToRow(section, rec));
      await contentStore.upsertContent(rowsToUpsert);
      return defaults;
    }
    return rows.map(rowToRecord);
  } catch (error) {
    console.error("Failed to get admin records from DB, falling back to defaults:", error);
    return defaultRecords(section);
  }
}

export async function saveAdminRecord(section: StoredSection, record: AdminContentRecord): Promise<AdminContentRecord> {
  const row = recordToRow(section, record);
  await contentStore.upsertContent([row]);
  return rowToRecord(row);
}

export async function removeAdminRecord(section: StoredSection, id: string): Promise<void> {
  await contentStore.deleteContent(section, id);
}

export async function getAdminSingleton(section: "about" | "settings"): Promise<AdminContentRecord> {
  try {
    const payload = await contentStore.getSingleton(section);
    if (!payload) {
      const defaultData = section === "about" ? { id: "about", title: "KIHC 소개", chairmanMessage: defaultAbout.chairmanMessage.join("\n\n"), chairmanImageUrl: defaultAbout.chairmanImageUrl, organizationIntroduction: defaultAbout.organizationIntroduction.join("\n\n"), organizationImageUrl: defaultAbout.organizationImageUrl, purpose: defaultAbout.purpose, vision: defaultAbout.vision } : { id: "settings", title: "사이트 설정", siteName: defaultSettings.siteName, footerInformation: defaultSettings.footerInformation, email: defaultSettings.email, searchKeywords: defaultSettings.searchKeywords };
      await contentStore.upsertSingleton(section, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(payload);
  } catch (error) {
    console.error("Failed to get singleton from DB:", error);
    if (section === "about") return { id: "about", title: "KIHC 소개", chairmanMessage: defaultAbout.chairmanMessage.join("\n\n"), chairmanImageUrl: defaultAbout.chairmanImageUrl, organizationIntroduction: defaultAbout.organizationIntroduction.join("\n\n"), organizationImageUrl: defaultAbout.organizationImageUrl, purpose: defaultAbout.purpose, vision: defaultAbout.vision };
    return { id: "settings", title: "사이트 설정", siteName: defaultSettings.siteName, footerInformation: defaultSettings.footerInformation, email: defaultSettings.email, searchKeywords: defaultSettings.searchKeywords };
  }
}

export async function saveAdminSingleton(section: "about" | "settings", record: AdminContentRecord): Promise<AdminContentRecord> {
  await contentStore.upsertSingleton(section, JSON.stringify(record));
  return record;
}

export function unavailableStorageResponse(error: unknown) {
  const status = 500;
  const message = error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
  return Response.json({ error: message, storageConnected: false }, { status });
}

export function isContentSection(section: string): section is StoredSection {
  return section === "news" || section === "research" || section === "popup" || section === "events" || section === "promotions";
}

export function isAdminSection(section: string): section is AdminSection {
  return isContentSection(section) || section === "about" || section === "settings";
}

