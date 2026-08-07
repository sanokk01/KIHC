import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "연구정책자료" };

export default function ResearchPage() {
  const materials = contentRepository.listResearch();
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="Research & Policy" title="연구정책자료" description="사람과 성장에 관한 KIHC의 연구 결과와 정책적 시사점을 소개합니다." />
        <section className="section listing-section">
          <div className="container">
            <div className="listing-heading"><p>전체 <strong>{materials.length}</strong>건</p><span>원문은 별도 문의를 통해 열람할 수 있습니다.</span></div>
            <div className="research-grid listing-grid">
              {materials.map((item, index) => (
                <Link prefetch={false} className="research-card" href={`/research/${item.slug}`} key={item.id}>
                  <div className={`research-cover cover-${index + 1}`}><span>KIHC RESEARCH</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
                  <div className="research-card-body"><p>{item.publishedAt}</p><h2>{item.title}</h2><span className="card-arrow" aria-hidden="true">↗</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
