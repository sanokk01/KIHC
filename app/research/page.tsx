import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Footer } from "../components/Footer";
import { AppLink as Link } from "../components/AppLink";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository } from "../lib/content";

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "연구정책자료" };

export default async function ResearchPage({ searchParams }: { searchParams: Promise<{ query?: string; type?: string; start?: string; end?: string; cat1?: string; cat2?: string; searchField?: string }> }) {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";

  const dict = {
    title: isEn ? "Research & Policy" : "연구정책자료",
    desc: isEn ? "Introducing KIHC's research findings and policy implications on people and growth." : "사람과 성장에 관한 KIHC의 연구 결과와 정책적 시사점을 소개합니다.",
    total: isEn ? "Total " : "전체 ",
    count: isEn ? " items" : "건",
    note: isEn ? "Original texts are available for viewing through separate inquiry." : "원문은 별도 문의를 통해 열람할 수 있습니다."
  };

  const params = await searchParams;
  const query = params.query?.toLowerCase() || "";
  const type = params.type || "";
  const start = params.start || "";
  const end = params.end || "";
  const cat1 = params.cat1 || "";
  const cat2 = params.cat2 || "";
  
  const allMaterials = await contentRepository.listResearch();
  
  let materials = allMaterials;
  
  if (type && type !== "보고서 전체") {
    materials = materials.filter(m => m.researchType === type);
  }
  if (cat1) materials = materials.filter(m => m.category1 === cat1);
  if (cat2) materials = materials.filter(m => m.category2 === cat2);
  if (start) materials = materials.filter(m => m.publishedAt >= start);
  if (end) materials = materials.filter(m => m.publishedAt <= end);
  if (query) {
    materials = materials.filter(item => item.title.toLowerCase().includes(query) || item.summary?.toLowerCase().includes(query));
  }

  // Sort by publishedAt desc
  materials.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="Research & Policy" title={dict.title} description={dict.desc} />
        <section className="section listing-section">
          <div className="container">
            
            {/* Search Box */}
            <div className="research-advanced-search">
              <form method="GET" action="/research">
                <div className="search-row">
                  <div className="search-label">보고서</div>
                  <div className="search-fields radio-group">
                    <label><input type="radio" name="type" value="보고서 전체" defaultChecked={!type || type === "보고서 전체"} /> 보고서 전체</label>
                    <label><input type="radio" name="type" value="협동연구보고서" defaultChecked={type === "협동연구보고서"} /> 협동연구보고서</label>
                    <label><input type="radio" name="type" value="기타연구보고서" defaultChecked={type === "기타연구보고서"} /> 기타연구보고서</label>
                  </div>
                </div>
                <div className="search-row">
                  <div className="search-label">검색 기간</div>
                  <div className="search-fields date-group">
                    <input type="date" name="start" defaultValue={start} />
                    <span>~</span>
                    <input type="date" name="end" defaultValue={end} />
                  </div>
                </div>
                <div className="search-row">
                  <div className="search-label">표출 분류</div>
                  <div className="search-fields select-group">
                    <select name="cat1" defaultValue={cat1}>
                      <option value="">대분류 전체</option>
                      <option value="대분류">대분류 (예시)</option>
                    </select>
                    <select name="cat2" defaultValue={cat2}>
                      <option value="">중분류 전체</option>
                      <option value="중분류">중분류 (예시)</option>
                    </select>
                  </div>
                </div>
                <div className="search-bottom-bar">
                  <select name="searchField" defaultValue={params.searchField || "전체"}>
                    <option value="전체">전체</option>
                    <option value="제목">제목</option>
                  </select>
                  <input type="text" name="query" placeholder="검색어를 입력하세요" defaultValue={query} />
                  <button type="submit" className="btn-search-submit">검색</button>
                </div>
              </form>
            </div>

            <div className="listing-heading" style={{ marginTop: 40 }}><p>{dict.total}<strong>{materials.length}</strong>{dict.count}</p><span>{dict.note}</span></div>
            
            <div className="research-list-vertical">
              {materials.map((item, index) => (
                <article className="research-list-item" key={item.id}>
                  <Link href={`/research/${item.slug}`} className="research-list-thumb">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div className="placeholder-thumb">KIHC</div>}
                    <div className="hover-overlay">
                      <span className="plus-icon">+</span>
                      <span>자세히 보기</span>
                    </div>
                  </Link>
                  <div className="research-list-info">
                    <span className="doc-type">{item.researchType || "자료집"}</span>
                    <h2><Link href={`/research/${item.slug}`}>{item.title}</Link></h2>
                    <div className="doc-meta">
                      <span>KIHC 한국인재역량연구회</span>
                      <span>{item.publishedAt}</span>
                    </div>
                  </div>
                </article>
              ))}
              {materials.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>검색 결과가 없습니다.</div>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
