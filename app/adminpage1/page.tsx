import type { Metadata } from "next";
import { AdminShell } from "../components/AdminShell";
import { AppLink as Link } from "../components/AppLink";
import { requireAdminUser } from "../lib/admin-auth";
import { contentRepository } from "../lib/content";
import { getDatabaseStatus } from "../lib/storage-status";
import { getDb } from "../../db";
import { contentRecords, siteSingletons } from "../../db/schema";
import { eq, count } from "drizzle-orm";

export const metadata: Metadata = { title: "관리자 대시보드" };

async function getDbDetail() {
  try {
    const db = getDb();
    const [newsAll] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "news"));
    const [researchAll] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "research"));
    const [promotionsAll] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "promotions"));
    const [popupAll] = await db.select({ count: count() }).from(contentRecords).where(eq(contentRecords.section, "popup"));
    const singletonRows = await db.select({ key: siteSingletons.key }).from(siteSingletons);
    const singletonKeys = singletonRows.map(r => r.key);
    return {
      ok: true,
      counts: {
        news: Number(newsAll?.count ?? 0),
        research: Number(researchAll?.count ?? 0),
        promotions: Number(promotionsAll?.count ?? 0),
        popup: Number(popupAll?.count ?? 0),
      },
      singletons: singletonKeys,
    };
  } catch {
    return { ok: false, counts: null, singletons: [] };
  }
}

export default async function AdminPage() {
  const user = await requireAdminUser("/adminpage1");
  const databaseStatus = await getDatabaseStatus();
  const dbDetail = databaseStatus.connected ? await getDbDetail() : null;
  const [news, research, promotions, popup] = await Promise.all([
    contentRepository.listNews(),
    contentRepository.listResearch(),
    contentRepository.listPromotionalMaterials(),
    contentRepository.getActivePopup(),
  ]);

  const checks = dbDetail ? [
    { label: "연구회 소식 (news)", count: dbDetail.counts?.news ?? 0, ok: (dbDetail.counts?.news ?? 0) > 0 },
    { label: "연구정책자료 (research)", count: dbDetail.counts?.research ?? 0, ok: (dbDetail.counts?.research ?? 0) > 0 },
    { label: "홍보물 (promotions)", count: dbDetail.counts?.promotions ?? 0, ok: true },
    { label: "팝업 (popup)", count: dbDetail.counts?.popup ?? 0, ok: true },
    { label: "About 싱글톤", count: null, ok: dbDetail.singletons.includes("about") },
    { label: "Settings 싱글톤", count: null, ok: dbDetail.singletons.includes("settings") },
  ] : [];

  return (
    <AdminShell user={user}>
      <div className="admin-title"><div><p>DASHBOARD</p><h1>안녕하세요, {user.displayName}님.</h1><span>KIHC 홈페이지의 콘텐츠 현황과 관리 메뉴를 확인하세요.</span></div><Link prefetch={false} href="/" target="_blank">사이트 보기 ↗</Link></div>

      {/* DB 연결 상태 */}
      <div className={`admin-storage-note dashboard-note${databaseStatus.connected ? " connected" : ""}`}>
        <strong>{databaseStatus.connected ? "✅ Supabase DB 연결됨" : "❌ Supabase DB 연결 오류"}</strong>
        <span>{databaseStatus.message}</span>
      </div>

      {/* DB 상세 진단 */}
      {databaseStatus.connected && dbDetail && (
        <section className="admin-card" style={{ marginBottom: "20px" }}>
          <div className="admin-card-heading"><h2>DB 데이터 체크</h2><span>각 테이블에 데이터가 정상적으로 있는지 확인합니다.</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px", padding: "16px 20px" }}>
            {checks.map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: "1px solid #e0e5e9", background: item.ok ? "#f0faf4" : "#fff8f0", borderRadius: "6px" }}>
                <span style={{ fontSize: "18px" }}>{item.ok ? "✅" : "⚠️"}</span>
                <span style={{ fontSize: "13px", color: "#2c3e50" }}>
                  <strong>{item.label}</strong>
                  {item.count !== null && <span style={{ marginLeft: "6px", color: "#64748b" }}>({item.count}건)</span>}
                </span>
              </div>
            ))}
          </div>
          {checks.some(c => !c.ok) && (
            <div style={{ margin: "0 20px 16px", padding: "12px 16px", background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "6px", fontSize: "13px", color: "#856404" }}>
              ⚠️ 일부 테이블에 데이터가 없습니다. 관리자 페이지에서 콘텐츠를 등록하거나, Supabase SQL 에디터에서 <code>supabase/kihc_full_setup.sql</code>을 실행해 초기 데이터를 설정하세요.
            </div>
          )}
          {checks.every(c => c.ok) && (
            <div style={{ margin: "0 20px 16px", padding: "12px 16px", background: "#d1fae5", border: "1px solid #10b981", borderRadius: "6px", fontSize: "13px", color: "#065f46" }}>
              ✅ 모든 테이블에 데이터가 정상적으로 존재합니다.
            </div>
          )}
        </section>
      )}

      <div className="stat-grid">
        <article><span>연구회 소식</span><strong>{news.length}</strong><Link prefetch={false} href="/adminpage1/news">관리하기 →</Link></article>
        <article><span>연구정책자료</span><strong>{research.length}</strong><Link prefetch={false} href="/adminpage1/research">관리하기 →</Link></article>
        <article><span>홍보물</span><strong>{promotions.length}</strong><Link prefetch={false} href="/adminpage1/promotions">관리하기 →</Link></article>
        <article><span>현재 활성 팝업</span><strong>{popup ? 1 : 0}</strong><Link prefetch={false} href="/adminpage1/popup">관리하기 →</Link></article>
      </div>
      <section className="admin-card recent-card">
        <div className="admin-card-heading"><h2>최근 게시물</h2><span>{databaseStatus.connected ? "DB에서 불러온 콘텐츠입니다." : "DB 연결 전 기본 콘텐츠를 보여줍니다."}</span></div>
        <div className="admin-table"><div className="admin-table-row head"><span>구분</span><span>제목</span><span>게시일</span><span>상태</span></div>{news.slice(0, 4).map((post) => <div className="admin-table-row" key={post.id}><span>소식</span><strong>{post.title}</strong><time>{post.publishedAt}</time><em>공개</em></div>)}</div>
      </section>
    </AdminShell>
  );
}
