import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { AppLink as Link } from "../components/AppLink";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository, type NewsSearchField } from "../lib/content";

export const metadata: Metadata = { title: "연구회 소식" };

const PAGE_SIZE = 4;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function pageHref(page: number, query: string, field: NewsSearchField) {
  const parameters = new URLSearchParams();
  if (query) parameters.set("q", query);
  if (field !== "title") parameters.set("field", field);
  if (page > 1) parameters.set("page", String(page));
  const search = parameters.toString();
  return search ? `/news?${search}` : "/news";
}

export default async function NewsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const parameters = await searchParams;
  const query = single(parameters?.q).trim();
  const rawField = single(parameters?.field);
  const field: NewsSearchField = rawField === "content" || rawField === "all" ? rawField : "title";
  const requestedPage = Number.parseInt(single(parameters?.page), 10);
  const result = await contentRepository.searchNews({ query, field, page: requestedPage, pageSize: PAGE_SIZE });
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="KIHC News" title="연구회 소식" description="한국인재역량연구회의 새로운 소식과 주요 안내를 전합니다." />
        <section className="section listing-section">
          <div className="container">
            <div className="listing-toolbar">
              <p>{query ? <>검색 결과 <strong>{result.filteredTotal}</strong>건 · 전체 {result.total}건</> : <>전체 <strong>{result.total}</strong>건</>}</p>
              <form className="search-shell" method="get" action="/news" role="search">
                <select aria-label="검색 조건" name="field" defaultValue={field}><option value="title">제목</option><option value="content">내용</option><option value="all">제목+내용</option></select>
                <input aria-label="검색어" name="q" defaultValue={query} placeholder="검색어를 입력하세요" />
                <button type="submit">검색</button>
              </form>
            </div>
            <div className="board-table" role="table" aria-label="연구회 소식 목록">
              <div className="board-row board-head" role="row"><span>No.</span><span>제목</span><span>날짜</span></div>
              {result.items.map((post, index) => (
                <div className="board-row" role="row" key={post.id}>
                  <span>{result.filteredTotal - ((result.page - 1) * result.pageSize) - index}</span>
                  <Link prefetch={false} href={`/news/${post.slug}`}>{post.title}</Link>
                  <time>{post.publishedAt}</time>
                </div>
              ))}
              {!result.items.length ? <div className="board-empty" role="status"><strong>검색 결과가 없습니다.</strong><span>검색어 또는 검색 조건을 바꿔 다시 확인해 주세요.</span></div> : null}
            </div>
            <nav className="pagination" aria-label="페이지 이동">
              {result.page > 1 ? <Link prefetch={false} href={pageHref(result.page - 1, query, field)} aria-label="이전 페이지">‹</Link> : <span aria-hidden="true" className="disabled">‹</span>}
              {Array.from({ length: result.totalPages }, (_, index) => index + 1).map((page) => (
                <Link prefetch={false} className={page === result.page ? "active" : undefined} aria-current={page === result.page ? "page" : undefined} href={pageHref(page, query, field)} key={page}>{page}</Link>
              ))}
              {result.page < result.totalPages ? <Link prefetch={false} href={pageHref(result.page + 1, query, field)} aria-label="다음 페이지">›</Link> : <span aria-hidden="true" className="disabled">›</span>}
            </nav>
            {query ? <p className="search-reset"><Link prefetch={false} href="/news">전체 소식 보기</Link></p> : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
