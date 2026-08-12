import { isAuthorizedAdminRequest, unauthorizedResponse } from "../../../lib/admin-auth";
import { getDatabaseStatus } from "../../../lib/storage-status";
import { getDb } from "../../../../db";
import { contentRecords, siteSingletons, mediaAssets } from "../../../../db/schema";
import { eq, sql, count } from "drizzle-orm";

export async function GET(request: Request) {
  if (!(await isAuthorizedAdminRequest(request))) return unauthorizedResponse();

  const dbStatus = await getDatabaseStatus();

  if (!dbStatus.connected) {
    return Response.json({
      connected: false,
      message: dbStatus.message,
      tables: null,
    });
  }

  try {
    const db = getDb();

    // 각 섹션별 건수 조회
    const [newsCount] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "news"));
    const [researchCount] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "research"));
    const [promotionsCount] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "promotions"));
    const [eventsCount] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "events"));
    const [popupCount] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "popup"));
    const [singletonCount] = await db.select({ count: count() }).from(siteSingletons);
    const [mediaCount] = await db.select({ count: count() }).from(mediaAssets);

    // singleton 키 목록
    const singletonRows = await db.select({ key: siteSingletons.key }).from(siteSingletons);
    const singletonKeys = singletonRows.map(r => r.key);

    return Response.json({
      connected: true,
      message: dbStatus.message,
      tables: {
        content_records: {
          news: Number(newsCount?.count ?? 0),
          research: Number(researchCount?.count ?? 0),
          promotions: Number(promotionsCount?.count ?? 0),
          events: Number(eventsCount?.count ?? 0),
          popup: Number(popupCount?.count ?? 0),
        },
        site_singletons: {
          total: Number(singletonCount?.count ?? 0),
          keys: singletonKeys,
          has_about: singletonKeys.includes("about"),
          has_settings: singletonKeys.includes("settings"),
        },
        media_assets: {
          total: Number(mediaCount?.count ?? 0),
        },
      },
      checklist: {
        db_connected: true,
        has_news: Number(newsCount?.count ?? 0) > 0,
        has_research: Number(researchCount?.count ?? 0) > 0,
        has_about: singletonKeys.includes("about"),
        has_settings: singletonKeys.includes("settings"),
      },
    });
  } catch (error) {
    return Response.json({
      connected: true,
      message: "DB 연결은 됐지만 테이블 조회 중 오류가 발생했습니다.",
      error: error instanceof Error ? error.message : String(error),
      tables: null,
    }, { status: 500 });
  }
}
