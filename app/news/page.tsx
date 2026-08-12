import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Footer } from "../components/Footer";
import { AppLink as Link } from "../components/AppLink";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository, type NewsSearchField } from "../lib/content";

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "연구회 소식" };

const PAGE_SIZE = 10;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function pageHref(page: number, query: string, field: NewsSearchField, category: string) {
  const parameters = new URLSearchParams();
  if (query) parameters.set("q", query);
  if (field !== "title") parameters.set("field", field);
  if (category && category !== "전체") parameters.set("category", category);
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
    searchTotal: isEn ? " / Total: " : "건 · 현재 페이지 ",
    searchFieldLabel: isEn ? "Search criteria" : "검색 조건",
    optTitle: isEn ? "Title" : "제목",
    optContent: isEn ? "Content" : "내용",
    optAll: isEn ? "Title+Content" : "제목+내용",
    searchPlaceholder: isEn ? "Enter keywords" : "검색어를 입력하세요",
    searchBtn: isEn ? "Search" : "검색",
    tableNo: "번호",
    tableTitle: "제목",
    tableDate: "등록일",
    tableAttach: "첨부파일",
    tableViews: "조회수",
    emptyTitle: isEn ? "No results found." : "검색 결과가 없습니다.",
    emptyDesc: isEn ? "Please try changing the keywords or search criteria." : "검색어 또는 검색 조건을 바꿔 다시 확인해 주세요.",
    resetBtn: isEn ? "View all news" : "전체 소식 보기"
  };

  const categories = ["전체", "공지사항", "뉴스레터", "행사일정"];

  const parameters = await searchParams;
  const query = single(parameters?.q).trim();
  const rawField = single(parameters?.field);
  const category = single(parameters?.category) || "전체";
  const field: NewsSearchField = rawField === "content" || rawField === "all" ? rawField : "title";
  const requestedPage = Number.parseInt(single(parameters?.page), 10);
  const result = await contentRepository.searchNews({ query, field, category, page: requestedPage, pageSize: PAGE_SIZE });
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="KIHC News" title={dict.title} description={dict.desc} />
        <section className="section listing-section">
          <div className="container news-layout">
            <aside className="news-sidebar">
              <h3>{dict.title}</h3>
              <nav>
                {categories.map((c) => (
                   <Link prefetch={false} key={c} href={`/news?category=${c === "전체" ? "" : c}`} className={category === c ? "active" : ""}>{c}</Link>
                ))}
              </nav>
            </aside>
            <div className="news-content">
              <div className="listing-toolbar">
                <p>{query ? <>{dict.searchResult}<strong>{result.filteredTotal}</strong>{dict.searchTotal}{result.total}{dict.count}</> : <>{dict.total}<strong>{result.total}</strong>{dict.count}</>}</p>
                <form className="search-shell" method="get" action="/news" role="search">
                  {category !== "전체" && <input type="hidden" name="category" value={category} />}
                  <select aria-label={dict.searchFieldLabel} name="field" defaultValue={field}><option value="title">{dict.optTitle}</option><option value="content">{dict.optContent}</option><option value="all">{dict.optAll}</option></select>
                  <input aria-label={dict.searchFieldLabel} name="q" defaultValue={query} placeholder={dict.searchPlaceholder} />
                  <button type="submit">{dict.searchBtn}</button>
                </form>
              </div>
              <div className="board-table news-board" role="table" aria-label={dict.title}>
                <div className="board-row board-head" role="row"><span>{dict.tableNo}</span><span>{dict.tableTitle}</span><span>{dict.tableDate}</span><span>{dict.tableAttach}</span><span>{dict.tableViews}</span></div>
                {result.items.map((post, index) => (
                  <div className="board-row" role="row" key={post.id}>
                    <span>{(result.page - 1) * result.pageSize + index + 1}</span>
                    <Link href={`/news/${post.slug}`} className="news-title-link">
                      {post.category1 && post.category1 !== "전체" && <span className="news-cat-badge">[{post.category1}]</span>}
                      {post.title}
                    </Link>
                    <time>{post.publishedAt}</time>
                    <span className="attach-icon">{post.attachmentUrl ? "📎" : ""}</span>
                    <span className="views-count">{post.views ?? 0}</span>
                  </div>
                ))}
                {!result.items.length ? <div className="board-empty" role="status"><strong>{dict.emptyTitle}</strong><span>{dict.emptyDesc}</span></div> : null}
              </div>
              <nav className="pagination" aria-label="페이지 이동">
                {result.page > 1 ? <Link href={pageHref(result.page - 1, query, field, category)} aria-label="이전 페이지">‹</Link> : <span aria-hidden="true" className="disabled">‹</span>}
                {Array.from({ length: result.totalPages }, (_, index) => index + 1).map((page) => (
                  <Link className={page === result.page ? "active" : undefined} aria-current={page === result.page ? "page" : undefined} href={pageHref(page, query, field, category)} key={page}>{page}</Link>
                ))}
                {result.page < result.totalPages ? <Link href={pageHref(result.page + 1, query, field, category)} aria-label="Next Page">›</Link> : <span aria-hidden="true" className="disabled">›</span>}
              </nav>
              {query ? <p className="search-reset"><Link href="/news">{dict.resetBtn}</Link></p> : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
