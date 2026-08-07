import type { Metadata } from "next";
import { AdminShell } from "../components/AdminShell";
import { AppLink as Link } from "../components/AppLink";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "관리자 대시보드" };

export default function AdminPage() {
  const news = contentRepository.listNews();
  const research = contentRepository.listResearch();
  const popup = contentRepository.getActivePopup();
  return (
    <AdminShell>
      <div className="admin-title"><div><p>DASHBOARD</p><h1>안녕하세요, 관리자님.</h1><span>KIHC 홈페이지의 콘텐츠 현황을 확인하세요.</span></div><Link prefetch={false} href="/" target="_blank">사이트 보기 ↗</Link></div>
      <div className="stat-grid">
        <article><span>연구회 소식</span><strong>{news.length}</strong><Link prefetch={false} href="/admin/news">관리하기 →</Link></article>
        <article><span>연구정책자료</span><strong>{research.length}</strong><Link prefetch={false} href="/admin/research">관리하기 →</Link></article>
        <article><span>현재 활성 팝업</span><strong>{popup ? 1 : 0}</strong><Link prefetch={false} href="/admin/popup">관리하기 →</Link></article>
      </div>
      <section className="admin-card recent-card">
        <div className="admin-card-heading"><h2>최근 게시물</h2><span>공개 사이트와 같은 임시 데이터를 사용합니다.</span></div>
        <div className="admin-table"><div className="admin-table-row head"><span>구분</span><span>제목</span><span>게시일</span><span>상태</span></div>{news.slice(0, 4).map((post) => <div className="admin-table-row" key={post.id}><span>소식</span><strong>{post.title}</strong><time>{post.publishedAt}</time><em>공개</em></div>)}</div>
      </section>
    </AdminShell>
  );
}
