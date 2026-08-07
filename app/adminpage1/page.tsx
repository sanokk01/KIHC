import type { Metadata } from "next";
import { AdminShell } from "../components/AdminShell";
import { AppLink as Link } from "../components/AppLink";
import { requireAdminUser } from "../lib/admin-auth";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "관리자 대시보드" };

export default async function AdminPage() {
  const user = await requireAdminUser("/adminpage1");
  const [news, research, popup] = await Promise.all([contentRepository.listNews(), contentRepository.listResearch(), contentRepository.getActivePopup()]);
  return (
    <AdminShell>
      <div className="admin-title"><div><p>DASHBOARD</p><h1>안녕하세요, {user.displayName}님.</h1><span>KIHC 홈페이지의 콘텐츠 현황과 관리 메뉴를 확인하세요.</span></div><Link prefetch={false} href="/" target="_blank">사이트 보기 ↗</Link></div>
      <div className="admin-storage-note dashboard-note connected"><strong>공동 관리 DB 연결됨</strong><span>초대된 팀원이 저장한 콘텐츠와 이미지는 모두에게 공유되고 공개 홈페이지에 반영됩니다.</span></div>
      <div className="stat-grid">
        <article><span>연구회 소식</span><strong>{news.length}</strong><Link prefetch={false} href="/adminpage1/news">관리하기 →</Link></article>
        <article><span>연구정책자료</span><strong>{research.length}</strong><Link prefetch={false} href="/adminpage1/research">관리하기 →</Link></article>
        <article><span>현재 활성 팝업</span><strong>{popup ? 1 : 0}</strong><Link prefetch={false} href="/adminpage1/popup">관리하기 →</Link></article>
      </div>
      <section className="admin-card recent-card">
        <div className="admin-card-heading"><h2>최근 게시물</h2><span>공개 사이트의 D1 데이터를 보여줍니다.</span></div>
        <div className="admin-table"><div className="admin-table-row head"><span>구분</span><span>제목</span><span>게시일</span><span>상태</span></div>{news.slice(0, 4).map((post) => <div className="admin-table-row" key={post.id}><span>소식</span><strong>{post.title}</strong><time>{post.publishedAt}</time><em>공개</em></div>)}</div>
      </section>
    </AdminShell>
  );
}
