import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { AppLink as Link } from "../components/AppLink";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "연구회 소식" };

export default function NewsPage() {
  const posts = contentRepository.listNews();
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="KIHC News" title="연구회 소식" description="한국인재역량연구회의 새로운 소식과 주요 안내를 전합니다." />
        <section className="section listing-section">
          <div className="container">
            <div className="listing-toolbar">
              <p>전체 <strong>{posts.length}</strong>건</p>
              <div className="search-shell" aria-label="검색 기능은 다음 단계에서 연결됩니다">
                <select aria-label="검색 조건" defaultValue="title"><option value="title">제목</option><option value="content">내용</option><option value="all">제목+내용</option></select>
                <input aria-label="검색어" placeholder="검색어를 입력하세요" />
                <button type="button">검색</button>
              </div>
            </div>
            <div className="board-table" role="table" aria-label="연구회 소식 목록">
              <div className="board-row board-head" role="row"><span>No.</span><span>제목</span><span>날짜</span></div>
              {posts.map((post, index) => (
                <div className="board-row" role="row" key={post.id}>
                  <span>{posts.length - index}</span>
                  <Link prefetch={false} href={`/news/${post.slug}`}>{post.title}</Link>
                  <time>{post.publishedAt}</time>
                </div>
              ))}
            </div>
            <div className="pagination" aria-label="페이지 이동"><button type="button" aria-label="이전 페이지">‹</button><button className="active" type="button">1</button><button type="button" aria-label="다음 페이지">›</button></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
