import type { StoredSection } from "../../db/content-store";
import type { AdminContentRecord, AdminSection } from "./admin-types";
import { defaultAbout, defaultNewsPosts, defaultPopup, defaultResearchMaterials, defaultSettings } from "./content";
import { databasePendingMessage } from "./storage-status";

export { databaseConnected, databasePendingMessage } from "./storage-status";

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(databasePendingMessage);
    this.name = "DatabaseNotConfiguredError";
  }
}

function defaultRecords(section: StoredSection): AdminContentRecord[] {
  if (section === "news") return defaultNewsPosts.map((item) => ({ id: item.id, slug: item.slug, title: item.title, publishedAt: item.publishedAt, status: item.status, imageUrl: item.imageUrl, excerpt: item.excerpt, content: item.content.join("\n\n") }));
  if (section === "research") return defaultResearchMaterials.map((item) => ({ id: item.id, slug: item.slug, title: item.title, publishedAt: item.publishedAt, status: item.status, imageUrl: item.imageUrl, author: item.author, summary: item.summary, tableOfContents: item.tableOfContents.join("\n"), keywords: item.keywords.join(", ") }));
  return [{ id: defaultPopup.id, title: defaultPopup.title, content: defaultPopup.content, imageUrl: defaultPopup.imageUrl, link: defaultPopup.link, active: defaultPopup.active, startsAt: defaultPopup.startsAt, endsAt: defaultPopup.endsAt }];
}

export async function getAdminRecords(section: StoredSection): Promise<AdminContentRecord[]> {
  return defaultRecords(section);
}

export async function saveAdminRecord(_section: StoredSection, _record: AdminContentRecord): Promise<never> {
  void _section;
  void _record;
  throw new DatabaseNotConfiguredError();
}

export async function removeAdminRecord(_section: StoredSection, _id: string): Promise<never> {
  void _section;
  void _id;
  throw new DatabaseNotConfiguredError();
}

export async function getAdminSingleton(section: "about" | "settings"): Promise<AdminContentRecord> {
  if (section === "about") return { id: "about", title: "KIHC 소개", chairmanMessage: defaultAbout.chairmanMessage.join("\n\n"), chairmanImageUrl: defaultAbout.chairmanImageUrl, organizationIntroduction: defaultAbout.organizationIntroduction.join("\n\n"), organizationImageUrl: defaultAbout.organizationImageUrl, purpose: defaultAbout.purpose, vision: defaultAbout.vision };
  return { id: "settings", title: "사이트 설정", siteName: defaultSettings.siteName, footerInformation: defaultSettings.footerInformation, email: defaultSettings.email };
}

export async function saveAdminSingleton(_section: "about" | "settings", _record: AdminContentRecord): Promise<never> {
  void _section;
  void _record;
  throw new DatabaseNotConfiguredError();
}

export function unavailableStorageResponse(error: unknown) {
  const status = error instanceof DatabaseNotConfiguredError ? 503 : 500;
  const message = error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
  return Response.json({ error: message, storageConnected: false }, { status });
}

export function isContentSection(section: string): section is StoredSection {
  return section === "news" || section === "research" || section === "popup";
}

export function isAdminSection(section: string): section is AdminSection {
  return isContentSection(section) || section === "about" || section === "settings";
}
