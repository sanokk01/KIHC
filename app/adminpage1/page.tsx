import type { Metadata } from "next";
import { AdminShell } from "../components/AdminShell";
import { AppLink as Link } from "../components/AppLink";
import { requireAdminUser } from "../lib/admin-auth";
import { contentRepository } from "../lib/content";
import { getDatabaseStatus } from "../lib/storage-status";

export const metadata: Metadata = { title: "관리자 대시보드" };

export default async function AdminPage() {
  const user = await requireAdminUser("/adminpage1");
  const databaseStatus = await getDatabaseStatus();
  const [news, research, promotions, popup] = await Promise.all([contentRepository.listNews(), contentRepository.listResearch(), contentRepository.listPromotionalMaterials(), contentRepository.getActivePopup()]);
  return (
    <AdminShell user={user}>
      <div className="admin-title"><div><p>DASHBOARD</p><h1>안녕하세요, {user.displayName}님.</h1><span>KIHC 홈페이지의 콘텐츠 현황과 관리 메뉴를 확인하세요.</span></div><Link prefetch={false} href="/" target="_blank">사이트 보기 ↗</Link></div>
      <div className={`admin-storage-note dashboard-note${databaseStatus.connected ? " connected" : ""}`}><strong>{databaseStatus.connected ? "Supabase DB 연결됨" : "Supabase DB 연결 오류"}</strong><span>{databaseStatus.message}</span></div>
      <div className="stat-grid">
        <article><span>연구회 소식</span><strong>{news.length}</strong><Link prefetch={false} href="/adminpage1/news">관리하기 →</Link></article>
        <article><span>연구정책자료</span><strong>{research.length}</strong><Link prefetch={false} href="/adminpage1/research">관리하기 →</Link></article>
        <article><span>홍보물</span><strong>{promotions.length}</strong><Link prefetch={false} href="/adminpage1/promotions">관리하기 →</Link></article>
        <article><span>현재 활성 팝업</span><strong>{popup ? 1 : 0}</strong><Link prefetch={false} href="/adminpage1/popup">관리하기 →</Link></article>
      </div>
      <section className="admin-card recent-card">
        <div className="admin-card-heading"><h2>최근 게시물</h2><span>DB 연결 전 기본 콘텐츠를 보여줍니다.</span></div>
        <div className="admin-table"><div className="admin-table-row head"><span>구분</span><span>제목</span><span>게시일</span><span>상태</span></div>{news.slice(0, 4).map((post) => <div className="admin-table-row" key={post.id}><span>소식</span><strong>{post.title}</strong><time>{post.publishedAt}</time><em>공개</em></div>)}</div>
      </section>
    </AdminShell>
  );
}
