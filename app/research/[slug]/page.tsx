/* eslint-disable @next/next/no-img-element -- future uploaded media may be served by the app's media route. */
import type { Metadata } from "next";
import { AppLink as Link } from "../../components/AppLink";
import { Footer } from "../../components/Footer";
import { OriginalInquiry } from "../../components/OriginalInquiry";
import { SiteHeader } from "../../components/SiteHeader";
import { contentRepository } from "../../lib/content";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "연구정책자료" };

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await contentRepository.getResearchBySlug(slug);
  if (!item) notFound();
  
  // Track views incrementally? (mocking view tracking logic or skip for now)

  return (
    <>
      <SiteHeader />
      
      {/* Category Tab Banner */}
      <div className="research-tab-banner">
        <div className="container">
          <ul className="research-tabs">
            <li><Link href="/research?type=보고서 전체" className={!item.researchType || item.researchType === "보고서 전체" ? "active" : ""}>전체보기</Link></li>
            <li><Link href="/research?type=보고서" className={item.researchType === "보고서" ? "active" : ""}>보고서</Link></li>
            <li><Link href="/research?type=브리프" className={item.researchType === "브리프" ? "active" : ""}>브리프</Link></li>
            <li><Link href="/research?type=단행본" className={item.researchType === "단행본" ? "active" : ""}>단행본</Link></li>
            <li><Link href="/research?type=자료집" className={item.researchType === "자료집" ? "active" : ""}>자료집</Link></li>
            <li><Link href="/research?type=기타" className={item.researchType === "기타" ? "active" : ""}>기타연구보고서</Link></li>
          </ul>
        </div>
      </div>

      <main className="research-detail-main new-design">
        <article className="container research-detail-content">
          
          <div className="research-detail-header">
            <span className="doc-type-badge">{item.researchType || "자료집"}</span>
            <div className="title-row">
              <h1 className="research-detail-title">{item.title}</h1>
            </div>
          </div>

          <div className="research-metadata-box">
            <div className="metadata-thumb">
              {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div className="placeholder-thumb">KIHC</div>}
            </div>
            <div className="metadata-info">
              <dl>
                <div className="meta-row">
                  <dt>주관</dt>
                  <dd>KIHC 한국인재역량연구회</dd>
                </div>
                <div className="meta-row">
                  <dt>발간일</dt>
                  <dd>{item.publishedAt}</dd>
                </div>
                <div className="meta-row">
                  <dt>연구자</dt>
                  <dd>{item.author}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="research-content-sections">
            <section className="detail-section">
              <div className="section-header"><h2>주요 내용</h2></div>
              <div className="section-body">
                <p>{item.summary}</p>
              </div>
            </section>
            
            {item.tableOfContents && item.tableOfContents.length > 0 && (
              <section className="detail-section">
                <div className="section-header"><h2>목차</h2></div>
                <div className="section-body">
                  <ol>
                    {item.tableOfContents.map((entry) => <li key={entry}>{entry}</li>)}
                  </ol>
                </div>
              </section>
            )}

            <section className="detail-section">
              <div className="section-header"><h2>키워드</h2></div>
              <div className="section-body">
                <div className="keyword-list">
                  {item.keywords.map((keyword) => <span key={keyword}>#{keyword}</span>)}
                </div>
              </div>
            </section>
          </div>

          <div className="detail-actions">
            <OriginalInquiry />
            <Link className="button button-outline" href="/research">목록으로</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
