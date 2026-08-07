import type { Metadata } from "next";
import { AppLink as Link } from "../../components/AppLink";
import { Footer } from "../../components/Footer";
import { OriginalInquiry } from "../../components/OriginalInquiry";
import { SiteHeader } from "../../components/SiteHeader";
import { contentRepository } from "../../lib/content";

export const metadata: Metadata = { title: "연구정책자료" };

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = contentRepository.getResearchBySlug(slug) ?? contentRepository.listResearch()[0];
  return (
    <>
      <SiteHeader />
      <main className="research-detail-main">
        <article className="container research-detail">
          <div className="detail-cover"><span>KIHC RESEARCH</span><strong>REPORT</strong></div>
          <div className="detail-intro">
            <p className="eyebrow">Research & Policy</p>
            <h1>{item.title}</h1>
            <dl><div><dt>저자</dt><dd>{item.author}</dd></div><div><dt>발행일</dt><dd>{item.publishedAt}</dd></div></dl>
          </div>
          <section className="detail-section"><h2>목차</h2><ol>{item.tableOfContents.map((entry) => <li key={entry}>{entry}</li>)}</ol></section>
          <section className="detail-section"><h2>내용 요약</h2><p>{item.summary}</p></section>
          <section className="detail-section"><h2>핵심 키워드</h2><div className="keyword-list">{item.keywords.map((keyword) => <span key={keyword}>#{keyword}</span>)}</div></section>
          <div className="detail-actions"><OriginalInquiry /><Link prefetch={false} className="button button-outline" href="/research">목록으로</Link></div>
        </article>
      </main>
      <Footer />
    </>
  );
}
