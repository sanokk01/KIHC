import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Footer } from "../components/Footer";
import { AppLink as Link } from "../components/AppLink";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository, type NewsSearchField } from "../lib/content";

export const dynamic = 'force-dynamic';
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
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";

  const dict = {
    title: isEn ? "News & Updates" : "연구회 소식",
    desc: isEn ? "Discover the latest news and important announcements from KIHC." : "한국인재역량연구회의 새로운 소식과 주요 안내를 전합니다.",
    total: isEn ? "Total " : "전체 ",
    count: isEn ? " items" : "건",
    searchResult: isEn ? "Search Results: " : "검색 결과 ",
    searchTotal: isEn ? " / Total: " : "건 · 전체 ",
    searchFieldLabel: isEn ? "Search criteria" : "검색 조건",
    optTitle: isEn ? "Title" : "제목",
    optContent: isEn ? "Content" : "내용",
    optAll: isEn ? "Title+Content" : "제목+내용",
    searchPlaceholder: isEn ? "Enter keywords" : "검색어를 입력하세요",
    searchBtn: isEn ? "Search" : "검색",
    tableNo: "No.",
    tableTitle: isEn ? "Title" : "제목",
    tableDate: isEn ? "Date" : "날짜",
    emptyTitle: isEn ? "No results found." : "검색 결과가 없습니다.",
    emptyDesc: isEn ? "Please try changing the keywords or search criteria." : "검색어 또는 검색 조건을 바꿔 다시 확인해 주세요.",
    resetBtn: isEn ? "View all news" : "전체 소식 보기"
  };

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
        <PageHero eyebrow="KIHC News" title={dict.title} description={dict.desc} />
        <section className="section listing-section">
          <div className="container">
            <div className="listing-toolbar">
              <p>{query ? <>{dict.searchResult}<strong>{result.filteredTotal}</strong>{dict.searchTotal}{result.total}{dict.count}</> : <>{dict.total}<strong>{result.total}</strong>{dict.count}</>}</p>
              <form className="search-shell" method="get" action="/news" role="search">
                <select aria-label={dict.searchFieldLabel} name="field" defaultValue={field}><option value="title">{dict.optTitle}</option><option value="content">{dict.optContent}</option><option value="all">{dict.optAll}</option></select>
                <input aria-label={dict.searchFieldLabel} name="q" defaultValue={query} placeholder={dict.searchPlaceholder} />
                <button type="submit">{dict.searchBtn}</button>
              </form>
            </div>
            <div className="board-table" role="table" aria-label={dict.title}>
              <div className="board-row board-head" role="row"><span>{dict.tableNo}</span><span>{dict.tableTitle}</span><span>{dict.tableDate}</span></div>
              {result.items.map((post, index) => (
                <div className="board-row" role="row" key={post.id}>
                  <span>{result.filteredTotal - ((result.page - 1) * result.pageSize) - index}</span>
                  <Link prefetch={false} href={`/news/${post.slug}`}>{post.title}</Link>
                  <time>{post.publishedAt}</time>
                </div>
              ))}
              {!result.items.length ? <div className="board-empty" role="status"><strong>{dict.emptyTitle}</strong><span>{dict.emptyDesc}</span></div> : null}
            </div>
            <nav className="pagination" aria-label="페이지 이동">
              {result.page > 1 ? <Link prefetch={false} href={pageHref(result.page - 1, query, field)} aria-label="이전 페이지">‹</Link> : <span aria-hidden="true" className="disabled">‹</span>}
              {Array.from({ length: result.totalPages }, (_, index) => index + 1).map((page) => (
                <Link prefetch={false} className={page === result.page ? "active" : undefined} aria-current={page === result.page ? "page" : undefined} href={pageHref(page, query, field)} key={page}>{page}</Link>
              ))}
              {result.page < result.totalPages ? <Link prefetch={false} href={pageHref(result.page + 1, query, field)} aria-label="Next Page">›</Link> : <span aria-hidden="true" className="disabled">›</span>}
            </nav>
            {query ? <p className="search-reset"><Link prefetch={false} href="/news">{dict.resetBtn}</Link></p> : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
